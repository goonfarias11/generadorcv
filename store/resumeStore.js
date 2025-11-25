import { create } from 'zustand'

export const useResumeStore = create((set) => ({
  resume: {
    name: '',
    email: '',
    phone: '',
    location: '',
    profile: '',
    photo: '', // Campo para imagen en base64
    website: '',
    linkedin: '',
    github: '',
    industry: '', // Rubro laboral
    targetRole: '', // Puesto objetivo
    experience: [],
    education: [],
    educationInfo: {
      hasHighSchoolCompleted: null,
      hasAnalitico: null
    },
    noExperienceExtras: {
      volunteer: '',
      projects: '',
      achievements: ''
    },
    skills: [],
    extras: [],
    template: 'ats', // Plantilla por defecto (gratuita)
    coverLetter: '',
    plan: 'free', // 'free' o 'professional'
    subscriptionStatus: 'none', // 'none', 'pending', 'active', 'expired'
    receiptUrl: null // URL del comprobante subido
  },
  
  updateResume: (data) => set((state) => ({
    resume: { ...state.resume, ...data }
  })),
  
  addExperience: (exp) => set((state) => ({
    resume: {
      ...state.resume,
      experience: [...state.resume.experience, exp]
    }
  })),
  
  updateExperience: (index, exp) => set((state) => ({
    resume: {
      ...state.resume,
      experience: state.resume.experience.map((e, i) => i === index ? exp : e)
    }
  })),
  
  removeExperience: (index) => set((state) => ({
    resume: {
      ...state.resume,
      experience: state.resume.experience.filter((_, i) => i !== index)
    }
  })),
  
  addEducation: (edu) => set((state) => ({
    resume: {
      ...state.resume,
      education: [...state.resume.education, edu]
    }
  })),
  
  updateEducation: (index, edu) => set((state) => ({
    resume: {
      ...state.resume,
      education: state.resume.education.map((e, i) => i === index ? edu : e)
    }
  })),
  
  removeEducation: (index) => set((state) => ({
    resume: {
      ...state.resume,
      education: state.resume.education.filter((_, i) => i !== index)
    }
  })),
  
  addSkill: (skill) => set((state) => ({
    resume: {
      ...state.resume,
      skills: [...state.resume.skills, skill]
    }
  })),
  
  removeSkill: (index) => set((state) => ({
    resume: {
      ...state.resume,
      skills: state.resume.skills.filter((_, i) => i !== index)
    }
  })),
  
  addExtra: (extra) => set((state) => ({
    resume: {
      ...state.resume,
      extras: [...state.resume.extras, extra]
    }
  })),
  
  removeExtra: (index) => set((state) => ({
    resume: {
      ...state.resume,
      extras: state.resume.extras.filter((_, i) => i !== index)
    }
  })),
  
  resetResume: () => set({
    resume: {
      name: '',
      email: '',
      phone: '',
      location: '',
      profile: '',
      photo: '',
      website: '',
      linkedin: '',
      github: '',
      industry: '',
      targetRole: '',
      experience: [],
      education: [],
      educationInfo: {
        hasHighSchoolCompleted: null,
        hasAnalitico: null
      },
      noExperienceExtras: {
        volunteer: '',
        projects: '',
        achievements: ''
      },
      skills: [],
      extras: [],
      template: 'ats',
      coverLetter: '',
      plan: 'free'
    }
  })
}))
