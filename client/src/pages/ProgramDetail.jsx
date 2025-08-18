import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/themeContext.jsx';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import {
  FiArrowLeft,
  FiCalendar,
  FiClock,
  FiGlobe,
  FiChevronDown,
  FiChevronUp,
  FiCode,
  FiShield,
  FiDatabase,
  FiWifi,
  FiSun,
  FiMoon,
  FiArrowRight,
  FiPlay,
  FiBookOpen,
  FiAlertCircle
} from 'react-icons/fi';

const ProgramDetail = () => {
  const { programId } = useParams();
  const navigate = useNavigate();
  const { isDark, setIsDark } = useTheme();
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const toggleDarkMode = () => {
    setIsDark(prev => !prev);
  };

  const programs = {
    'software-engineering': {
      name: 'Software Engineering',
      icon: <FiCode className="w-8 h-8" />,
      duration: 24,
      mode_of_learning: 'online',
      commitment_time: 80,
      start_date: '2025-09-15',
      description: 'Master full-stack development with modern frameworks, cloud architecture, and enterprise-level software design patterns. This intensive program covers everything from frontend frameworks like React and Vue to backend systems with Node.js, microservices, and DevOps practices.',
      requirements: [
        { icon: <FiBookOpen />, text: 'Modern laptop with minimum 8GB RAM, 256GB SSD' },
        { icon: <FiWifi />, text: 'Stable internet connection (minimum 25 Mbps)' },
        { icon: <FiBookOpen />, text: 'Basic programming knowledge in any language' },
        { icon: <FiBookOpen />, text: 'High school mathematics or equivalent' }
      ],
      faqs: [
        {
          question: 'Do I need prior programming experience?',
          answer: 'Basic programming knowledge is recommended but not mandatory. Our intensive curriculum starts with fundamentals and quickly progresses to advanced topics.'
        },
        {
          question: 'What technologies will I learn?',
          answer: 'You\'ll master React, Node.js, TypeScript, Python, Docker, Kubernetes, AWS, MongoDB, PostgreSQL, and modern DevOps tools.'
        },
        {
          question: 'How demanding is the 80-hour commitment?',
          answer: 'This is an intensive bootcamp-style program. Expect 11+ hours daily including lectures, projects, code reviews, and self-study.'
        },
        {
          question: 'What kind of support will I receive?',
          answer: '24/7 community support, weekly 1-on-1 mentoring, code reviews, and career guidance from industry professionals.'
        }
      ]
    },
    'cybersecurity': {
      name: 'Cybersecurity',
      icon: <FiShield className="w-8 h-8" />,
      duration: 20,
      mode_of_learning: 'online',
      commitment_time: 80,
      start_date: '2025-10-01',
      description: 'Comprehensive cybersecurity training covering ethical hacking, penetration testing, network security, and enterprise security architecture. Learn offensive and defensive security techniques used by top-tier security professionals.',
      requirements: [
        { icon: <FiBookOpen />, text: 'High-performance laptop (16GB RAM recommended)' },
        { icon: <FiWifi />, text: 'Reliable internet for lab environments' },
        { icon: <FiBookOpen />, text: 'Basic networking and system administration knowledge' },
        { icon: <FiBookOpen />, text: 'Understanding of operating systems (Linux/Windows)' }
      ],
      faqs: [
        {
          question: 'Will I get industry certifications?',
          answer: 'Yes, the program prepares you for CEH, CISSP, and OSCP certifications. Exam vouchers included for qualified students.'
        },
        {
          question: 'Is this ethical hacking or defensive security?',
          answer: 'Both! You\'ll learn offensive security techniques for penetration testing and defensive strategies for threat detection and response.'
        },
        {
          question: 'Do I need a security background?',
          answer: 'Basic IT knowledge is sufficient. We cover fundamentals before advancing to complex security concepts and practical labs.'
        },
        {
          question: 'What lab environments are provided?',
          answer: 'Access to virtual labs with vulnerable systems, enterprise network simulations, and cloud security environments.'
        }
      ]
    },
    'data-science': {
      name: 'Data Science',
      icon: <FiDatabase className="w-8 h-8" />,
      duration: 28,
      mode_of_learning: 'online',
      commitment_time: 80,
      start_date: '2025-09-22',
      description: 'Advanced data science program covering machine learning, deep learning, big data engineering, and MLOps. Work with real datasets from leading companies and build production-ready ML systems.',
      requirements: [
        { icon: <FiBookOpen />, text: 'Laptop with GPU support preferred (NVIDIA recommended)' },
        { icon: <FiWifi />, text: 'High-speed internet for large dataset downloads' },
        { icon: <FiBookOpen />, text: 'Strong mathematics background (statistics, calculus)' },
        { icon: <FiBookOpen />, text: 'Basic Python programming experience' }
      ],
      faqs: [
        {
          question: 'What programming languages are covered?',
          answer: 'Primarily Python and R, with additional exposure to SQL, Scala for big data, and JavaScript for data visualization.'
        },
        {
          question: 'Will I work with real company data?',
          answer: 'Yes, our industry partners provide anonymized datasets from real business scenarios for hands-on projects.'
        },
        {
          question: 'How much math knowledge do I need?',
          answer: 'Strong foundation in statistics and calculus is essential. We provide math refreshers but assume undergraduate-level knowledge.'
        },
        {
          question: 'What\'s the job placement rate?',
          answer: '89% of graduates secure data science roles within 6 months, with average starting salaries of $95,000+.'
        }
      ]
    },
    'mathematics': {
      name: 'Applied Mathematics',
      icon: <FiWifi className="w-8 h-8" />,
      duration: 16,
      mode_of_learning: 'online',
      commitment_time: 80,
      start_date: '2025-11-01',
      description: 'Rigorous applied mathematics program focusing on algorithms, computational methods, and mathematical modeling for computer science applications. Perfect foundation for advanced CS studies.',
      requirements: [
        { icon: <FiBookOpen />, text: 'Standard laptop with mathematical software support' },
        { icon: <FiWifi />, text: 'Stable connection for interactive mathematical tools' },
        { icon: <FiBookOpen />, text: 'Strong high school mathematics background' },
        { icon: <FiBookOpen />, text: 'Logical thinking and problem-solving aptitude' }
      ],
      faqs: [
        {
          question: 'Is this theoretical or applied mathematics?',
          answer: 'Heavily applied with focus on computer science applications: algorithms, cryptography, machine learning math, and optimization.'
        },
        {
          question: 'What software tools will I use?',
          answer: 'MATLAB, Python with NumPy/SciPy, R, Wolfram Mathematica, and specialized algorithm visualization tools.'
        },
        {
          question: 'Do I need calculus knowledge?',
          answer: 'Yes, calculus and linear algebra are prerequisites. We build upon these to cover advanced topics like optimization and numerical methods.'
        },
        {
          question: 'How does this prepare me for tech roles?',
          answer: 'Essential for AI/ML engineering, quantitative analysis, algorithm development, and technical research positions.'
        }
      ]
    }
  };

  const currentProgram = programs[programId];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Error state for invalid program ID
  if (!currentProgram) {
    return (
      <div className={`${isDark ? 'dark' : ''}`}>
        <div className="bg-primary text-primary min-h-screen">
          {/* Header */}
          <header className="bg-accent text-on-accent py-4 shadow-theme-lg">
            <div className="container mx-auto px-4 flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => navigate(-1)}
                  className="border-on-accent text-on-accent"
                >
                  <FiArrowLeft className="w-4 h-4" />
                </Button>
                <h1 className="text-xl font-bold">cTerm2025</h1>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={toggleDarkMode}
                className="border-on-accent text-on-accent"
              >
                {isDark ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
              </Button>
            </div>
          </header>

          {/* Error Content */}
          <div className="container mx-auto px-4 py-20">
            <Card className="max-w-2xl mx-auto p-8 text-center">
              <FiAlertCircle className="w-16 h-16 text-accent mx-auto mb-6" />
              <h1 className="text-3xl font-bold mb-4">Program Not Found</h1>
              <p className="text-lg text-secondary mb-8">
                The program "{programId}" doesn't exist or may have been moved.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="primary" onClick={() => navigate('/')}>
                  Browse All Programs
                </Button>
                <Button variant="secondary" onClick={() => navigate(-1)}>
                  Go Back
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${isDark ? 'dark' : ''}`}>
      <div className="bg-primary text-primary min-h-screen transition-colors duration-300">

        {/* Header */}
        <header className="bg-accent text-on-accent py-4 shadow-theme-lg sticky top-0 z-50">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => navigate(-1)}
                className="border-on-accent text-on-accent"
              >
                <FiArrowLeft className="w-4 h-4" />
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">cT</span>
                </div>
                <h1 className="text-xl font-bold">cTerm2025</h1>
              </div>
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={toggleDarkMode}
              className="border-on-accent text-on-accent"
            >
              {isDark ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
            </Button>
          </div>
        </header>

        {/* Program Header */}
        <section className="bg-card py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center space-x-4 mb-6">
                <div className="text-accent">{currentProgram.icon}</div>
                <h1 className="text-3xl md:text-4xl font-bold">{currentProgram.name}</h1>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <Card className="p-4">
                  <div className="flex items-center space-x-3">
                    <FiCalendar className="w-5 h-5 text-accent" />
                    <div>
                      <p className="text-sm text-secondary">Start Date</p>
                      <p className="font-semibold">{formatDate(currentProgram.start_date)}</p>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4">
                  <div className="flex items-center space-x-3">
                    <FiClock className="w-5 h-5 text-accent" />
                    <div>
                      <p className="text-sm text-secondary">Duration</p>
                      <p className="font-semibold">{currentProgram.duration} weeks</p>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4">
                  <div className="flex items-center space-x-3">
                    <FiGlobe className="w-5 h-5 text-accent" />
                    <div>
                      <p className="text-sm text-secondary">Mode</p>
                      <p className="font-semibold capitalize">{currentProgram.mode_of_learning}</p>
                    </div>
                  </div>
                </Card>
              </div>

              <Card className="bg-accent text-on-accent p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-2">Intensive Commitment</h3>
                    <p className="opacity-90">{currentProgram.commitment_time} hours per week of focused learning</p>
                  </div>
                  <div className="text-4xl font-bold">{currentProgram.commitment_time}h</div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Program Description */}
        <section className="py-12 bg-primary">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">Program Overview</h2>
              <p className="text-lg leading-relaxed text-secondary">{currentProgram.description}</p>
            </div>
          </div>
        </section>

        {/* Requirements */}
        <section className="py-12 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-8">Requirements</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {currentProgram.requirements.map((req, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-start space-x-4">
                      <div className="text-accent mt-1">{req.icon}</div>
                      <p>{req.text}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 bg-card">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-8">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {currentProgram.faqs.map((faq, index) => (
                  <Card key={index} variant="outlined" className="overflow-hidden">
                    <button
                      onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                      className="w-full flex justify-between items-center p-4 text-left hover:bg-secondary transition-colors duration-200"
                    >
                      <span className="font-semibold">{faq.question}</span>
                      {expandedFAQ === index ?
                        <FiChevronUp className="w-5 h-5 text-accent flex-shrink-0" /> :
                        <FiChevronDown className="w-5 h-5 text-accent flex-shrink-0" />
                      }
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ${
                      expandedFAQ === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}>
                      <div className="p-4 pt-0 text-secondary border-t border-primary">
                        {faq.answer}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-accent text-on-accent">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Begin Your Journey?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Join thousands of learners who are transforming their careers with cTerm2025's intensive programs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary" size="lg" className="hover:scale-105 transform transition-all duration-200"
                onClick={() => navigate('/register')}>
                <FiArrowRight className="w-5 h-5 mr-2" />
                <span>Apply Now</span>
                <FiArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                variant="secondary" 
                size="lg"
                className="border-on-accent text-on-accent hover:bg-white hover:bg-opacity-10"
              >
                <FiPlay className="w-5 h-5 mr-2" />
                <span>Watch Preview</span>
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-primary py-8 border-t border-primary">
          <div className="container mx-auto px-4 text-center">
            <p className="text-secondary">© 2025 cTerm2025. Building the future of technical education.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ProgramDetail;