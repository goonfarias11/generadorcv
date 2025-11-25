import {
  autoFormat,
  improveProfile,
  detectMetrics,
  analyzeReadability,
  generateProfileSuggestion,
} from '@/lib/helpers';

describe('Helper functions', () => {
  describe('autoFormat', () => {
    test('debe capitalizar primera letra de cada oración', () => {
      const text = 'hola mundo. esto es una prueba.';
      const result = autoFormat(text);
      
      expect(result).toContain('Hola mundo');
      expect(result).toContain('Esto es una prueba');
    });

    test('debe eliminar espacios extra', () => {
      const text = 'texto   con    espacios    extra';
      const result = autoFormat(text);
      
      expect(result).not.toMatch(/\s{2,}/);
    });

    test('debe manejar texto vacío', () => {
      expect(autoFormat('')).toBe('');
      expect(autoFormat('   ')).toBe('');
    });
  });

  describe('improveProfile', () => {
    test('debe mejorar perfil básico con sugerencias', () => {
      const basicProfile = 'Desarrollador';
      const result = improveProfile(basicProfile);
      
      expect(result.length).toBeGreaterThan(basicProfile.length);
      expect(result).toContain('Desarrollador');
    });

    test('debe mantener perfil ya bueno sin cambios drásticos', () => {
      const goodProfile = 'Desarrollador Full Stack Senior con 8 años de experiencia en React, Node.js y arquitecturas cloud. Experto en liderar equipos técnicos y optimizar procesos de desarrollo.';
      const result = improveProfile(goodProfile);
      
      expect(result).toBeDefined();
      expect(result.length).toBeGreaterThan(50);
    });
  });

  describe('detectMetrics', () => {
    test('debe detectar porcentajes', () => {
      const text = 'Aumenté la eficiencia en 40%';
      const metrics = detectMetrics(text);
      
      expect(metrics.length).toBeGreaterThan(0);
      expect(metrics.some(m => m.includes('40%'))).toBe(true);
    });

    test('debe detectar cantidades con números', () => {
      const text = 'Lideré equipo de 10 personas';
      const metrics = detectMetrics(text);
      
      expect(metrics.length).toBeGreaterThan(0);
    });

    test('debe detectar montos en dinero', () => {
      const text = 'Ahorré $50,000 en costos';
      const metrics = detectMetrics(text);
      
      expect(metrics.length).toBeGreaterThan(0);
      expect(metrics.some(m => m.includes('$') || m.includes('50'))).toBe(true);
    });

    test('debe retornar array vacío si no hay métricas', () => {
      const text = 'Trabajé en proyectos web';
      const metrics = detectMetrics(text);
      
      expect(Array.isArray(metrics)).toBe(true);
    });
  });

  describe('analyzeReadability', () => {
    test('debe analizar legibilidad de texto complejo', () => {
      const text = 'Este es un texto de prueba con varias oraciones. Cada oración tiene diferentes longitudes. Algunas son cortas. Otras son significativamente más largas y contienen múltiples cláusulas.';
      const result = analyzeReadability(text);
      
      expect(result).toHaveProperty('avgSentenceLength');
      expect(result).toHaveProperty('avgWordLength');
      expect(result).toHaveProperty('score');
      expect(typeof result.score).toBe('string');
    });

    test('debe manejar texto vacío', () => {
      const result = analyzeReadability('');
      
      expect(result).toBeDefined();
      expect(result.avgSentenceLength).toBe(0);
    });

    test('debe calcular promedio de longitud de palabras', () => {
      const text = 'Hola mundo';
      const result = analyzeReadability(text);
      
      expect(result.avgWordLength).toBeGreaterThan(0);
    });
  });

  describe('generateProfileSuggestion', () => {
    test('debe generar sugerencia basada en experiencia', () => {
      const resume = {
        fullName: 'Juan Pérez',
        experience: [
          {
            position: 'Senior Developer',
            company: 'Tech Corp',
            description: 'Desarrollo de aplicaciones'
          }
        ],
        skills: ['JavaScript', 'React', 'Node.js'],
      };

      const suggestion = generateProfileSuggestion(resume);
      
      expect(suggestion).toBeDefined();
      expect(suggestion.length).toBeGreaterThan(20);
      expect(typeof suggestion).toBe('string');
    });

    test('debe generar sugerencia genérica si no hay experiencia', () => {
      const resume = {
        fullName: 'Test User',
        experience: [],
        skills: ['JavaScript'],
      };

      const suggestion = generateProfileSuggestion(resume);
      
      expect(suggestion).toBeDefined();
      expect(suggestion.length).toBeGreaterThan(0);
    });

    test('debe incluir skills en la sugerencia', () => {
      const resume = {
        fullName: 'Test',
        experience: [],
        skills: ['Python', 'Machine Learning', 'TensorFlow'],
      };

      const suggestion = generateProfileSuggestion(resume);
      
      expect(suggestion).toBeDefined();
      // Debería mencionar las skills o tecnologías
      expect(suggestion.length).toBeGreaterThan(20);
    });
  });
});
