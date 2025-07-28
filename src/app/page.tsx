"use client";

import { useState } from "react";
import Link from "next/link";
import { FaChevronLeft, FaChevronRight, FaCog } from "react-icons/fa";
import RealTerminal from "./components/RealTerminal";

export default function Home() {
  const [isTerminalExpanded, setIsTerminalExpanded] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [navigationMode, setNavigationMode] = useState<"terminal" | "simple">("terminal");

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
          <div className="flex space-x-4 text-gray-400 items-center">
            {/* Navigation Mode Toggle */}
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-gray-500">Mode:</span>
              <button
                onClick={() => setNavigationMode(navigationMode === "terminal" ? "simple" : "terminal")}
                className={`px-2 py-1 rounded transition-colors ${
                  navigationMode === "terminal" ? `${currentTheme.primary} bg-gray-700` : "text-gray-400 hover:text-gray-200"
                }`}
                title={navigationMode === "terminal" ? "Switch to Simple Navigation" : "Switch to Terminal Mode"}
              >
                {navigationMode === "terminal" ? "⌨️ Terminal" : "🖱️ Simple"}
              </button>
            </div>
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
            className={`transition-all duration-300 p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-green-600 scrollbar-track-gray-800 ${
              navigationMode === "terminal" ? (isTerminalExpanded ? "flex-1" : "flex-grow min-w-0") : "w-full"
            }`}
          >
            {navigationMode === "simple" ? (
              /* Simple Navigation Mode - Output right, navigation/services/contact left */
              <div className="flex flex-col md:flex-row gap-10 w-full min-h-[80vh] ">
                {/* Left: Navigation, Services and Contact */}
                <div className="w-[30%] min-w-[160px] flex flex-col justify-between py-8">
                  {/* Navigation Buttons */}
                  <div className="mb-10">
                    <h1 className={`text-5xl font-bold ${currentTheme.primary} mb-4`}>Hi, I'm rojasmart</h1>
                    <p className={`text-2xl ${currentTheme.text} mb-8`}>Developer & Designer specialized in modern web technologies</p>
                    <div className="flex flex-wrap gap-4">
                      <button
                        onClick={() => {
                          const aboutContent = [
                            "===================================================================",
                            "                           WHO AM I?",
                            "===================================================================",
                            "",
                            "                    I am a Multidisciplinary creator.",
                            "                 Specialized in modern web technologies",
                            "                Building user-centered digital products",
                            "",
                            "    ⚡ Creating innovative solutions that bridge design & code",
                            "    🎨 Turning complex ideas into beautiful, functional products",
                            "    🚀 Passionate about user experience and clean architecture",
                            "",
                            "===================================================================",
                          ];
                          setTerminalOutput(["$ whoami", "", ...aboutContent, ""]);
                        }}
                        className={`px-6 py-3 ${currentTheme.border} border ${currentTheme.primary} hover:bg-gray-800 transition-colors rounded-lg`}
                      >
                        About Me
                      </button>
                      <button
                        onClick={executeProfileCommand}
                        className={`px-6 py-3 ${currentTheme.border} border ${currentTheme.primary} hover:bg-gray-800 transition-colors rounded-lg`}
                      >
                        Skills & Experience
                      </button>
                      <button
                        onClick={() => {
                          const projectsContent = [
                            "===================================================================",
                            "                          GITHUB PROJECTS",
                            "===================================================================",
                            "",
                            "🚀 Featured Repositories:",
                            "",
                            "📁 rojasmart.dev",
                            "   • Terminal-style portfolio website built with Next.js & TypeScript",
                            "   • Real-time WebSocket terminal integration",
                            "   • 🔗 https://github.com/rojasmart/rojasmart.dev",
                            "",
                            "📁 next-dashboard",
                            "   • Modern admin dashboard with Next.js 14 App Router",
                            "   • TailwindCSS, Prisma, PostgreSQL integration",
                            "   • 🔗 https://github.com/rojasmart/next-dashboard",
                            "",
                            "🌟 Total Public Repositories: 25+",
                            "📊 Languages: TypeScript, JavaScript, Python, PHP, CSS",
                            "🔧 Main Profile: https://github.com/rojasmart",
                            "",
                            "===================================================================",
                          ];
                          setTerminalOutput(["$ projects", "", ...projectsContent, ""]);
                        }}
                        className={`px-6 py-3 ${currentTheme.border} border ${currentTheme.primary} hover:bg-gray-800 transition-colors rounded-lg`}
                      >
                        Projects
                      </button>
                    </div>
                  </div>
                  {/* Services Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <div className={`${currentTheme.border} border rounded-lg p-8 bg-gray-900 bg-opacity-50`}>
                      <h3 className={`text-2xl font-bold ${currentTheme.secondary} mb-4`}>Technical</h3>
                      <p className={`${currentTheme.text} mb-4`}>
                        Custom websites and web applications built with modern frameworks like React, Next.js, and TypeScript.
                      </p>
                      <ul className={`${currentTheme.text} text-sm space-y-1`}>
                        <li>• Frontend Development</li>
                        <li>• Backend APIs</li>
                        <li>• Database Design</li>
                        <li>• Performance Optimization</li>
                      </ul>
                    </div>
                    <div className={`${currentTheme.border} border rounded-lg p-8 bg-gray-900 bg-opacity-50`}>
                      <h3 className={`text-2xl font-bold ${currentTheme.secondary} mb-4`}>Creative</h3>
                      <p className={`${currentTheme.text} mb-4`}>Beautiful and functional user interfaces that provide excellent user experiences.</p>
                      <ul className={`${currentTheme.text} text-sm space-y-1`}>
                        <li>• User Interface Design</li>
                        <li>• User Experience Research</li>
                        <li>• Prototyping & Wireframing</li>
                        <li>• Design Systems</li>
                      </ul>
                    </div>
                  </div>
                  {/* Contact Section */}
                  <div className={`${currentTheme.border} border rounded-lg p-8 bg-gray-900 bg-opacity-30 text-center`}>
                    <h3 className={`text-2xl font-bold ${currentTheme.accent} mb-4`}>Let's Work Together</h3>
                    <p className={`${currentTheme.text} mb-6`}>Ready to start your project? I'm available for freelance work and collaborations.</p>
                    <a
                      href="mailto:rogeriosvaldo@gmail.com"
                      className={`inline-block px-8 py-3 ${currentTheme.primary} border ${currentTheme.border} hover:bg-gray-800 transition-colors rounded-lg font-semibold`}
                    >
                      📧 rogeriosvaldo@gmail.com
                    </a>
                  </div>
                </div>
                {/* Right: Output/Terminal */}
                <div className="w-[70%] min-w-[360px] flex-grow flex-shrink-0 py-8">
                  <div className={`${currentTheme.secondary} text-lg font-bold mb-4 flex items-center`}>
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Output
                  </div>
                  <div className={`bg-gray-900 bg-opacity-50 p-6 rounded-lg ${currentTheme.border} border max-h-[80vh] overflow-y-auto`}>
                    {terminalOutput.length === 0 ? (
                      <div className={`${currentTheme.text} italic`}>No output yet. Clique nos botões acima para ver informações.</div>
                    ) : (
                      terminalOutput.map((line, index) => (
                        <div
                          key={index}
                          className={`leading-relaxed text-${terminalConfig.fontSize} font-mono mb-1 ${
                            line.includes("$")
                              ? currentTheme.accent
                              : line.includes("===")
                              ? currentTheme.secondary
                              : line.includes("📧") || line.includes("🌐") || line.includes("💼")
                              ? currentTheme.accent
                              : currentTheme.text
                          }`}
                        >
                          {line}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* Terminal Mode - existing content */
              <>
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
              </>
            )}
          </div>

          {/* Real Terminal Sidebar - Command Input - only show in terminal mode */}
          {navigationMode === "terminal" && (
            <div
              className={`transition-all duration-300 flex flex-col min-h-0 border-l border-gray-600 bg-gray-900 ${
                isTerminalExpanded ? "w-80" : "w-12"
              }`}
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
                    {isTerminalExpanded ? <FaChevronLeft size={14} /> : <FaChevronRight size={14} />}
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
          )}
        </div>
      </div>
    </div>
  );
}
