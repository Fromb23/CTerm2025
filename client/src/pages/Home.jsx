
import React, { useState } from 'react';
import { ThemeProvider, useTheme } from '../contexts/themeContext.jsx';

const Home = () => {
  const { isDark, setIsDark } = useTheme();

  const handleToggleDarkMode = () => {
    setIsDark(prev => !prev);
  };

  return (
    <div className={`bg-primary text-primary min-h-screen flex flex-col ${isDark ? 'dark' : ''}`}>
      {/* Header */}
      <header className="bg-accent text-on-accent py-4 shadow-theme-lg">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">cTerm2025</h1>
          <nav className="hidden md:flex space-x-6">
            <a href="#about" className="hover:text-blue-300 transition">About Us</a>
            <a href="#programs" className="hover:text-blue-300 transition">Our Programs</a>
            <a href="#community" className="hover:text-blue-300 transition">Our Community</a>
            <a href="#impact" className="hover:text-blue-300 transition">Our Impact</a>
            <a href="#talent" className="hover:text-blue-300 transition">Talent Hub</a>
            <button className="button-primary px-4 py-2 rounded-md">Be Part of Us</button>
			<button 
			onClick={handleToggleDarkMode}
			className="button-outline px-4 py-2 rounded-md border-on-accent text-on-accent">Dark Mode</button>	
          </nav>
          <button className="md:hidden button-outline px-3 py-1 rounded">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-secondary py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Revolutionizing Tech Education</h1>
          <p className="text-xl md:text-2xl text-secondary mb-8 max-w-3xl mx-auto">
            cTerm2025 is the future of rigorous, self-paced tech education. 
            Master Software Engineering, Cybersecurity, Data Science, and Mathematics 
            through our intensive 80-hour/week curriculum.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="button-primary px-8 py-3 text-lg rounded-lg">
              Start Learning Now
            </button>
            <button className="button-outline px-8 py-3 text-lg rounded-lg border-accent text-accent">
              Explore Programs
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">About cTerm2025</h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-lg mb-4">
                cTerm2025 is not just another learning platform - it's a movement. We're built on the philosophy that 
                <span className="text-accent font-semibold"> "hard things make better engineers"</span>. Our curriculum is designed to push you beyond your limits.
              </p>
              <p className="text-lg mb-6">
                With AI-powered grading and adaptive learning paths, we ensure you master each concept before moving forward. 
                No shortcuts, no hand-holding - just real, deep technical mastery.
              </p>
              <button className="button-primary px-6 py-2 rounded-md">
                Our Learning Philosophy
              </button>
            </div>
            <div className="rounded-lg overflow-hidden shadow-theme-lg">
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                alt="Students collaborating"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs" className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Programs</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Software Engineering",
                description: "Full-stack development with modern frameworks and architectures",
                hours: "80 hrs/week",
                status: "popular"
              },
              {
                title: "Cybersecurity",
                description: "Offensive and defensive security with real-world simulations",
                hours: "80 hrs/week",
                status: "new"
              },
              {
                title: "Data Science",
                description: "Machine learning, statistics, and big data engineering",
                hours: "80 hrs/week",
                status: "popular"
              },
              {
                title: "Mathematics",
                description: "Applied mathematics for computer science and algorithms",
                hours: "80 hrs/week",
                status: "coming-soon"
              }
            ].map((program, index) => (
              <div key={index} className="bg-card p-6 rounded-lg shadow-theme border border-primary">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold">{program.title}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    program.status === 'popular' ? 'bg-success text-white' : 
                    program.status === 'new' ? 'bg-info text-white' : 
                    'bg-pending text-white'
                  }`}>
                    {program.status.replace('-', ' ')}
                  </span>
                </div>
                <p className="text-secondary mb-4">{program.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-accent">{program.hours}</span>
                  <button className="button-outline px-4 py-1 text-sm rounded-md">
                    Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section id="community" className="py-16 bg-primary">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Community</h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="rounded-lg overflow-hidden shadow-theme-lg order-2 md:order-1">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                alt="Community members"
                className="w-full h-auto"
              />
            </div>
            <div className="order-1 md:order-2">
              <h3 className="text-2xl font-semibold mb-4">The cTerm Collective</h3>
              <p className="text-lg mb-4">
                Join 10,000+ dedicated learners who embrace the challenge. Our community is built on:
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <span className="text-success mr-2">✓</span>
                  <span>Peer accountability groups</span>
                </li>
                <li className="flex items-start">
                  <span className="text-success mr-2">✓</span>
                  <span>24/7 technical support forums</span>
                </li>
                <li className="flex items-start">
                  <span className="text-success mr-2">✓</span>
                  <span>Weekly code reviews with experts</span>
                </li>
                <li className="flex items-start">
                  <span className="text-success mr-2">✓</span>
                  <span>Global hackathons and challenges</span>
                </li>
              </ul>
              <button className="button-primary px-6 py-2 rounded-md">
                Join the Community
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section id="impact" className="py-16 bg-accent text-on-accent">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">Our Impact</h2>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              { value: "92%", label: "Completion Rate" },
              { value: "85%", label: "Hired Within 3 Months" },
              { value: "10K+", label: "Active Learners" }
            ].map((stat, index) => (
              <div key={index} className="p-6 rounded-lg border border-accent">
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
          <p className="text-xl max-w-3xl mx-auto mb-8">
            cTerm graduates work at top tech companies worldwide, having proven their ability to 
            tackle the most demanding technical challenges.
          </p>
          <button className="button-secondary px-6 py-2 rounded-md border-on-accent text-on-accent">
            Success Stories
          </button>
        </div>
      </section>

      {/* Talent Hub Section */}
      <section id="talent" className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Talent Hub</h2>
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xl mb-8">
              Our graduates are among the most technically proficient in the industry. 
              Hire from our pool of rigorously trained professionals.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="button-primary px-8 py-3 rounded-lg">
                Hire cTerm Grads
              </button>
              <button className="button-outline px-8 py-3 rounded-lg border-accent text-accent">
                Partner With Us
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Tech Career?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join cTerm2025 and push your limits with our intensive, results-driven programs.
          </p>
          <button className="button-primary px-8 py-3 text-lg rounded-lg">
            Apply Now - It's Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-accent text-on-accent py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-bold">cTerm2025</h2>
              <p className="text-sm">The future of technical education</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-blue-300">Terms</a>
              <a href="#" className="hover:text-blue-300">Privacy</a>
              <a href="#" className="hover:text-blue-300">Contact</a>
            </div>
          </div>
          <div className="mt-6 text-center text-sm">
            © {new Date().getFullYear()} cTerm2025. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;