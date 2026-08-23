import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
    testDir: './tests/e2e',
    fullyParallel: false,
    retries: process.env.CI ? 2 : 0,
    reporter: 'list',
    use: {
        baseURL: 'http://127.0.0.1:4322',
        trace: 'on-first-retry',
    },
    projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
    webServer: [
        {
            command: 'node tests/e2e/mock-backend.ts',
            port: 4011,
            reuseExistingServer: false,
            timeout: 120_000,
        },
        {
            command: 'pnpm exec astro dev --host 127.0.0.1 --port 4322',
            env: {
                ...process.env,
                API_URL: 'http://127.0.0.1:4011',
                ERP_API_KEY: 'itd_0000000000000000.e2e-integration-secret-00000000000000000000',
                PUBLIC_IZIPAY_PUBLIC_KEY: 'test-public-key',
                PUBLIC_RECAPTCHA_SITE_KEY: 'test-site-key',
            },
            port: 4322,
            reuseExistingServer: false,
            timeout: 120_000,
        },
    ],
})
