const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('FinOps Dashboard UI Tests', () => {

  test('should load the dashboard and verify initial state', async ({ page }) => {
    // Navigate to the local index.html
    const absolutePath = path.resolve(__dirname, '../index.html');
    await page.goto(`file://${absolutePath}`);

    // Verify header
    await expect(page.locator('.header-title')).toContainText('Bob - Cloud Efficiency Analyst');

    // Verify initial reset state
    await expect(page.locator('#status-chip')).toContainText('Waiting for data...');
    await expect(page.locator('#dashboard-title')).toContainText('Efficiency Analysis');
    await expect(page.locator('#analysis-section')).toBeHidden();
    
    // Verify gauge defaults
    await expect(page.locator('#savings-pct')).toHaveText('~0%');
  });

  test('should process a CSV file and update the UI accordingly', async ({ page }) => {
    const absolutePath = path.resolve(__dirname, '../index.html');
    await page.goto(`file://${absolutePath}`);

    // Path to the mock CSV we created earlier
    const csvPath = path.resolve(__dirname, '../test_data.csv');

    // Handle the file upload via the hidden input
    await page.setInputFiles('#file-upload', csvPath);

    // Verify Status Chip updates immediately
    await expect(page.locator('#status-chip')).toContainText('Efficiency analysis: test_data.csv');
    
    // Verify the Analysis Section becomes visible
    const analysisSection = page.locator('#analysis-section');
    await expect(analysisSection).toBeVisible();

    // Verify the dynamic extraction and math worked
    const coreStory = page.locator('#core-story-text');
    await expect(coreStory).toContainText('test-workload-api');
    await expect(coreStory).toContainText('overallocated by approximately');

    // Verify Risk Mitigation text updated
    const riskMitigation = page.locator('#risk-mitigation-text');
    await expect(riskMitigation).toContainText('Reducing the CPU limit');

    // Verify dynamic Terraform Code Block
    await expect(page.locator('#tf-workload-name')).toHaveText('test-workload-api');
    await expect(page.locator('#tf-old-cpu')).toHaveText('2000m');
    await expect(page.locator('#tf-new-cpu')).toHaveText('500m');
  });

  test('should render the sequential AI Chat explanation', async ({ page }) => {
    const absolutePath = path.resolve(__dirname, '../index.html');
    await page.goto(`file://${absolutePath}`);

    const csvPath = path.resolve(__dirname, '../test_data.csv');
    await page.setInputFiles('#file-upload', csvPath);

    const chatMessages = page.locator('#chat-messages');

    // Wait for the final savings message to appear (takes ~6 seconds based on our setTimeout)
    await expect(chatMessages).toContainText('How much will this save?', { timeout: 7000 });

    // Verify the .chat-tag classes were injected correctly
    const chatTags = page.locator('.chat-tag');
    await expect(chatTags.first()).toBeVisible();
    await expect(chatTags).toHaveCount(3); // Resource, Project, Savings

    // Verify the "What you need to do" text
    await expect(chatMessages).toContainText('What you need to do');
  });

  test('should reset the UI when Reset button is clicked', async ({ page }) => {
    const absolutePath = path.resolve(__dirname, '../index.html');
    await page.goto(`file://${absolutePath}`);

    const csvPath = path.resolve(__dirname, '../test_data.csv');
    await page.setInputFiles('#file-upload', csvPath);

    // Verify it processed
    await expect(page.locator('#analysis-section')).toBeVisible();

    // Click Reset UI
    await page.click('#reset-btn');

    // Verify UI goes back to initial state
    await expect(page.locator('#analysis-section')).toBeHidden();
    await expect(page.locator('#status-chip')).toContainText('Waiting for data...');
    await expect(page.locator('#savings-pct')).toHaveText('~0%');
  });
});
