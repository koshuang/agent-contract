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

test('check accepts an explicit thin consumer that inherits shared semantics', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-contract-thin-'));
  fs.mkdirSync(path.join(root, '.agents'), { recursive: true });
  fs.writeFileSync(path.join(root, 'agent-contract.yml'), `version: 1\ncontract:\n  spec: "0.1"\n  inherits: shared\nverification:\n  commands:\n    - test\n`);
  fs.writeFileSync(path.join(root, 'AGENTS.md'), '# Consumer rules\n\n## Verification\n\nRun the repository verification gates.\n');
  fs.writeFileSync(path.join(root, '.agents/HANDOFFS.md'), '# Handoffs\n');

  const check = run(['check', '--root', root]);
  assert.equal(check.status, 0, check.stderr);
  assert.match(check.stdout, /shared semantics inherited/i);
});

test('thin consumer still fails closed when local verification declaration is missing', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-contract-thin-invalid-'));
  fs.mkdirSync(path.join(root, '.agents'), { recursive: true });
  fs.writeFileSync(path.join(root, 'agent-contract.yml'), `version: 1\ncontract:\n  spec: "0.1"\n  inherits: shared\n`);
  fs.writeFileSync(path.join(root, 'AGENTS.md'), '# Consumer rules\n');
  fs.writeFileSync(path.join(root, '.agents/HANDOFFS.md'), '# Handoffs\n');

  const check = run(['check', '--root', root]);
  assert.equal(check.status, 1);
  assert.match(check.stderr, /missing verification section/i);
});

test('check fails for a repository without a contract', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-contract-empty-'));
  const check = run(['check', '--root', root]);
  assert.equal(check.status, 1);
  assert.match(check.stderr, /missing/i);
});
