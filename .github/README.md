# GitHub Actions CI/CD

This repository uses GitHub Actions for continuous integration and deployment.

## Workflows

### CI Workflow (`.github/workflows/ci.yml`)

Runs on every push and pull request to `main`, `master`, and `develop` branches.

#### Jobs

1. **Lint & Type Check**
   - Runs ESLint
   - Performs TypeScript type checking
   - Ensures code quality and type safety

2. **Unit Tests**
   - Runs Vitest unit and component tests
   - Uploads test results as artifacts

3. **E2E Tests**
   - Runs Playwright end-to-end tests
   - Tests across Chromium, Firefox, and WebKit
   - Uploads test reports, videos, and screenshots on failure

4. **Build**
   - Builds the Next.js application
   - Ensures the project compiles successfully
   - Uploads build artifacts

5. **CI Status**
   - Aggregates results from all jobs
   - Provides overall CI status

## Required Secrets

For the CI to work properly, you may need to set the following secrets in your GitHub repository:

- `DATABASE_URL` - Database connection string (optional, uses placeholder if not set)
- `NEXTAUTH_SECRET` - NextAuth secret key (optional, uses test secret if not set)

### Setting up Secrets

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add the required secrets

## Artifacts

The workflow uploads the following artifacts:

- **Unit test results**: Test output and coverage reports (7 days retention)
- **Playwright report**: HTML test report (30 days retention)
- **Playwright videos**: Test execution videos (7 days retention)
- **Playwright screenshots**: Screenshots from failed tests (7 days retention)
- **Build artifacts**: Compiled Next.js build (1 day retention)

## Local Testing

To test the CI workflow locally, you can use [act](https://github.com/nektos/act):

```bash
# Install act
brew install act  # macOS
# or
curl https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash

# Run the CI workflow
act -j lint-and-typecheck
act -j unit-tests
act -j e2e-tests
act -j build
```

## Troubleshooting

### Tests failing in CI but passing locally

1. Check environment variables are set correctly
2. Ensure Prisma Client is generated (`pnpm prisma generate`)
3. Verify Playwright browsers are installed (`pnpm exec playwright install --with-deps`)

### Build failures

1. Check that all environment variables are available
2. Verify Prisma schema is valid
3. Ensure all dependencies are listed in `package.json`

### Timeout issues

If jobs are timing out, you can increase the `timeout-minutes` value in the workflow file.
