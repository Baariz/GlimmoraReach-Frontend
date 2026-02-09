import { Outlet, Link } from 'react-router-dom';
import Footer from './Footer';

export default function PublicLayout() {
  function scrollToSection(e, sectionId) {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Public header / navbar */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
              </svg>
            </div>
            <span className="text-lg font-bold text-primary tracking-tight group-hover:opacity-80 transition">
              Glimmora Reach
            </span>
          </Link>

          {/* Center nav links */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              onClick={(e) => scrollToSection(e, 'features')}
              className="text-sm font-medium text-gray-600 hover:text-primary transition duration-200"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={(e) => scrollToSection(e, 'how-it-works')}
              className="text-sm font-medium text-gray-600 hover:text-primary transition duration-200"
            >
              How It Works
            </a>
            <a
              href="#pricing"
              onClick={(e) => scrollToSection(e, 'pricing')}
              className="text-sm font-medium text-gray-600 hover:text-primary transition duration-200"
            >
              Pricing
            </a>
          </nav>

          {/* Right buttons */}
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-medium text-gray-600 hover:text-primary transition duration-200 px-4 py-2"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-sm font-semibold text-white gradient-primary px-5 py-2 rounded-lg hover:opacity-90 transition duration-200"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Page content -- offset by header height */}
      <main className="flex-1 pt-16">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
