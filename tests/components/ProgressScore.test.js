import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProgressScore from '@/app/builder/components/ProgressScore';
import { mockResumeData, emptyResumeData } from '@/tests/helpers/testUtils';

// Mock del módulo score
jest.mock('@/lib/score', () => ({
  calculateScore: jest.fn((resume) => {
    // Mock simple basado en si el resume tiene datos
    if (!resume.fullName || !resume.email) {
      return { score: 0, tips: [] };
    }
    if (resume.experience?.length > 0 && resume.education?.length > 0) {
      return {
        score: 85,
        tips: ['Agrega más proyectos para destacar']
      };
    }
    return {
      score: 45,
      tips: [
        'Agrega experiencia laboral',
        'Completa tu educación',
        'Incluye habilidades técnicas'
      ]
    };
  })
}));

describe('ProgressScore Component', () => {
  test('debe mostrar score 0 para CV vacío', () => {
    render(<ProgressScore resume={emptyResumeData} />);
    
    expect(screen.getByText(/0/)).toBeInTheDocument();
  });

  test('debe mostrar score calculado para CV completo', () => {
    render(<ProgressScore resume={mockResumeData} />);
    
    expect(screen.getByText(/85/)).toBeInTheDocument();
  });

  test('debe renderizar barra de progreso', () => {
    const { container } = render(<ProgressScore resume={mockResumeData} />);
    
    const progressBar = container.querySelector('[role="progressbar"], .progress-bar, .w-full');
    expect(progressBar).toBeInTheDocument();
  });

  test('debe mostrar tips cuando el score es bajo', () => {
    const lowScoreResume = {
      fullName: 'Test',
      email: 'test@test.com',
      experience: [],
      education: [],
      skills: [],
    };
    
    render(<ProgressScore resume={lowScoreResume} />);
    
    // Verificar que se muestren tips
    expect(screen.getByText(/Agrega experiencia laboral/i) || 
           screen.getByText(/experiencia/i)).toBeInTheDocument();
  });

  test('debe usar colores diferentes según el score', () => {
    const { container, rerender } = render(
      <ProgressScore resume={emptyResumeData} />
    );
    
    // Score bajo (0) - debería usar color rojo o warning
    let progressElement = container.querySelector('.bg-red-500, .bg-orange-500, .bg-yellow-500, .bg-green-500');
    expect(progressElement).toBeInTheDocument();
    
    // Score alto (85)
    rerender(<ProgressScore resume={mockResumeData} />);
    progressElement = container.querySelector('.bg-green-500, .bg-emerald-500');
    expect(progressElement).toBeInTheDocument();
  });

  test('debe manejar resume undefined sin crashear', () => {
    expect(() => render(<ProgressScore resume={undefined} />)).not.toThrow();
  });

  test('debe manejar resume null sin crashear', () => {
    expect(() => render(<ProgressScore resume={null} />)).not.toThrow();
  });

  test('debe actualizar cuando cambian los datos del resume', () => {
    const { rerender } = render(<ProgressScore resume={emptyResumeData} />);
    
    expect(screen.getByText(/0/)).toBeInTheDocument();
    
    rerender(<ProgressScore resume={mockResumeData} />);
    
    expect(screen.getByText(/85/)).toBeInTheDocument();
  });
});
