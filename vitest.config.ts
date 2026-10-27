import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Use recursive globs so nested package dirs (e.g. mcp/node_modules,
    // mcp/dist) are excluded too — a bare 'node_modules' only matches the
    // repo root, which let third-party test files under mcp/node_modules
    // leak into the run.
    exclude: ['**/node_modules/**', '**/dist/**'],
  },
});
