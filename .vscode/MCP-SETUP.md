# MCP (Model Context Protocol) Setup

This workspace has Playwright MCP server configured for web browsing and research capabilities.

## What is MCP?

Model Context Protocol (MCP) allows GitHub Copilot to interact with external tools and services. The Playwright MCP server enables Copilot to:

- 🌐 Browse web pages and extract content
- 🔍 Search Google for documentation
- 📄 Navigate through links and gather information
- 📊 Extract structured data from websites

## Configuration

The Playwright MCP server is configured in `.vscode/settings.json`:

```json
"github.copilot.chat.mcp.servers": {
  "playwright": {
    "command": "npx",
    "args": ["@playwright/mcp@latest"]
  }
}
```

## Usage in Chat Modes

Your **Beast Mode 3.1** chat mode (`vscode-userdata:/User/prompts/beastmode.chatmode.md`) is configured to use Playwright for web research.

When you use Beast Mode, Copilot can automatically:
- Fetch URLs you provide
- Search Google for package documentation
- Browse documentation sites
- Follow links to gather comprehensive information

## How to Use

1. **Activate Beast Mode**: Select your chat mode in the Copilot chat
2. **Provide a task**: Ask Copilot to research something
3. **Let it work**: Copilot will use Playwright to browse the web autonomously

### Example Prompts:

```
Search Google for the latest Supabase React Native best practices
```

```
Browse the Expo Router documentation and find examples of nested layouts
```

```
Research how to implement push notifications with Expo and Supabase
```

## MCP Server Lifecycle

- **Auto-start**: Configured with `"chat.mcp.autoStart": "newAndOutdated"`
- **First use**: The MCP server will download and start automatically on first use
- **Updates**: Will automatically use `@latest` version via npx

## Troubleshooting

If the Playwright MCP server isn't working:

1. Check VS Code Output panel → "MCP Servers" for errors
2. Ensure you have Node.js installed (required for npx)
3. Restart VS Code to reinitialize MCP servers
4. Check network connectivity (MCP downloads packages on demand)

## Security

- MCP servers run with the same permissions as VS Code
- The Playwright MCP server can browse any public website
- Be cautious when browsing untrusted sites
- MCP access is set to "all" in settings (can be restricted if needed)

## Learn More

- [MCP Documentation](https://modelcontextprotocol.io/)
- [Playwright MCP](https://github.com/microsoft/playwright-mcp)
- [VS Code Copilot MCP Guide](https://code.visualstudio.com/docs/copilot/copilot-mcp)
