"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { FaLinkedin, FaGithub, FaBehance, FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function Home() {
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);

  // Interactive terminal state
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalOutput, setTerminalOutput] = useState<string[]>(["Interactive Terminal - rojasmart.dev", "Type 'help' for available commands", ""]);
  const [currentPath, setCurrentPath] = useState("/home/rojasmart");
  const [isTerminalExpanded, setIsTerminalExpanded] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  // ...existing code for terminalContent, fileSystem, commands, etc...

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
    "$ echo 'Ready for new challenges...'",
    "Ready for new challenges...",
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

  const commands = {
    help: () => "Available commands: ls, cd, cat, pwd, clear, tree, whoami",
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
      setTerminalOutput([]);
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

  const getFileSystemItem = (path: string) => {
    const parts = path.split("/").filter((p) => p);
    let current = fileSystem["/home/rojasmart"];

    for (const part of parts.slice(2)) {
      // Skip 'home' and 'rojasmart'
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
        // Don't go above /home/rojasmart
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

  // Terminal typing effect (existing)
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
            setTimeout(typeChar, 30);
          } else {
            setTimeout(() => {
              setCurrentLineIndex((prev) => prev + 1);
            }, 500);
          }
        };

        setTerminalLines((prev) => [...prev, ""]);
        typeChar();
      }
    };

    const timer = setTimeout(typeNextLine, 100);
    return () => clearTimeout(timer);
  }, [currentLineIndex, terminalContent]);

  // Focus terminal input when expanded
  useEffect(() => {
    if (inputRef.current && isTerminalExpanded) {
      inputRef.current.focus();
    }
  }, [isTerminalExpanded]);

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono overflow-hidden">
      {/* Terminal Window */}
      <div className="h-screen flex flex-col">
        {/* Terminal Header */}
        <div className="flex items-center justify-between bg-gray-800 px-4 py-2 border-b border-gray-600">
          <div className="flex items-center">{/* Empty div to maintain layout */}</div>
          <div className="text-gray-400 text-sm">rojasmart@dev:~</div>
          <div className="flex space-x-4 text-gray-400">
            <Link href="#blog" className="hover:text-green-400 transition-colors">
              ./blog
            </Link>
          </div>
        </div>

        {/* Terminal Content */}
        <div className="flex-1 flex">
          {/* Main Terminal Content */}
          <div
            className={`${
              isTerminalExpanded ? "flex-1" : "w-full"
            } p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-green-600 scrollbar-track-gray-800 transition-all duration-300`}
          >
            {/* Initial terminal lines */}
            <div className="mb-8">
              {terminalLines.map((line, index) => (
                <div key={index} className="leading-relaxed">
                  {line.startsWith("$") ? (
                    <span className="text-yellow-400">{line}</span>
                  ) : line.startsWith("drwx") || line.startsWith("-rw-") ? (
                    <span className="text-blue-400">{line}</span>
                  ) : line.includes("===") ? (
                    <span className="text-cyan-400 font-bold">{line}</span>
                  ) : (
                    <span>{line}</span>
                  )}
                </div>
              ))}
              {currentLineIndex >= terminalContent.length && <span className="animate-pulse text-yellow-400">$ </span>}
            </div>

            {/* Hero Section */}
            {currentLineIndex >= terminalContent.length && (
              <div className="space-y-4">
                <div className="text-yellow-400">$ cat skills.txt</div>
                <div className="text-cyan-400 text-2xl font-bold mb-4">Professional Skills</div>
                <div className="border border-green-600 rounded bg-gray-900 bg-opacity-50 p-4 mb-8">
                  <div className="grid grid-cols-4 gap-4">
                    {/* Header */}
                    <div className="text-cyan-400 font-bold border-b border-green-600 pb-2">Development</div>
                    <div className="text-cyan-400 font-bold border-b border-green-600 pb-2">CMS Platform</div>
                    <div className="text-cyan-400 font-bold border-b border-green-600 pb-2">Design</div>
                    <div className="text-cyan-400 font-bold border-b border-green-600 pb-2">Admin</div>

                    {/* Rows */}
                    <div className="text-gray-300 py-1">Next.js</div>
                    <div className="text-gray-300 py-1">WordPress</div>
                    <div className="text-gray-300 py-1">Figma</div>
                    <div className="text-gray-300 py-1">Linux</div>

                    <div className="text-gray-300 py-1">React</div>
                    <div className="text-gray-300 py-1">Strapi</div>
                    <div className="text-gray-300 py-1">Adobe CC</div>
                    <div className="text-gray-300 py-1">Docker</div>

                    <div className="text-gray-300 py-1">TypeScript</div>
                    <div className="text-gray-300 py-1">Contentful</div>
                    <div className="text-gray-300 py-1">Sketch</div>
                    <div className="text-gray-300 py-1">AWS</div>

                    <div className="text-gray-300 py-1">Node.js</div>
                    <div className="text-gray-300 py-1">Sanity</div>
                    <div className="text-gray-300 py-1">Photoshop</div>
                    <div className="text-gray-300 py-1">Git</div>

                    <div className="text-gray-300 py-1">JavaScript</div>
                    <div className="text-gray-300 py-1">Prismic</div>
                    <div className="text-gray-300 py-1">Illustrator</div>
                    <div className="text-gray-300 py-1">Nginx</div>
                  </div>
                </div>

                <div className="text-yellow-400">$ ls projects/</div>
                <div className="grid md:grid-cols-2 gap-6 my-8">
                  <div className="border border-green-600 rounded p-6 bg-gray-900 bg-opacity-50">
                    <div className="text-cyan-400 text-xl font-semibold mb-3">./web-development</div>
                    <div className="text-gray-300">Custom websites and web applications built with modern frameworks.</div>
                  </div>
                  <div className="border border-green-600 rounded p-6 bg-gray-900 bg-opacity-50">
                    <div className="text-cyan-400 text-xl font-semibold mb-3">./ui-ux-design</div>
                    <div className="text-gray-300">Beautiful and functional user interfaces that users love.</div>
                  </div>
                </div>

                <div className="text-yellow-400">$ cat contact.txt</div>
                <div className="bg-gray-900 bg-opacity-50 p-6 rounded border border-green-600 my-8">
                  <div className="text-cyan-400 text-2xl font-bold mb-4">&gt; Wanna get in touch?</div>
                  <div className="text-gray-300 mb-6">I am always available for exciting discussions and ideas.</div>
                  <Link href="mailto:rogeriosvaldo@gmail.com" className="text-green-400 hover:text-green-300 underline">
                    rogeriosvaldo@gmail.com
                  </Link>
                </div>

                <div className="text-yellow-400">$ ls social/</div>
                <div className="flex space-x-6 my-6">
                  <a
                    href="https://www.linkedin.com/in/your-profile"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <FaLinkedin size={24} />
                  </a>
                  <a
                    href="https://github.com/your-profile"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-gray-300 transition-colors"
                  >
                    <FaGithub size={24} />
                  </a>
                  <a
                    href="https://www.behance.net/your-profile"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-400 transition-colors"
                  >
                    <FaBehance size={24} />
                  </a>
                </div>

                <div className="text-yellow-400 flex items-center">
                  $ <span className="animate-pulse ml-2">_</span>
                </div>
              </div>
            )}
          </div>

          {/* Interactive Terminal Sidebar */}
          <div className={`${isTerminalExpanded ? "w-80" : "w-12"} border-l border-gray-600 bg-gray-900 transition-all duration-300 flex flex-col`}>
            {/* Terminal Header with Toggle */}
            <div className="flex items-center justify-between bg-gray-800 px-4 py-2 border-b border-gray-600">
              <div className={`${isTerminalExpanded ? "block" : "hidden"} text-gray-400 text-sm font-mono`}>Interactive Terminal</div>
              <button
                onClick={() => setIsTerminalExpanded(!isTerminalExpanded)}
                className="text-gray-400 hover:text-green-400 transition-colors p-1"
                title={isTerminalExpanded ? "Collapse terminal" : "Expand terminal"}
              >
                {isTerminalExpanded ? <FaChevronRight size={14} /> : <FaChevronLeft size={14} />}
              </button>
            </div>

            {/* Terminal Content - only show when expanded */}
            {isTerminalExpanded && (
              <div className="h-full flex flex-col">
                <div className="flex-1 p-4 overflow-y-auto max-h-96 scrollbar-thin scrollbar-thumb-green-600 scrollbar-track-gray-800">
                  {terminalOutput.map((line, index) => (
                    <div key={index} className={`text-sm leading-relaxed ${line.includes("$") ? "text-green-400" : "text-gray-300"}`}>
                      {line}
                    </div>
                  ))}
                </div>

                <div className="p-4 border-t border-gray-600">
                  <form onSubmit={handleTerminalSubmit} className="flex items-center text-green-400">
                    <span className="text-sm">{currentPath}$ </span>
                    <input
                      ref={inputRef}
                      type="text"
                      value={terminalInput}
                      onChange={(e) => setTerminalInput(e.target.value)}
                      className="bg-transparent outline-none flex-1 ml-2 text-green-400 text-sm"
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
                <div className="text-gray-400 transform -rotate-90 text-xs whitespace-nowrap">TERMINAL</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
