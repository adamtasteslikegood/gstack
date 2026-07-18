import { describe, test, expect } from 'bun:test';
import * as path from 'path';
import * as fs from 'fs';

const ROOT = path.resolve(import.meta.dir, '..');
const SETUP_SCRIPT = path.join(ROOT, 'setup');

describe('setup: Playwright Linux dependency fallback', () => {
  test('setup auto-installs Playwright system deps on Linux when Chromium still fails to launch', () => {
    const content = fs.readFileSync(SETUP_SCRIPT, 'utf-8');
    expect(content).toContain('PLAYWRIGHT_LINUX_DEPS_ATTEMPTED=0');
    expect(content).toContain('Installing Playwright system dependencies (Linux)...');
    expect(content).toContain('bunx playwright install-deps chromium');
    expect(content).toContain('GSTACK_SKIP_PLAYWRIGHT_DEPS');
  });

  test('Linux dependency fallback happens after browser install and before the final failure message', () => {
    const content = fs.readFileSync(SETUP_SCRIPT, 'utf-8');
    const installChromiumIdx = content.indexOf('bunx playwright install chromium');
    const installDepsIdx = content.indexOf('bunx playwright install-deps chromium');
    const finalFailIdx = content.indexOf('gstack setup failed: Playwright Chromium could not be launched');

    expect(installChromiumIdx).toBeGreaterThan(-1);
    expect(installDepsIdx).toBeGreaterThan(installChromiumIdx);
    expect(finalFailIdx).toBeGreaterThan(installDepsIdx);
  });

  test('final Linux failure includes a manual remediation hint and skip env var', () => {
    const content = fs.readFileSync(SETUP_SCRIPT, 'utf-8');
    expect(content).toContain("Hint: try 'cd $SOURCE_GSTACK_DIR && bunx playwright install-deps chromium'");
    expect(content).toContain('Set GSTACK_SKIP_PLAYWRIGHT_DEPS=1 to skip the automatic Linux dependency install.');
  });
});
