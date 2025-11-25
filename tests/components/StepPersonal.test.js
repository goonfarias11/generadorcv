import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import StepPersonal from '@/app/builder/components/StepPersonal';

// Mock del store
const mockUpdateResume = jest.fn();
jest.mock('@/store/resumeStore', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedIn: '',
    github: '',
    portfolio: '',
    updateResume: mockUpdateResume
  }))
}));

describe('StepPersonal Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('debe renderizar todos los campos personales', () => {
    render(<StepPersonal onNext={jest.fn()} />);
    
    expect(screen.getByText(/nombre completo/i)).toBeInTheDocument();
    expect(screen.getByText(/email/i)).toBeInTheDocument();
  });

  test('debe tener botón para continuar', () => {
    render(<StepPersonal onNext={jest.fn()} />);
    
    const nextButton = screen.getByRole('button', { name: /siguiente|continuar/i });
    expect(nextButton).toBeInTheDocument();
  });

  test('debe llamar onNext al hacer click en siguiente', () => {
    const mockOnNext = jest.fn();
    render(<StepPersonal onNext={mockOnNext} />);
    
    const nextButton = screen.getByRole('button', { name: /siguiente|continuar/i });
    fireEvent.click(nextButton);
    
    expect(mockOnNext).toHaveBeenCalled();
  });

  test('snapshot del componente', () => {
    const { container } = render(<StepPersonal onNext={jest.fn()} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
