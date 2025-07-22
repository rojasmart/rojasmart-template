import { NextRequest, NextResponse } from 'next/server';
import { WebSocketServer } from 'ws';
import { spawn, ChildProcess } from 'child_process';
import * as http from 'http';
import { CommandHandler } from '../../data/commands/commandHandler';

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
      data: `Welcome to rojasmart.dev terminal! 🚀

Type 'whoami', 'profile', 'projects' or 'help' to get to know me.

rojasmart@dev:$ `,
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
          const command = data.trim().toLowerCase();
          
          // List of blocked commands for security
          const blockedCommands = [
            'rm', 'rmdir', 'del', 'delete', 'mv', 'move', 'cp', 'copy',
            'chmod', 'chown', 'sudo', 'su', 'passwd', 'useradd', 'userdel',
            'kill', 'killall', 'pkill', 'ps', 'top', 'htop', 'netstat',
            'ifconfig', 'ip', 'ping', 'wget', 'curl', 'ssh', 'scp', 'ftp',
            'mount', 'umount', 'fdisk', 'mkfs', 'fsck', 'dd', 'tar', 'zip',
            'unzip', 'gunzip', 'gzip', 'find', 'locate', 'which', 'whereis',
            'ls', 'dir', 'pwd', 'cd', 'mkdir', 'touch', 'cat', 'less', 'more',
            'head', 'tail', 'grep', 'awk', 'sed', 'sort', 'wc', 'diff',
            'history', 'alias', 'export', 'env', 'set', 'unset', 'source',
            'bash', 'sh', 'zsh', 'fish', 'cmd', 'powershell', 'python', 'node',
            'npm', 'yarn', 'git', 'docker', 'systemctl', 'service', 'crontab'
          ];

          // Check if command starts with any blocked command
          const isBlocked = blockedCommands.some(blocked => 
            command === blocked || command.startsWith(blocked + ' ')
          );

          if (isBlocked) {
            ws.send(JSON.stringify({
              type: 'output',
              data: `Command '${data.trim()}' is not allowed for security reasons.\nUse 'help' to see available commands.\nrojasmart@dev:$ `,
            }));
            return;
          }

          // Handle clear command
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

          // Try to execute command through handler
          const output = CommandHandler.executeCommand(data.trim());
          if (output) {
            ws.send(JSON.stringify({
              type: 'output',
              data: output,
            }));
            return;
          }

          // If we reach here, it's an unrecognized command
          ws.send(JSON.stringify({
            type: 'output',
            data: `Command '${data.trim()}' not found.\nUse 'help' to see available commands.\nrojasmart@dev:$ `,
          }));
          return;
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
