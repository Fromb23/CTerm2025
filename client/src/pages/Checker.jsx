import React, { useState, useEffect } from 'react';
import { 
  FiSun, 
  FiMoon, 
  FiMenu, 
  FiX, 
  FiCheck, 
  FiArrowRight, 
  FiUsers, 
  FiCode, 
  FiShield, 
  FiDatabase, 
  FiCalculator,
  FiTrendingUp,
  FiAward,
  FiGlobe,
  FiChevronDown,
  FiPlay
} from 'react-icons/fi';

const Home = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }

    // Handle scroll effects
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);

    // Intersection observer for active section
    const sections = document.querySelectorAll('section[id]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.6 }
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
  };

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  const programs = [
    {
      title: "Software Engineering",
      description: "Full-stack development with modern frameworks, microservices, and cloud architecture",
      hours: "80 hrs/week",
      status: "popular",
      icon: <FiCode className="w-8 h-8" />,
      skills: ["React/Next.js", "Node.js", "Kubernetes", "AWS/GCP"]
    },
    {
      title: "Cybersecurity",
      description: "Offensive security, penetration testing, and enterprise security architecture",
      hours: "80 hrs/week",
      status: "new",
      icon: <FiShield className="w-8 h-8" />,
      skills: ["Ethical Hacking", "CISSP", "Security Audit", "Threat Analysis"]
    },
    {
      title: "Data Science",
      description: "Machine learning, deep learning, and big data engineering with real datasets",
      hours: "80 hrs/week",
      status: "popular",
      icon: <FiDatabase className="w-8 h-8" />,
      skills: ["Python/R", "TensorFlow", "Spark", "MLOps"]
    },
    {
      title: "Mathematics",
      description: "Advanced algorithms, computational mathematics, and mathematical modeling",
      hours: "80 hrs/week",
      status: "coming-soon",
      icon: <FiCalculator className="w-8 h-8" />,
      skills: ["Linear Algebra", "Statistics", "Algorithms", "Discrete Math"]
    }
  ];

  const stats = [
    { value: "92%", label: "Completion Rate", icon: <FiTrendingUp /> },
    { value: "85%", label: "Hired Within 3 Months", icon: <FiAward /> },
    { value: "10K+", label: "Active Learners", icon: <FiUsers /> },
    { value: "50+", label: "Countries", icon: <FiGlobe /> }
  ];

  const navItems = [
    { id: 'about', label: 'About Us' },
    { id: 'programs', label: 'Our Programs' },
    { id: 'community', label: 'Our Community' },
    { id: 'impact', label: 'Our Impact' },
    { id: 'talent', label: 'Talent Hub' }
  ];

  return (
    <div className={`${darkMode ? 'dark' : ''}`}>
      <div className="bg-primary text-primary min-h-screen transition-colors duration-300">
        
        {/* Enhanced Header */}
        <header className={`bg-accent text-on-accent py-4 shadow-theme-lg fixed w-full top-0 z-50 transition-all duration-300 ${
          scrollY > 50 ? 'py-2 backdrop-blur-md bg-opacity-95' : ''
        }`}>
          <div className="container mx-auto px-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">cT</span>
              </div>
              <h1 className="text-xl md:text-2xl font-bold">cTerm2025</h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`hover:text-blue-300 transition-colors duration-200 relative ${
                    activeSection === item.id ? 'text-blue-300' : ''
                  }`}
                >
                  {item.label}
                  {activeSection === item.id && (
                    <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-300 rounded-full" />
                  )}
                </button>
              ))}
              <button className="button-primary px-4 py-2 rounded-md hover:scale-105 transform transition-all duration-200">
                Be Part of Us
              </button>
            </nav>

            {/* Controls */}
            <div className="flex items-center space-x-3">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg hover:bg-opacity-20 hover:bg-white transition-all duration-200 transform hover:scale-110"
              >
                {darkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
              </button>
              
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-opacity-20 hover:bg-white transition-all duration-200"
              >
                {mobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div className={`lg:hidden transition-all duration-300 overflow-hidden ${
            mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div className="px-4 py-4 border-t border-blue-500 border-opacity-30 mt-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="block w-full text-left py-3 hover:text-blue-300 transition-colors duration-200"
                >
                  {item.label}
                </button>
              ))}
              <button className="w-full button-primary px-4 py-3 rounded-md mt-4">
                Be Part of Us
              </button>
            </div>
          </div>
        </header>

        {/* Enhanced Hero Section */}
        <section className="bg-secondary pt-24 md:pt-32 pb-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-600/10" />
          <div className="container mx-auto px-4 text-center relative">
            <div className="animate-bounce mb-8">
              <div className="w-16 h-16 mx-auto bg-accent text-on-accent rounded-full flex items-center justify-center">
                <FiCode className="w-8 h-8" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                Revolutionizing
              </span>
              <br />
              Tech Education
            </h1>
            
            <p className="text-xl md:text-2xl text-secondary mb-8 max-w-3xl mx-auto leading-relaxed">
              Where hard work meets excellence. 80+ hours weekly of rigorous, AI-powered learning in 
              Software Engineering, Cybersecurity, Data Science, and Mathematics.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              <button className="button-primary px-8 py-4 text-lg rounded-lg font-semibold hover:scale-105 transform transition-all duration-200 flex items-center justify-center space-x-2 group">
                <span>Start Learning Now</span>
                <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
              <button className="border border-primary px-8 py-4 text-lg rounded-lg hover:bg-secondary transition-all duration-200 flex items-center justify-center space-x-2">
                <FiPlay className="w-5 h-5" />
                <span>Watch Demo</span>
              </button>
            </div>

            {/* Scroll Indicator */}
            <div className="animate-bounce">
              <FiChevronDown className="w-6 h-6 mx-auto text-secondary" />
            </div>
          </div>
        </section>

        {/* Enhanced About Section */}
        <section id="about" className="py-20 bg-card">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">About cTerm2025</h2>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <p className="text-lg leading-relaxed">
                  cTerm2025 isn't just another learning platform—it's a <span className="text-accent font-semibold">revolution</span>. 
                  Built on the philosophy that <span className="text-accent font-semibold">"hard things make better engineers"</span>, 
                  our curriculum pushes you beyond conventional limits.
                </p>
                <p className="text-lg leading-relaxed">
                  With AI-powered adaptive grading and personalized learning paths, we ensure mastery of each concept. 
                  No shortcuts, no hand-holding—just deep, transformative technical excellence.
                </p>
                
                <div className="grid sm:grid-cols-2 gap-4 mt-8">
                  <div className="flex items-center space-x-3 p-4 bg-secondary rounded-lg">
                    <FiCheck className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>AI-Powered Learning</span>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-secondary rounded-lg">
                    <FiCheck className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>80+ Hours Weekly</span>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-secondary rounded-lg">
                    <FiCheck className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>Industry Mentors</span>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-secondary rounded-lg">
                    <FiCheck className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>Global Community</span>
                  </div>
                </div>
                
                <button className="button-primary px-6 py-3 rounded-md hover:scale-105 transform transition-all duration-200">
                  Our Learning Philosophy
                </button>
              </div>
              
              <div className="relative">
                <div className="rounded-2xl overflow-hidden shadow-theme-lg transform hover:scale-105 transition-transform duration-300">
                  <img 
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                    alt="Students collaborating"
                    className="w-full h-auto"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="text-sm opacity-90">10,000+ Active Learners</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Programs Section */}
        <section id="programs" className="py-20 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Intensive Programs</h2>
              <p className="text-xl text-secondary max-w-3xl mx-auto">
                Each program demands 80+ hours weekly of focused learning. Are you ready for the challenge?
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
              {programs.map((program, index) => (
                <div 
                  key={index} 
                  className="bg-card p-6 rounded-xl shadow-theme border border-primary hover:shadow-theme-lg transition-all duration-300 transform hover:-translate-y-2 group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="text-accent group-hover:scale-110 transition-transform duration-300">
                      {program.icon}
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                      program.status === 'popular' ? 'bg-success text-white' : 
                      program.status === 'new' ? 'bg-info text-white' : 
                      'bg-pending text-white'
                    }`}>
                      {program.status.replace('-', ' ').toUpperCase()}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3">{program.title}</h3>
                  <p className="text-secondary mb-4 text-sm leading-relaxed">{program.description}</p>
                  
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {program.skills.map((skill, skillIndex) => (
                        <span key={skillIndex} className="text-xs bg-accent text-on-accent px-2 py-1 rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-accent">{program.hours}</span>
                    <button className="button-outline px-4 py-2 text-sm rounded-md hover:scale-105 transform transition-all duration-200 flex items-center space-x-1">
                      <span>Explore</span>
                      <FiArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Community Section */}
        <section id="community" className="py-20 bg-primary">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">The cTerm Collective</h2>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="rounded-2xl overflow-hidden shadow-theme-lg order-2 lg:order-1 transform hover:scale-105 transition-transform duration-300">
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                  alt="Community members"
                  className="w-full h-auto"
                />
              </div>
              <div className="order-1 lg:order-2 space-y-6">
                <h3 className="text-2xl md:text-3xl font-semibold">Join 10,000+ Elite Learners</h3>
                <p className="text-lg leading-relaxed">
                  Our community thrives on challenge, mutual support, and relentless pursuit of excellence. 
                  When you join cTerm, you're not just learning—you're joining a movement.
                </p>
                
                <div className="space-y-4">
                  {[
                    { icon: <FiUsers />, text: "24/7 peer accountability groups" },
                    { icon: <FiCode />, text: "Expert-led code reviews weekly" },
                    { icon: <FiGlobe />, text: "Global hackathons and challenges" },
                    { icon: <FiAward />, text: "Industry mentorship program" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-secondary transition-colors duration-200">
                      <div className="text-success mt-1">{item.icon}</div>
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
                
                <button className="button-primary px-6 py-3 rounded-md hover:scale-105 transform transition-all duration-200 flex items-center space-x-2">
                  <FiUsers className="w-5 h-5" />
                  <span>Join the Community</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Impact Section */}
        <section id="impact" className="py-20 bg-accent text-on-accent">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Transforming Careers Globally</h2>
            <p className="text-xl mb-16 max-w-3xl mx-auto opacity-90">
              Our graduates don't just find jobs—they become the technical leaders shaping the future.
            </p>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {stats.map((stat, index) => (
                <div 
                  key={index} 
                  className="p-6 rounded-xl border border-blue-400 border-opacity-30 hover:bg-blue-500 hover:bg-opacity-10 transition-all duration-300 transform hover:scale-105"
                >
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className="text-3xl md:text-4xl font-bold mb-2">{stat.value}</div>
                  <div className="text-sm md:text-base opacity-90">{stat.label}</div>
                </div>
              ))}
            </div>
            
            <div className="max-w-4xl mx-auto">
              <p className="text-lg mb-8 opacity-90">
                "cTerm graduates consistently outperform in technical interviews and become our most 
                valuable contributors within months of joining."
              </p>
              <button className="button-secondary px-6 py-3 rounded-md border-on-accent text-on-accent hover:bg-white hover:bg-opacity-10 transition-all duration-200">
                Read Success Stories
              </button>
            </div>
          </div>
        </section>

        {/* Enhanced Talent Hub Section */}
        <section id="talent" className="py-20 bg-card">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Elite Talent Hub</h2>
              <p className="text-xl text-secondary max-w-3xl mx-auto">
                Our graduates represent the top 1% of technical talent. Hire proven performers who thrive under pressure.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold">Why cTerm Graduates Excel</h3>
                <div className="space-y-4">
                  {[
                    "Proven ability to handle 80+ hour work weeks",
                    "AI-verified technical competency",
                    "Real-world project portfolio",
                    "Continuous learning mindset",
                    "Global collaboration experience"
                  ].map((point, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <FiCheck className="w-5 h-5 text-success mt-1 flex-shrink-0" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="text-center space-y-6">
                <div className="bg-secondary p-8 rounded-2xl">
                  <div className="text-4xl font-bold text-accent mb-2">95%</div>
                  <p className="text-secondary">Performance rating from hiring partners</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="button-primary px-6 py-3 rounded-lg hover:scale-105 transform transition-all duration-200 flex-1">
                    Hire cTerm Grads
                  </button>
                  <button className="button-outline px-6 py-3 rounded-lg border-accent text-accent hover:scale-105 transform transition-all duration-200 flex-1">
                    Partner With Us
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced CTA Section */}
        <section className="py-20 bg-secondary relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-600/10" />
          <div className="container mx-auto px-4 text-center relative">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Push Your Limits?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-secondary">
              Join cTerm2025 and discover what you're truly capable of. The journey is demanding, but the rewards are extraordinary.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="button-primary px-8 py-4 text-lg rounded-lg font-semibold hover:scale-105 transform transition-all duration-200 flex items-center space-x-2">
                <span>Apply Now - It's Free</span>
                <FiArrowRight className="w-5 h-5" />
              </button>
              <p className="text-sm text-secondary">Join 500+ applications this month</p>
            </div>
          </div>
        </section>

        {/* Enhanced Footer */}
        <footer className="bg-accent text-on-accent py-12">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">cT</span>
                  </div>
                  <h2 className="text-xl font-bold">cTerm2025</h2>
                </div>
                <p className="text-sm opacity-80 mb-4">Revolutionizing technical education through rigorous, AI-powered learning experiences.</p>
                <div className="flex space-x-4">
                  <button className="p-2 rounded-lg hover:bg-blue-500 hover:bg-opacity-20 transition-colors duration-200">
                    <FiGlobe className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Programs</h3>
                <div className="space-y-2 text-sm">
                  <button className="block hover:text-blue-300 transition-colors duration-200">Software Engineering</button>
                  <button className="block hover:text-blue-300 transition-colors duration-200">Cybersecurity</button>
                  <button className="block hover:text-blue-300 transition-colors duration-200">Data Science</button>
                  <button className="block hover:text-blue-300 transition-colors duration-200">Mathematics</button>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Company</h3>
                <div className="space-y-2 text-sm">
                  <button className="block hover:text-blue-300 transition-colors duration-200">About</button>
                  <button className="block hover:text-blue-300 transition-colors duration-200">Careers</button>
                  <button className="block hover:text-blue-300 transition-colors duration-200">Contact</button>
                  <button className="block hover:text-blue-300 transition-colors duration-200">Privacy</button>
                </div>
              </div>
            </div>
            
            <div className="border-t border-blue-500 border-opacity-30 pt-8 text-center text-sm opacity-80">
              © {new Date().getFullYear()} cTerm2025. All rights reserved. Building the future of technical education.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;