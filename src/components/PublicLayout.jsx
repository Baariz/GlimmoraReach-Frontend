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
          <Link to="/" className="flex items-center group">
            <img src="/Glimmora_reach_logo_fit.png" alt="Glimmora Reach" className="h-8 w-auto object-contain group-hover:opacity-80 transition" />
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
