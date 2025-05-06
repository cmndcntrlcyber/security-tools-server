import { executeCommand, sanitizeInput, formatOutput } from '../utils.js';

/**
 * Interface for MSFConsole exploit options
 */
export interface MSFConsoleExploitOptions {
  exploitModule: string;
  target: string;
  payload?: string;
  options?: Record<string, string>;
}

/**
 * Interface for MSFConsole post-exploitation options
 */
export interface MSFConsolePostExploitOptions {
  sessionId: number;
  module: string;
  options?: Record<string, string>;
}

/**
 * Interface for MSFConsole command options
 */
export interface MSFConsoleCommandOptions {
  command: string;
}

/**
 * MSFConsole tool implementation for Metasploit Framework operations
 */
export class MSFConsoleTool {
  /**
   * Run an exploit using MSFConsole
   * @param options Exploit options
   * @returns Exploit results
   */
  async runExploit(options: MSFConsoleExploitOptions): Promise<string> {
    // Sanitize inputs
    const exploitModule = sanitizeInput(options.exploitModule);
    const target = sanitizeInput(options.target);
    const payload = options.payload ? sanitizeInput(options.payload) : '';
    
    // Build the resource script content
    let resourceScript = `use ${exploitModule}\n`;
    resourceScript += `set RHOSTS ${target}\n`;
    
    if (payload) {
      resourceScript += `set PAYLOAD ${payload}\n`;
    }
    
    // Add any additional options
    if (options.options) {
      for (const [key, value] of Object.entries(options.options)) {
        resourceScript += `set ${sanitizeInput(key)} ${sanitizeInput(value)}\n`;
      }
    }
    
    resourceScript += "exploit\n";
    
    // Create a temporary resource script file
    const tempFile = `/tmp/msfconsole_exploit_${Date.now()}.rc`;
    const writeCommand = `echo '${resourceScript}' > ${tempFile}`;
    await executeCommand(writeCommand);
    
    // Execute MSFConsole with the resource script
    const command = `msfconsole -q -r ${tempFile}`;
    const { stdout, stderr } = await executeCommand(command, 120000); // 2 minute timeout
    
    // Clean up the temporary file
    await executeCommand(`rm ${tempFile}`);
    
    if (stderr && !stdout) {
      return `Error: ${stderr}`;
    }
    
    return formatOutput(stdout);
  }

  /**
   * Run a post-exploitation module
   * @param options Post-exploitation options
   * @returns Post-exploitation results
   */
  async runPostExploitation(options: MSFConsolePostExploitOptions): Promise<string> {
    // Sanitize inputs
    const sessionId = options.sessionId;
    const module = sanitizeInput(options.module);
    
    // Build the resource script content
    let resourceScript = `use ${module}\n`;
    resourceScript += `set SESSION ${sessionId}\n`;
    
    // Add any additional options
    if (options.options) {
      for (const [key, value] of Object.entries(options.options)) {
        resourceScript += `set ${sanitizeInput(key)} ${sanitizeInput(value)}\n`;
      }
    }
    
    resourceScript += "run\n";
    
    // Create a temporary resource script file
    const tempFile = `/tmp/msfconsole_post_${Date.now()}.rc`;
    const writeCommand = `echo '${resourceScript}' > ${tempFile}`;
    await executeCommand(writeCommand);
    
    // Execute MSFConsole with the resource script
    const command = `msfconsole -q -r ${tempFile}`;
    const { stdout, stderr } = await executeCommand(command, 120000); // 2 minute timeout
    
    // Clean up the temporary file
    await executeCommand(`rm ${tempFile}`);
    
    if (stderr && !stdout) {
      return `Error: ${stderr}`;
    }
    
    return formatOutput(stdout);
  }

  /**
   * Run an arbitrary MSFConsole command
   * @param options Command options
   * @returns Command results
   */
  async runCommand(options: MSFConsoleCommandOptions): Promise<string> {
    // Sanitize inputs
    const command = sanitizeInput(options.command);
    
    // Build the resource script content
    const resourceScript = `${command}\n`;
    
    // Create a temporary resource script file
    const tempFile = `/tmp/msfconsole_cmd_${Date.now()}.rc`;
    const writeCommand = `echo '${resourceScript}' > ${tempFile}`;
    await executeCommand(writeCommand);
    
    // Execute MSFConsole with the resource script
    const msfCommand = `msfconsole -q -r ${tempFile}`;
    const { stdout, stderr } = await executeCommand(msfCommand, 60000); // 1 minute timeout
    
    // Clean up the temporary file
    await executeCommand(`rm ${tempFile}`);
    
    if (stderr && !stdout) {
      return `Error: ${stderr}`;
    }
    
    return formatOutput(stdout);
  }
}
