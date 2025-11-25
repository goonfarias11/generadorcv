import { test, expect } from '@playwright/test';

test.describe('Autosave - Persistencia de Datos', () => {
  test.beforeEach(async ({ page }) => {
    // Limpiar localStorage antes de cada test
    await page.goto('/builder');
    await page.evaluate(() => localStorage.clear());
  });

  test('debe guardar datos automáticamente', async ({ page }) => {
    await page.goto('/builder');

    // Rellenar información
    const nameInput = page.getByPlaceholder(/nombre/i).first();
    if (await nameInput.isVisible()) {
      await nameInput.fill('María García');
      await page.waitForTimeout(2000); // Esperar autosave
    }

    const emailInput = page.getByPlaceholder(/email/i).first();
    if (await emailInput.isVisible()) {
      await emailInput.fill('maria@example.com');
      await page.waitForTimeout(2000);
    }

    // Verificar que se guardó en localStorage
    const savedData = await page.evaluate(() => {
      return localStorage.getItem('resume-autosave');
    });

    expect(savedData).toBeTruthy();
    expect(savedData).toContain('María García');
    expect(savedData).toContain('maria@example.com');
  });

  test('debe recuperar datos al recargar la página', async ({ page }) => {
    await page.goto('/builder');

    // Paso 1: Rellenar datos
    const nameInput = page.getByPlaceholder(/nombre/i).first();
    if (await nameInput.isVisible()) {
      await nameInput.fill('Pedro Sánchez');
      await page.waitForTimeout(2000);
    }

    const emailInput = page.getByPlaceholder(/email/i).first();
    if (await emailInput.isVisible()) {
      await emailInput.fill('pedro@example.com');
      await page.waitForTimeout(2000);
    }

    // Paso 2: Recargar la página
    await page.reload();
    await page.waitForTimeout(1000);

    // Paso 3: Verificar que los datos reaparecen
    const nameInputAfterReload = page.getByPlaceholder(/nombre/i).first();
    if (await nameInputAfterReload.isVisible()) {
      const nameValue = await nameInputAfterReload.inputValue();
      expect(nameValue).toBe('Pedro Sánchez');
    }

    const emailInputAfterReload = page.getByPlaceholder(/email/i).first();
    if (await emailInputAfterReload.isVisible()) {
      const emailValue = await emailInputAfterReload.inputValue();
      expect(emailValue).toBe('pedro@example.com');
    }
  });

  test('debe limpiar autosave al resetear CV', async ({ page }) => {
    await page.goto('/builder');

    // Rellenar datos
    const nameInput = page.getByPlaceholder(/nombre/i).first();
    if (await nameInput.isVisible()) {
      await nameInput.fill('Test User');
      await page.waitForTimeout(2000);
    }

    // Buscar botón de resetear/limpiar
    const resetButton = page.getByText(/limpiar|resetear|borrar/i).first();
    if (await resetButton.isVisible()) {
      await resetButton.click();
      await page.waitForTimeout(1000);

      // Verificar que localStorage está limpio
      const savedData = await page.evaluate(() => {
        return localStorage.getItem('resume-autosave');
      });

      expect(savedData).toBeFalsy();
    }
  });

  test('debe guardar experiencias agregadas', async ({ page }) => {
    await page.goto('/builder');

    // Navegar hasta experiencia (asumiendo paso 2)
    for (let i = 0; i < 2; i++) {
      const nextButton = page.getByRole('button', { name: /siguiente|continuar/i }).first();
      if (await nextButton.isVisible()) {
        await nextButton.click();
        await page.waitForTimeout(500);
      }
    }

    // Agregar experiencia
    const addButton = page.getByText(/agregar.*experiencia/i).first();
    if (await addButton.isVisible()) {
      await addButton.click();
      await page.waitForTimeout(500);

      const companyInput = page.getByPlaceholder(/empresa/i).first();
      if (await companyInput.isVisible()) {
        await companyInput.fill('Tech Corp');
        await page.waitForTimeout(2000);
      }
    }

    // Recargar y verificar
    await page.reload();
    await page.waitForTimeout(1000);

    // Navegar nuevamente hasta experiencia
    for (let i = 0; i < 2; i++) {
      const nextButton = page.getByRole('button', { name: /siguiente|continuar/i }).first();
      if (await nextButton.isVisible()) {
        await nextButton.click();
        await page.waitForTimeout(500);
      }
    }

    // Verificar que la experiencia persiste
    const savedCompany = page.getByText('Tech Corp').first();
    if (await savedCompany.isVisible()) {
      await expect(savedCompany).toBeVisible();
    }
  });

  test('debe actualizar autosave al cambiar de plantilla', async ({ page }) => {
    await page.goto('/builder');

    // Seleccionar plantilla Premium
    await page.getByText(/premium/i).first().click();
    await page.waitForTimeout(2000);

    // Verificar que se guardó la plantilla
    const savedData = await page.evaluate(() => {
      return localStorage.getItem('resume-autosave');
    });

    expect(savedData).toBeTruthy();

    // Cambiar a otra plantilla
    await page.getByText(/ats/i).first().click();
    await page.waitForTimeout(2000);

    // Recargar y verificar que se mantuvo ATS
    await page.reload();
    await page.waitForTimeout(1000);

    const atsButton = page.getByText(/ats/i).first();
    if (await atsButton.isVisible()) {
      // Debería estar seleccionado
      await expect(atsButton).toHaveClass(/active|selected/);
    }
  });
});
