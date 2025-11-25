import { calculateScore } from '@/lib/score';

describe('calculateScore', () => {
  test('debe retornar score 0 para CV vacío', () => {
    const emptyResume = {
      fullName: '',
      email: '',
      profile: '',
      experience: [],
      education: [],
      skills: [],
    };

    const result = calculateScore(emptyResume);
    
    expect(result.score).toBe(0);
    expect(result.tips).toHaveLength(0);
  });

  test('debe retornar score básico para CV mínimo', () => {
    const minimalResume = {
      fullName: 'Juan Pérez',
      email: 'juan@example.com',
      profile: 'Desarrollador con experiencia',
      experience: [{
        company: 'Tech Corp',
        position: 'Developer',
        description: 'Trabajé en proyectos'
      }],
      education: [{
        institution: 'Universidad',
        degree: 'Ingeniería'
      }],
      skills: ['JavaScript', 'React'],
    };

    const result = calculateScore(minimalResume);
    
    expect(result.score).toBeGreaterThan(30);
    expect(result.score).toBeLessThan(70);
    expect(result.tips).toBeDefined();
    expect(Array.isArray(result.tips)).toBe(true);
  });

  test('debe detectar y bonificar métricas en experiencia', () => {
    const resumeWithMetrics = {
      fullName: 'Juan Pérez',
      email: 'juan@example.com',
      profile: 'Desarrollador senior con impacto medible',
      experience: [{
        company: 'Tech Corp',
        position: 'Senior Developer',
        description: 'Aumenté la eficiencia en 40%. Reduje costos en $50,000. Lideré equipo de 10 personas.'
      }],
      education: [{ institution: 'Universidad', degree: 'Ingeniería' }],
      skills: ['JavaScript', 'React', 'Node.js', 'AWS'],
    };

    const resumeWithoutMetrics = {
      ...resumeWithMetrics,
      experience: [{
        company: 'Tech Corp',
        position: 'Senior Developer',
        description: 'Trabajé en varios proyectos. Desarrollé aplicaciones web.'
      }],
    };

    const resultWith = calculateScore(resumeWithMetrics);
    const resultWithout = calculateScore(resumeWithoutMetrics);
    
    expect(resultWith.score).toBeGreaterThan(resultWithout.score);
  });

  test('debe sugerir tips específicos para CV incompleto', () => {
    const incompleteResume = {
      fullName: 'Juan Pérez',
      email: 'juan@example.com',
      profile: 'Developer', // Perfil muy corto
      experience: [{
        company: 'Tech Corp',
        position: 'Developer',
        description: 'Work' // Descripción muy corta
      }],
      education: [],
      skills: ['JS'], // Pocas skills
    };

    const result = calculateScore(incompleteResume);
    
    expect(result.tips.length).toBeGreaterThan(0);
    expect(result.tips.some(tip => tip.includes('perfil') || tip.includes('profile'))).toBe(true);
  });

  test('debe detectar oraciones muy cortas', () => {
    const resumeShortSentences = {
      fullName: 'Juan Pérez',
      email: 'juan@example.com',
      profile: 'Dev. Work. Code.',
      experience: [{
        company: 'Tech Corp',
        position: 'Developer',
        description: 'Do tasks. Fix bugs.'
      }],
      education: [{ institution: 'Universidad', degree: 'Ingeniería' }],
      skills: ['JavaScript', 'React'],
    };

    const result = calculateScore(resumeShortSentences);
    
    expect(result.tips.some(tip => 
      tip.toLowerCase().includes('oraciones') || 
      tip.toLowerCase().includes('sentences') ||
      tip.toLowerCase().includes('detalles')
    )).toBe(true);
  });

  test('debe alcanzar score cercano a 100 para CV completo y optimizado', () => {
    const perfectResume = {
      fullName: 'Juan Pérez García',
      email: 'juan.perez@example.com',
      phone: '+54 11 1234-5678',
      location: 'Buenos Aires, Argentina',
      linkedIn: 'https://linkedin.com/in/juanperez',
      github: 'https://github.com/juanperez',
      portfolio: 'https://juanperez.dev',
      profile: 'Desarrollador Full Stack Senior con más de 8 años de experiencia liderando equipos técnicos y arquitectando soluciones escalables. Especializado en React, Node.js y cloud computing con AWS. Track record comprobado aumentando la eficiencia operativa en 45% y reduciendo costos en $100,000 anuales.',
      experience: [
        {
          company: 'Tech Giants Inc',
          position: 'Senior Full Stack Developer',
          startDate: '2020-01',
          endDate: 'Presente',
          description: 'Lideré equipo de 12 desarrolladores en migración de arquitectura monolítica a microservicios, resultando en aumento de 60% en performance. Implementé CI/CD pipeline que redujo deployment time en 75%. Desarrollé features críticas usadas por 500,000+ usuarios mensuales.'
        },
        {
          company: 'StartupXYZ',
          position: 'Full Stack Developer',
          startDate: '2018-01',
          endDate: '2019-12',
          description: 'Construí plataforma e-commerce desde cero alcanzando $2M en ventas anuales. Optimicé base de datos reduciendo query time en 80%. Mentoricé 3 desarrolladores junior en mejores prácticas.'
        }
      ],
      education: [
        {
          institution: 'Universidad Tecnológica Nacional',
          degree: 'Ingeniería en Sistemas de Información',
          startDate: '2012',
          endDate: '2017',
          description: 'Promedio: 9.2/10. Mejor promedio de la cohorte.'
        }
      ],
      skills: ['JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'Express', 'PostgreSQL', 'MongoDB', 'AWS', 'Docker', 'Kubernetes', 'GraphQL', 'REST APIs', 'Git', 'Agile/Scrum'],
      languages: ['Español (Nativo)', 'Inglés (Fluido - C2)', 'Portugués (Intermedio)'],
      certifications: ['AWS Certified Solutions Architect', 'Professional Scrum Master I', 'Google Cloud Professional'],
      projects: [
        {
          name: 'SaaS Analytics Platform',
          description: 'Plataforma de analytics en tiempo real procesando 10M+ eventos diarios con arquitectura serverless',
          url: 'https://analytics-platform.com'
        }
      ]
    };

    const result = calculateScore(perfectResume);
    
    expect(result.score).toBeGreaterThan(85);
    expect(result.tips.length).toBeLessThan(3);
  });

  test('debe limitar tips a máximo 5 sugerencias', () => {
    const veryBadResume = {
      fullName: 'A',
      email: 'a',
      profile: 'b',
      experience: [],
      education: [],
      skills: [],
    };

    const result = calculateScore(veryBadResume);
    
    expect(result.tips.length).toBeLessThanOrEqual(5);
  });

  test('debe detectar palabras duplicadas excesivamente', () => {
    const resumeWithDuplicates = {
      fullName: 'Juan Pérez',
      email: 'juan@example.com',
      profile: 'Responsable de responsabilidades importantes con responsabilidad',
      experience: [{
        company: 'Tech Corp',
        position: 'Developer',
        description: 'Desarrollé desarrollos de desarrollo utilizando desarrollo ágil'
      }],
      education: [{ institution: 'Universidad', degree: 'Ingeniería' }],
      skills: ['JavaScript', 'React'],
    };

    const result = calculateScore(resumeWithDuplicates);
    
    // El score debe ser penalizado
    expect(result.score).toBeLessThan(80);
  });

  test('debe retornar objeto con estructura correcta', () => {
    const resume = {
      fullName: 'Test',
      email: 'test@test.com',
      profile: 'Test profile',
      experience: [],
      education: [],
      skills: ['Test'],
    };

    const result = calculateScore(resume);
    
    expect(result).toHaveProperty('score');
    expect(result).toHaveProperty('tips');
    expect(typeof result.score).toBe('number');
    expect(Array.isArray(result.tips)).toBe(true);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });
});
