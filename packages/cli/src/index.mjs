#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const args = process.argv.slice(2);
const command = args[0];
const rootFlag = args.indexOf('--root');
const root = path.resolve(rootFlag >= 0 ? args[rootFlag + 1] : process.cwd());
const here = path.dirname(new URL(import.meta.url).pathname);
const repoRoot = path.resolve(here, '../../..');

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function copyIfMissing(source, target) {
  if (fs.existsSync(target)) return false;
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
  return true;
}

function init() {
  const created = [];
  if (copyIfMissing(path.join(repoRoot, 'templates/AGENTS.md'), path.join(root, 'AGENTS.md'))) created.push('AGENTS.md');
  if (copyIfMissing(path.join(repoRoot, 'templates/HANDOFFS.md'), path.join(root, '.agents/HANDOFFS.md'))) created.push('.agents/HANDOFFS.md');
  const manifest = path.join(root, 'agent-contract.yml');
  if (!fs.existsSync(manifest)) {
    fs.writeFileSync(manifest, `version: 1\ncontract:\n  spec: "0.1"\nverification:\n  commands: []\nreview:\n  disposition_required: true\nhandoff:\n  path: .agents/HANDOFFS.md\nsecurity:\n  destructive_operations: explicit-approval\n`);
    created.push('agent-contract.yml');
  }
  console.log(created.length ? `Created:\n${created.map(x => `✓ ${x}`).join('\n')}` : 'Nothing to create; contract files already exist.');
}

function check() {
  const failures = [];
  const agentsPath = path.join(root, 'AGENTS.md');
  const manifestPath = path.join(root, 'agent-contract.yml');
  const handoffPath = path.join(root, '.agents/HANDOFFS.md');
  let inheritsShared = false;

  if (!fs.existsSync(manifestPath)) failures.push('agent-contract.yml is missing');
  if (!fs.existsSync(agentsPath)) failures.push('AGENTS.md is missing');
  if (!fs.existsSync(handoffPath)) failures.push('.agents/HANDOFFS.md is missing');

  if (fs.existsSync(manifestPath)) {
    const manifest = read(manifestPath);
    if (!/^version:\s*1\s*$/m.test(manifest)) failures.push('manifest version must be 1');
    if (!/^contract:\s*$/m.test(manifest) || !/^\s+spec:\s*["']?0\.1["']?\s*$/m.test(manifest)) failures.push('contract.spec must declare 0.1');
    inheritsShared = /^\s+inherits:\s*["']?shared["']?\s*$/m.test(manifest);
  }

  if (fs.existsSync(agentsPath)) {
    const text = read(agentsPath).toLowerCase();
    const required = inheritsShared ? ['verification'] : ['role', 'goal', 'can', 'cannot', 'escalate', 'verification', 'done'];
    for (const section of required) {
      const rx = new RegExp(`^#{1,6}\\s+.*${section}`, 'mi');
      if (!rx.test(text)) failures.push(`AGENTS.md missing ${section} section`);
    }
  }

  if (failures.length) {
    console.error(`Agent Contract check failed:\n${failures.map(x => `✗ ${x}`).join('\n')}`);
    process.exitCode = 1;
    return;
  }

  console.log(`Agent Contract check passed:\n✓ manifest\n✓ AGENTS.md (${inheritsShared ? 'shared semantics inherited' : 'full contract'})\n✓ structured handoff`);
}

if (command === 'init') init();
else if (command === 'check') check();
else {
  console.error('Usage: agent-contract <init|check> [--root <path>]');
  process.exitCode = 2;
}
