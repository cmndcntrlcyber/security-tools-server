import { exec } from 'child_process';
import { promisify } from 'util';

// Promisify the exec function for easier async/await usage
const execAsync = promisify(exec);

/**
 * Execute a shell command and return the result
 * @param command The command to execute
 * @param timeout Optional timeout in milliseconds
 * @returns Promise with stdout and stderr
 */
export async function executeCommand(command: string, timeout = 60000): Promise<{ stdout: string; stderr: string }> {
  try {
    // Execute the command with a timeout
    const result = await execAsync(command, { timeout });
    return result;
  } catch (error: any) {
    // Handle execution errors
    console.error(`Command execution error: ${error.message}`);
    return {
      stdout: '',
      stderr: error.message || 'Unknown error occurred during command execution'
    };
  }
}

/**
 * Sanitize input to prevent command injection
 * @param input The input string to sanitize
 * @returns Sanitized string
 */
export function sanitizeInput(input: string): string {
  // Remove shell special characters and escape quotes
  return input
    .replace(/[;&|`$(){}[\]\\*?<>]/g, '')
    .replace(/'/g, '\\\'')
    .replace(/"/g, '\\"');
}

/**
 * Format command output for better readability
 * @param output The command output to format
 * @returns Formatted output
 */
export function formatOutput(output: string): string {
  // Remove ANSI color codes and format for readability
  return output
    .replace(/\x1B\[\d+m/g, '') // Remove ANSI color codes
    .trim();
}

/**
 * Parse JSON output from a command
 * @param output The command output to parse
 * @returns Parsed JSON object or null if parsing fails
 */
export function parseJsonOutput(output: string): any {
  try {
    return JSON.parse(output);
  } catch (error) {
    console.error('Failed to parse JSON output:', error);
    return null;
  }
}

/**
 * Check if a tool is available on the system
 * @param toolName The name of the tool to check
 * @returns Promise<boolean> True if the tool is available
 */
export async function isToolAvailable(toolName: string): Promise<boolean> {
  try {
    await execAsync(`which ${toolName}`);
    return true;
  } catch (error) {
    return false;
  }
}
