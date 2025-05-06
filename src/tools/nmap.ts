import { executeCommand, sanitizeInput, formatOutput } from '../utils.js';

/**
 * Interface for Nmap host discovery options
 */
export interface NmapHostDiscoveryOptions {
  target: string;
  technique?: string;
  timing?: number;
}

/**
 * Interface for Nmap port scan options
 */
export interface NmapPortScanOptions {
  target: string;
  ports?: string;
  scanType?: string;
  timing?: number;
  serviceDetection?: boolean;
}

/**
 * Interface for Nmap service fingerprinting options
 */
export interface NmapServiceFingerprintOptions {
  target: string;
  ports?: string;
  intensity?: number;
}

/**
 * Nmap tool implementation for network discovery and scanning
 */
export class NmapTool {
  /**
   * Discover hosts on a network
   * @param options Host discovery options
   * @returns Host discovery results
   */
  async hostDiscovery(options: NmapHostDiscoveryOptions): Promise<string> {
    // Sanitize inputs
    const target = sanitizeInput(options.target);
    const technique = sanitizeInput(options.technique || 'PE');
    const timing = options.timing || 3;

    // Build the command
    // PE: ICMP Echo, PP: ICMP Timestamp, PM: ICMP Address Mask, PS: TCP SYN, PA: TCP ACK, PU: UDP
    let techniqueFlag = '';
    switch (technique) {
      case 'PE': techniqueFlag = '-PE'; break;
      case 'PP': techniqueFlag = '-PP'; break;
      case 'PM': techniqueFlag = '-PM'; break;
      case 'PS': techniqueFlag = '-PS'; break;
      case 'PA': techniqueFlag = '-PA'; break;
      case 'PU': techniqueFlag = '-PU'; break;
      default: techniqueFlag = '-PE';
    }

    const command = `nmap ${techniqueFlag} -sn -T${timing} ${target} -oG -`;
    
    // Execute the command
    const { stdout, stderr } = await executeCommand(command);
    
    if (stderr && !stdout) {
      return `Error: ${stderr}`;
    }
    
    return formatOutput(stdout);
  }

  /**
   * Scan for open ports on target systems
   * @param options Port scan options
   * @returns Port scan results
   */
  async portScan(options: NmapPortScanOptions): Promise<string> {
    // Sanitize inputs
    const target = sanitizeInput(options.target);
    const ports = sanitizeInput(options.ports || 'top1000');
    const scanType = sanitizeInput(options.scanType || 'SYN');
    const timing = options.timing || 3;
    const serviceDetection = options.serviceDetection !== false;

    // Build the command
    let scanFlag = '';
    switch (scanType) {
      case 'SYN': scanFlag = '-sS'; break;
      case 'TCP': scanFlag = '-sT'; break;
      case 'UDP': scanFlag = '-sU'; break;
      case 'FIN': scanFlag = '-sF'; break;
      case 'NULL': scanFlag = '-sN'; break;
      case 'XMAS': scanFlag = '-sX'; break;
      default: scanFlag = '-sS';
    }

    let portFlag = '';
    if (ports === 'top1000') {
      portFlag = '--top-ports 1000';
    } else if (ports === 'all') {
      portFlag = '-p-';
    } else {
      portFlag = `-p ${ports}`;
    }

    const serviceFlag = serviceDetection ? '-sV' : '';
    
    const command = `nmap ${scanFlag} ${portFlag} ${serviceFlag} -T${timing} ${target} -oN -`;
    
    // Execute the command
    const { stdout, stderr } = await executeCommand(command);
    
    if (stderr && !stdout) {
      return `Error: ${stderr}`;
    }
    
    return formatOutput(stdout);
  }

  /**
   * Perform detailed service version detection
   * @param options Service fingerprint options
   * @returns Service fingerprint results
   */
  async serviceFingerprint(options: NmapServiceFingerprintOptions): Promise<string> {
    // Sanitize inputs
    const target = sanitizeInput(options.target);
    const ports = sanitizeInput(options.ports || 'open');
    const intensity = options.intensity || 7;

    // Build the command
    const command = `nmap -sV --version-intensity ${intensity} -p ${ports} ${target} -oN -`;
    
    // Execute the command
    const { stdout, stderr } = await executeCommand(command);
    
    if (stderr && !stdout) {
      return `Error: ${stderr}`;
    }
    
    return formatOutput(stdout);
  }
}
