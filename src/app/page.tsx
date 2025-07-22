"use client";

import { useState } from "react";
import Link from "next/link";
import { FaChevronLeft, FaChevronRight, FaCog } from "react-icons/fa";
import RealTerminal from "./components/RealTerminal";

export default function Home() {
  const [isTerminalExpanded, setIsTerminalExpanded] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);

  // Terminal Configuration State
  const [terminalConfig, setTerminalConfig] = useState({
    theme: "matrix", // matrix, classic, modern
    fontSize: "sm", // xs, sm, base, lg
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

  const handleTerminalOutputChange = (output: string[]) => {
    setTerminalOutput(output);
  };

  // Profile command handler
  const executeProfileCommand = () => {
    const profileOutput = [
      "$ profile",
      "",
      "╔══════════════════════════════════════════════════════════════════════════════════════╗",
      "║                                  ROJASMART PROFILE                                   ║",
      "╠══════════════════════════════════════════════════════════════════════════════════════╣",
      "║ DEVELOPMENT          │ DESIGN               │ ADMIN/DEVOPS        │ CMS PLATFORMS    ║",
      "╠══════════════════════════════════════════════════════════════════════════════════════╣",
      "║ • React/Next.js      │ • UI/UX Design       │ • Linux Server       │ • WordPress      ║",
      "║ • TypeScript         │ • Figma/Adobe XD     │ • Docker             │ • Drupal         ║",
      "║ • Node.js            │ • Responsive Design  │ • AWS/Cloud          │ • Strapi         ║",
      "║ • Python             │ • Design Systems     │ • CI/CD Pipelines    │ • Contentful     ║",
      "║ • JavaScript (ES6+)  │ • Prototyping        │ • Database Admin     │ • Sanity         ║",
      "║ • HTML5/CSS3         │ • Brand Identity     │ • Nginx/Apache       │ • Ghost          ║",
      "║ • Tailwind CSS       │ • Web Animation      │ • Git/Version Ctrl   │ • Netlify CMS    ║",
      "║ • APIs/REST          │ • Mobile Design      │ • Server Security    │ • Forestry       ║",
      "╚══════════════════════════════════════════════════════════════════════════════════════╝",
      "",
      "📧 Contact: rogeriosvaldo@gmail.com",
      "🌐 Location: Available for remote work worldwide",
      "💼 Status: Open for freelance projects and collaborations",
      "",
      "Type 'help' to see available commands",
      "",
    ];
    setTerminalOutput(profileOutput);
  };

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
            <div className="grid grid-cols-2 gap-4 text-sm">
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
            </div>
            <div className="mt-3 text-xs text-gray-400">
              Real terminal with full command support. Try commands like: <span className={currentTheme.accent}>ls</span>,{" "}
              <span className={currentTheme.accent}>pwd</span>, <span className={currentTheme.accent}>profile</span>,{" "}
              <span className={currentTheme.accent}>help</span>
            </div>
          </div>
        )}

        {/* Terminal Content */}
        <div className="flex-1 flex min-h-0">
          {/* Main Content - Terminal Output Display */}
          <div
            className={`${
              isTerminalExpanded ? "flex-1" : "flex-1"
            } p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-green-600 scrollbar-track-gray-800 transition-all duration-300`}
          >
            {/* Terminal Output Display */}
            {terminalOutput.length > 0 ? (
              <div className="mb-8">
                <div className={`${currentTheme.secondary} text-lg font-bold mb-4 flex items-center`}>
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Terminal Output
                </div>
                {terminalOutput.map((line, index) => (
                  <div
                    key={index}
                    className={`leading-relaxed text-${terminalConfig.fontSize} font-mono mb-1 ${
                      line.includes("$")
                        ? currentTheme.accent
                        : line.includes("error") || line.includes("Error")
                        ? "text-red-400"
                        : line.includes("Connected")
                        ? currentTheme.primary
                        : line.includes("╔") || line.includes("║") || line.includes("╚") || line.includes("╠") || line.includes("╣")
                        ? currentTheme.secondary
                        : line.includes("📧") || line.includes("🌐") || line.includes("💼")
                        ? currentTheme.accent
                        : currentTheme.text
                    }`}
                  >
                    {line}
                  </div>
                ))}
                <div className={`${currentTheme.accent} flex items-center mt-4`}>
                  $ <span className="animate-pulse ml-2">_</span>
                </div>
              </div>
            ) : (
              <>
                {/* Welcome Content - shown when no terminal output */}
                <div className="mb-8">
                  <div className={`leading-relaxed text-${terminalConfig.fontSize}`}>
                    <div className={currentTheme.accent}>$ cd /home/rojasmart</div>
                    <div className={currentTheme.accent}>$ ls -la</div>
                    <div className="text-blue-400">drwxr-xr-x 2 rojasmart rojasmart 4096 Jul 22 2025 .</div>
                    <div className="text-blue-400">drwxr-xr-x 3 root root 4096 Jul 22 2025 ..</div>
                    <div className="text-blue-400">-rw-r--r-- 1 rojasmart rojasmart 220 Jul 22 2025 .bash_logout</div>
                    <div className="text-blue-400">-rw-r--r-- 1 rojasmart rojasmart 3771 Jul 22 2025 .bashrc</div>
                    <div className="text-blue-400">-rw-r--r-- 1 rojasmart rojasmart 807 Jul 22 2025 .profile</div>
                    <div className="text-blue-400">-rw-r--r-- 1 rojasmart rojasmart 1024 Jul 22 2025 about.txt</div>
                    <div className="text-blue-400">-rw-r--r-- 1 rojasmart rojasmart 2048 Jul 22 2025 skills.txt</div>
                    <div className="text-blue-400">drwxr-xr-x 2 rojasmart rojasmart 4096 Jul 22 2025 projects/</div>
                    <div></div>
                    <div className={currentTheme.accent}>$ cat about.txt</div>
                    <div className={`${currentTheme.secondary} font-bold`}>=====================================</div>
                    <div className={`${currentTheme.secondary} font-bold`}> Welcome to rojasmart.dev </div>
                    <div className={`${currentTheme.secondary} font-bold`}>=====================================</div>
                    <div>Full-stack Developer & Designer</div>
                    <div>Specialized in modern web technologies</div>
                    <div>Building user-centered digital products</div>
                    <div></div>
                    <div className={currentTheme.accent}>$ echo 'Available Commands:'</div>
                    <div className={`${currentTheme.text} ml-4`}>
                      <div className={`${currentTheme.primary} cursor-pointer hover:underline`} onClick={executeProfileCommand}>
                        • profile - Show detailed skills table
                      </div>
                      <div className={currentTheme.text}>• help - Show all available commands</div>
                      <div className={currentTheme.text}>• Or use the Real Terminal on the right →</div>
                    </div>
                  </div>
                </div>

                {/* Hero Section */}
                <div className="space-y-4">
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
                    $ <span className="animate-pulse ml-2">_</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Real Terminal Sidebar - Command Input */}
          <div
            className={`${
              isTerminalExpanded ? "w-80" : "w-12"
            } border-l border-gray-600 bg-gray-900 transition-all duration-300 flex flex-col min-h-0`}
          >
            {/* Terminal Header with Toggle */}
            <div className="flex items-center justify-between bg-gray-800 px-4 py-2 border-b border-gray-600 flex-shrink-0">
              <div className={`${isTerminalExpanded ? "block" : "hidden"} text-gray-400 text-sm font-mono`}>Command Input</div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsTerminalExpanded(!isTerminalExpanded)}
                  className={`text-gray-400 hover:${currentTheme.primary} transition-colors p-1`}
                  title={isTerminalExpanded ? "Collapse terminal" : "Expand terminal"}
                >
                  {isTerminalExpanded ? <FaChevronRight size={14} /> : <FaChevronLeft size={14} />}
                </button>
              </div>
            </div>

            {/* Terminal Content - only show when expanded */}
            {isTerminalExpanded && (
              <RealTerminal
                theme={currentTheme}
                fontSize={terminalConfig.fontSize}
                isVisible={isTerminalExpanded}
                onToggle={() => setIsTerminalExpanded(false)}
                onOutputChange={handleTerminalOutputChange}
              />
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
