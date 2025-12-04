#!/usr/bin/env node

/**
 * Development server wrapper with proper cleanup handling
 * Ensures port 3000 is released when the server is stopped
 */

const { spawn } = require('child_process');
const { execSync } = require('child_process');
const os = require('os');

const platform = os.platform();

// Function to kill processes on port 3000
function killPort(port = '3000') {
  try {
    if (platform === 'win32') {
      const result = execSync(`netstat -ano | findstr :${port}`, { encoding: 'utf-8' });
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
          execSync(`taskkill /PID ${pid} /F`, { stdio: 'ignore' });
        } catch (err) {
          // Process might already be dead
        }
      });
    } else {
      const lsofResult = execSync(`lsof -ti:${port}`, { encoding: 'utf-8' });
      const pids = lsofResult.trim().split('\n').filter(Boolean);

      pids.forEach(pid => {
        try {
          execSync(`kill -9 ${pid}`, { stdio: 'ignore' });
        } catch (err) {
          // Process might already be dead
        }
      });
    }
  } catch (err) {
    // No processes found, that's fine
  }
}

// Cleanup function
function cleanup() {
  console.log('\n🛑 Shutting down...');
  killPort('3000');
  process.exit(0);
}

// Handle process termination signals
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
  cleanup();
});

// Start the dev server
console.log('🚀 Starting development server...');
const devServer = spawn('pnpm', ['dev:raw'], {
  stdio: 'inherit',
  shell: true,
});

// Handle dev server exit
devServer.on('exit', (code) => {
  console.log(`\n📦 Dev server exited with code ${code}`);
  cleanup();
});

// Handle dev server errors
devServer.on('error', (err) => {
  console.error('❌ Error starting dev server:', err);
  cleanup();
});
