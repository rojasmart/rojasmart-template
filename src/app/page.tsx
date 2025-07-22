"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaLinkedin, FaGithub, FaBehance } from "react-icons/fa";

export default function Home() {
  const [matrixText1, setMatrixText1] = useState("");
  const [matrixText2, setMatrixText2] = useState("");
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);

  const words = ["Designer", "Photographer", "3D Artist", "Chess Player", "Runner", "Frontend Developer", "Web Developer"];

  const terminalContent = [
    "$ cd /home/rogerio",
    "$ ls -la",
    "drwxr-xr-x  2 rogerio rogerio  4096 Jul 22 2025 .",
    "drwxr-xr-x  3 root    root     4096 Jul 22 2025 ..",
    "-rw-r--r--  1 rogerio rogerio   220 Jul 22 2025 .bash_logout",
    "-rw-r--r--  1 rogerio rogerio  3771 Jul 22 2025 .bashrc",
    "-rw-r--r--  1 rogerio rogerio   807 Jul 22 2025 .profile",
    "-rw-r--r--  1 rogerio rogerio  1024 Jul 22 2025 about.txt",
    "drwxr-xr-x  2 rogerio rogerio  4096 Jul 22 2025 projects/",
    "",
    "$ cat about.txt",
    "=====================================",
    "       Welcome to rojasmart.dev      ",
    "=====================================",
    "",
  ];

  // Matrix effect logic (existing)
  useEffect(() => {
    let currentWordIndex1 = 0;
    let currentWordIndex2 = 1;
    let animationFrame1: number;
    let animationFrame2: number;

    const randomChar = () => String.fromCharCode(33 + Math.random() * 94);

    const generateMatrixEffect = (
      targetWord: string,
      setMatrixText: React.Dispatch<React.SetStateAction<string>>,
      currentWordIndex: number,
      updateIndex: () => void
    ) => {
      let displayText = "";
      let charIndex = 0;

      const animate = () => {
        if (charIndex < targetWord.length) {
          displayText = targetWord
            .split("")
            .map((char, i) => (i <= charIndex ? char : randomChar()))
            .join("");
          setMatrixText(displayText);
          charIndex++;
          requestAnimationFrame(animate);
        } else {
          setTimeout(() => {
            updateIndex();
          }, 3000);
        }
      };

      animate();
    };

    const updateIndex1 = () => {
      currentWordIndex1 = (currentWordIndex1 + 1) % words.length;
      if (currentWordIndex1 === currentWordIndex2) {
        currentWordIndex1 = (currentWordIndex1 + 1) % words.length;
      }
      generateMatrixEffect(words[currentWordIndex1], setMatrixText1, currentWordIndex1, updateIndex1);
    };

    const updateIndex2 = () => {
      currentWordIndex2 = (currentWordIndex2 + 1) % words.length;
      if (currentWordIndex2 === currentWordIndex1) {
        currentWordIndex2 = (currentWordIndex2 + 1) % words.length;
      }
      generateMatrixEffect(words[currentWordIndex2], setMatrixText2, currentWordIndex2, updateIndex2);
    };

    generateMatrixEffect(words[currentWordIndex1], setMatrixText1, currentWordIndex1, updateIndex1);
    generateMatrixEffect(words[currentWordIndex2], setMatrixText2, currentWordIndex2, updateIndex2);

    return () => {
      cancelAnimationFrame(animationFrame1);
      cancelAnimationFrame(animationFrame2);
    };
  }, []);

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
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <div className="text-gray-400 text-sm">rogerio@dev:~</div>
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
              <div className="text-yellow-400">$ whoami</div>
              <div className="text-6xl font-bold text-white mb-6">
                <span className="text-green-400">&gt;</span> HI, I am <span className="text-cyan-400 underline">Rogério</span>
              </div>

              <div className="text-yellow-400">$ cat skills.txt</div>
              <div className="text-lg mb-8">
                <span className="text-white">&gt; I am a </span>
                <span className="text-green-400 bg-gray-900 px-2 py-1 rounded">{matrixText1}</span>
                <span className="text-white"> and </span>
                <span className="text-green-400 bg-gray-900 px-2 py-1 rounded">{matrixText2}</span>
                <span className="text-white"> with +7 years of experience in designing and building intuitive, user-centered products.</span>
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
