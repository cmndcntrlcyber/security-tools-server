#!/usr/bin/env node

/**
 * Security Tools MCP Server
 * 
 * This server provides access to various security tools:
 * - BBOT: For reconnaissance and scanning
 * - Nmap: For network discovery and security scanning
 * - MSFVenom: For payload generation
 * - MSFConsole: For running Metasploit Framework commands
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ErrorCode,
  McpError
} from "@modelcontextprotocol/sdk/types.js";

import { isToolAvailable } from "./utils.js";
import {
  BBotTool,
  NmapTool,
  MSFVenomTool,
  MSFConsoleTool
} from "./tools/index.js";

// Initialize tool instances
const bbotTool = new BBotTool();
const nmapTool = new NmapTool();
const msfVenomTool = new MSFVenomTool();
const msfConsoleTool = new MSFConsoleTool();

/**
 * Create an MCP server with capabilities for security tools
 */
const server = new Server(
  {
    name: "cmndcntrl-mcp",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

/**
 * Handler that lists available tools.
 * Exposes all the security tools with their input schemas.
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      // BBOT Tools
      {
        name: "bbot_scan_target",
        description: "Run a BBOT scan against a target",
        inputSchema: {
          type: "object",
          properties: {
            target: {
              type: "string",
              description: "Target URL or IP address"
            },
            modules: {
              type: "array",
              items: {
                type: "string"
              },
              description: "BBOT modules to use (e.g., subdomain_enum, web_discovery)"
            },
            outputFormat: {
              type: "string",
              description: "Output format (json, csv, etc.)"
            },
            depth: {
              type: "number",
              description: "Scan depth level"
            }
          },
          required: ["target"]
        }
      },
      {
        name: "bbot_enumerate_subdomains",
        description: "Discover subdomains for a given domain",
        inputSchema: {
          type: "object",
          properties: {
            domain: {
              type: "string",
              description: "Domain to enumerate subdomains for"
            },
            depth: {
              type: "number",
              description: "Recursion depth"
            },
            techniques: {
              type: "array",
              items: {
                type: "string"
              },
              description: "Techniques to use (dns, scrape, etc.)"
            }
          },
          required: ["domain"]
        }
      },

      // Nmap Tools
      {
        name: "nmap_host_discovery",
        description: "Find live hosts in a network",
        inputSchema: {
          type: "object",
          properties: {
            target: {
              type: "string",
              description: "Target network range (e.g., 192.168.1.0/24)"
            },
            technique: {
              type: "string",
              description: "Discovery technique (PE, PP, PM, PS, PA, PU)"
            },
            timing: {
              type: "number",
              description: "Timing template (0-5)"
            }
          },
          required: ["target"]
        }
      },
      {
        name: "nmap_port_scan",
        description: "Scan for open ports with service detection",
        inputSchema: {
          type: "object",
          properties: {
            target: {
              type: "string",
              description: "Target IP or hostname"
            },
            ports: {
              type: "string",
              description: "Port specification (e.g., 22,80,443 or top1000 or all)"
            },
            scanType: {
              type: "string",
              description: "Scan type (SYN, TCP, UDP, FIN, NULL, XMAS)"
            },
            timing: {
              type: "number",
              description: "Timing template (0-5)"
            },
            serviceDetection: {
              type: "boolean",
              description: "Enable service version detection"
            }
          },
          required: ["target"]
        }
      },
      {
        name: "nmap_service_fingerprint",
        description: "Detailed service version detection",
        inputSchema: {
          type: "object",
          properties: {
            target: {
              type: "string",
              description: "Target IP or hostname"
            },
            ports: {
              type: "string",
              description: "Port specification (e.g., 22,80,443 or open)"
            },
            intensity: {
              type: "number",
              description: "Version detection intensity (0-9)"
            }
          },
          required: ["target"]
        }
      },

      // MSFVenom Tools
      {
        name: "msfvenom_generate_payload",
        description: "Create payloads optimized for initial access",
        inputSchema: {
          type: "object",
          properties: {
            payloadType: {
              type: "string",
              description: "Payload type (reverse_tcp, reverse_https, bind_tcp, etc.)"
            },
            platform: {
              type: "string",
              description: "Target platform (windows, linux, mac, android, web)"
            },
            format: {
              type: "string",
              description: "Output format (exe, elf, raw, dll, asp, jsp, war, etc.)"
            },
            ip: {
              type: "string",
              description: "Listener IP address (for reverse payloads)"
            },
            port: {
              type: "number",
              description: "Listener port"
            },
            encoder: {
              type: "string",
              description: "Encoder to use"
            },
            iterations: {
              type: "number",
              description: "Number of encoding iterations"
            },
            options: {
              type: "object",
              description: "Additional options as key-value pairs"
            }
          },
          required: ["payloadType", "platform", "format"]
        }
      },
      {
        name: "msfvenom_encode_payload",
        description: "Apply encoders to evade detection",
        inputSchema: {
          type: "object",
          properties: {
            payloadFile: {
              type: "string",
              description: "Path to payload file"
            },
            encoder: {
              type: "string",
              description: "Encoder to use"
            },
            iterations: {
              type: "number",
              description: "Number of encoding iterations"
            },
            outputFormat: {
              type: "string",
              description: "Output format"
            }
          },
          required: ["payloadFile", "encoder"]
        }
      },

      // MSFConsole Tools
      {
        name: "msfconsole_run_exploit",
        description: "Execute exploits for initial access vectors",
        inputSchema: {
          type: "object",
          properties: {
            exploitModule: {
              type: "string",
              description: "Exploit module path (e.g., exploit/windows/smb/ms17_010_eternalblue)"
            },
            target: {
              type: "string",
              description: "Target IP or hostname"
            },
            payload: {
              type: "string",
              description: "Payload to use"
            },
            options: {
              type: "object",
              description: "Additional options as key-value pairs"
            }
          },
          required: ["exploitModule", "target"]
        }
      },
      {
        name: "msfconsole_post_exploitation",
        description: "Run post-exploitation modules",
        inputSchema: {
          type: "object",
          properties: {
            sessionId: {
              type: "number",
              description: "Session ID"
            },
            module: {
              type: "string",
              description: "Post-exploitation module path"
            },
            options: {
              type: "object",
              description: "Additional options as key-value pairs"
            }
          },
          required: ["sessionId", "module"]
        }
      },
      {
        name: "msfconsole_run_command",
        description: "Run arbitrary MSF commands",
        inputSchema: {
          type: "object",
          properties: {
            command: {
              type: "string",
              description: "MSF command to execute"
            }
          },
          required: ["command"]
        }
      }
    ]
  };
});

/**
 * Handler for tool execution.
 * Routes the request to the appropriate tool implementation.
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const toolName = request.params.name;
  const args = request.params.arguments || {};

  try {
    let result: string;

    // Check if the required tools are available
    switch (toolName) {
      case "bbot_scan_target":
      case "bbot_enumerate_subdomains":
        if (!(await isToolAvailable("bbot"))) {
          throw new McpError(ErrorCode.InternalError, "BBOT is not installed or not available");
        }
        break;
      case "nmap_host_discovery":
      case "nmap_port_scan":
      case "nmap_service_fingerprint":
        if (!(await isToolAvailable("nmap"))) {
          throw new McpError(ErrorCode.InternalError, "Nmap is not installed or not available");
        }
        break;
      case "msfvenom_generate_payload":
      case "msfvenom_encode_payload":
        if (!(await isToolAvailable("msfvenom"))) {
          throw new McpError(ErrorCode.InternalError, "MSFVenom is not installed or not available");
        }
        break;
      case "msfconsole_run_exploit":
      case "msfconsole_post_exploitation":
      case "msfconsole_run_command":
        if (!(await isToolAvailable("msfconsole"))) {
          throw new McpError(ErrorCode.InternalError, "MSFConsole is not installed or not available");
        }
        break;
    }

    // Execute the requested tool
    switch (toolName) {
      // BBOT Tools
      case "bbot_scan_target":
        result = await bbotTool.scanTarget(args as any);
        break;
      case "bbot_enumerate_subdomains":
        result = await bbotTool.enumerateSubdomains(args as any);
        break;

      // Nmap Tools
      case "nmap_host_discovery":
        result = await nmapTool.hostDiscovery(args as any);
        break;
      case "nmap_port_scan":
        result = await nmapTool.portScan(args as any);
        break;
      case "nmap_service_fingerprint":
        result = await nmapTool.serviceFingerprint(args as any);
        break;

      // MSFVenom Tools
      case "msfvenom_generate_payload":
        result = await msfVenomTool.generatePayload(args as any);
        break;
      case "msfvenom_encode_payload":
        result = await msfVenomTool.encodePayload(args as any);
        break;

      // MSFConsole Tools
      case "msfconsole_run_exploit":
        result = await msfConsoleTool.runExploit(args as any);
        break;
      case "msfconsole_post_exploitation":
        result = await msfConsoleTool.runPostExploitation(args as any);
        break;
      case "msfconsole_run_command":
        result = await msfConsoleTool.runCommand(args as any);
        break;

      default:
        throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${toolName}`);
    }

    return {
      content: [{
        type: "text",
        text: result
      }]
    };
  } catch (error: any) {
    console.error(`Error executing tool ${toolName}:`, error);
    
    if (error instanceof McpError) {
      throw error;
    }
    
    return {
      content: [{
        type: "text",
        text: `Error: ${error.message || "Unknown error occurred"}`
      }],
      isError: true
    };
  }
});

/**
 * Start the server using stdio transport.
 * This allows the server to communicate via standard input/output streams.
 */
async function main() {
  try {
    // Check if required tools are available
    const toolsAvailable = {
      bbot: await isToolAvailable("bbot"),
      nmap: await isToolAvailable("nmap"),
      msfvenom: await isToolAvailable("msfvenom"),
      msfconsole: await isToolAvailable("msfconsole")
    };
    
    console.error("Security tools availability:");
    console.error(`- BBOT: ${toolsAvailable.bbot ? "Available" : "Not available"}`);
    console.error(`- Nmap: ${toolsAvailable.nmap ? "Available" : "Not available"}`);
    console.error(`- MSFVenom: ${toolsAvailable.msfvenom ? "Available" : "Not available"}`);
    console.error(`- MSFConsole: ${toolsAvailable.msfconsole ? "Available" : "Not available"}`);
    
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Security Tools MCP server running on stdio");
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
