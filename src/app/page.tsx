import Link from "next/link";

export default function Home() {
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
        <h1 className="text-6xl font-bold text-black mb-6">HI, I am Rogério</h1>
        <p className="text-lg text-black mb-4">
          I am a passionate Frontend and Web Developer with +7 years of experience in designing and building intuitive, user-centered products.
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
