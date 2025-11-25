import { create } from 'zustand';
import useResumeStore from '@/store/resumeStore';

// Mock de localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

global.localStorage = localStorageMock;

describe('resumeStore', () => {
  beforeEach(() => {
    // Limpiar el store antes de cada test
    const { resetResume } = useResumeStore.getState();
    resetResume();
    localStorage.clear();
  });

  test('debe tener estado inicial correcto', () => {
    const state = useResumeStore.getState();
    
    expect(state.fullName).toBe('');
    expect(state.email).toBe('');
    expect(state.phone).toBe('');
    expect(state.experience).toEqual([]);
    expect(state.education).toEqual([]);
    expect(state.skills).toEqual([]);
  });

  test('updateResume debe actualizar un campo simple', () => {
    const { updateResume } = useResumeStore.getState();
    
    updateResume('fullName', 'Juan Pérez');
    
    const state = useResumeStore.getState();
    expect(state.fullName).toBe('Juan Pérez');
  });

  test('updateResume debe actualizar múltiples campos', () => {
    const { updateResume } = useResumeStore.getState();
    
    updateResume('fullName', 'Juan Pérez');
    updateResume('email', 'juan@example.com');
    updateResume('phone', '+54 11 1234-5678');
    
    const state = useResumeStore.getState();
    expect(state.fullName).toBe('Juan Pérez');
    expect(state.email).toBe('juan@example.com');
    expect(state.phone).toBe('+54 11 1234-5678');
  });

  test('addExperience debe agregar nueva experiencia', () => {
    const { addExperience } = useResumeStore.getState();
    
    const newExperience = {
      company: 'Tech Corp',
      position: 'Developer',
      startDate: '2020-01',
      endDate: '2022-12',
      description: 'Desarrollo de aplicaciones'
    };
    
    addExperience(newExperience);
    
    const state = useResumeStore.getState();
    expect(state.experience).toHaveLength(1);
    expect(state.experience[0]).toMatchObject(newExperience);
    expect(state.experience[0]).toHaveProperty('id');
  });

  test('updateExperience debe actualizar experiencia existente', () => {
    const { addExperience, updateExperience } = useResumeStore.getState();
    
    addExperience({
      company: 'Tech Corp',
      position: 'Developer',
      description: 'Original'
    });
    
    const state = useResumeStore.getState();
    const experienceId = state.experience[0].id;
    
    updateExperience(experienceId, {
      company: 'Tech Corp Updated',
      position: 'Senior Developer',
      description: 'Updated description'
    });
    
    const updatedState = useResumeStore.getState();
    expect(updatedState.experience[0].company).toBe('Tech Corp Updated');
    expect(updatedState.experience[0].position).toBe('Senior Developer');
  });

  test('removeExperience debe eliminar experiencia', () => {
    const { addExperience, removeExperience } = useResumeStore.getState();
    
    addExperience({ company: 'Tech Corp 1' });
    addExperience({ company: 'Tech Corp 2' });
    
    let state = useResumeStore.getState();
    expect(state.experience).toHaveLength(2);
    
    const firstId = state.experience[0].id;
    removeExperience(firstId);
    
    state = useResumeStore.getState();
    expect(state.experience).toHaveLength(1);
    expect(state.experience[0].company).toBe('Tech Corp 2');
  });

  test('addEducation debe agregar nueva educación', () => {
    const { addEducation } = useResumeStore.getState();
    
    const newEducation = {
      institution: 'Universidad Nacional',
      degree: 'Ingeniería en Sistemas',
      startDate: '2015',
      endDate: '2019'
    };
    
    addEducation(newEducation);
    
    const state = useResumeStore.getState();
    expect(state.education).toHaveLength(1);
    expect(state.education[0]).toMatchObject(newEducation);
  });

  test('updateEducation debe actualizar educación existente', () => {
    const { addEducation, updateEducation } = useResumeStore.getState();
    
    addEducation({
      institution: 'Universidad',
      degree: 'Ingeniería'
    });
    
    const state = useResumeStore.getState();
    const educationId = state.education[0].id;
    
    updateEducation(educationId, {
      institution: 'Universidad Tecnológica',
      degree: 'Ingeniería en Sistemas'
    });
    
    const updatedState = useResumeStore.getState();
    expect(updatedState.education[0].institution).toBe('Universidad Tecnológica');
  });

  test('removeEducation debe eliminar educación', () => {
    const { addEducation, removeEducation } = useResumeStore.getState();
    
    addEducation({ institution: 'Universidad 1' });
    addEducation({ institution: 'Universidad 2' });
    
    let state = useResumeStore.getState();
    const firstId = state.education[0].id;
    
    removeEducation(firstId);
    
    state = useResumeStore.getState();
    expect(state.education).toHaveLength(1);
    expect(state.education[0].institution).toBe('Universidad 2');
  });

  test('updateSkills debe actualizar array de skills', () => {
    const { updateSkills } = useResumeStore.getState();
    
    updateSkills(['JavaScript', 'React', 'Node.js']);
    
    const state = useResumeStore.getState();
    expect(state.skills).toEqual(['JavaScript', 'React', 'Node.js']);
  });

  test('resetResume debe volver todo al estado inicial', () => {
    const { updateResume, addExperience, addEducation, updateSkills, resetResume } = useResumeStore.getState();
    
    // Agregar datos
    updateResume('fullName', 'Juan Pérez');
    updateResume('email', 'juan@example.com');
    addExperience({ company: 'Tech Corp' });
    addEducation({ institution: 'Universidad' });
    updateSkills(['JavaScript']);
    
    // Verificar que hay datos
    let state = useResumeStore.getState();
    expect(state.fullName).toBe('Juan Pérez');
    expect(state.experience).toHaveLength(1);
    
    // Resetear
    resetResume();
    
    // Verificar estado inicial
    state = useResumeStore.getState();
    expect(state.fullName).toBe('');
    expect(state.email).toBe('');
    expect(state.experience).toEqual([]);
    expect(state.education).toEqual([]);
    expect(state.skills).toEqual([]);
  });

  test('debe mantener inmutabilidad en actualizaciones', () => {
    const { addExperience } = useResumeStore.getState();
    
    const initialState = useResumeStore.getState();
    const initialExperience = initialState.experience;
    
    addExperience({ company: 'Tech Corp' });
    
    const newState = useResumeStore.getState();
    
    // El array debe ser diferente (nueva referencia)
    expect(newState.experience).not.toBe(initialExperience);
  });

  test('debe generar IDs únicos para experiencias', () => {
    const { addExperience } = useResumeStore.getState();
    
    addExperience({ company: 'Corp 1' });
    addExperience({ company: 'Corp 2' });
    addExperience({ company: 'Corp 3' });
    
    const state = useResumeStore.getState();
    const ids = state.experience.map(exp => exp.id);
    const uniqueIds = new Set(ids);
    
    expect(uniqueIds.size).toBe(3);
  });

  test('debe generar IDs únicos para educación', () => {
    const { addEducation } = useResumeStore.getState();
    
    addEducation({ institution: 'Uni 1' });
    addEducation({ institution: 'Uni 2' });
    
    const state = useResumeStore.getState();
    const ids = state.education.map(edu => edu.id);
    const uniqueIds = new Set(ids);
    
    expect(uniqueIds.size).toBe(2);
  });
});
