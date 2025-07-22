"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { FaLinkedin, FaGithub, FaBehance, FaChevronLeft, FaChevronRight, FaCog } from "react-icons/fa";

export default function Home() {
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);

  // Interactive terminal state
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalOutput, setTerminalOutput] = useState<string[]>(["Type 'help' for available commands", ""]);
  const [currentPath, setCurrentPath] = useState("/home/rojasmart");
  const [isTerminalExpanded, setIsTerminalExpanded] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalOutputRef = useRef<HTMLDivElement>(null);

  // Terminal Configuration State
  const [terminalConfig, setTerminalConfig] = useState({
    theme: "matrix", // matrix, classic, modern
    tableStyle: "simple", // simple, bordered, ascii
    fontSize: "sm", // xs, sm, base, lg
    showIcons: true,
    animations: true,
  });

  // Theme configurations
  const themes = {
    matrix: {
      bg: "bg-black",
      primary: "text-green-400",
      secondary: "text-cyan-400",
      accent: "text-yellow-400",
      text: "text-gray-300",
      border: "border-green-600",
      name: "Matrix",
    },
    classic: {
      bg: "bg-gray-900",
      primary: "text-white",
      secondary: "text-blue-400",
      accent: "text-yellow-300",
      text: "text-gray-200",
      border: "border-gray-500",
      name: "Classic",
    },
    modern: {
      bg: "bg-slate-900",
      primary: "text-emerald-400",
      secondary: "text-purple-400",
      accent: "text-orange-400",
      text: "text-slate-200",
      border: "border-emerald-500",
      name: "Modern",
    },
  };

  const currentTheme = themes[terminalConfig.theme as keyof typeof themes];

  // Add config commands to the existing commands object
  const commands = {
    help: () => "Available commands: ls, cd, cat, pwd, clear, tree, whoami, config, theme, font",
    config: (args?: string[]) => {
      if (!args || args.length === 0) {
        return `Current configuration:
Theme: ${currentTheme.name}
Table Style: ${terminalConfig.tableStyle}
Font Size: ${terminalConfig.fontSize}
Show Icons: ${terminalConfig.showIcons}
Animations: ${terminalConfig.animations}

Use: config <option> <value>
Options: theme, table, font, icons, animations`;
      }

      const [option, value] = args;

      switch (option) {
        case "theme":
          if (["matrix", "classic", "modern"].includes(value)) {
            setTerminalConfig((prev) => ({ ...prev, theme: value }));
            return `Theme changed to: ${themes[value as keyof typeof themes].name}`;
          }
          return "Available themes: matrix, classic, modern";

        case "table":
          if (["simple", "bordered", "ascii"].includes(value)) {
            setTerminalConfig((prev) => ({ ...prev, tableStyle: value }));
            return `Table style changed to: ${value}`;
          }
          return "Available table styles: simple, bordered, ascii";

        case "font":
          if (["xs", "sm", "base", "lg"].includes(value)) {
            setTerminalConfig((prev) => ({ ...prev, fontSize: value }));
            return `Font size changed to: ${value}`;
          }
          return "Available font sizes: xs, sm, base, lg";

        case "icons":
          if (["true", "false"].includes(value)) {
            setTerminalConfig((prev) => ({ ...prev, showIcons: value === "true" }));
            return `Icons ${value === "true" ? "enabled" : "disabled"}`;
          }
          return "Use: config icons true|false";

        default:
          return "Unknown option. Type 'config' for help.";
      }
    },
    theme: (args?: string[]) => {
      if (!args || args.length === 0) {
        return `Current theme: ${currentTheme.name}
Available themes: matrix, classic, modern
Usage: theme <theme-name>`;
      }
      return commands.config(["theme", args[0]]);
    },
    font: (args?: string[]) => {
      if (!args || args.length === 0) {
        return `Current font size: ${terminalConfig.fontSize}
Available sizes: xs, sm, base, lg
Usage: font <size>`;
      }
      return commands.config(["font", args[0]]);
    },
    ls: (args?: string[]) => {
      const path = args && args.length > 0 ? args[0] : currentPath;
      const dir = getFileSystemItem(path);

      if (!dir || dir.type !== "directory") {
        return `ls: cannot access '${path}': No such file or directory`;
      }

      return Object.keys(dir.children)
        .map((name) => {
          const item = dir.children[name];
          const prefix = item.type === "directory" ? "drwxr-xr-x" : "-rw-r--r--";
          const size = item.type === "directory" ? "4096" : "1024";
          return `${prefix}  1 rojasmart rojasmart  ${size} Jul 22 2025 ${name}${item.type === "directory" ? "/" : ""}`;
        })
        .join("\n");
    },
    cd: (args?: string[]) => {
      if (!args || args.length === 0) {
        setCurrentPath("/home/rojasmart");
        return "";
      }

      const targetPath = resolvePath(currentPath, args[0]);
      const dir = getFileSystemItem(targetPath);

      if (!dir) {
        return `cd: no such file or directory: ${args[0]}`;
      }

      if (dir.type !== "directory") {
        return `cd: not a directory: ${args[0]}`;
      }

      setCurrentPath(targetPath);
      return "";
    },
    cat: (args?: string[]) => {
      if (!args || args.length === 0) {
        return "cat: missing file operand";
      }

      const filePath = resolvePath(currentPath, args[0]);
      const file = getFileSystemItem(filePath);

      if (!file) {
        return `cat: ${args[0]}: No such file or directory`;
      }

      if (file.type === "directory") {
        return `cat: ${args[0]}: Is a directory`;
      }

      return file.content;
    },
    pwd: () => currentPath,
    clear: () => {
      setTerminalOutput(["Interactive Terminal - rojasmart.dev", "Type 'help' for available commands", ""]);
      return "";
    },
    tree: () => {
      const buildTree = (path: string, prefix: string = ""): string => {
        const item = getFileSystemItem(path);
        if (!item || item.type !== "directory") return "";

        const children = Object.keys(item.children);
        return children
          .map((name, index) => {
            const isLast = index === children.length - 1;
            const child = item.children[name];
            const connector = isLast ? "└── " : "├── ";
            const result = prefix + connector + name + (child.type === "directory" ? "/" : "");

            if (child.type === "directory") {
              const childPrefix = prefix + (isLast ? "    " : "│   ");
              return result + "\n" + buildTree(path + "/" + name, childPrefix);
            }

            return result;
          })
          .join("\n");
      };

      return currentPath + "\n" + buildTree(currentPath);
    },
    whoami: () => "rojasmart",
  };

  // ...existing file system and other functions...

  const terminalContent = [
    "$ cd /home/rojasmart",
    "$ ls -la",
    "drwxr-xr-x  2 rojasmart rojasmart  4096 Jul 22 2025 .",
    "drwxr-xr-x  3 root      root       4096 Jul 22 2025 ..",
    "-rw-r--r--  1 rojasmart rojasmart   220 Jul 22 2025 .bash_logout",
    "-rw-r--r--  1 rojasmart rojasmart  3771 Jul 22 2025 .bashrc",
    "-rw-r--r--  1 rojasmart rojasmart   807 Jul 22 2025 .profile",
    "-rw-r--r--  1 rojasmart rojasmart  1024 Jul 22 2025 about.txt",
    "-rw-r--r--  1 rojasmart rojasmart  2048 Jul 22 2025 skills.txt",
    "drwxr-xr-x  2 rojasmart rojasmart  4096 Jul 22 2025 projects/",
    "",
    "$ cat about.txt",
    "=====================================",
    "       Welcome to rojasmart.dev      ",
    "=====================================",
    "Full-stack Developer & Designer",
    "Specialized in modern web technologies",
    "Building user-centered digital products",
    "",
  ];

  // File system structure
  const fileSystem: any = {
    "/home/rojasmart": {
      type: "directory",
      children: {
        "about.txt": {
          type: "file",
          content: "Full-stack Developer & Designer\nSpecialized in modern web technologies\nBuilding user-centered digital products",
        },
        "skills.txt": {
          type: "file",
          content:
            "Development: Next.js, React, TypeScript, JavaScript\nCMS: WordPress, Strapi, Contentful\nDesign: Figma, Adobe CC, Sketch\nAdmin: Linux, Docker, AWS, Git",
        },
        projects: {
          type: "directory",
          children: {
            "web-development": {
              type: "directory",
              children: {
                "nextjs-app.md": { type: "file", content: "Modern Next.js applications with TypeScript" },
                "react-components.md": { type: "file", content: "Reusable React component library" },
              },
            },
            "ui-ux-design": {
              type: "directory",
              children: {
                "figma-designs.md": { type: "file", content: "User interface designs in Figma" },
                "user-research.md": { type: "file", content: "User experience research and testing" },
              },
            },
          },
        },
        "contact.txt": {
          type: "file",
          content: "Email: rogeriosvaldo@gmail.com\nLinkedIn: /in/your-profile\nGitHub: /your-profile",
        },
      },
    },
  };

  const getFileSystemItem = (path: string) => {
    const parts = path.split("/").filter((p) => p);
    let current = fileSystem["/home/rojasmart"];

    for (const part of parts.slice(2)) {
      if (!current || !current.children || !current.children[part]) {
        return null;
      }
      current = current.children[part];
    }

    return current;
  };

  const resolvePath = (currentPath: string, targetPath: string): string => {
    if (targetPath.startsWith("/")) {
      return targetPath;
    }

    if (targetPath === "..") {
      const parts = currentPath.split("/").filter((p) => p);
      if (parts.length > 2) {
        return "/" + parts.slice(0, -1).join("/");
      }
      return currentPath;
    }

    if (targetPath === ".") {
      return currentPath;
    }

    return currentPath + "/" + targetPath;
  };

  const handleTerminalCommand = (cmd: string) => {
    const [command, ...args] = cmd.trim().split(" ");
    let response = "";

    if (commands[command as keyof typeof commands]) {
      response = commands[command as keyof typeof commands](args);
    } else if (command) {
      response = `${command}: command not found`;
    }

    setTerminalOutput((prev) => [...prev, `${currentPath}$ ${cmd}`, response, ""]);
  };

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (terminalInput.trim()) {
      handleTerminalCommand(terminalInput);
      setTerminalInput("");
    }
  };

  // Render skills table based on style
  const renderSkillsTable = () => {
    const skills = [
      ["Next.js", "WordPress", "Figma", "Linux"],
      ["React", "Strapi", "Adobe CC", "Docker"],
      ["TypeScript", "Contentful", "Sketch", "AWS"],
      ["Node.js", "Sanity", "Photoshop", "Git"],
      ["JavaScript", "Prismic", "Illustrator", "Nginx"],
    ];

    const headers = ["Development", "CMS Platform", "Design", "Admin"];

    if (terminalConfig.tableStyle === "ascii") {
      return (
        <div className={`font-mono text-${terminalConfig.fontSize} ${currentTheme.text} my-6`}>
          <div>┌─────────────┬─────────────┬─────────────┬─────────────┐</div>
          <div>
            │ <span className={currentTheme.secondary}>Development</span> │ <span className={currentTheme.secondary}>CMS Platform</span> │{" "}
            <span className={currentTheme.secondary}>Design</span> │ <span className={currentTheme.secondary}>Admin</span> │
          </div>
          <div>├─────────────┼─────────────┼─────────────┼─────────────┤</div>
          {skills.map((row, index) => (
            <div key={index}>
              │{" "}
              {row.map((skill, i) => (
                <span key={i}>
                  {skill.padEnd(11)} {i < row.length - 1 ? "│ " : ""}
                </span>
              ))}
              │
            </div>
          ))}
          <div>└─────────────┴─────────────┴─────────────┴─────────────┘</div>
        </div>
      );
    }

    if (terminalConfig.tableStyle === "bordered") {
      return (
        <div className={`${currentTheme.border} border rounded bg-gray-900 bg-opacity-50 p-4 mb-8`}>
          <div className="grid grid-cols-4 gap-4">
            {headers.map((header) => (
              <div key={header} className={`${currentTheme.secondary} font-bold ${currentTheme.border} border-b pb-2`}>
                {header}
              </div>
            ))}
            {skills.flat().map((skill, index) => (
              <div key={index} className={`${currentTheme.text} py-1`}>
                {skill}
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Simple style
    return (
      <div className={`font-mono text-${terminalConfig.fontSize} ${currentTheme.text} my-6 space-y-1`}>
        <div className={`${currentTheme.secondary} font-bold mb-2`}>{headers.join("    ")}</div>
        {skills.map((row, index) => (
          <div key={index}>{row.join("    ")}</div>
        ))}
      </div>
    );
  };

  // ...existing useEffect hooks...

  // Terminal typing effect
  useEffect(() => {
    const typeNextLine = () => {
      if (currentLineIndex < terminalContent.length) {
        const line = terminalContent[currentLineIndex];
        let charIndex = 0;
        let currentLine = "";

        const typeChar = () => {
          if (charIndex < line.length) {
            currentLine += line[charIndex];
            setTerminalLines((prev) => {
              const newLines = [...prev];
              newLines[currentLineIndex] = currentLine;
              return newLines;
            });
            charIndex++;
            setTimeout(typeChar, terminalConfig.animations ? 30 : 0);
          } else {
            setTimeout(
              () => {
                setCurrentLineIndex((prev) => prev + 1);
              },
              terminalConfig.animations ? 500 : 100
            );
          }
        };

        setTerminalLines((prev) => [...prev, ""]);
        typeChar();
      }
    };

    const timer = setTimeout(typeNextLine, terminalConfig.animations ? 100 : 50);
    return () => clearTimeout(timer);
  }, [currentLineIndex, terminalContent, terminalConfig.animations]);

  // Auto-scroll terminal output to bottom
  useEffect(() => {
    if (terminalOutputRef.current) {
      terminalOutputRef.current.scrollTop = terminalOutputRef.current.scrollHeight;
    }
  }, [terminalOutput]);

  // Focus terminal input when expanded
  useEffect(() => {
    if (inputRef.current && isTerminalExpanded) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isTerminalExpanded]);

  return (
    <div className={`min-h-screen ${currentTheme.bg} ${currentTheme.primary} font-mono overflow-hidden`}>
      {/* Terminal Window */}
      <div className="h-screen flex flex-col">
        {/* Terminal Header */}
        <div className="flex items-center justify-between bg-gray-800 px-4 py-2 border-b border-gray-600">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="text-gray-400 hover:text-green-400 transition-colors p-1"
              title="Terminal Settings"
            >
              <FaCog size={14} />
            </button>
          </div>
          <div className="text-gray-400 text-sm">rojasmart@dev:~ [{currentTheme.name}]</div>
          <div className="flex space-x-4 text-gray-400">
            <Link href="#blog" className={`hover:${currentTheme.primary} transition-colors`}>
              ./blog
            </Link>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="bg-gray-800 border-b border-gray-600 p-4">
            <div className={`${currentTheme.secondary} font-bold mb-3`}>Terminal Configuration</div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
              <div>
                <label className="text-gray-400 block mb-1">Theme</label>
                <select
                  value={terminalConfig.theme}
                  onChange={(e) => setTerminalConfig((prev) => ({ ...prev, theme: e.target.value }))}
                  className="bg-gray-700 text-white p-1 rounded text-xs w-full"
                >
                  <option value="matrix">Matrix</option>
                  <option value="classic">Classic</option>
                  <option value="modern">Modern</option>
                </select>
              </div>
              <div>
                <label className="text-gray-400 block mb-1">Table Style</label>
                <select
                  value={terminalConfig.tableStyle}
                  onChange={(e) => setTerminalConfig((prev) => ({ ...prev, tableStyle: e.target.value }))}
                  className="bg-gray-700 text-white p-1 rounded text-xs w-full"
                >
                  <option value="simple">Simple</option>
                  <option value="bordered">Bordered</option>
                  <option value="ascii">ASCII</option>
                </select>
              </div>
              <div>
                <label className="text-gray-400 block mb-1">Font Size</label>
                <select
                  value={terminalConfig.fontSize}
                  onChange={(e) => setTerminalConfig((prev) => ({ ...prev, fontSize: e.target.value }))}
                  className="bg-gray-700 text-white p-1 rounded text-xs w-full"
                >
                  <option value="xs">Extra Small</option>
                  <option value="sm">Small</option>
                  <option value="base">Medium</option>
                  <option value="lg">Large</option>
                </select>
              </div>
              <div>
                <label className="text-gray-400 block mb-1">Icons</label>
                <select
                  value={terminalConfig.showIcons.toString()}
                  onChange={(e) => setTerminalConfig((prev) => ({ ...prev, showIcons: e.target.value === "true" }))}
                  className="bg-gray-700 text-white p-1 rounded text-xs w-full"
                >
                  <option value="true">Show</option>
                  <option value="false">Hide</option>
                </select>
              </div>
              <div>
                <label className="text-gray-400 block mb-1">Animations</label>
                <select
                  value={terminalConfig.animations.toString()}
                  onChange={(e) => setTerminalConfig((prev) => ({ ...prev, animations: e.target.value === "true" }))}
                  className="bg-gray-700 text-white p-1 rounded text-xs w-full"
                >
                  <option value="true">Enabled</option>
                  <option value="false">Disabled</option>
                </select>
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-400">
              Try commands: <span className={currentTheme.accent}>config theme matrix</span>, <span className={currentTheme.accent}>font lg</span>,{" "}
              <span className={currentTheme.accent}>config table ascii</span>
            </div>
          </div>
        )}

        {/* Terminal Content */}
        <div className="flex-1 flex min-h-0">
          {/* Main Terminal Content */}
          <div
            className={`${
              isTerminalExpanded ? "flex-1" : "flex-1"
            } p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-green-600 scrollbar-track-gray-800 transition-all duration-300`}
          >
            {/* Initial terminal lines */}
            <div className="mb-8">
              {terminalLines.map((line, index) => (
                <div key={index} className={`leading-relaxed text-${terminalConfig.fontSize}`}>
                  {line.startsWith("$") ? (
                    <span className={currentTheme.accent}>{line}</span>
                  ) : line.startsWith("drwx") || line.startsWith("-rw-") ? (
                    <span className="text-blue-400">{line}</span>
                  ) : line.includes("===") ? (
                    <span className={`${currentTheme.secondary} font-bold`}>{line}</span>
                  ) : (
                    <span>{line}</span>
                  )}
                </div>
              ))}
              {currentLineIndex >= terminalContent.length && (
                <span className={`${currentTheme.accent} ${terminalConfig.animations ? "animate-pulse" : ""}`}>$ </span>
              )}
            </div>

            {/* Hero Section */}
            {currentLineIndex >= terminalContent.length && (
              <div className="space-y-4">
                <div className={currentTheme.accent}>$ cat skills.txt</div>
                <div className={`${currentTheme.secondary} text-2xl font-bold mb-4`}>Professional Skills</div>

                {renderSkillsTable()}

                <div className={currentTheme.accent}>$ ls projects/</div>
                <div className="grid md:grid-cols-2 gap-6 my-8">
                  <div className={`${currentTheme.border} border rounded p-6 bg-gray-900 bg-opacity-50`}>
                    <div className={`${currentTheme.secondary} text-xl font-semibold mb-3`}>./web-development</div>
                    <div className={currentTheme.text}>Custom websites and web applications built with modern frameworks.</div>
                  </div>
                  <div className={`${currentTheme.border} border rounded p-6 bg-gray-900 bg-opacity-50`}>
                    <div className={`${currentTheme.secondary} text-xl font-semibold mb-3`}>./ui-ux-design</div>
                    <div className={currentTheme.text}>Beautiful and functional user interfaces that users love.</div>
                  </div>
                </div>

                <div className={currentTheme.accent}>$ cat contact.txt</div>
                <div className={`font-mono text-${terminalConfig.fontSize} ${currentTheme.text} my-6 space-y-2`}>
                  <div>Email: rogeriosvaldo@gmail.com</div>
                </div>

                <div className={currentTheme.accent}>$ echo "Send me an email"</div>
                <div className={`${currentTheme.text} mb-4`}>
                  <a href="mailto:rogeriosvaldo@gmail.com" className={`${currentTheme.primary} hover:text-green-300 underline font-mono`}>
                    mailto:rogeriosvaldo@gmail.com
                  </a>
                </div>

                <div className={currentTheme.accent}>$ ls social/</div>
                <div className={`space-y-1 my-6 font-mono text-${terminalConfig.fontSize} ${currentTheme.text}`}>
                  <div className="hover:text-blue-400 transition-colors cursor-pointer">
                    <a href="https://www.linkedin.com/in/your-profile" target="_blank" rel="noopener noreferrer">
                      -rw-r--r-- 1 rojasmart rojasmart 1024 Jul 22 2025 linkedin.url
                    </a>
                  </div>
                  <div className="hover:text-white transition-colors cursor-pointer">
                    <a href="https://github.com/your-profile" target="_blank" rel="noopener noreferrer">
                      -rw-r--r-- 1 rojasmart rojasmart 1024 Jul 22 2025 github.url
                    </a>
                  </div>
                  <div className="hover:text-blue-500 transition-colors cursor-pointer">
                    <a href="https://www.behance.net/your-profile" target="_blank" rel="noopener noreferrer">
                      -rw-r--r-- 1 rojasmart rojasmart 1024 Jul 22 2025 behance.url
                    </a>
                  </div>
                </div>

                <div className={`${currentTheme.accent} flex items-center`}>
                  $ <span className={`${terminalConfig.animations ? "animate-pulse" : ""} ml-2`}>_</span>
                </div>
              </div>
            )}
          </div>

          {/* Interactive Terminal Sidebar */}
          <div
            className={`${
              isTerminalExpanded ? "w-80" : "w-12"
            } border-l border-gray-600 bg-gray-900 transition-all duration-300 flex flex-col min-h-0`}
          >
            {/* Terminal Header with Toggle */}
            <div className="flex items-center justify-between bg-gray-800 px-4 py-2 border-b border-gray-600 flex-shrink-0">
              <div className={`${isTerminalExpanded ? "block" : "hidden"} text-gray-400 text-sm font-mono`}>Interactive Terminal</div>
              <button
                onClick={() => setIsTerminalExpanded(!isTerminalExpanded)}
                className={`text-gray-400 hover:${currentTheme.primary} transition-colors p-1`}
                title={isTerminalExpanded ? "Collapse terminal" : "Expand terminal"}
              >
                {isTerminalExpanded ? <FaChevronRight size={14} /> : <FaChevronLeft size={14} />}
              </button>
            </div>

            {/* Terminal Content - only show when expanded */}
            {isTerminalExpanded && (
              <div className="flex-1 flex flex-col min-h-0">
                <div ref={terminalOutputRef} className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-green-600 scrollbar-track-gray-800">
                  {terminalOutput.map((line, index) => (
                    <div
                      key={index}
                      className={`text-${terminalConfig.fontSize} leading-relaxed ${line.includes("$") ? currentTheme.primary : currentTheme.text}`}
                    >
                      {line}
                    </div>
                  ))}
                </div>

                <div className="p-4 border-t border-gray-600 flex-shrink-0">
                  <form onSubmit={handleTerminalSubmit} className={`flex items-center ${currentTheme.primary}`}>
                    <span className={`text-${terminalConfig.fontSize}`}>{currentPath}$ </span>
                    <input
                      ref={inputRef}
                      type="text"
                      value={terminalInput}
                      onChange={(e) => setTerminalInput(e.target.value)}
                      className={`bg-transparent outline-none flex-1 ml-2 ${currentTheme.primary} text-${terminalConfig.fontSize}`}
                      autoComplete="off"
                      placeholder="Enter command..."
                    />
                  </form>
                </div>
              </div>
            )}

            {/* Collapsed state - show terminal icon */}
            {!isTerminalExpanded && (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-gray-400 transform -rotate-90 text-xs whitespace-nowrap font-mono">TERMINAL</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
