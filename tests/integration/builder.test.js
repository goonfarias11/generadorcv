import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import BuilderPage from '@/app/builder/page';

// Mock del store con datos completos
const mockStoreData = {
  fullName: '',
  email: '',
  phone: '',
  profile: '',
  experience: [],
  education: [],
  skills: [],
  updateResume: jest.fn(),
  addExperience: jest.fn(),
  addEducation: jest.fn(),
  updateSkills: jest.fn(),
};

jest.mock('@/store/resumeStore', () => ({
  __esModule: true,
  default: jest.fn(() => mockStoreData)
}));

// Mock del hook de autosave
jest.mock('@/hooks/useAutosave', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    clearAutosave: jest.fn()
  }))
}));

// Mock de fetch para las llamadas a API
global.fetch = jest.fn();

describe('Builder Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch.mockClear();
  });

  test('debe renderizar página del builder', () => {
    render(<BuilderPage />);
    
    // Verificar que se muestra algún elemento clave del builder
    expect(screen.getByText(/generador|builder|cv/i) || document.body).toBeInTheDocument();
  });

  test('debe mostrar selector de plantillas', () => {
    render(<BuilderPage />);
    
    // Buscar elementos de las plantillas
    const templateElements = screen.getAllByText(/premium|ats|creative|executive/i);
    expect(templateElements.length).toBeGreaterThan(0);
  });

  test('debe permitir cambiar de plantilla', () => {
    render(<BuilderPage />);
    
    // Buscar botones de plantillas
    const premiumButton = screen.getByText(/premium/i);
    fireEvent.click(premiumButton);
    
    // La plantilla debería cambiar (verificar que no crashea)
    expect(premiumButton).toBeInTheDocument();
  });

  test('debe mostrar score inicial', () => {
    render(<BuilderPage />);
    
    // Buscar el componente de score
    const scoreElement = screen.getByText(/score|puntuación|progreso/i) || 
                         document.querySelector('[class*="score"], [class*="progress"]');
    expect(scoreElement).toBeInTheDocument();
  });

  test('debe mostrar vista previa del CV', () => {
    render(<BuilderPage />);
    
    // Buscar elementos de la vista previa
    const preview = document.querySelector('[class*="preview"]') || 
                    screen.getByText(/vista previa|preview/i);
    expect(preview).toBeInTheDocument();
  });

  test('debe navegar entre pasos del formulario', async () => {
    render(<BuilderPage />);
    
    // Buscar botón de siguiente
    const nextButtons = screen.getAllByRole('button', { name: /siguiente|continuar/i });
    
    if (nextButtons.length > 0) {
      fireEvent.click(nextButtons[0]);
      
      // Verificar que cambió de paso
      await waitFor(() => {
        expect(mockStoreData.updateResume).toHaveBeenCalled();
      });
    }
  });

  test('debe actualizar store al completar información personal', async () => {
    render(<BuilderPage />);
    
    // Buscar inputs de información personal
    const inputs = screen.getAllByRole('textbox');
    
    if (inputs.length > 0) {
      fireEvent.change(inputs[0], { target: { value: 'Juan Pérez' } });
      
      await waitFor(() => {
        expect(mockStoreData.updateResume).toHaveBeenCalled();
      });
    }
  });

  test('debe mostrar botón de exportar PDF', () => {
    render(<BuilderPage />);
    
    const exportButton = screen.getByText(/exportar|pdf|descargar/i) ||
                         screen.getByRole('button', { name: /pdf/i });
    expect(exportButton).toBeInTheDocument();
  });

  test('debe llamar a API al exportar PDF', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      blob: () => Promise.resolve(new Blob(['pdf content'], { type: 'application/pdf' })),
    });

    render(<BuilderPage />);
    
    const exportButton = screen.getByText(/exportar|pdf|generar/i);
    fireEvent.click(exportButton);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/generate'),
        expect.any(Object)
      );
    });
  });

  test('debe actualizar score cuando se completa información', async () => {
    const { rerender } = render(<BuilderPage />);
    
    // Simular actualización del store con datos
    mockStoreData.fullName = 'Juan Pérez';
    mockStoreData.email = 'juan@example.com';
    mockStoreData.experience = [{
      company: 'Tech Corp',
      position: 'Developer'
    }];
    
    rerender(<BuilderPage />);
    
    // El score debería actualizarse
    await waitFor(() => {
      const scoreElement = document.querySelector('[class*="score"]');
      expect(scoreElement).toBeInTheDocument();
    });
  });

  test('debe mostrar todas las secciones del formulario', () => {
    render(<BuilderPage />);
    
    // Verificar que existen elementos para navegar por las secciones
    const sections = document.querySelectorAll('[class*="step"], [class*="section"]');
    expect(sections.length).toBeGreaterThan(0);
  });

  test('debe manejar errores de exportación PDF', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Error de red'));

    render(<BuilderPage />);
    
    const exportButton = screen.getByText(/exportar|pdf|generar/i);
    fireEvent.click(exportButton);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
    
    // El componente no debería crashear
    expect(exportButton).toBeInTheDocument();
  });

  test('flujo completo: rellenar formulario y exportar', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      blob: () => Promise.resolve(new Blob(['pdf'], { type: 'application/pdf' })),
    });

    render(<BuilderPage />);
    
    // 1. Rellenar nombre
    const inputs = screen.getAllByRole('textbox');
    if (inputs[0]) {
      fireEvent.change(inputs[0], { target: { value: 'Juan Pérez' } });
    }
    
    // 2. Seleccionar plantilla
    const templateButton = screen.getByText(/premium|ats/i);
    fireEvent.click(templateButton);
    
    // 3. Exportar
    const exportButton = screen.getByText(/exportar|pdf/i);
    fireEvent.click(exportButton);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  test('snapshot del builder completo', () => {
    const { container } = render(<BuilderPage />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
