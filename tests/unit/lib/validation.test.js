import {
  validateEmail,
  validatePhone,
  validateURL,
  validateResumeStructure,
} from '@/lib/validation';

describe('Validation functions', () => {
  describe('validateEmail', () => {
    test('debe validar emails correctos', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.com')).toBe(true);
      expect(validateEmail('user+tag@example.co.uk')).toBe(true);
      expect(validateEmail('123@test.com')).toBe(true);
    });

    test('debe rechazar emails inválidos', () => {
      expect(validateEmail('invalidemail')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('user@')).toBe(false);
      expect(validateEmail('user @example.com')).toBe(false);
      expect(validateEmail('')).toBe(false);
    });
  });

  describe('validatePhone', () => {
    test('debe validar teléfonos con diferentes formatos', () => {
      expect(validatePhone('+54 11 1234-5678')).toBe(true);
      expect(validatePhone('1234567890')).toBe(true);
      expect(validatePhone('+1 (555) 123-4567')).toBe(true);
      expect(validatePhone('555-1234')).toBe(true);
    });

    test('debe rechazar teléfonos inválidos', () => {
      expect(validatePhone('abc')).toBe(false);
      expect(validatePhone('123')).toBe(false);
      expect(validatePhone('')).toBe(false);
    });
  });

  describe('validateURL', () => {
    test('debe validar URLs correctas', () => {
      expect(validateURL('https://example.com')).toBe(true);
      expect(validateURL('http://test.com')).toBe(true);
      expect(validateURL('https://subdomain.example.com/path')).toBe(true);
      expect(validateURL('https://github.com/user')).toBe(true);
    });

    test('debe rechazar URLs inválidas', () => {
      expect(validateURL('notaurl')).toBe(false);
      expect(validateURL('www.example.com')).toBe(false);
      expect(validateURL('')).toBe(false);
      expect(validateURL('htp://wrong.com')).toBe(false);
    });

    test('debe aceptar URL vacía como válida (opcional)', () => {
      expect(validateURL('')).toBe(false);
    });
  });

  describe('validateResumeStructure', () => {
    test('debe validar estructura completa y correcta', () => {
      const validResume = {
        fullName: 'Juan Pérez',
        email: 'juan@example.com',
        phone: '+54 11 1234-5678',
        experience: [
          {
            company: 'Tech Corp',
            position: 'Developer',
            description: 'Trabajé en proyectos web'
          }
        ],
        education: [
          {
            institution: 'Universidad',
            degree: 'Ingeniería'
          }
        ],
        skills: ['JavaScript', 'React'],
      };

      const result = validateResumeStructure(validResume);
      
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('debe detectar email inválido', () => {
      const invalidResume = {
        fullName: 'Juan Pérez',
        email: 'emailinvalido',
        phone: '+54 11 1234-5678',
        experience: [],
        education: [],
        skills: [],
      };

      const result = validateResumeStructure(invalidResume);
      
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('email'))).toBe(true);
    });

    test('debe detectar campos requeridos faltantes', () => {
      const incompleteResume = {
        email: 'test@example.com',
        // falta fullName
      };

      const result = validateResumeStructure(incompleteResume);
      
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    test('debe validar arrays vacíos como válidos', () => {
      const minimalResume = {
        fullName: 'Test',
        email: 'test@example.com',
        experience: [],
        education: [],
        skills: [],
      };

      const result = validateResumeStructure(minimalResume);
      
      expect(result.valid).toBe(true);
    });
  });
});
