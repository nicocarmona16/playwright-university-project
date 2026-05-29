import { test, expect } from '@playwright/test';

/**
 * Environment variables test fixture
 */
export const testWithEnvironment = test.extend<{
  environment: 'development' | 'staging' | 'production';
  baseUrl: string;
}>({
  environment: ['development', { option: true }],
  baseUrl: async ({ environment }, use) => {
    const urls = {
      development: 'http://localhost:3000',
      staging: 'https://staging.example.com',
      production: 'https://example.com'
    };
    await use(urls[environment]);
  },
});

/**
 * API test fixture
 */
export const testWithAPI = test.extend<{
  apiBaseUrl: string;
  apiToken: string;
}>({
  apiBaseUrl: ['https://api.example.com', { option: true }],
  apiToken: async ({}, use) => {
    const token = process.env.API_TOKEN || 'test-token';
    await use(token);
  },
});