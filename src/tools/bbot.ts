import { executeCommand, sanitizeInput, formatOutput } from '../utils.js';

/**
 * Interface for BBOT scan options
 */
export interface BBotScanOptions {
  target: string;
  modules?: string[];
  outputFormat?: string;
  depth?: number;
}

/**
 * Interface for BBOT subdomain enumeration options
 */
export interface BBotSubdomainOptions {
  domain: string;
  depth?: number;
  techniques?: string[];
}

/**
 * BBOT tool implementation for reconnaissance and scanning
 */
export class BBotTool {
  /**
   * Run a BBOT scan against a target
   * @param options Scan options
   * @returns Scan results
   */
  async scanTarget(options: BBotScanOptions): Promise<string> {
    // Sanitize inputs
    const target = sanitizeInput(options.target);
    const modules = options.modules?.map(sanitizeInput).join(',') || 'subdomain_enum,web_discovery';
    const outputFormat = sanitizeInput(options.outputFormat || 'json');
    const depth = options.depth || 1;

    // Build the command
    const command = `bbot -t ${target} -m ${modules} -o ${outputFormat} -d ${depth} --no-color`;
    
    // Execute the command
    const { stdout, stderr } = await executeCommand(command);
    
    if (stderr && !stdout) {
      return `Error: ${stderr}`;
    }
    
    return formatOutput(stdout);
  }

  /**
   * Enumerate subdomains for a given domain
   * @param options Subdomain enumeration options
   * @returns Subdomain enumeration results
   */
  async enumerateSubdomains(options: BBotSubdomainOptions): Promise<string> {
    // Sanitize inputs
    const domain = sanitizeInput(options.domain);
    const depth = options.depth || 2;
    const techniques = options.techniques?.map(sanitizeInput).join(',') || 'dns,scrape';

    // Build the command
    const command = `bbot -t ${domain} -m subdomain_enum -f techniques=${techniques} -d ${depth} -o json --no-color`;
    
    // Execute the command
    const { stdout, stderr } = await executeCommand(command);
    
    if (stderr && !stdout) {
      return `Error: ${stderr}`;
    }
    
    return formatOutput(stdout);
  }
}
