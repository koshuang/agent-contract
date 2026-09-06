import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const cli = path.resolve('packages/cli/src/index.mjs');

function run(args) {
  return spawnSync(process.execPath, [cli, ...args], { encoding: 'utf8' });
}

test('init creates the contract files and check passes', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-contract-'));
  const init = run(['init', '--root', root]);
  assert.equal(init.status, 0, init.stderr);
  assert.ok(fs.existsSync(path.join(root, 'AGENTS.md')));
  assert.ok(fs.existsSync(path.join(root, 'agent-contract.yml')));
  assert.ok(fs.existsSync(path.join(root, '.agents/HANDOFFS.md')));

  const check = run(['check', '--root', root]);
  assert.equal(check.status, 0, check.stderr);
  assert.match(check.stdout, /check passed/i);
});

test('check fails for a repository without a contract', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-contract-empty-'));
  const check = run(['check', '--root', root]);
  assert.equal(check.status, 1);
  assert.match(check.stderr, /missing/i);
});
