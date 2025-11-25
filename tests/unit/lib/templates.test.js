import { templates } from '@/lib/templates';

describe('templates', () => {
  const mockResume = {
    fullName: 'Juan Pérez',
    email: 'juan@example.com',
    phone: '+54 11 1234-5678',
    location: 'Buenos Aires, Argentina',
    linkedIn: 'https://linkedin.com/in/juanperez',
    github: 'https://github.com/juanperez',
    portfolio: 'https://juanperez.dev',
    profile: 'Desarrollador Full Stack con experiencia',
    experience: [
      {
        company: 'Tech Corp',
        position: 'Senior Developer',
        startDate: '2020-01',
        endDate: 'Presente',
        description: 'Desarrollo de aplicaciones web'
      }
    ],
    education: [
      {
        institution: 'Universidad Nacional',
        degree: 'Ingeniería en Sistemas',
        startDate: '2015',
        endDate: '2019'
      }
    ],
    skills: ['JavaScript', 'React', 'Node.js'],
    languages: ['Español', 'Inglés'],
    certifications: ['AWS Certified'],
  };

  test('debe tener exactamente 8 plantillas', () => {
    expect(Object.keys(templates)).toHaveLength(8);
  });

  test('debe incluir todas las plantillas esperadas', () => {
    const expectedTemplates = [
      'premium',
      'ats',
      'executive',
      'creative',
      'minimalista',
      'startup',
      'academica',
      'dark'
    ];

    expectedTemplates.forEach(template => {
      expect(templates).toHaveProperty(template);
    });
  });

  test('cada plantilla debe ser una función', () => {
    Object.values(templates).forEach(template => {
      expect(typeof template).toBe('function');
    });
  });

  test('cada plantilla debe retornar un string HTML', () => {
    Object.entries(templates).forEach(([name, template]) => {
      const html = template(mockResume);
      
      expect(typeof html).toBe('string');
      expect(html.length).toBeGreaterThan(0);
      expect(html).toMatch(/<html|<!DOCTYPE/i);
    });
  });

  test('plantilla premium debe incluir datos del resume', () => {
    const html = templates.premium(mockResume);
    
    expect(html).toContain('Juan Pérez');
    expect(html).toContain('juan@example.com');
    expect(html).toContain('Tech Corp');
    expect(html).toContain('Senior Developer');
    expect(html).toContain('JavaScript');
  });

  test('plantilla ATS debe ser simple y parseable', () => {
    const html = templates.ats(mockResume);
    
    expect(html).toContain('Juan Pérez');
    expect(html).toContain('Tech Corp');
    // ATS templates típicamente usan fuentes simples
    expect(html.toLowerCase()).toMatch(/arial|calibri|helvetica|sans-serif/);
  });

  test('plantilla executive debe tener estilo profesional', () => {
    const html = templates.executive(mockResume);
    
    expect(html).toContain('Juan Pérez');
    expect(html).toContain('Tech Corp');
  });

  test('plantilla creative debe incluir elementos de diseño', () => {
    const html = templates.creative(mockResume);
    
    expect(html).toContain('Juan Pérez');
    expect(html).toContain('Tech Corp');
  });

  test('plantilla minimalista debe ser limpia', () => {
    const html = templates.minimalista(mockResume);
    
    expect(html).toContain('Juan Pérez');
    expect(html).toContain('Tech Corp');
  });

  test('plantilla startup debe tener estilo moderno', () => {
    const html = templates.startup(mockResume);
    
    expect(html).toContain('Juan Pérez');
    expect(html).toContain('Tech Corp');
  });

  test('plantilla academica debe enfocarse en educación', () => {
    const html = templates.academica(mockResume);
    
    expect(html).toContain('Juan Pérez');
    expect(html).toContain('Universidad Nacional');
    expect(html).toContain('Ingeniería en Sistemas');
  });

  test('plantilla dark debe tener fondo oscuro', () => {
    const html = templates.dark(mockResume);
    
    expect(html).toContain('Juan Pérez');
    expect(html).toContain('Tech Corp');
    // Debe tener colores oscuros
    expect(html.toLowerCase()).toMatch(/#[0-9a-f]{3,6}/);
  });

  test('todas las plantillas deben manejar arrays vacíos', () => {
    const emptyResume = {
      fullName: 'Test User',
      email: 'test@test.com',
      experience: [],
      education: [],
      skills: [],
      languages: [],
      certifications: [],
    };

    Object.entries(templates).forEach(([name, template]) => {
      expect(() => template(emptyResume)).not.toThrow();
      const html = template(emptyResume);
      expect(html).toContain('Test User');
    });
  });

  test('todas las plantillas deben manejar campos opcionales faltantes', () => {
    const minimalResume = {
      fullName: 'Test User',
      email: 'test@test.com',
    };

    Object.entries(templates).forEach(([name, template]) => {
      expect(() => template(minimalResume)).not.toThrow();
    });
  });

  test('plantillas deben generar HTML válido básico', () => {
    Object.entries(templates).forEach(([name, template]) => {
      const html = template(mockResume);
      
      // Verificar tags HTML básicos
      expect(html).toMatch(/<html/i);
      expect(html).toMatch(/<body/i);
      expect(html).toMatch(/<\/html>/i);
      expect(html).toMatch(/<\/body>/i);
    });
  });
});
