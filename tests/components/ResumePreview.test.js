import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ResumePreview from '@/app/builder/components/ResumePreview';
import { mockResumeData } from '@/tests/helpers/testUtils';

describe('ResumePreview Component', () => {
  const defaultProps = {
    resume: mockResumeData,
    template: 'premium'
  };

  test('debe renderizar sin crashear', () => {
    render(<ResumePreview {...defaultProps} />);
    expect(screen.getByText(/Juan Pérez/)).toBeInTheDocument();
  });

  test('debe mostrar nombre completo', () => {
    render(<ResumePreview {...defaultProps} />);
    expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
  });

  test('debe mostrar email', () => {
    render(<ResumePreview {...defaultProps} />);
    expect(screen.getByText(/juan.perez@email.com/)).toBeInTheDocument();
  });

  test('debe mostrar teléfono', () => {
    render(<ResumePreview {...defaultProps} />);
    expect(screen.getByText(/\+54 11 1234-5678/)).toBeInTheDocument();
  });

  test('debe mostrar experiencia laboral', () => {
    render(<ResumePreview {...defaultProps} />);
    expect(screen.getByText(/Tech Company/)).toBeInTheDocument();
    expect(screen.getByText(/Senior Developer/)).toBeInTheDocument();
  });

  test('debe mostrar educación', () => {
    render(<ResumePreview {...defaultProps} />);
    expect(screen.getByText(/Universidad Nacional/)).toBeInTheDocument();
    expect(screen.getByText(/Ingeniería en Sistemas/)).toBeInTheDocument();
  });

  test('debe mostrar habilidades', () => {
    render(<ResumePreview {...defaultProps} />);
    expect(screen.getByText(/JavaScript/)).toBeInTheDocument();
    expect(screen.getByText(/React/)).toBeInTheDocument();
  });

  test('debe cambiar de plantilla correctamente', () => {
    const { rerender } = render(<ResumePreview {...defaultProps} />);
    
    // Cambiar a plantilla ATS
    rerender(<ResumePreview resume={mockResumeData} template="ats" />);
    expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
    
    // Cambiar a plantilla creative
    rerender(<ResumePreview resume={mockResumeData} template="creative" />);
    expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
  });

  test('debe manejar todas las plantillas disponibles', () => {
    const templates = ['premium', 'ats', 'executive', 'creative', 'minimalista', 'startup', 'academica', 'dark'];
    
    templates.forEach(template => {
      const { unmount } = render(<ResumePreview resume={mockResumeData} template={template} />);
      expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
      unmount();
    });
  });

  test('debe manejar resume vacío sin crashear', () => {
    const emptyResume = {
      fullName: '',
      email: '',
      experience: [],
      education: [],
      skills: [],
    };
    
    expect(() => render(<ResumePreview resume={emptyResume} template="premium" />)).not.toThrow();
  });

  test('debe actualizar cuando cambian los datos del resume', () => {
    const { rerender } = render(<ResumePreview {...defaultProps} />);
    
    expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
    
    const updatedResume = {
      ...mockResumeData,
      fullName: 'María García'
    };
    
    rerender(<ResumePreview resume={updatedResume} template="premium" />);
    expect(screen.getByText('María García')).toBeInTheDocument();
  });

  test('debe renderizar perfil profesional', () => {
    render(<ResumePreview {...defaultProps} />);
    expect(screen.getByText(/Desarrollador Full Stack/)).toBeInTheDocument();
  });

  test('debe renderizar links sociales', () => {
    render(<ResumePreview {...defaultProps} />);
    
    const linkedinLink = screen.getByText(/linkedin.com\/in\/juanperez/) || 
                         document.querySelector('[href*="linkedin"]');
    expect(linkedinLink).toBeInTheDocument();
  });

  test('snapshot de plantilla premium', () => {
    const { container } = render(<ResumePreview resume={mockResumeData} template="premium" />);
    expect(container.firstChild).toMatchSnapshot();
  });

  test('snapshot de plantilla ATS', () => {
    const { container } = render(<ResumePreview resume={mockResumeData} template="ats" />);
    expect(container.firstChild).toMatchSnapshot();
  });

  test('snapshot de plantilla creative', () => {
    const { container } = render(<ResumePreview resume={mockResumeData} template="creative" />);
    expect(container.firstChild).toMatchSnapshot();
  });

  test('snapshot de plantilla minimalista', () => {
    const { container } = render(<ResumePreview resume={mockResumeData} template="minimalista" />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
