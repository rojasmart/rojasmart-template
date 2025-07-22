"use client";

import { useState, useEffect } from "react";

import Link from "next/link";
import { FaLinkedin, FaGithub, FaBehance } from "react-icons/fa"; // Import icons

export default function Home() {
  const [matrixText1, setMatrixText1] = useState("");
  const [matrixText2, setMatrixText2] = useState("");
  const words = ["Designer", "Photographer", "3D Artist", "Chess Player", "Runner", "Frontend Developer", "Web Developer"];

  useEffect(() => {
    let currentWordIndex1 = 0;
    let currentWordIndex2 = 1; // Start with a different word for the second text
    let animationFrame1: number;
    let animationFrame2: number;

    const randomChar = () => String.fromCharCode(33 + Math.random() * 94); // Random ASCII characters

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
          }, 3000); // Pause before switching to the next word
        }
      };

      animate();
    };

    const updateIndex1 = () => {
      currentWordIndex1 = (currentWordIndex1 + 1) % words.length;
      if (currentWordIndex1 === currentWordIndex2) {
        currentWordIndex1 = (currentWordIndex1 + 1) % words.length; // Ensure no overlap
      }
      generateMatrixEffect(words[currentWordIndex1], setMatrixText1, currentWordIndex1, updateIndex1);
    };

    const updateIndex2 = () => {
      currentWordIndex2 = (currentWordIndex2 + 1) % words.length;
      if (currentWordIndex2 === currentWordIndex1) {
        currentWordIndex2 = (currentWordIndex2 + 1) % words.length; // Ensure no overlap
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

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-slate-200">
        <div className="w-full px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-xl font-bold text-black">rojasmart.dev</div>
            <div className="flex space-x-6">
              <Link href="#blog" className="text-black hover:text-slate-600">
                Blog
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="w-full px-6 py-20">
        <h1 className="text-6xl font-bold text-black mb-6">
          HI, I am <span className="underline">Rogério</span>
        </h1>
        <p className="text-lg text-black mb-4">
          I am a <span className="text-green-400 font-mono">{matrixText1}</span> and <span className="text-green-400 font-mono">{matrixText2}</span>{" "}
          with +7 years of experience in designing and building intuitive, user-centered products.
        </p>
      </section>

      {/* Projects */}
      <section id="projects" className="w-full px-6 py-16">
        <h2 className="text-3xl font-bold text-black mb-8">Personal Projects</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-6 border border-slate-200 rounded-lg">
            <h3 className="text-xl font-semibold text-black mb-3">Web Development</h3>
            <p className="text-black">Custom websites and web applications built with modern frameworks.</p>
          </div>
          <div className="p-6 border border-slate-200 rounded-lg">
            <h3 className="text-xl font-semibold text-black mb-3">UI/UX Design</h3>
            <p className="text-black">Beautiful and functional user interfaces that users love.</p>
          </div>
        </div>
      </section>

      {/* Simple Contact */}
      <section id="contact" className="bg-slate-50">
        <div className="w-full px-6 py-16">
          <h2 className="text-3xl font-bold text-black mb-4">Wanna get in touch?</h2>
          <p className="text-black mb-8">I am always available for exciting discussions and ideas.</p>
          <Link href="mailto:hello@rojasmart.dev" className="text-black hover:text-slate-600">
            rogeriosvaldo@gmail.com
          </Link>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="border-t border-slate-200">
        <div className="w-full px-6 py-8 flex flex-col items-left">
          <div className="flex space-x-6">
            <a href="https://www.linkedin.com/in/your-profile" target="_blank" rel="noopener noreferrer" className="text-black hover:text-blue-600">
              <FaLinkedin size={24} />
            </a>
            <a href="https://github.com/your-profile" target="_blank" rel="noopener noreferrer" className="text-black hover:text-gray-800">
              <FaGithub size={24} />
            </a>
            <a href="https://www.behance.net/your-profile" target="_blank" rel="noopener noreferrer" className="text-black hover:text-blue-500">
              <FaBehance size={24} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
