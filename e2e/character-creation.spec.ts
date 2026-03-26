import { test, expect } from '@playwright/test';

test.describe('Character Creation Flow', () => {
  test('should allow a player to create a new character and start the game', async ({ page }) => {
    // 1. Start on the main menu
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Nexus Chronicles' })).toBeVisible();

    // 2. Click "New Game"
    await page.getByRole('button', { name: 'New Game' }).click();
    await expect(page.getByRole('heading', { name: 'Choose your Lineage' })).toBeVisible();

    // 3. Select Race and Sub-Race
    await page.getByRole('heading', { name: 'Human' }).click();
    await expect(page.getByRole('heading', { name: 'Choose your Heritage' })).toBeVisible();
    await page.getByRole('heading', { name: 'Highlander' }).click();
    
    // 4. Select Class and Sub-Class
    await expect(page.getByRole('heading', { name: 'Choose your Path' })).toBeVisible();
    await page.getByRole('heading', { name: 'Fighter' }).click();
    await expect(page.getByRole('heading', { name: 'Choose your Martial Archetype' })).toBeVisible();
    await page.getByRole('heading', { name: 'Champion' }).click();

    // 5. Select Background
    await expect(page.getByRole('heading', { name: 'Choose your Background' })).toBeVisible();
    // Use a more specific locator for the background to avoid ambiguity with details pane
    await page.locator('.grid > div').filter({ hasText: 'Soldier' }).first().click();
    await page.getByRole('button', { name: 'Confirm Background' }).click();

    // 6. Attributes - just click next as it should be valid by default
    await expect(page.getByRole('heading', { name: 'Assign Attributes' })).toBeVisible();
    await page.getByRole('button', { name: 'Next' }).click();

    // 7. Appearance - just click next
    await expect(page.getByRole('heading', { name: 'Carve your Identity' })).toBeVisible();
    await page.getByRole('button', { name: 'Next' }).click();

    // 8. Naming
    await expect(page.getByRole('heading', { name: 'What is your Name?' })).toBeVisible();
    await page.getByPlaceholder('Enter your name...').fill('Test Hero');
    await page.getByRole('button', { name: 'Review Summary' }).click();

    // 9. Summary and Begin
    await expect(page.getByRole('heading', { name: 'Final Summary' })).toBeVisible();
    await page.getByRole('button', { name: 'Begin Adventure' }).click();

    // 10. Wait for sprite generation and verify we are in the game
    // The game header is a good indicator of being in the main game screen.
    await expect(page.locator('header')).toBeVisible({ timeout: 60000 }); // Generous timeout for image generation
    await expect(page.getByRole('heading', { name: 'Dev Tester' })).not.toBeVisible();
    await expect(page.getByRole('heading', { name: 'Test Hero' })).toBeVisible();

    // 11. Verify the game has started by checking for the initial scene text.
    await expect(page.getByText('There is no memory of a beginning.')).toBeVisible();
  });
});
