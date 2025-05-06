#!/usr/bin/env node

/**
 * This script verifies that all required security tools are installed and available.
 * It can be used to check the environment before running the MCP server.
 */

import { execSync } from 'child_process';
import chalk from 'chalk';

// Define the tools to check
const tools = [
  { name: 'bbot', command: 'bbot --version', description: 'Black Box Operations Tool for reconnaissance and scanning' },
  { name: 'nmap', command: 'nmap --version', description: 'Network Mapper for network discovery and security scanning' },
  { name: 'msfvenom', command: 'msfvenom --version', description: 'Metasploit Framework payload generator' },
  { name: 'msfconsole', command: 'msfconsole --version', description: 'Metasploit Framework console' }
];

console.log(chalk.blue('Verifying security tools installation...\n'));

let allToolsAvailable = true;
const results = [];

// Check each tool
for (const tool of tools) {
  try {
    const output = execSync(tool.command, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
    const version = output.trim().split('\n')[0];
    results.push({
      name: tool.name,
      available: true,
      version,
      description: tool.description
    });
  } catch (error) {
    results.push({
      name: tool.name,
      available: false,
      description: tool.description
    });
    allToolsAvailable = false;
  }
}

// Display results
console.log(chalk.blue('Results:'));
console.log('----------------------------------------');

for (const result of results) {
  if (result.available) {
    console.log(`${chalk.green('✓')} ${chalk.bold(result.name)}: ${chalk.green('Available')}`);
    console.log(`  Version: ${result.version}`);
    console.log(`  Description: ${result.description}`);
  } else {
    console.log(`${chalk.red('✗')} ${chalk.bold(result.name)}: ${chalk.red('Not available')}`);
    console.log(`  Description: ${result.description}`);
    console.log(`  ${chalk.yellow('Please install this tool to use all features of the MCP server.')}`);
  }
  console.log('----------------------------------------');
}

// Summary
if (allToolsAvailable) {
  console.log(chalk.green.bold('All required security tools are installed and available!'));
  console.log(chalk.green('You can now run the MCP server.'));
} else {
  console.log(chalk.yellow.bold('Some security tools are missing.'));
  console.log(chalk.yellow('The MCP server will still run, but some features may not be available.'));
  console.log(chalk.yellow('Please install the missing tools for full functionality.'));
}
