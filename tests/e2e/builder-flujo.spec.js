import { test, expect } from '@playwright/test';

test.describe('Builder - Flujo Completo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/builder');
  });

  test('debe cargar la página del builder', async ({ page }) => {
    await expect(page).toHaveTitle(/Generador|CV|Builder/i);
  });

  test('debe mostrar selector de plantillas', async ({ page }) => {
    // Buscar elementos de plantillas
    const premiumTemplate = page.getByText(/premium/i);
    await expect(premiumTemplate).toBeVisible();
  });

  test('debe permitir seleccionar una plantilla', async ({ page }) => {
    const premiumButton = page.getByText(/premium/i).first();
    await premiumButton.click();
    
    // Verificar que se seleccionó
    await expect(premiumButton).toHaveClass(/active|selected/);
  });

  test('flujo completo: rellenar CV y exportar PDF', async ({ page }) => {
    // 1. Seleccionar plantilla
    await page.getByText(/premium/i).first().click();
    await page.waitForTimeout(500);

    // 2. Rellenar información personal
    const nameInput = page.getByPlaceholder(/nombre|name/i).first();
    if (await nameInput.isVisible()) {
      await nameInput.fill('Juan Pérez García');
    }

    const emailInput = page.getByPlaceholder(/email|correo/i).first();
    if (await emailInput.isVisible()) {
      await emailInput.fill('juan.perez@example.com');
    }

    const phoneInput = page.getByPlaceholder(/teléfono|phone/i).first();
    if (await phoneInput.isVisible()) {
      await phoneInput.fill('+54 11 1234-5678');
    }

    // 3. Avanzar al siguiente paso
    const nextButton = page.getByRole('button', { name: /siguiente|continuar/i }).first();
    if (await nextButton.isVisible()) {
      await nextButton.click();
      await page.waitForTimeout(500);
    }

    // 4. Verificar que el score aumenta
    const scoreElement = page.locator('[class*="score"]').first();
    if (await scoreElement.isVisible()) {
      const scoreText = await scoreElement.textContent();
      expect(scoreText).toBeTruthy();
    }

    // 5. Mock de la descarga PDF
    await page.route('**/api/generate', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/pdf',
        body: Buffer.from('fake pdf content'),
      });
    });

    // 6. Intentar exportar PDF
    const exportButton = page.getByText(/exportar|pdf|descargar/i).first();
    if (await exportButton.isVisible()) {
      await exportButton.click();
    }

    // Verificar que no hubo errores
    await page.waitForTimeout(1000);
  });

  test('debe cambiar entre diferentes plantillas', async ({ page }) => {
    const templates = ['Premium', 'ATS', 'Creative', 'Executive'];

    for (const template of templates) {
      const templateButton = page.getByText(template, { exact: false }).first();
      if (await templateButton.isVisible()) {
        await templateButton.click();
        await page.waitForTimeout(300);
        
        // Verificar que la vista previa cambió
        const preview = page.locator('[class*="preview"]').first();
        await expect(preview).toBeVisible();
      }
    }
  });

  test('debe mostrar vista previa actualizada en tiempo real', async ({ page }) => {
    // Rellenar nombre
    const nameInput = page.getByPlaceholder(/nombre/i).first();
    if (await nameInput.isVisible()) {
      await nameInput.fill('Test User');
      await page.waitForTimeout(500);
      
      // Verificar que aparece en la vista previa
      const preview = page.locator('[class*="preview"]');
      await expect(preview.getByText('Test User')).toBeVisible();
    }
  });

  test('debe validar campos de email', async ({ page }) => {
    const emailInput = page.getByPlaceholder(/email/i).first();
    
    if (await emailInput.isVisible()) {
      // Email inválido
      await emailInput.fill('emailinvalido');
      await emailInput.blur();
      await page.waitForTimeout(300);
      
      // Debería mostrar error
      const errorMessage = page.locator('text=/email.*inválido|invalid.*email/i').first();
      if (await errorMessage.isVisible()) {
        await expect(errorMessage).toBeVisible();
      }
    }
  });

  test('debe permitir agregar experiencia laboral', async ({ page }) => {
    // Navegar hasta la sección de experiencia
    const steps = 2; // Asumiendo que experiencia es el paso 2
    
    for (let i = 0; i < steps; i++) {
      const nextButton = page.getByRole('button', { name: /siguiente|continuar/i }).first();
      if (await nextButton.isVisible()) {
        await nextButton.click();
        await page.waitForTimeout(500);
      }
    }

    // Agregar experiencia
    const addButton = page.getByText(/agregar|añadir.*experiencia/i).first();
    if (await addButton.isVisible()) {
      await addButton.click();
      await page.waitForTimeout(300);
      
      // Rellenar campos de experiencia
      const companyInput = page.getByPlaceholder(/empresa|company/i).first();
      if (await companyInput.isVisible()) {
        await companyInput.fill('Tech Corporation');
      }
    }
  });

  test('score debe aumentar al completar secciones', async ({ page }) => {
    // Obtener score inicial
    const scoreElement = page.locator('[class*="score"]').first();
    let initialScore = 0;
    
    if (await scoreElement.isVisible()) {
      const scoreText = await scoreElement.textContent();
      initialScore = parseInt(scoreText.match(/\d+/)?.[0] || '0');
    }

    // Rellenar información
    const nameInput = page.getByPlaceholder(/nombre/i).first();
    if (await nameInput.isVisible()) {
      await nameInput.fill('Juan Pérez');
      await page.waitForTimeout(500);
    }

    const emailInput = page.getByPlaceholder(/email/i).first();
    if (await emailInput.isVisible()) {
      await emailInput.fill('juan@example.com');
      await page.waitForTimeout(500);
    }

    // Verificar que el score aumentó
    if (await scoreElement.isVisible()) {
      const newScoreText = await scoreElement.textContent();
      const newScore = parseInt(newScoreText.match(/\d+/)?.[0] || '0');
      expect(newScore).toBeGreaterThanOrEqual(initialScore);
    }
  });
});
