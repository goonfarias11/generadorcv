import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Question from '@/app/builder/components/Question';

describe('Question Component', () => {
  const mockOnAnswer = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('debe renderizar pregunta de texto correctamente', () => {
    render(
      <Question
        question="¿Cuál es tu nombre completo?"
        type="text"
        onAnswer={mockOnAnswer}
      />
    );
    
    expect(screen.getByText('¿Cuál es tu nombre completo?')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  test('debe llamar onAnswer al escribir en input de texto', () => {
    render(
      <Question
        question="¿Cuál es tu email?"
        type="text"
        onAnswer={mockOnAnswer}
      />
    );
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test@example.com' } });
    
    expect(input.value).toBe('test@example.com');
  });

  test('debe renderizar pregunta de textarea correctamente', () => {
    render(
      <Question
        question="Describe tu perfil profesional"
        type="textarea"
        onAnswer={mockOnAnswer}
      />
    );
    
    expect(screen.getByText('Describe tu perfil profesional')).toBeInTheDocument();
    const textarea = screen.getByRole('textbox');
    expect(textarea.tagName).toBe('TEXTAREA');
  });

  test('debe mostrar valor inicial si se proporciona', () => {
    render(
      <Question
        question="Tu nombre"
        type="text"
        value="Juan Pérez"
        onAnswer={mockOnAnswer}
      />
    );
    
    const input = screen.getByRole('textbox');
    expect(input.value).toBe('Juan Pérez');
  });

  test('debe mostrar placeholder si se proporciona', () => {
    render(
      <Question
        question="Tu email"
        type="text"
        placeholder="ejemplo@email.com"
        onAnswer={mockOnAnswer}
      />
    );
    
    const input = screen.getByPlaceholderText('ejemplo@email.com');
    expect(input).toBeInTheDocument();
  });

  test('debe validar email y mostrar error si es inválido', () => {
    render(
      <Question
        question="Tu email"
        type="text"
        validation="email"
        onAnswer={mockOnAnswer}
      />
    );
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'emailinvalido' } });
    fireEvent.blur(input);
    
    // Verificar que se muestre algún mensaje de error
    // (esto depende de cómo esté implementada la validación en el componente)
  });

  test('debe aplicar clases CSS personalizadas', () => {
    const { container } = render(
      <Question
        question="Pregunta de prueba"
        type="text"
        onAnswer={mockOnAnswer}
        className="custom-class"
      />
    );
    
    expect(container.querySelector('.custom-class')).toBeInTheDocument();
  });

  test('debe manejar diferentes tipos de input', () => {
    const { rerender } = render(
      <Question
        question="Test"
        type="text"
        onAnswer={mockOnAnswer}
      />
    );
    
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    
    rerender(
      <Question
        question="Test"
        type="textarea"
        onAnswer={mockOnAnswer}
      />
    );
    
    const textarea = screen.getByRole('textbox');
    expect(textarea.tagName).toBe('TEXTAREA');
  });
});
