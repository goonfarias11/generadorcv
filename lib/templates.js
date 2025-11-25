export const templates = {
  premium: {
    name: 'Premium',
    description: 'Moderna, dos columnas, ideal para profesionales',
    render: (resume) => `
      <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 850px; margin: 0 auto; background: white;">
        <div style="display: flex;">
          <!-- Columna izquierda -->
          <div style="width: 35%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px;">
            ${resume.photo ? `
              <div style="margin-bottom: 30px; text-align: center;">
                <img src="${resume.photo}" alt="Foto de perfil" style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover; border: 4px solid rgba(255,255,255,0.3); box-shadow: 0 4px 6px rgba(0,0,0,0.1);" />
              </div>
            ` : ''}
            <div style="margin-bottom: 40px;">
              <h1 style="font-size: 28px; font-weight: bold; margin: 0 0 5px 0;">${resume.name || 'Tu Nombre'}</h1>
              <div style="height: 3px; width: 50px; background: white; margin: 15px 0;"></div>
            </div>
            
            ${resume.email || resume.phone || resume.location || resume.website || resume.linkedin || resume.github ? `
              <div style="margin-bottom: 40px;">
                <h3 style="font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px;">Contacto</h3>
                ${resume.email ? `<p style="margin: 8px 0; font-size: 13px;">📧 ${resume.email}</p>` : ''}
                ${resume.phone ? `<p style="margin: 8px 0; font-size: 13px;">📱 ${resume.phone}</p>` : ''}
                ${resume.location ? `<p style="margin: 8px 0; font-size: 13px;">📍 ${resume.location}</p>` : ''}
                ${resume.website ? `<p style="margin: 8px 0; font-size: 13px;">🌐 ${resume.website}</p>` : ''}
                ${resume.linkedin ? `<p style="margin: 8px 0; font-size: 13px;">💼 ${resume.linkedin}</p>` : ''}
                ${resume.github ? `<p style="margin: 8px 0; font-size: 13px;">💻 ${resume.github}</p>` : ''}
              </div>
            ` : ''}
            
            ${resume.skills && resume.skills.length > 0 ? `
              <div style="margin-bottom: 40px;">
                <h3 style="font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px;">Habilidades</h3>
                ${resume.skills.map(skill => `<div style="background: rgba(255,255,255,0.2); padding: 8px 12px; margin: 8px 0; border-radius: 5px; font-size: 13px;">${skill}</div>`).join('')}
              </div>
            ` : ''}
            
            ${resume.extras && resume.extras.length > 0 ? `
              <div>
                <h3 style="font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px;">Información Adicional</h3>
                ${resume.extras.map(extra => `<p style="margin: 12px 0; font-size: 13px; line-height: 1.6;">${extra}</p>`).join('')}
              </div>
            ` : ''}
          </div>
          
          <!-- Columna derecha -->
          <div style="width: 65%; padding: 40px;">
            ${resume.profile ? `
              <div style="margin-bottom: 35px;">
                <h2 style="font-size: 18px; font-weight: 700; color: #667eea; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 0.5px;">Perfil Profesional</h2>
                <p style="font-size: 14px; line-height: 1.7; color: #374151;">${resume.profile}</p>
              </div>
            ` : ''}
            
            ${resume.experience && resume.experience.length > 0 ? `
              <div style="margin-bottom: 35px;">
                <h2 style="font-size: 18px; font-weight: 700; color: #667eea; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 0.5px;">Experiencia</h2>
                ${resume.experience.map(exp => `
                  <div style="margin-bottom: 25px;">
                    <h3 style="font-size: 16px; font-weight: 600; color: #1f2937; margin-bottom: 5px;">${exp.position || 'Posición'}</h3>
                    <div style="font-size: 14px; color: #6b7280; margin-bottom: 8px;">
                      <span style="font-weight: 500;">${exp.company || 'Empresa'}</span>
                      ${exp.startDate ? ` • ${exp.startDate}${exp.endDate ? ` - ${exp.endDate}` : ' - Presente'}` : ''}
                    </div>
                    ${exp.description ? `<p style="font-size: 13px; line-height: 1.6; color: #4b5563;">${exp.description}</p>` : ''}
                  </div>
                `).join('')}
              </div>
            ` : ''}
            
            ${resume.experience.length === 0 && resume.noExperienceExtras && (resume.noExperienceExtras.volunteer || resume.noExperienceExtras.projects || resume.noExperienceExtras.achievements) ? `
              <div style="margin-bottom: 35px;">
                <h2 style="font-size: 18px; font-weight: 700; color: #667eea; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 0.5px;">Logros y Proyectos</h2>
                ${resume.noExperienceExtras.volunteer ? `
                  <div style="margin-bottom: 20px;">
                    <h3 style="font-size: 15px; font-weight: 600; color: #1f2937; margin-bottom: 8px;">Voluntariado</h3>
                    <p style="font-size: 13px; line-height: 1.6; color: #4b5563;">${resume.noExperienceExtras.volunteer}</p>
                  </div>
                ` : ''}
                ${resume.noExperienceExtras.projects ? `
                  <div style="margin-bottom: 20px;">
                    <h3 style="font-size: 15px; font-weight: 600; color: #1f2937; margin-bottom: 8px;">Proyectos Personales</h3>
                    <p style="font-size: 13px; line-height: 1.6; color: #4b5563;">${resume.noExperienceExtras.projects}</p>
                  </div>
                ` : ''}
                ${resume.noExperienceExtras.achievements ? `
                  <div style="margin-bottom: 20px;">
                    <h3 style="font-size: 15px; font-weight: 600; color: #1f2937; margin-bottom: 8px;">Logros</h3>
                    <p style="font-size: 13px; line-height: 1.6; color: #4b5563;">${resume.noExperienceExtras.achievements}</p>
                  </div>
                ` : ''}
              </div>
            ` : ''}
            
            ${resume.education && resume.education.length > 0 ? `
              <div>
                <h2 style="font-size: 18px; font-weight: 700; color: #667eea; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 0.5px;">Educación</h2>
                ${resume.education.map(edu => `
                  <div style="margin-bottom: 20px;">
                    <h3 style="font-size: 16px; font-weight: 600; color: #1f2937; margin-bottom: 5px;">${edu.degree || 'Título'}</h3>
                    <div style="font-size: 14px; color: #6b7280;">
                      <span style="font-weight: 500;">${edu.institution || 'Institución'}</span>
                      ${edu.year ? ` • ${edu.year}` : ''}
                    </div>
                    ${resume.educationInfo && (resume.educationInfo.hasHighSchoolCompleted !== null || resume.educationInfo.hasAnalitico !== null) ? `
                      <div style="font-size: 13px; color: #6b7280; margin-top: 5px;">
                        ${resume.educationInfo.hasHighSchoolCompleted !== null ? `Secundario completo: ${resume.educationInfo.hasHighSchoolCompleted ? 'Sí' : 'No'}` : ''}
                        ${resume.educationInfo.hasHighSchoolCompleted !== null && resume.educationInfo.hasAnalitico !== null ? ' • ' : ''}
                        ${resume.educationInfo.hasAnalitico !== null ? `Analítico en mano: ${resume.educationInfo.hasAnalitico ? 'Sí' : 'No'}` : ''}
                      </div>
                    ` : ''}
                  </div>
                `).join('')}
              </div>
            ` : ''}
            
          </div>
        </div>
        
        ${resume.coverLetter && resume.coverLetter.trim() ? `
          <div style="page-break-before: always;"></div>
          <section id="cover-letter" style="font-family: system-ui, -apple-system, sans-serif; max-width: 850px; margin: 0 auto; padding: 60px; background: white;">
            <h1 style="font-size: 28px; font-weight: 700; color: #667eea; margin-bottom: 30px; text-align: center; text-transform: uppercase; letter-spacing: 1px;">Carta de Presentación</h1>
            <p style="font-size: 14px; line-height: 1.9; color: #374151; white-space: pre-wrap; text-align: justify;">${resume.coverLetter}</p>
          </section>
        ` : ''}
          </div>
        </div>
      </div>
    `
  },
  
  ats: {
    name: 'ATS Friendly',
    description: 'Una columna, sin gráficos, optimizado para sistemas ATS',
    render: (resume) => `
      <div style="font-family: 'Times New Roman', serif; max-width: 850px; margin: 0 auto; padding: 50px; background: white;">
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #000; padding-bottom: 20px;">
          ${resume.photo ? `
            <div style="margin-bottom: 15px;">
              <img src="${resume.photo}" alt="Foto de perfil" style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover; border: 3px solid #000; box-shadow: 0 2px 4px rgba(0,0,0,0.1); display: inline-block;" />
            </div>
          ` : ''}
          <h1 style="font-size: 32px; font-weight: bold; margin: 0 0 10px 0; text-transform: uppercase;">${resume.name || 'TU NOMBRE'}</h1>
          <div style="font-size: 12px; color: #333;">
            ${resume.email ? `${resume.email}` : ''}
            ${resume.phone ? ` | ${resume.phone}` : ''}
            ${resume.location ? ` | ${resume.location}` : ''}
            ${resume.website ? ` | ${resume.website}` : ''}
            ${resume.linkedin ? ` | ${resume.linkedin}` : ''}
            ${resume.github ? ` | ${resume.github}` : ''}
          </div>
        </div>
        
        ${resume.profile ? `
          <div style="margin-bottom: 25px;">
            <h2 style="font-size: 16px; font-weight: bold; margin-bottom: 10px; text-transform: uppercase; border-bottom: 1px solid #000; padding-bottom: 5px;">PERFIL PROFESIONAL</h2>
            <p style="font-size: 12px; line-height: 1.6; text-align: justify;">${resume.profile}</p>
          </div>
        ` : ''}
        
        ${resume.experience && resume.experience.length > 0 ? `
          <div style="margin-bottom: 25px;">
            <h2 style="font-size: 16px; font-weight: bold; margin-bottom: 15px; text-transform: uppercase; border-bottom: 1px solid #000; padding-bottom: 5px;">EXPERIENCIA LABORAL</h2>
            ${resume.experience.map(exp => `
              <div style="margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
                  <strong style="font-size: 13px;">${exp.position || 'Posición'}</strong>
                  ${exp.startDate ? `<span style="font-size: 12px;">${exp.startDate}${exp.endDate ? ` - ${exp.endDate}` : ' - Presente'}</span>` : ''}
                </div>
                <div style="font-size: 12px; font-style: italic; margin-bottom: 8px;">${exp.company || 'Empresa'}</div>
                ${exp.description ? `<p style="font-size: 11px; line-height: 1.5; text-align: justify;">${exp.description}</p>` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}
        
        ${resume.experience.length === 0 && resume.noExperienceExtras && (resume.noExperienceExtras.volunteer || resume.noExperienceExtras.projects || resume.noExperienceExtras.achievements) ? `
          <div style="margin-bottom: 25px;">
            <h2 style="font-size: 16px; font-weight: bold; margin-bottom: 15px; text-transform: uppercase; border-bottom: 1px solid #000; padding-bottom: 5px;">LOGROS Y PROYECTOS</h2>
            ${resume.noExperienceExtras.volunteer ? `
              <div style="margin-bottom: 15px;">
                <h3 style="font-size: 13px; font-weight: bold; margin-bottom: 5px;">Voluntariado</h3>
                <p style="font-size: 11px; line-height: 1.5; text-align: justify;">${resume.noExperienceExtras.volunteer}</p>
              </div>
            ` : ''}
            ${resume.noExperienceExtras.projects ? `
              <div style="margin-bottom: 15px;">
                <h3 style="font-size: 13px; font-weight: bold; margin-bottom: 5px;">Proyectos Personales</h3>
                <p style="font-size: 11px; line-height: 1.5; text-align: justify;">${resume.noExperienceExtras.projects}</p>
              </div>
            ` : ''}
            ${resume.noExperienceExtras.achievements ? `
              <div style="margin-bottom: 15px;">
                <h3 style="font-size: 13px; font-weight: bold; margin-bottom: 5px;">Logros</h3>
                <p style="font-size: 11px; line-height: 1.5; text-align: justify;">${resume.noExperienceExtras.achievements}</p>
              </div>
            ` : ''}
          </div>
        ` : ''}
        
        ${resume.education && resume.education.length > 0 ? `
          <div style="margin-bottom: 25px;">
            <h2 style="font-size: 16px; font-weight: bold; margin-bottom: 15px; text-transform: uppercase; border-bottom: 1px solid #000; padding-bottom: 5px;">EDUCACIÓN</h2>
            ${resume.education.map(edu => `
              <div style="margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between;">
                  <strong style="font-size: 13px;">${edu.degree || 'Título'}</strong>
                  ${edu.year ? `<span style="font-size: 12px;">${edu.year}</span>` : ''}
                </div>
                <div style="font-size: 12px; font-style: italic;">${edu.institution || 'Institución'}</div>
                ${resume.educationInfo && (resume.educationInfo.hasHighSchoolCompleted !== null || resume.educationInfo.hasAnalitico !== null) ? `
                  <div style="font-size: 11px; margin-top: 3px;">
                    ${resume.educationInfo.hasHighSchoolCompleted !== null ? `Secundario completo: ${resume.educationInfo.hasHighSchoolCompleted ? 'Sí' : 'No'}` : ''}
                    ${resume.educationInfo.hasHighSchoolCompleted !== null && resume.educationInfo.hasAnalitico !== null ? ' | ' : ''}
                    ${resume.educationInfo.hasAnalitico !== null ? `Analítico en mano: ${resume.educationInfo.hasAnalitico ? 'Sí' : 'No'}` : ''}
                  </div>
                ` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}
        
        ${resume.skills && resume.skills.length > 0 ? `
          <div style="margin-bottom: 25px;">
            <h2 style="font-size: 16px; font-weight: bold; margin-bottom: 10px; text-transform: uppercase; border-bottom: 1px solid #000; padding-bottom: 5px;">HABILIDADES</h2>
            <p style="font-size: 12px;">${resume.skills.join(' • ')}</p>
          </div>
        ` : ''}
        
        ${resume.extras && resume.extras.length > 0 ? `
          <div style="margin-bottom: 25px;">
            <h2 style="font-size: 16px; font-weight: bold; margin-bottom: 10px; text-transform: uppercase; border-bottom: 1px solid #000; padding-bottom: 5px;">INFORMACIÓN ADICIONAL</h2>
            ${resume.extras.map(extra => `<p style="font-size: 11px; margin: 5px 0;">${extra}</p>`).join('')}
          </div>
        ` : ''}
        
        
        ${resume.coverLetter && resume.coverLetter.trim() ? `
          <div style="page-break-before: always;"></div>
          <section id="cover-letter" style="font-family: 'Times New Roman', serif; max-width: 850px; margin: 0 auto; padding: 50px; background: white;">
            <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 30px; text-align: center; text-transform: uppercase; border-bottom: 2px solid #000; padding-bottom: 15px;">CARTA DE PRESENTACIÓN</h1>
            <p style="font-size: 12px; line-height: 1.7; text-align: justify; white-space: pre-wrap;">${resume.coverLetter}</p>
          </section>
        ` : ''}
      </div>
    `
  },
  
  executive: {
    name: 'Ejecutiva',
    description: 'Elegante, azul oscuro, ideal para niveles senior',
    render: (resume) => `
      <div style="font-family: 'Georgia', serif; max-width: 850px; margin: 0 auto; background: white;">
        <div style="background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%); color: white; padding: 50px 60px; position: relative;">
          ${resume.photo ? `
            <div style="position: absolute; top: 30px; right: 60px;">
              <img src="${resume.photo}" alt="Foto de perfil" style="width: 120px; height: 120px; border-radius: 10px; object-fit: cover; border: 4px solid rgba(255,255,255,0.3); box-shadow: 0 4px 6px rgba(0,0,0,0.2);" />
            </div>
          ` : ''}
          <h1 style="font-size: 36px; font-weight: 300; margin: 0 0 10px 0; letter-spacing: 2px;">${resume.name || 'Tu Nombre'}</h1>
          <div style="height: 2px; width: 100px; background: #60a5fa; margin: 15px 0;"></div>
          <div style="font-size: 14px; margin-top: 20px; opacity: 0.95;">
            ${resume.email ? `${resume.email}` : ''}
            ${resume.phone ? ` • ${resume.phone}` : ''}
            ${resume.location ? ` • ${resume.location}` : ''}
            ${resume.website ? ` • ${resume.website}` : ''}
            ${resume.linkedin ? ` • ${resume.linkedin}` : ''}
            ${resume.github ? ` • ${resume.github}` : ''}
          </div>
        </div>
        
        <div style="padding: 50px 60px;">
          ${resume.profile ? `
            <div style="margin-bottom: 40px;">
              <p style="font-size: 15px; line-height: 1.8; color: #374151; font-style: italic; border-left: 4px solid #1e40af; padding-left: 20px;">${resume.profile}</p>
            </div>
          ` : ''}
          
          ${resume.experience && resume.experience.length > 0 ? `
            <div style="margin-bottom: 40px;">
              <h2 style="font-size: 22px; font-weight: 600; color: #1e3a8a; margin-bottom: 25px; border-bottom: 2px solid #1e40af; padding-bottom: 10px;">Experiencia Profesional</h2>
              ${resume.experience.map(exp => `
                <div style="margin-bottom: 30px;">
                  <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px;">
                    <h3 style="font-size: 18px; font-weight: 600; color: #1f2937; margin: 0;">${exp.position || 'Posición'}</h3>
                    ${exp.startDate ? `<span style="font-size: 13px; color: #6b7280;">${exp.startDate}${exp.endDate ? ` - ${exp.endDate}` : ' - Presente'}</span>` : ''}
                  </div>
                  <div style="font-size: 15px; color: #1e40af; font-weight: 500; margin-bottom: 10px;">${exp.company || 'Empresa'}</div>
                  ${exp.description ? `<p style="font-size: 14px; line-height: 1.7; color: #4b5563;">${exp.description}</p>` : ''}
                </div>
              `).join('')}
            </div>
          ` : ''}
          
          ${resume.experience.length === 0 && resume.noExperienceExtras && (resume.noExperienceExtras.volunteer || resume.noExperienceExtras.projects || resume.noExperienceExtras.achievements) ? `
            <div style="margin-bottom: 40px;">
              <h2 style="font-size: 22px; font-weight: 600; color: #1e3a8a; margin-bottom: 25px; border-bottom: 2px solid #1e40af; padding-bottom: 10px;">Logros y Proyectos</h2>
              ${resume.noExperienceExtras.volunteer ? `
                <div style="margin-bottom: 20px;">
                  <h3 style="font-size: 16px; font-weight: 600; color: #1f2937; margin-bottom: 8px;">Voluntariado</h3>
                  <p style="font-size: 14px; line-height: 1.7; color: #4b5563;">${resume.noExperienceExtras.volunteer}</p>
                </div>
              ` : ''}
              ${resume.noExperienceExtras.projects ? `
                <div style="margin-bottom: 20px;">
                  <h3 style="font-size: 16px; font-weight: 600; color: #1f2937; margin-bottom: 8px;">Proyectos Personales</h3>
                  <p style="font-size: 14px; line-height: 1.7; color: #4b5563;">${resume.noExperienceExtras.projects}</p>
                </div>
              ` : ''}
              ${resume.noExperienceExtras.achievements ? `
                <div style="margin-bottom: 20px;">
                  <h3 style="font-size: 16px; font-weight: 600; color: #1f2937; margin-bottom: 8px;">Logros</h3>
                  <p style="font-size: 14px; line-height: 1.7; color: #4b5563;">${resume.noExperienceExtras.achievements}</p>
                </div>
              ` : ''}
            </div>
          ` : ''}
          
          ${resume.education && resume.education.length > 0 ? `
            <div style="margin-bottom: 40px;">
              <h2 style="font-size: 22px; font-weight: 600; color: #1e3a8a; margin-bottom: 25px; border-bottom: 2px solid #1e40af; padding-bottom: 10px;">Formación Académica</h2>
              ${resume.education.map(edu => `
                <div style="margin-bottom: 20px;">
                  <div style="display: flex; justify-content: space-between; align-items: baseline;">
                    <h3 style="font-size: 16px; font-weight: 600; color: #1f2937; margin: 0;">${edu.degree || 'Título'}</h3>
                    ${edu.year ? `<span style="font-size: 13px; color: #6b7280;">${edu.year}</span>` : ''}
                  </div>
                  <div style="font-size: 14px; color: #1e40af; margin-top: 5px;">${edu.institution || 'Institución'}</div>
                  ${resume.educationInfo && (resume.educationInfo.hasHighSchoolCompleted !== null || resume.educationInfo.hasAnalitico !== null) ? `
                    <div style="font-size: 13px; color: #6b7280; margin-top: 5px;">
                      ${resume.educationInfo.hasHighSchoolCompleted !== null ? `Secundario completo: ${resume.educationInfo.hasHighSchoolCompleted ? 'Sí' : 'No'}` : ''}
                      ${resume.educationInfo.hasHighSchoolCompleted !== null && resume.educationInfo.hasAnalitico !== null ? ' • ' : ''}
                      ${resume.educationInfo.hasAnalitico !== null ? `Analítico en mano: ${resume.educationInfo.hasAnalitico ? 'Sí' : 'No'}` : ''}
                    </div>
                  ` : ''}
                </div>
              `).join('')}
            </div>
          ` : ''}
          
          <div style="display: flex; gap: 40px;">
            ${resume.skills && resume.skills.length > 0 ? `
              <div style="flex: 1;">
                <h2 style="font-size: 22px; font-weight: 600; color: #1e3a8a; margin-bottom: 20px; border-bottom: 2px solid #1e40af; padding-bottom: 10px;">Competencias</h2>
                ${resume.skills.map(skill => `<div style="font-size: 14px; margin: 10px 0; color: #374151;">• ${skill}</div>`).join('')}
              </div>
            ` : ''}
            
            ${resume.extras && resume.extras.length > 0 ? `
              <div style="flex: 1;">
                <h2 style="font-size: 22px; font-weight: 600; color: #1e3a8a; margin-bottom: 20px; border-bottom: 2px solid #1e40af; padding-bottom: 10px;">Adicional</h2>
                ${resume.extras.map(extra => `<p style="font-size: 13px; margin: 10px 0; color: #374151;">${extra}</p>`).join('')}
              </div>
            ` : ''}
          </div>
          
        </div>
        
        ${resume.coverLetter && resume.coverLetter.trim() ? `
          <div style="page-break-before: always;"></div>
          <section id="cover-letter" style="font-family: 'Georgia', serif; max-width: 850px; margin: 0 auto; padding: 60px; background: white;">
            <h1 style="font-size: 28px; font-weight: 600; color: #1e3a8a; margin-bottom: 30px; text-align: center; border-bottom: 3px solid #1e40af; padding-bottom: 15px;">Carta de Presentación</h1>
            <p style="font-size: 15px; line-height: 1.9; color: #374151; white-space: pre-wrap; text-align: justify;">${resume.coverLetter}</p>
          </section>
        ` : ''}
        </div>
      </div>
    `
  },
  
  creative: {
    name: 'Creativa',
    description: 'Colores vibrantes, visual, ideal para diseñadores',
    render: (resume) => `
      <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 850px; margin: 0 auto; background: #f8fafc;">
        <div style="background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #3b82f6 100%); padding: 60px; text-align: center; position: relative;">
          ${resume.photo ? `
            <div style="display: inline-block; margin-bottom: 20px;">
              <img src="${resume.photo}" alt="Foto de perfil" style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover; border: 5px solid white; box-shadow: 0 10px 30px rgba(0,0,0,0.2);" />
            </div>
          ` : `
            <div style="background: white; display: inline-block; width: 120px; height: 120px; border-radius: 50%; margin-bottom: 20px; line-height: 120px; font-size: 48px; font-weight: bold; color: #8b5cf6; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
              ${resume.name ? resume.name.charAt(0).toUpperCase() : 'T'}
            </div>
          `}
          <h1 style="font-size: 40px; font-weight: 800; color: white; margin: 20px 0 10px 0; text-shadow: 2px 2px 4px rgba(0,0,0,0.2);">${resume.name || 'Tu Nombre'}</h1>
          <div style="font-size: 13px; color: rgba(255,255,255,0.9); margin-top: 10px;">
            ${resume.email ? `${resume.email}` : ''}
            ${resume.phone ? ` • ${resume.phone}` : ''}
            ${resume.location ? ` • ${resume.location}` : ''}
            ${resume.website ? ` • ${resume.website}` : ''}
            ${resume.linkedin ? ` • ${resume.linkedin}` : ''}
            ${resume.github ? ` • ${resume.github}` : ''}
          </div>
        </div>
        
        <div style="padding: 50px;">
          ${resume.profile ? `
            <div style="background: white; padding: 30px; border-radius: 15px; margin-bottom: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border-left: 5px solid #ec4899;">
              <h2 style="font-size: 20px; font-weight: 700; color: #ec4899; margin: 0 0 15px 0;">✨ Sobre Mí</h2>
              <p style="font-size: 15px; line-height: 1.8; color: #475569; margin: 0;">${resume.profile}</p>
            </div>
          ` : ''}
          
          ${resume.experience && resume.experience.length > 0 ? `
            <div style="background: white; padding: 30px; border-radius: 15px; margin-bottom: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border-left: 5px solid #8b5cf6;">
              <h2 style="font-size: 20px; font-weight: 700; color: #8b5cf6; margin: 0 0 25px 0;">💼 Experiencia</h2>
              ${resume.experience.map((exp, idx) => `
                <div style="margin-bottom: ${idx < resume.experience.length - 1 ? '25px' : '0'}; padding-bottom: ${idx < resume.experience.length - 1 ? '25px' : '0'}; ${idx < resume.experience.length - 1 ? 'border-bottom: 2px dashed #e2e8f0;' : ''}">
                  <h3 style="font-size: 17px; font-weight: 600; color: #1e293b; margin: 0 0 8px 0;">${exp.position || 'Posición'}</h3>
                  <div style="font-size: 14px; color: #64748b; margin-bottom: 10px;">
                    <span style="background: #f1f5f9; padding: 4px 12px; border-radius: 20px; font-weight: 500;">${exp.company || 'Empresa'}</span>
                    ${exp.startDate ? ` <span style="margin-left: 10px;">${exp.startDate}${exp.endDate ? ` - ${exp.endDate}` : ' - Presente'}</span>` : ''}
                  </div>
                  ${exp.description ? `<p style="font-size: 14px; line-height: 1.6; color: #475569; margin: 10px 0 0 0;">${exp.description}</p>` : ''}
                </div>
              `).join('')}
            </div>
          ` : ''}
          
          ${resume.experience.length === 0 && resume.noExperienceExtras && (resume.noExperienceExtras.volunteer || resume.noExperienceExtras.projects || resume.noExperienceExtras.achievements) ? `
            <div style="background: white; padding: 30px; border-radius: 15px; margin-bottom: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border-left: 5px solid #8b5cf6;">
              <h2 style="font-size: 20px; font-weight: 700; color: #8b5cf6; margin: 0 0 25px 0;">⭐ Logros y Proyectos</h2>
              ${resume.noExperienceExtras.volunteer ? `
                <div style="margin-bottom: 20px;">
                  <h3 style="font-size: 16px; font-weight: 600; color: #1e293b; margin: 0 0 8px 0;">Voluntariado</h3>
                  <p style="font-size: 14px; line-height: 1.6; color: #475569;">${resume.noExperienceExtras.volunteer}</p>
                </div>
              ` : ''}
              ${resume.noExperienceExtras.projects ? `
                <div style="margin-bottom: 20px;">
                  <h3 style="font-size: 16px; font-weight: 600; color: #1e293b; margin: 0 0 8px 0;">Proyectos Personales</h3>
                  <p style="font-size: 14px; line-height: 1.6; color: #475569;">${resume.noExperienceExtras.projects}</p>
                </div>
              ` : ''}
              ${resume.noExperienceExtras.achievements ? `
                <div style="margin-bottom: 20px;">
                  <h3 style="font-size: 16px; font-weight: 600; color: #1e293b; margin: 0 0 8px 0;">Logros</h3>
                  <p style="font-size: 14px; line-height: 1.6; color: #475569;">${resume.noExperienceExtras.achievements}</p>
                </div>
              ` : ''}
            </div>
          ` : ''}
          
          ${resume.education && resume.education.length > 0 ? `
            <div style="background: white; padding: 30px; border-radius: 15px; margin-bottom: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border-left: 5px solid #3b82f6;">
              <h2 style="font-size: 20px; font-weight: 700; color: #3b82f6; margin: 0 0 20px 0;">🎓 Educación</h2>
              ${resume.education.map((edu, idx) => `
                <div style="margin-bottom: ${idx < resume.education.length - 1 ? '15px' : '0'};">
                  <h3 style="font-size: 16px; font-weight: 600; color: #1e293b; margin: 0 0 5px 0;">${edu.degree || 'Título'}</h3>
                  <div style="font-size: 14px; color: #64748b;">
                    ${edu.institution || 'Institución'}${edu.year ? ` • ${edu.year}` : ''}
                  </div>
                  ${resume.educationInfo && (resume.educationInfo.hasHighSchoolCompleted !== null || resume.educationInfo.hasAnalitico !== null) ? `
                    <div style="font-size: 13px; color: #64748b; margin-top: 5px;">
                      ${resume.educationInfo.hasHighSchoolCompleted !== null ? `Secundario completo: ${resume.educationInfo.hasHighSchoolCompleted ? 'Sí' : 'No'}` : ''}
                      ${resume.educationInfo.hasHighSchoolCompleted !== null && resume.educationInfo.hasAnalitico !== null ? ' • ' : ''}
                      ${resume.educationInfo.hasAnalitico !== null ? `Analítico en mano: ${resume.educationInfo.hasAnalitico ? 'Sí' : 'No'}` : ''}
                    </div>
                  ` : ''}
                </div>
              `).join('')}
            </div>
          ` : ''}
          
          ${resume.skills && resume.skills.length > 0 ? `
            <div style="background: white; padding: 30px; border-radius: 15px; margin-bottom: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border-left: 5px solid #10b981;">
              <h2 style="font-size: 20px; font-weight: 700; color: #10b981; margin: 0 0 20px 0;">🚀 Habilidades</h2>
              <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                ${resume.skills.map(skill => `<span style="background: linear-gradient(135deg, #ec4899, #8b5cf6); color: white; padding: 10px 20px; border-radius: 25px; font-size: 13px; font-weight: 500;">${skill}</span>`).join('')}
              </div>
            </div>
          ` : ''}
          
          ${resume.extras && resume.extras.length > 0 ? `
            <div style="background: white; padding: 30px; border-radius: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border-left: 5px solid #f59e0b;">
              <h2 style="font-size: 20px; font-weight: 700; color: #f59e0b; margin: 0 0 15px 0;">⭐ Información Adicional</h2>
              ${resume.extras.map(extra => `<p style="font-size: 14px; margin: 10px 0; color: #475569;">${extra}</p>`).join('')}
            </div>
          ` : ''}
          
        </div>
        
        ${resume.coverLetter && resume.coverLetter.trim() ? `
          <div style="page-break-before: always;"></div>
          <section id="cover-letter" style="font-family: system-ui, -apple-system, sans-serif; max-width: 850px; margin: 0 auto; padding: 60px; background: #f8fafc;">
            <div style="background: white; padding: 40px; border-radius: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border-left: 5px solid #8b5cf6;">
              <h1 style="font-size: 26px; font-weight: 700; color: #8b5cf6; margin-bottom: 25px; text-align: center;">✉️ Carta de Presentación</h1>
              <p style="font-size: 14px; line-height: 1.8; color: #475569; white-space: pre-wrap; text-align: justify;">${resume.coverLetter}</p>
            </div>
          </section>
        ` : ''}
        </div>
      </div>
    `
  },
  
  minimalista: {
    name: 'Minimalista',
    description: 'Limpio, espaciado, tipografía elegante',
    render: (resume) => `
      <div style="font-family: 'Inter', -apple-system, sans-serif; max-width: 850px; margin: 0 auto; padding: 60px; background: white; ">
        <div style="margin-bottom: 50px; border-bottom: 1px solid #e5e7eb; padding-bottom: 30px; position: relative;">
          ${resume.photo ? `
            <div style="position: absolute; top: 0; right: 0;">
              <img src="${resume.photo}" alt="Foto de perfil" style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover; border: 2px solid #e5e7eb; box-shadow: 0 2px 4px rgba(0,0,0,0.1);" />
            </div>
          ` : ''}
          <h1 style="font-size: 42px; font-weight: 300; margin: 0 0 10px 0; letter-spacing: -1px; color: #111;">${resume.name || 'Tu Nombre'}</h1>
          <div style="font-size: 12px; color: #6b7280; margin-top: 8px;">
            ${resume.email ? `${resume.email}` : ''}
            ${resume.phone ? ` • ${resume.phone}` : ''}
            ${resume.location ? ` • ${resume.location}` : ''}
            ${resume.website ? ` • ${resume.website}` : ''}
            ${resume.linkedin ? ` • ${resume.linkedin}` : ''}
            ${resume.github ? ` • ${resume.github}` : ''}
          </div>
        </div>
        
        ${resume.profile ? `
          <div style="margin-bottom: 45px;">
            <p style="font-size: 15px; line-height: 1.9; color: #374151;">${resume.profile}</p>
          </div>
        ` : ''}
        
        ${resume.experience && resume.experience.length > 0 ? `
          <div style="margin-bottom: 45px;">
            <h2 style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: #111; margin-bottom: 25px;">Experiencia</h2>
            ${resume.experience.map(exp => `
              <div style="margin-bottom: 30px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                  <h3 style="font-size: 16px; font-weight: 600; color: #111; margin: 0;">${exp.position || 'Posición'}</h3>
                  ${exp.startDate ? `<span style="font-size: 13px; color: #6b7280;">${exp.startDate}${exp.endDate ? ` – ${exp.endDate}` : ' – Presente'}</span>` : ''}
                </div>
                <div style="font-size: 14px; color: #6b7280; margin-bottom: 10px;">${exp.company || 'Empresa'}</div>
                ${exp.description ? `<p style="font-size: 14px; line-height: 1.7; color: #4b5563;">${exp.description}</p>` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}
        
        ${resume.experience.length === 0 && resume.noExperienceExtras && (resume.noExperienceExtras.volunteer || resume.noExperienceExtras.projects || resume.noExperienceExtras.achievements) ? `
          <div style="margin-bottom: 45px;">
            <h2 style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: #111; margin-bottom: 25px;">Logros y Proyectos</h2>
            ${resume.noExperienceExtras.volunteer ? `
              <div style="margin-bottom: 20px;">
                <h3 style="font-size: 15px; font-weight: 600; color: #111; margin: 0 0 8px 0;">Voluntariado</h3>
                <p style="font-size: 14px; line-height: 1.7; color: #4b5563;">${resume.noExperienceExtras.volunteer}</p>
              </div>
            ` : ''}
            ${resume.noExperienceExtras.projects ? `
              <div style="margin-bottom: 20px;">
                <h3 style="font-size: 15px; font-weight: 600; color: #111; margin: 0 0 8px 0;">Proyectos Personales</h3>
                <p style="font-size: 14px; line-height: 1.7; color: #4b5563;">${resume.noExperienceExtras.projects}</p>
              </div>
            ` : ''}
            ${resume.noExperienceExtras.achievements ? `
              <div style="margin-bottom: 20px;">
                <h3 style="font-size: 15px; font-weight: 600; color: #111; margin: 0 0 8px 0;">Logros</h3>
                <p style="font-size: 14px; line-height: 1.7; color: #4b5563;">${resume.noExperienceExtras.achievements}</p>
              </div>
            ` : ''}
          </div>
        ` : ''}
        
        ${resume.education && resume.education.length > 0 ? `
          <div style="margin-bottom: 45px;">
            <h2 style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: #111; margin-bottom: 25px;">Educación</h2>
            ${resume.education.map(edu => `
              <div style="margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between;">
                  <h3 style="font-size: 15px; font-weight: 600; color: #111; margin: 0 0 5px 0;">${edu.degree || 'Título'}</h3>
                  ${edu.year ? `<span style="font-size: 13px; color: #6b7280;">${edu.year}</span>` : ''}
                </div>
                <div style="font-size: 14px; color: #6b7280;">${edu.institution || 'Institución'}</div>
              </div>
            `).join('')}
          </div>
        ` : ''}
        
        ${resume.skills && resume.skills.length > 0 ? `
          <div style="margin-bottom: 45px;">
            <h2 style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: #111; margin-bottom: 20px;">Habilidades</h2>
            <div style="font-size: 14px; color: #374151; line-height: 2;">${resume.skills.join('  •  ')}</div>
          </div>
        ` : ''}
        
        ${resume.extras && resume.extras.length > 0 ? `
          <div style="margin-bottom: 45px;">
            <h2 style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: #111; margin-bottom: 20px;">Adicional</h2>
            ${resume.extras.map(extra => `<p style="font-size: 13px; margin: 8px 0; color: #4b5563; line-height: 1.7;">${extra}</p>`).join('')}
          </div>
        ` : ''}
      </div>
      
      ${resume.coverLetter && resume.coverLetter.trim() ? `
        <div style="page-break-before: always;"></div>
        <section id="cover-letter" style="font-family: 'Inter', -apple-system, sans-serif; max-width: 850px; margin: 0 auto; padding: 60px; background: white;">
          <h1 style="font-size: 24px; font-weight: 300; margin-bottom: 40px; text-align: center; letter-spacing: 2px; text-transform: uppercase; color: #111; border-bottom: 1px solid #e5e7eb; padding-bottom: 20px;">Carta de Presentación</h1>
          <p style="font-size: 15px; line-height: 1.9; color: #374151; white-space: pre-wrap; text-align: justify;">${resume.coverLetter}</p>
        </section>
      ` : ''}
    `
  },
  
  startup: {
    name: 'Startup',
    description: 'Moderno, dinámico, ideal para tech',
    render: (resume) => `
      <div style="font-family: 'Roboto', sans-serif; max-width: 850px; margin: 0 auto; background: white; ">
        <div style="background: linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%); padding: 50px 60px; position: relative; overflow: hidden;">
          <div style="position: absolute; top: 0; right: 0; width: 300px; height: 300px; background: rgba(255,255,255,0.1); border-radius: 50%; transform: translate(30%, -30%);"></div>
          ${resume.photo ? `
            <div style="position: absolute; top: 40px; left: 60px;">
              <img src="${resume.photo}" alt="Foto de perfil" style="width: 110px; height: 110px; border-radius: 12px; object-fit: cover; border: 4px solid rgba(255,255,255,0.3); box-shadow: 0 4px 8px rgba(0,0,0,0.2);" />
            </div>
          ` : ''}
          <div style="position: relative; z-index: 1; ${resume.photo ? 'margin-left: 140px;' : ''}">
            <h1 style="font-size: 38px; font-weight: 900; color: white; margin: 0 0 15px 0; letter-spacing: -0.5px;">${resume.name || 'Tu Nombre'}</h1>
            <div style="height: 4px; width: 80px; background: #fbbf24; margin-bottom: 20px;"></div>
            <div style="font-size: 15px; color: rgba(255,255,255,0.95);">
              ${resume.email ? `${resume.email}` : ''}
              ${resume.phone ? ` | ${resume.phone}` : ''}
              ${resume.location ? ` | ${resume.location}` : ''}
              ${resume.website ? ` | ${resume.website}` : ''}
              ${resume.linkedin ? ` | ${resume.linkedin}` : ''}
              ${resume.github ? ` | ${resume.github}` : ''}
            </div>
          </div>
        </div>
        
        <div style="padding: 50px 60px;">
          ${resume.profile ? `
            <div style="margin-bottom: 40px; padding: 25px; background: #f9fafb; border-left: 4px solid #6366f1; border-radius: 8px;">
              <p style="font-size: 15px; line-height: 1.8; color: #374151; margin: 0;">${resume.profile}</p>
            </div>
          ` : ''}
          
          ${resume.experience && resume.experience.length > 0 ? `
            <div style="margin-bottom: 40px;">
              <h2 style="font-size: 24px; font-weight: 700; color: #6366f1; margin-bottom: 25px; display: flex; align-items: center; gap: 10px;">
                <span style="display: inline-block; width: 8px; height: 8px; background: #fbbf24; border-radius: 50%;"></span>
                Experiencia
              </h2>
              ${resume.experience.map((exp, idx) => `
                <div style="margin-bottom: 30px; padding-left: 20px; border-left: 2px solid ${idx === 0 ? '#6366f1' : '#e5e7eb'};">
                  <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
                    <h3 style="font-size: 18px; font-weight: 600; color: #111; margin: 0;">${exp.position || 'Posición'}</h3>
                    ${exp.startDate ? `<span style="font-size: 13px; color: #6b7280; background: #f3f4f6; padding: 4px 12px; border-radius: 12px;">${exp.startDate}${exp.endDate ? ` - ${exp.endDate}` : ' - Actual'}</span>` : ''}
                  </div>
                  <div style="font-size: 15px; color: #6366f1; font-weight: 500; margin-bottom: 10px;">${exp.company || 'Empresa'}</div>
                  ${exp.description ? `<p style="font-size: 14px; line-height: 1.7; color: #4b5563; margin: 0;">${exp.description}</p>` : ''}
                </div>
              `).join('')}
            </div>
          ` : ''}
          
          ${resume.experience.length === 0 && resume.noExperienceExtras && (resume.noExperienceExtras.volunteer || resume.noExperienceExtras.projects || resume.noExperienceExtras.achievements) ? `
            <div style="margin-bottom: 40px;">
              <h2 style="font-size: 24px; font-weight: 700; color: #6366f1; margin-bottom: 25px; display: flex; align-items: center; gap: 10px;">
                <span style="display: inline-block; width: 8px; height: 8px; background: #fbbf24; border-radius: 50%;"></span>
                Logros y Proyectos
              </h2>
              ${resume.noExperienceExtras.volunteer ? `
                <div style="margin-bottom: 20px; padding-left: 20px; border-left: 2px solid #6366f1;">
                  <h3 style="font-size: 16px; font-weight: 600; color: #111; margin: 0 0 8px 0;">Voluntariado</h3>
                  <p style="font-size: 14px; line-height: 1.7; color: #4b5563;">${resume.noExperienceExtras.volunteer}</p>
                </div>
              ` : ''}
              ${resume.noExperienceExtras.projects ? `
                <div style="margin-bottom: 20px; padding-left: 20px; border-left: 2px solid #6366f1;">
                  <h3 style="font-size: 16px; font-weight: 600; color: #111; margin: 0 0 8px 0;">Proyectos Personales</h3>
                  <p style="font-size: 14px; line-height: 1.7; color: #4b5563;">${resume.noExperienceExtras.projects}</p>
                </div>
              ` : ''}
              ${resume.noExperienceExtras.achievements ? `
                <div style="margin-bottom: 20px; padding-left: 20px; border-left: 2px solid #6366f1;">
                  <h3 style="font-size: 16px; font-weight: 600; color: #111; margin: 0 0 8px 0;">Logros</h3>
                  <p style="font-size: 14px; line-height: 1.7; color: #4b5563;">${resume.noExperienceExtras.achievements}</p>
                </div>
              ` : ''}
            </div>
          ` : ''}
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px;">
            ${resume.education && resume.education.length > 0 ? `
              <div>
                <h2 style="font-size: 24px; font-weight: 700; color: #6366f1; margin-bottom: 25px; display: flex; align-items: center; gap: 10px;">
                  <span style="display: inline-block; width: 8px; height: 8px; background: #fbbf24; border-radius: 50%;"></span>
                  Educación
                </h2>
                ${resume.education.map(edu => `
                  <div style="margin-bottom: 20px;">
                    <h3 style="font-size: 16px; font-weight: 600; color: #111; margin: 0 0 5px 0;">${edu.degree || 'Título'}</h3>
                    <div style="font-size: 14px; color: #6b7280;">${edu.institution || 'Institución'}</div>
                    ${edu.year ? `<div style="font-size: 13px; color: #9ca3af; margin-top: 2px;">${edu.year}</div>` : ''}
                  </div>
                `).join('')}
              </div>
            ` : '<div></div>'}
            
            ${resume.skills && resume.skills.length > 0 ? `
              <div>
                <h2 style="font-size: 24px; font-weight: 700; color: #6366f1; margin-bottom: 25px; display: flex; align-items: center; gap: 10px;">
                  <span style="display: inline-block; width: 8px; height: 8px; background: #fbbf24; border-radius: 50%;"></span>
                  Skills
                </h2>
                <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                  ${resume.skills.map(skill => `<span style="background: #ede9fe; color: #6366f1; padding: 8px 16px; border-radius: 20px; font-size: 13px; font-weight: 500;">${skill}</span>`).join('')}
                </div>
              </div>
            ` : '<div></div>'}
          </div>
          
          ${resume.extras && resume.extras.length > 0 ? `
            <div style="margin-top: 40px;">
              <h2 style="font-size: 24px; font-weight: 700; color: #6366f1; margin-bottom: 20px; display: flex; align-items: center; gap: 10px;">
                <span style="display: inline-block; width: 8px; height: 8px; background: #fbbf24; border-radius: 50%;"></span>
                Adicional
              </h2>
              ${resume.extras.map(extra => `<p style="font-size: 14px; margin: 10px 0; color: #4b5563; line-height: 1.6;">${extra}</p>`).join('')}
            </div>
          ` : ''}
          
        </div>
        
        ${resume.coverLetter && resume.coverLetter.trim() ? `
          <div style="page-break-before: always;"></div>
          <section id="cover-letter" style="font-family: 'Roboto', sans-serif; max-width: 850px; margin: 0 auto; padding: 60px; background: white;">
            <h1 style="font-size: 28px; font-weight: 700; color: #6366f1; margin-bottom: 30px; text-align: center; display: flex; align-items: center; justify-content: center; gap: 12px;">
              <span style="display: inline-block; width: 10px; height: 10px; background: #8b5cf6; border-radius: 50%;"></span>
              Carta de Presentación
            </h1>
            <p style="font-size: 14px; line-height: 1.8; color: #374151; white-space: pre-wrap; text-align: justify;">${resume.coverLetter}</p>
          </section>
        ` : ''}
        </div>
      </div>
    `
  },
  
  academica: {
    name: 'Académica',
    description: 'Profesional, serif, ideal para investigadores',
    render: (resume) => `
      <div style="font-family: 'Lora', Georgia, serif; max-width: 850px; margin: 0 auto; padding: 60px 70px; background: white; ">
        <div style="text-align: center; margin-bottom: 40px; padding-bottom: 25px; border-bottom: 3px double #374151;">
          ${resume.photo ? `
            <div style="margin-bottom: 20px;">
              <img src="${resume.photo}" alt="Foto de perfil" style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover; border: 4px solid #374151; box-shadow: 0 2px 6px rgba(0,0,0,0.1); display: inline-block;" />
            </div>
          ` : ''}
          <h1 style="font-size: 36px; font-weight: 600; margin: 0 0 15px 0; color: #111; letter-spacing: 1px;">${resume.name || 'Tu Nombre'}</h1>
          <div style="font-size: 14px; color: #6b7280; font-family: sans-serif;">
            ${resume.email ? `${resume.email}` : ''}
            ${resume.phone ? ` • ${resume.phone}` : ''}
            ${resume.location ? ` • ${resume.location}` : ''}
            ${resume.website ? ` • ${resume.website}` : ''}
            ${resume.linkedin ? ` • ${resume.linkedin}` : ''}
            ${resume.github ? ` • ${resume.github}` : ''}
          </div>
        </div>
        
        ${resume.profile ? `
          <div style="margin-bottom: 35px;">
            <h2 style="font-size: 20px; font-weight: 600; color: #111; margin-bottom: 15px; font-variant: small-caps;">Perfil Académico</h2>
            <p style="font-size: 14px; line-height: 1.9; color: #374151; text-align: justify;">${resume.profile}</p>
          </div>
        ` : ''}
        
        ${resume.education && resume.education.length > 0 ? `
          <div style="margin-bottom: 35px;">
            <h2 style="font-size: 20px; font-weight: 600; color: #111; margin-bottom: 20px; font-variant: small-caps;">Formación Académica</h2>
            ${resume.education.map(edu => `
              <div style="margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid #e5e7eb;">
                <div style="display: flex; justify-content: space-between; align-items: baseline;">
                  <h3 style="font-size: 16px; font-weight: 600; color: #111; margin: 0 0 5px 0;">${edu.degree || 'Título'}</h3>
                  ${edu.year ? `<span style="font-size: 14px; color: #6b7280; font-style: italic;">${edu.year}</span>` : ''}
                </div>
                <div style="font-size: 15px; color: #4b5563; font-style: italic;">${edu.institution || 'Institución'}</div>
              </div>
            `).join('')}
          </div>
        ` : ''}
        
        ${resume.experience && resume.experience.length > 0 ? `
          <div style="margin-bottom: 35px;">
            <h2 style="font-size: 20px; font-weight: 600; color: #111; margin-bottom: 20px; font-variant: small-caps;">Experiencia Profesional</h2>
            ${resume.experience.map(exp => `
              <div style="margin-bottom: 25px; padding-bottom: 20px; border-bottom: 1px solid #e5e7eb;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                  <h3 style="font-size: 16px; font-weight: 600; color: #111; margin: 0;">${exp.position || 'Posición'}</h3>
                  ${exp.startDate ? `<span style="font-size: 13px; color: #6b7280;">${exp.startDate}${exp.endDate ? ` – ${exp.endDate}` : ' – Presente'}</span>` : ''}
                </div>
                <div style="font-size: 15px; color: #4b5563; font-style: italic; margin-bottom: 10px;">${exp.company || 'Empresa'}</div>
                ${exp.description ? `<p style="font-size: 14px; line-height: 1.8; color: #374151; text-align: justify; margin: 0;">${exp.description}</p>` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}
        
        ${resume.experience.length === 0 && resume.noExperienceExtras && (resume.noExperienceExtras.volunteer || resume.noExperienceExtras.projects || resume.noExperienceExtras.achievements) ? `
          <div style="margin-bottom: 35px;">
            <h2 style="font-size: 20px; font-weight: 600; color: #111; margin-bottom: 20px; font-variant: small-caps;">Logros y Proyectos</h2>
            ${resume.noExperienceExtras.volunteer ? `
              <div style="margin-bottom: 20px;">
                <h3 style="font-size: 16px; font-weight: 600; color: #111; margin-bottom: 8px;">Voluntariado</h3>
                <p style="font-size: 14px; line-height: 1.8; color: #374151; text-align: justify;">${resume.noExperienceExtras.volunteer}</p>
              </div>
            ` : ''}
            ${resume.noExperienceExtras.projects ? `
              <div style="margin-bottom: 20px;">
                <h3 style="font-size: 16px; font-weight: 600; color: #111; margin-bottom: 8px;">Proyectos Personales</h3>
                <p style="font-size: 14px; line-height: 1.8; color: #374151; text-align: justify;">${resume.noExperienceExtras.projects}</p>
              </div>
            ` : ''}
            ${resume.noExperienceExtras.achievements ? `
              <div style="margin-bottom: 20px;">
                <h3 style="font-size: 16px; font-weight: 600; color: #111; margin-bottom: 8px;">Logros</h3>
                <p style="font-size: 14px; line-height: 1.8; color: #374151; text-align: justify;">${resume.noExperienceExtras.achievements}</p>
              </div>
            ` : ''}
          </div>
        ` : ''}
        
        ${resume.skills && resume.skills.length > 0 ? `
          <div style="margin-bottom: 35px;">
            <h2 style="font-size: 20px; font-weight: 600; color: #111; margin-bottom: 15px; font-variant: small-caps;">Competencias</h2>
            <p style="font-size: 14px; color: #374151; line-height: 1.8;">${resume.skills.join(' • ')}</p>
          </div>
        ` : ''}
        
        ${resume.extras && resume.extras.length > 0 ? `
          <div style="margin-bottom: 35px;">
            <h2 style="font-size: 20px; font-weight: 600; color: #111; margin-bottom: 15px; font-variant: small-caps;">Información Adicional</h2>
            ${resume.extras.map(extra => `<p style="font-size: 13px; margin: 10px 0; color: #4b5563; line-height: 1.7;">${extra}</p>`).join('')}
          </div>
        ` : ''}
        
      </div>
      
      ${resume.coverLetter && resume.coverLetter.trim() ? `
        <div style="page-break-before: always;"></div>
        <section id="cover-letter" style="font-family: 'Lora', Georgia, serif; max-width: 850px; margin: 0 auto; padding: 60px 70px; background: white;">
          <h1 style="font-size: 26px; font-weight: 600; color: #111; margin-bottom: 35px; text-align: center; font-variant: small-caps; border-bottom: 3px double #374151; padding-bottom: 20px;">Carta de Presentación</h1>
          <p style="font-size: 14px; line-height: 1.9; color: #374151; white-space: pre-wrap; text-align: justify;">${resume.coverLetter}</p>
        </section>
      ` : ''}
      </div>
    `
  },
  
  dark: {
    name: 'Dark Mode',
    description: 'Modo oscuro, moderno y llamativo',
    render: (resume) => `
      <div style="font-family: 'Inter', sans-serif; max-width: 850px; margin: 0 auto; background: #0f172a; color: #e2e8f0; ">
        <div style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); padding: 50px 60px; border-bottom: 3px solid #3b82f6; position: relative;">
          ${resume.photo ? `
            <div style="position: absolute; top: 40px; right: 60px;">
              <img src="${resume.photo}" alt="Foto de perfil" style="width: 120px; height: 120px; border-radius: 12px; object-fit: cover; border: 3px solid #3b82f6; box-shadow: 0 4px 8px rgba(0,0,0,0.3);" />
            </div>
          ` : ''}
          <h1 style="font-size: 42px; font-weight: 800; margin: 0 0 15px 0; color: #f1f5f9; letter-spacing: -1px;">${resume.name || 'Tu Nombre'}</h1>
          <div style="height: 3px; width: 100px; background: linear-gradient(90deg, #3b82f6, #8b5cf6); margin-bottom: 20px;"></div>
          <div style="font-size: 15px; color: #94a3b8;">
            ${resume.email ? `${resume.email}` : ''}
            ${resume.phone ? ` | ${resume.phone}` : ''}
            ${resume.location ? ` | ${resume.location}` : ''}
            ${resume.website ? ` | ${resume.website}` : ''}
            ${resume.linkedin ? ` | ${resume.linkedin}` : ''}
            ${resume.github ? ` | ${resume.github}` : ''}
          </div>
        </div>
        
        <div style="padding: 50px 60px;">
          ${resume.profile ? `
            <div style="margin-bottom: 40px;">
              <h2 style="font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: #3b82f6; margin-bottom: 15px;">Perfil</h2>
              <p style="font-size: 15px; line-height: 1.8; color: #cbd5e1;">${resume.profile}</p>
            </div>
          ` : ''}
          
          ${resume.experience && resume.experience.length > 0 ? `
            <div style="margin-bottom: 40px;">
              <h2 style="font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: #3b82f6; margin-bottom: 25px;">Experiencia</h2>
              ${resume.experience.map(exp => `
                <div style="margin-bottom: 30px; padding: 20px; background: #1e293b; border-left: 3px solid #3b82f6; border-radius: 8px;">
                  <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <h3 style="font-size: 18px; font-weight: 600; color: #f1f5f9; margin: 0;">${exp.position || 'Posición'}</h3>
                    ${exp.startDate ? `<span style="font-size: 13px; color: #64748b;">${exp.startDate}${exp.endDate ? ` - ${exp.endDate}` : ' - Presente'}</span>` : ''}
                  </div>
                  <div style="font-size: 15px; color: #3b82f6; font-weight: 500; margin-bottom: 10px;">${exp.company || 'Empresa'}</div>
                  ${exp.description ? `<p style="font-size: 14px; line-height: 1.7; color: #94a3b8; margin: 0;">${exp.description}</p>` : ''}
                </div>
              `).join('')}
            </div>
          ` : ''}
          
          ${resume.experience.length === 0 && resume.noExperienceExtras && (resume.noExperienceExtras.volunteer || resume.noExperienceExtras.projects || resume.noExperienceExtras.achievements) ? `
            <div style="margin-bottom: 40px;">
              <h2 style="font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: #3b82f6; margin-bottom: 25px;">Logros y Proyectos</h2>
              ${resume.noExperienceExtras.volunteer ? `
                <div style="margin-bottom: 20px; padding: 20px; background: #1e293b; border-left: 3px solid #3b82f6; border-radius: 8px;">
                  <h3 style="font-size: 16px; font-weight: 600; color: #f1f5f9; margin: 0 0 8px 0;">Voluntariado</h3>
                  <p style="font-size: 14px; line-height: 1.7; color: #94a3b8;">${resume.noExperienceExtras.volunteer}</p>
                </div>
              ` : ''}
              ${resume.noExperienceExtras.projects ? `
                <div style="margin-bottom: 20px; padding: 20px; background: #1e293b; border-left: 3px solid #3b82f6; border-radius: 8px;">
                  <h3 style="font-size: 16px; font-weight: 600; color: #f1f5f9; margin: 0 0 8px 0;">Proyectos Personales</h3>
                  <p style="font-size: 14px; line-height: 1.7; color: #94a3b8;">${resume.noExperienceExtras.projects}</p>
                </div>
              ` : ''}
              ${resume.noExperienceExtras.achievements ? `
                <div style="margin-bottom: 20px; padding: 20px; background: #1e293b; border-left: 3px solid #3b82f6; border-radius: 8px;">
                  <h3 style="font-size: 16px; font-weight: 600; color: #f1f5f9; margin: 0 0 8px 0;">Logros</h3>
                  <p style="font-size: 14px; line-height: 1.7; color: #94a3b8;">${resume.noExperienceExtras.achievements}</p>
                </div>
              ` : ''}
            </div>
          ` : ''}
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px;">
            ${resume.education && resume.education.length > 0 ? `
              <div>
                <h2 style="font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: #3b82f6; margin-bottom: 20px;">Educación</h2>
                ${resume.education.map(edu => `
                  <div style="margin-bottom: 20px; padding: 15px; background: #1e293b; border-radius: 8px;">
                    <h3 style="font-size: 16px; font-weight: 600; color: #f1f5f9; margin: 0 0 5px 0;">${edu.degree || 'Título'}</h3>
                    <div style="font-size: 14px; color: #94a3b8;">${edu.institution || 'Institución'}</div>
                    ${edu.year ? `<div style="font-size: 13px; color: #64748b; margin-top: 5px;">${edu.year}</div>` : ''}
                  </div>
                `).join('')}
              </div>
            ` : '<div></div>'}
            
            ${resume.skills && resume.skills.length > 0 ? `
              <div>
                <h2 style="font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: #3b82f6; margin-bottom: 20px;">Habilidades</h2>
                <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                  ${resume.skills.map(skill => `<span style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; padding: 8px 16px; border-radius: 6px; font-size: 13px; font-weight: 500;">${skill}</span>`).join('')}
                </div>
              </div>
            ` : '<div></div>'}
          </div>
          
          ${resume.extras && resume.extras.length > 0 ? `
            <div style="margin-top: 40px;">
              <h2 style="font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: #3b82f6; margin-bottom: 20px;">Adicional</h2>
              ${resume.extras.map(extra => `<p style="font-size: 14px; margin: 12px 0; color: #94a3b8; line-height: 1.7;">${extra}</p>`).join('')}
            </div>
          ` : ''}
          
        </div>
        
        ${resume.coverLetter && resume.coverLetter.trim() ? `
          <div style="page-break-before: always;"></div>
          <section id="cover-letter" style="font-family: 'Inter', sans-serif; max-width: 850px; margin: 0 auto; padding: 60px; background: #0f172a;">
            <h1 style="font-size: 24px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: #3b82f6; margin-bottom: 30px; text-align: center; border-bottom: 1px solid #334155; padding-bottom: 20px;">Carta de Presentación</h1>
            <p style="font-size: 14px; line-height: 1.8; color: #cbd5e1; white-space: pre-wrap; text-align: justify;">${resume.coverLetter}</p>
          </section>
        ` : ''}
        </div>
      </div>
    `
  }
}

