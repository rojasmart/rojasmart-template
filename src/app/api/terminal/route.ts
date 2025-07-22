import { NextRequest, NextResponse } from 'next/server';
import { WebSocketServer } from 'ws';
import { spawn, ChildProcess } from 'child_process';
import * as http from 'http';

// Global variables to store WebSocket server
let wss: WebSocketServer | null = null;
let server: http.Server | null = null;

interface TerminalSession {
  id: string;
  shell: ChildProcess;
  cwd: string;
}

const sessions = new Map<string, TerminalSession>();

function initializeWebSocketServer() {
  if (wss) return wss;

  // Create HTTP server for WebSocket
  server = http.createServer();
  wss = new WebSocketServer({ server });

  wss.on('connection', (ws, request) => {
    const sessionId = Math.random().toString(36).substring(7);
    console.log(`New terminal session: ${sessionId}`);

    // Initialize shell process
    const shell = spawn(process.platform === 'win32' ? 'cmd.exe' : 'bash', [], {
      cwd: process.cwd(),
      env: {
        ...process.env,
        TERM: 'xterm-256color',
        PS1: 'rojasmart@dev:$ ',
      },
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    const session: TerminalSession = {
      id: sessionId,
      shell,
      cwd: process.cwd(),
    };

    sessions.set(sessionId, session);

    // Send initial prompt
    ws.send(JSON.stringify({
      type: 'output',
      data: 'Terminal connected. Type commands to interact with the system.\nrojasmart@dev:$ ',
    }));

    // Handle shell output
    shell.stdout?.on('data', (data) => {
      ws.send(JSON.stringify({
        type: 'output',
        data: data.toString(),
      }));
    });

    shell.stderr?.on('data', (data) => {
      ws.send(JSON.stringify({
        type: 'error',
        data: data.toString(),
      }));
    });

    // Handle shell exit
    shell.on('close', (code) => {
      ws.send(JSON.stringify({
        type: 'output',
        data: `\nProcess exited with code ${code}\n`,
      }));
      sessions.delete(sessionId);
    });

    // Handle WebSocket messages (commands from client)
    ws.on('message', (message) => {
      try {
        const { type, data } = JSON.parse(message.toString());
        
        if (type === 'command' && session.shell.stdin) {
          // Special handling for certain commands
          if (data.trim() === 'clear') {
            ws.send(JSON.stringify({
              type: 'clear',
              data: '',
            }));
            ws.send(JSON.stringify({
              type: 'output',
              data: 'rojasmart@dev:$ ',
            }));
            return;
          }

          // Handle profile command
          if (data.trim() === 'profile') {
            const profileOutput = `
╔══════════════════════════════════════════════════════════════════════════════════════╗
║                                  ROJASMART PROFILE                                   ║
╠══════════════════════════════════════════════════════════════════════════════════════╣
║ DEVELOPMENT          │ DESIGN               │ ADMIN/DEVOPS        │ CMS PLATFORMS    ║
╠══════════════════════════════════════════════════════════════════════════════════════╣
║ • React/Next.js      │ • UI/UX Design       │ • Linux Server       │ • WordPress      ║
║ • TypeScript         │ • Figma/Adobe XD     │ • Docker             │ • Drupal         ║
║ • Node.js            │ • Responsive Design  │ • AWS/Cloud          │ • Strapi         ║
║ • Python             │ • Design Systems     │ • CI/CD Pipelines    │ • Contentful     ║
║ • JavaScript (ES6+)  │ • Prototyping        │ • Database Admin     │ • Sanity         ║
║ • HTML5/CSS3         │ • Brand Identity     │ • Nginx/Apache       │ • Ghost          ║
║ • Tailwind CSS       │ • Web Animation      │ • Git/Version Ctrl   │ • Netlify CMS    ║
║ • APIs/REST          │ • Mobile Design      │ • Server Security    │ • Forestry       ║
╚══════════════════════════════════════════════════════════════════════════════════════╝

📧 Contact: rogeriosvaldo@gmail.com
🌐 Location: Available for remote work worldwide
💼 Status: Open for freelance projects and collaborations

Type 'help' to see available commands
rojasmart@dev:$ `;
            
            ws.send(JSON.stringify({
              type: 'output',
              data: profileOutput,
            }));
            return;
          }

          // Handle whoami command
          if (data.trim() === 'whoami') {
            const whoamiOutput = `
╔══════════════════════════════════════════════════════════════════╗
║                         ROJASMART IDENTITY                       ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║    ██████╗  ██████╗      ██╗ █████╗ ███████╗███╗   ███╗ █████╗   ║
║    ██╔══██╗██╔═══██╗     ██║██╔══██╗██╔════╝████╗ ████║██╔══██╗  ║
║    ██████╔╝██║   ██║     ██║███████║███████╗██╔████╔██║███████║  ║
║    ██╔══██╗██║   ██║██   ██║██╔══██║╚════██║██║╚██╔╝██║██╔══██║  ║
║    ██║  ██║╚██████╔╝╚█████╔╝██║  ██║███████║██║ ╚═╝ ██║██║  ██║  ║
║    ╚═╝  ╚═╝ ╚═════╝  ╚════╝ ╚═╝  ╚═╝╚══════╝╚═╝     ╚═╝╚═╝  ╚═╝  ║
║                                                                  ║
║                    Full-stack Developer & Designer               ║
║                 Specialized in modern web technologies           ║
║                Building user-centered digital products           ║
║                                                                  ║
║    ⚡ Creating innovative solutions that bridge design & code     ║
║    🎨 Turning complex ideas into beautiful, functional products  ║
║    🚀 Passionate about user experience and clean architecture    ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
rojasmart@dev:$ `;
            
            ws.send(JSON.stringify({
              type: 'output',
              data: whoamiOutput,
            }));
            return;
          }

          // Handle projects command
          if (data.trim() === 'projects') {
            const projectsOutput = `
╔══════════════════════════════════════════════════════════════════════════════════════╗
║                                 GITHUB PROJECTS                                      ║
╠══════════════════════════════════════════════════════════════════════════════════════╣
║                                                                                      ║
║  🚀 Featured Repositories:                                                           ║
║                                                                                      ║
║  📁 rojasmart.dev                                                                    ║
║     ├── Terminal-style portfolio website built with Next.js & TypeScript            ║
║     ├── Real-time WebSocket terminal integration                                     ║
║     └── 🔗 https://github.com/rojasmart/rojasmart.dev                               ║
║                                                                                      ║
║  📁 next-dashboard                                                                   ║
║     ├── Modern admin dashboard with Next.js 14 App Router                           ║
║     ├── TailwindCSS, Prisma, PostgreSQL integration                                 ║
║     └── 🔗 https://github.com/rojasmart/next-dashboard                              ║
║                                                                                      ║
║  📁 ecommerce-platform                                                              ║
║     ├── Full-stack e-commerce solution with React & Node.js                        ║
║     ├── Stripe integration, JWT auth, MongoDB                                       ║
║     └── 🔗 https://github.com/rojasmart/ecommerce-platform                         ║
║                                                                                      ║
║  📁 design-system                                                                   ║
║     ├── Reusable React component library with Storybook                            ║
║     ├── TypeScript, CSS-in-JS, automated testing                                    ║
║     └── 🔗 https://github.com/rojasmart/design-system                              ║
║                                                                                      ║
║  📁 wordpress-themes                                                                ║
║     ├── Collection of custom WordPress themes & plugins                            ║
║     ├── Modern PHP, Gutenberg blocks, REST API                                      ║
║     └── 🔗 https://github.com/rojasmart/wordpress-themes                           ║
║                                                                                      ║
║  📁 python-automation                                                               ║
║     ├── Web scraping and automation scripts                                         ║
║     ├── Beautiful Soup, Selenium, pandas integration                               ║
║     └── 🔗 https://github.com/rojasmart/python-automation                          ║
║                                                                                      ║
║  🌟 Total Public Repositories: 25+                                                  ║
║  📊 Languages: TypeScript, JavaScript, Python, PHP, CSS                            ║
║  🔧 Main Profile: https://github.com/rojasmart                                      ║
║                                                                                      ║
║  💡 Want to collaborate? Fork any repo and submit a PR!                            ║
║                                                                                      ║
╚══════════════════════════════════════════════════════════════════════════════════════╝
rojasmart@dev:$ `;
            
            ws.send(JSON.stringify({
              type: 'output',
              data: projectsOutput,
            }));
            return;
          }

          // Handle help command
          if (data.trim() === 'help') {
            const helpOutput = `
Available commands:
  profile    - Show detailed skills and expertise table
  whoami     - Show developer identity and specialization
  projects   - Display GitHub repositories and project links
  ls         - List directory contents
  pwd        - Show current directory
  clear      - Clear terminal screen
  node -v    - Show Node.js version
  npm -v     - Show npm version
  
Standard bash commands are also available.
rojasmart@dev:$ `;
            
            ws.send(JSON.stringify({
              type: 'output',
              data: helpOutput,
            }));
            return;
          }

          // Send command to shell
          session.shell.stdin.write(data + '\n');
        } else if (type === 'resize') {
          // Handle terminal resize
          if (session.shell.pid) {
            process.kill(session.shell.pid, 'SIGWINCH');
          }
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    // Handle WebSocket close
    ws.on('close', () => {
      console.log(`Terminal session closed: ${sessionId}`);
      if (session.shell.pid) {
        session.shell.kill();
      }
      sessions.delete(sessionId);
    });

    // Handle WebSocket errors
    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      if (session.shell.pid) {
        session.shell.kill();
      }
      sessions.delete(sessionId);
    });
  });

  // Start the server
  const PORT = 3001;
  server.listen(PORT, () => {
    console.log(`WebSocket server running on port ${PORT}`);
  });

  return wss;
}

export async function GET() {
  try {
    initializeWebSocketServer();
    return NextResponse.json({ 
      status: 'WebSocket server initialized',
      port: 3001,
      endpoint: 'ws://localhost:3001'
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to initialize WebSocket server' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { command } = await request.json();
    
    // For simple command execution without persistent session
    return new Promise((resolve) => {
      const child = spawn('bash', ['-c', command], {
        cwd: process.cwd(),
        env: process.env,
      });

      let output = '';
      let error = '';

      child.stdout?.on('data', (data) => {
        output += data.toString();
      });

      child.stderr?.on('data', (data) => {
        error += data.toString();
      });

      child.on('close', (code) => {
        resolve(NextResponse.json({
          output,
          error,
          exitCode: code,
        }));
      });

      child.on('error', (err) => {
        resolve(NextResponse.json(
          { error: err.message },
          { status: 500 }
        ));
      });
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
}
