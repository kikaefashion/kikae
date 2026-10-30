#!/usr/bin/env node

/**
 * Dependency-audit gate for CI.
 *
 * Runs `yarn audit --level high --json` and fails the build only when it finds
 * advisories that are NOT listed in `audit-allowlist.json`. This lets us accept
 * known, currently-unfixable transitive advisories (for example the zod advisory
 * under `expo > @expo/cli`) while still failing on anything new.
 */

const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const ALLOWLIST_PATH = path.join(ROOT, 'audit-allowlist.json');

function readAllowlist() {
  const raw = fs.readFileSync(ALLOWLIST_PATH, 'utf8');
  return JSON.parse(raw).advisories || {};
}

function runYarnAudit() {
  // `shell: true` lets Windows resolve the `yarn.cmd` shim; on Linux CI it
  // resolves `yarn` from PATH as usual. The args are static and safe.
  return spawnSync('yarn', ['audit', '--level', 'high', '--json'], {
    shell: true,
    encoding: 'utf8',
  });
}

function parseLines(stdout, type) {
  const found = [];
  for (const line of (stdout || '').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    let entry;
    try {
      entry = JSON.parse(trimmed);
    } catch {
      continue; // skip non-JSON lines (banners, warnings, progress, ...)
    }
    if (entry.type === type && entry.data) found.push(entry.data);
  }
  return found;
}

function main() {
  const allowlist = readAllowlist();

  const result = runYarnAudit();
  if (result.error) {
    console.error(`Failed to run \`yarn audit\`: ${result.error.message}`);
    process.exit(1);
  }

  const advisories = parseLines(result.stdout, 'auditAdvisory').map(
    (data) => data.advisory,
  );
  const summary = parseLines(result.stdout, 'auditSummary')[0];

  // If no summary came back, the audit did not complete successfully
  // (e.g. network/registry error). Fail loudly instead of passing silently.
  if (!summary) {
    console.error('`yarn audit` did not produce a summary. Audit output:');
    console.error(result.stderr || result.stdout || '(no output)');
    process.exit(1);
  }

  const allowed = [];
  const blocking = [];

  for (const advisory of advisories) {
    if (allowlist[String(advisory.id)]) {
      allowed.push(advisory);
    } else {
      blocking.push(advisory);
    }
  }

  if (allowed.length > 0) {
    console.log('\nAccepted (allowlisted) advisories:');
    for (const advisory of allowed) {
      const entry = allowlist[String(advisory.id)] || {};
      console.log(
        `  - [${advisory.severity}] ${advisory.module_name} (${advisory.id}): ${advisory.title}`,
      );
      console.log(`    Reason: ${entry.reason || 'see audit-allowlist.json'}`);
    }
  }

  if (blocking.length > 0) {
    console.error('\nBlocking advisories (not allowlisted):');
    for (const advisory of blocking) {
      console.error(
        `  - [${advisory.severity}] ${advisory.module_name} (${advisory.id}): ${advisory.title}`,
      );
      console.error(`    ${advisory.url || ''}`);
    }
    console.error(
      '\nRun `yarn audit` for details. To accept one, add it to audit-allowlist.json with a reason.',
    );
    process.exit(1);
  }

  const totals = summary.vulnerabilities || {};
  console.log(
    `\nAudit gate passed. Reported: ${totals.high || 0} high, ${totals.critical || 0} critical` +
      ` (${allowed.length} accepted, ${blocking.length} blocking).`,
  );
  process.exit(0);
}

main();
