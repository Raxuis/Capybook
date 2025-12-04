#!/usr/bin/env node

/**
 * Script to kill processes running on a specific port
 * Usage: node scripts/kill-port.js [port]
 * Default port: 3000
 */

const { execSync } = require('child_process');
const os = require('os');

const port = process.argv[2] || '3000';
const platform = os.platform();

let command;

if (platform === 'win32') {
  // Windows
  command = `netstat -ano | findstr :${port}`;
  try {
    const result = execSync(command, { encoding: 'utf-8' });
    const lines = result.trim().split('\n');
    const pids = new Set();

    lines.forEach(line => {
      const parts = line.trim().split(/\s+/);
      const pid = parts[parts.length - 1];
      if (pid && !isNaN(pid)) {
        pids.add(pid);
      }
    });

    pids.forEach(pid => {
      try {
        execSync(`taskkill /PID ${pid} /F`, { stdio: 'inherit' });
        console.log(`✓ Killed process ${pid} on port ${port}`);
      } catch (err) {
        // Process might already be dead
      }
    });
  } catch (err) {
    console.log(`No processes found on port ${port}`);
  }
} else {
  // macOS and Linux
  try {
    // Find processes using the port
    const lsofResult = execSync(`lsof -ti:${port}`, { encoding: 'utf-8' });
    const pids = lsofResult.trim().split('\n').filter(Boolean);

    if (pids.length === 0) {
      console.log(`No processes found on port ${port}`);
      process.exit(0);
    }

    // Kill each process
    pids.forEach(pid => {
      try {
        execSync(`kill -9 ${pid}`, { stdio: 'inherit' });
        console.log(`✓ Killed process ${pid} on port ${port}`);
      } catch (err) {
        // Process might already be dead
      }
    });
  } catch (err) {
    console.log(`No processes found on port ${port}`);
  }
}
