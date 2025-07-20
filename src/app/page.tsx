import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Simple Navigation */}
      <nav className="border-b border-slate-200">
        <div className="w-full px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-xl font-bold text-black">rojasmart.dev</div>
            <div className="flex space-x-6">
              <Link href="#about" className="text-black hover:text-slate-600">
                About
              </Link>
              <Link href="#services" className="text-black hover:text-slate-600">
                Services
              </Link>
              <Link href="#contact" className="text-black hover:text-slate-600">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Simple Hero */}
      <section className="w-full px-6 py-20">
        <h1 className="text-5xl font-bold text-black mb-6">Welcome to RojaSmart</h1>
        <p className="text-xl text-black mb-8 max-w-2xl">Building modern web applications with clean code and great user experiences.</p>
        <Link href="#contact" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors">
          Get Started
        </Link>
      </section>

      {/* Simple About */}
      <section id="about" className="bg-slate-50">
        <div className="w-full px-6 py-16">
          <h2 className="text-3xl font-bold text-black mb-8">About</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-blue-600 text-xl">⚡</span>
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">Fast</h3>
              <p className="text-black">Optimized for speed and performance</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-blue-600 text-xl">📱</span>
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">Responsive</h3>
              <p className="text-black">Works on all devices and screen sizes</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-blue-600 text-xl">🎨</span>
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">Modern</h3>
              <p className="text-black">Built with latest technologies</p>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Services */}
      <section id="services" className="w-full px-6 py-16">
        <h2 className="text-3xl font-bold text-black mb-8">Services</h2>
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
          <h2 className="text-3xl font-bold text-black mb-4">Let's Work Together</h2>
          <p className="text-black mb-8">Ready to start your project? Get in touch with us.</p>
          <Link
            href="mailto:hello@rojasmart.dev"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="border-t border-slate-200">
        <div className="w-full px-6 py-8">
          <p className="text-black">© 2025 rojasmart.dev. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
