import { readFileSync } from 'fs';
import { join } from 'path';

export class CommandHandler {
  private static getAsciiContent(filename: string): string {
    try {
      const filePath = join(process.cwd(), 'src/app/data/ascii', filename);
      return readFileSync(filePath, 'utf-8');
    } catch (error) {
      console.error(`Error reading ${filename}:`, error);
      return `Error: Could not read ${filename}`;
    }
  }

  static executeCommand(command: string): string | null {
    const cmd = command.trim().toLowerCase();
    
    switch (cmd) {
      case 'whoami':
        return this.getAsciiContent('whoami.txt') + '\nrojasmart@dev:$ ';
      
      case 'profile':
        return this.getAsciiContent('profile.txt') + '\nrojasmart@dev:$ ';
      
      case 'projects':
        return this.getAsciiContent('projects.txt') + '\nrojasmart@dev:$ ';
      
      case 'help':
        return this.getAsciiContent('help.txt') + '\nrojasmart@dev:$ ';
      
      default:
        return null; // Command not found
    }
  }

  static getAvailableCommands(): string[] {
    return ['whoami', 'profile', 'projects', 'help', 'clear'];
  }
}
