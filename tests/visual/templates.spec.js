import { test, expect } from '@playwright/test';

test.describe('Visual Regression - Plantillas CV', () => {
  const mockResumeData = {
    fullName: 'Juan Pérez García',
    email: 'juan.perez@example.com',
    phone: '+54 11 1234-5678',
    location: 'Buenos Aires, Argentina',
    linkedIn: 'https://linkedin.com/in/juanperez',
    github: 'https://github.com/juanperez',
    portfolio: 'https://juanperez.dev',
    profile: 'Desarrollador Full Stack Senior con 8+ años de experiencia liderando equipos técnicos y arquitectando soluciones escalables. Especializado en React, Node.js y cloud computing.',
    experience: [
      {
        company: 'Tech Giants Inc',
        position: 'Senior Full Stack Developer',
        startDate: '2020-01',
        endDate: 'Presente',
        description: 'Lideré equipo de 12 desarrolladores en migración a microservicios, aumentando performance en 60%.'
      },
      {
        company: 'StartupXYZ',
        position: 'Full Stack Developer',
        startDate: '2018-01',
        endDate: '2019-12',
        description: 'Construí plataforma e-commerce alcanzando $2M en ventas anuales.'
      }
    ],
    education: [
      {
        institution: 'Universidad Tecnológica',
        degree: 'Ingeniería en Sistemas',
        startDate: '2012',
        endDate: '2017',
        description: 'Promedio: 9.2/10'
      }
    ],
    skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'AWS', 'Docker'],
    languages: ['Español (Nativo)', 'Inglés (Fluido)'],
    certifications: ['AWS Certified', 'Scrum Master'],
  };

  test.beforeEach(async ({ page }) => {
    await page.goto('/builder');
    
    // Inyectar datos de prueba en el store
    await page.evaluate((data) => {
      localStorage.setItem('resume-autosave', JSON.stringify(data));
    }, mockResumeData);
    
    await page.reload();
    await page.waitForTimeout(1000);
  });

  test('visual snapshot - plantilla Premium', async ({ page }) => {
    // Seleccionar plantilla Premium
    await page.getByText(/premium/i).first().click();
    await page.waitForTimeout(1000);

    // Capturar screenshot de la vista previa
    const preview = page.locator('[class*="preview"]').first();
    await expect(preview).toBeVisible();
    await expect(preview).toHaveScreenshot('plantilla-premium.png', {
      maxDiffPixels: 100,
    });
  });

  test('visual snapshot - plantilla ATS', async ({ page }) => {
    await page.getByText(/ats/i).first().click();
    await page.waitForTimeout(1000);

    const preview = page.locator('[class*="preview"]').first();
    await expect(preview).toHaveScreenshot('plantilla-ats.png', {
      maxDiffPixels: 100,
    });
  });

  test('visual snapshot - plantilla Executive', async ({ page }) => {
    await page.getByText(/executive/i).first().click();
    await page.waitForTimeout(1000);

    const preview = page.locator('[class*="preview"]').first();
    await expect(preview).toHaveScreenshot('plantilla-executive.png', {
      maxDiffPixels: 100,
    });
  });

  test('visual snapshot - plantilla Creative', async ({ page }) => {
    await page.getByText(/creative/i).first().click();
    await page.waitForTimeout(1000);

    const preview = page.locator('[class*="preview"]').first();
    await expect(preview).toHaveScreenshot('plantilla-creative.png', {
      maxDiffPixels: 100,
    });
  });

  test('visual snapshot - plantilla Minimalista', async ({ page }) => {
    await page.getByText(/minimalista/i).first().click();
    await page.waitForTimeout(1000);

    const preview = page.locator('[class*="preview"]').first();
    await expect(preview).toHaveScreenshot('plantilla-minimalista.png', {
      maxDiffPixels: 100,
    });
  });

  test('visual snapshot - plantilla Startup', async ({ page }) => {
    await page.getByText(/startup/i).first().click();
    await page.waitForTimeout(1000);

    const preview = page.locator('[class*="preview"]').first();
    await expect(preview).toHaveScreenshot('plantilla-startup.png', {
      maxDiffPixels: 100,
    });
  });

  test('visual snapshot - plantilla Academica', async ({ page }) => {
    await page.getByText(/academica|académica/i).first().click();
    await page.waitForTimeout(1000);

    const preview = page.locator('[class*="preview"]').first();
    await expect(preview).toHaveScreenshot('plantilla-academica.png', {
      maxDiffPixels: 100,
    });
  });

  test('visual snapshot - plantilla Dark', async ({ page }) => {
    await page.getByText(/dark|oscura/i).first().click();
    await page.waitForTimeout(1000);

    const preview = page.locator('[class*="preview"]').first();
    await expect(preview).toHaveScreenshot('plantilla-dark.png', {
      maxDiffPixels: 100,
    });
  });

  test('visual snapshot - página completa del builder', async ({ page }) => {
    await page.getByText(/premium/i).first().click();
    await page.waitForTimeout(1000);

    // Screenshot de toda la página
    await expect(page).toHaveScreenshot('builder-completo.png', {
      fullPage: true,
      maxDiffPixels: 200,
    });
  });

  test('visual snapshot - score component', async ({ page }) => {
    const scoreComponent = page.locator('[class*="score"]').first();
    
    if (await scoreComponent.isVisible()) {
      await expect(scoreComponent).toHaveScreenshot('score-component.png', {
        maxDiffPixels: 50,
      });
    }
  });

  test('visual snapshot - CV vacío vs CV completo', async ({ page }) => {
    // CV vacío
    await page.evaluate(() => {
      localStorage.clear();
    });
    await page.reload();
    await page.waitForTimeout(1000);

    const previewEmpty = page.locator('[class*="preview"]').first();
    if (await previewEmpty.isVisible()) {
      await expect(previewEmpty).toHaveScreenshot('cv-vacio.png', {
        maxDiffPixels: 100,
      });
    }

    // CV completo
    await page.evaluate((data) => {
      localStorage.setItem('resume-autosave', JSON.stringify(data));
    }, mockResumeData);
    await page.reload();
    await page.waitForTimeout(1000);

    await page.getByText(/premium/i).first().click();
    await page.waitForTimeout(500);

    const previewFull = page.locator('[class*="preview"]').first();
    if (await previewFull.isVisible()) {
      await expect(previewFull).toHaveScreenshot('cv-completo.png', {
        maxDiffPixels: 100,
      });
    }
  });

  test('visual snapshot - responsive mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    await page.goto('/builder');
    await page.waitForTimeout(1000);

    await expect(page).toHaveScreenshot('builder-mobile.png', {
      fullPage: true,
      maxDiffPixels: 200,
    });
  });

  test('visual snapshot - responsive tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 }); // iPad
    await page.goto('/builder');
    await page.waitForTimeout(1000);

    await expect(page).toHaveScreenshot('builder-tablet.png', {
      fullPage: true,
      maxDiffPixels: 200,
    });
  });
});
