import { create } from 'zustand';

/**
 * Helper para crear un store de Zustand limpio en cada test
 */
export const createMockStore = (initialState = {}) => {
  return create((set) => ({
    ...initialState,
    updateResume: (field, value) => set({ [field]: value }),
    resetResume: () => set(initialState),
  }));
};

/**
 * Mock de datos de CV completo para tests
 */
export const mockResumeData = {
  fullName: 'Juan Pérez',
  email: 'juan.perez@email.com',
  phone: '+54 11 1234-5678',
  location: 'Buenos Aires, Argentina',
  linkedIn: 'https://linkedin.com/in/juanperez',
  github: 'https://github.com/juanperez',
  portfolio: 'https://juanperez.dev',
  profile: 'Desarrollador Full Stack con 5 años de experiencia en React y Node.js. Experto en arquitecturas escalables y metodologías ágiles.',
  experience: [
    {
      id: '1',
      company: 'Tech Company',
      position: 'Senior Developer',
      startDate: '2020-01',
      endDate: 'Presente',
      description: 'Lideré equipo de 5 desarrolladores. Implementé microservicios que aumentaron la eficiencia en 40%. Reduje el tiempo de carga en 60%.',
    },
  ],
  education: [
    {
      id: '1',
      institution: 'Universidad Nacional',
      degree: 'Ingeniería en Sistemas',
      startDate: '2015',
      endDate: '2019',
      description: 'Promedio: 8.5/10',
    },
  ],
  skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS'],
  languages: ['Español (Nativo)', 'Inglés (Avanzado)'],
  certifications: ['AWS Certified Developer', 'Scrum Master Certified'],
  projects: [
    {
      id: '1',
      name: 'E-commerce Platform',
      description: 'Plataforma de comercio electrónico con 10,000 usuarios activos',
      url: 'https://example.com',
    },
  ],
  coverLetter: {
    greeting: 'Estimado equipo de reclutamiento',
    body: 'Me dirijo a ustedes para expresar mi interés en la posición disponible...',
    closing: 'Quedo a disposición para una entrevista.',
  },
};

/**
 * Mock de datos de CV vacío
 */
export const emptyResumeData = {
  fullName: '',
  email: '',
  phone: '',
  location: '',
  linkedIn: '',
  github: '',
  portfolio: '',
  profile: '',
  experience: [],
  education: [],
  skills: [],
  languages: [],
  certifications: [],
  projects: [],
  coverLetter: { greeting: '', body: '', closing: '' },
};
