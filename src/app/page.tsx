"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaLinkedin, FaGithub, FaBehance } from "react-icons/fa";

export default function Home() {
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);

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
        <div className="flex-1 p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-green-600 scrollbar-track-gray-800">
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

                  {/* Row 1 */}
                  <div className="text-gray-300 py-1">Next.js</div>
                  <div className="text-gray-300 py-1">WordPress</div>
                  <div className="text-gray-300 py-1">Figma</div>
                  <div className="text-gray-300 py-1">Linux</div>

                  {/* Row 2 */}
                  <div className="text-gray-300 py-1">React</div>
                  <div className="text-gray-300 py-1">Strapi</div>
                  <div className="text-gray-300 py-1">Adobe CC</div>
                  <div className="text-gray-300 py-1">Docker</div>

                  {/* Row 3 */}
                  <div className="text-gray-300 py-1">TypeScript</div>
                  <div className="text-gray-300 py-1">Contentful</div>
                  <div className="text-gray-300 py-1">Sketch</div>
                  <div className="text-gray-300 py-1">AWS</div>

                  {/* Row 4 */}
                  <div className="text-gray-300 py-1">Node.js</div>
                  <div className="text-gray-300 py-1">Sanity</div>
                  <div className="text-gray-300 py-1">Photoshop</div>
                  <div className="text-gray-300 py-1">Git</div>

                  {/* Row 5 */}
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
      </div>
    </div>
  );
}
