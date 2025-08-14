import { useState } from 'react';
import Form from '../components/ui/Form';

const Checker = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`min-h-screen flex flex-col bg-primary transition-colors duration-300 ${darkMode ? 'dark' : ''}`}>
      {/* Header */}
      <header className="flex justify-between items-center p-6 border-b border-primary sticky top-0 bg-primary z-10">
        <div className="text-3xl font-bold text-accent">Checker</div>
        <div className="flex gap-4 items-center">
          <button className="button-primary px-6 py-2 rounded-md hover:bg-accent-dark transition-colors">
            Apply Now
          </button>
          <button 
            onClick={toggleDarkMode}
            className="text-xl icon-primary hover:icon-accent transition-colors p-2"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-grow container mx-auto px-6 py-12 flex flex-col lg:flex-row items-center gap-12">
        <div className="lg:w-1/2 space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-accent leading-tight">
            Elevate Your Code Review Process
          </h1>
          <p className="text-lg text-secondary leading-relaxed">
            Checker is the premier automated evaluation system for software engineering programs, 
            providing instant feedback on code quality, structure, and best practices.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <span className="icon-accent text-xl">✓</span>
              <p className="text-secondary">Secure sandboxed execution environment</p>
            </div>
            <div className="flex items-start gap-4">
              <span className="icon-accent text-xl">✓</span>
              <p className="text-secondary">Multi-language support (Python, C, Bash)</p>
            </div>
            <div className="flex items-start gap-4">
              <span className="icon-accent text-xl">✓</span>
              <p className="text-secondary">Real-time feedback and scoring</p>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button className="button-primary px-8 py-3 rounded-md hover:bg-accent-dark transition-colors">
              Get Started
            </button>
            <button className="button-secondary px-8 py-3 rounded-md border border-primary transition-colors">
              Learn More
            </button>
          </div>
        </div>

        <div className="lg:w-1/2">
          <div className="bg-card p-1 rounded-lg shadow-theme-lg overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1617791160536-598cf32026fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
              alt="Code review illustration"
              className="w-full h-auto rounded-lg"
              loading="lazy"
            />
          </div>
        </div>
      </section>
      {/* Form Section */}
<section className="container mx-auto px-6 pb-16">
  <div className="max-w-xl mx-auto bg-card p-6 rounded-lg shadow-theme-md">
    <h2 className="text-2xl font-semibold text-accent mb-4">Try It Out</h2>
    <Form />
  </div>
</section>


      {/* Footer */}
      <footer className="bg-secondary py-8 border-t border-primary">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-lg font-medium text-primary">Checker Evaluation System</div>
            <div className="text-sm text-secondary text-center md:text-right">
              <p>© {new Date().getFullYear()} Checker. All rights reserved.</p>
              <p className="mt-1">For educational institutions and approved programs only.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Checker;