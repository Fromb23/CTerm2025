import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { typeWriter } from '../utils/typewriter';

const CheckerResult = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const stdoutRef = useRef(null);
  const hasAnimatedRef = useRef(false);

  const [isAnimating, setIsAnimating] = useState(true);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [showDetails, setShowDetails] = useState({
    stdout: true,
    stderr: false,
    exitCode: false
  });

  const {
    taskName,
    repoUrl,
    stdout = '',
    stderr = '',
    exitCode = 1,
  } = state || {};

  // Apply saved theme on mount or toggle
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Typewriter effect for stdout
  useEffect(() => {
    if (
      stdoutRef.current &&
      stdout &&
      !hasAnimatedRef.current
    ) {
      hasAnimatedRef.current = true;
      stdoutRef.current.textContent = '';
      setIsAnimating(true);

      typeWriter(stdout, stdoutRef.current, 12).then(() => {
        setIsAnimating(false);
        setShowDetails(prev => ({
          ...prev,
          exitCode: true,
          stderr: !!stderr
        }));
      });
    }
  }, [stdout, stderr]);

  if (!taskName || !repoUrl) {
    return (
      <div className="p-6 text-center text-error">
        <div className="bg-card p-6 rounded-lg shadow-md max-w-md mx-auto">
          <h2 className="text-xl font-bold mb-2">Invalid Data</h2>
          <p className="mb-4">Please run a check first</p>
          <button
            onClick={() => navigate('/')}
            className="button-primary px-4 py-2 rounded-md"
          >
            Start New Check
          </button>
        </div>
      </div>
    );
  }

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleDetail = (key) => {
    setShowDetails(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-primary text-primary">
      <div className="bg-card shadow-lg rounded-xl p-6 md:p-8 max-w-4xl w-full space-y-6 border border-accent/10">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-accent">Validation Results</h1>
            <p className="text-sm text-secondary">Task: {taskName}</p>
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-secondary hover:bg-accent/10 transition-colors"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>

        {/* Info Cards */}
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-secondary/30 p-4 rounded-lg">
              <h3 className="font-medium text-secondary mb-1">Repository</h3>
              <a 
                href={repoUrl} 
                target="_blank" 
                rel="noreferrer"
                className="text-accent underline break-all hover:text-accent-dark"
              >
                {repoUrl}
              </a>
            </div>

            <div className="bg-secondary/30 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-secondary">Status</h3>
                <button 
                  onClick={() => toggleDetail('exitCode')}
                  className="text-xs px-2 py-1 rounded bg-accent/10 hover:bg-accent/20"
                >
                  {showDetails.exitCode ? 'Hide' : 'Show'}
                </button>
              </div>
              {showDetails.exitCode && (
                <div className="mt-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                    exitCode === 0
                      ? 'bg-success text-on-success'
                      : 'bg-error text-on-error'
                  }`}>
                    {exitCode === 0 ? '✓' : '✗'} {exitCode} — {exitCode === 0 ? 'Success' : 'Failure'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Output Sections */}
          <div className="space-y-4">
            <div className="bg-secondary/30 rounded-lg overflow-hidden">
              <button 
                className="w-full flex justify-between items-center p-4 hover:bg-secondary/40 transition-colors"
                onClick={() => toggleDetail('stdout')}
              >
                <h3 className="font-medium">Standard Output</h3>
                <span>{showDetails.stdout ? '▲' : '▼'}</span>
              </button>
              {showDetails.stdout && (
                <div className="p-4 pt-0">
                  <pre 
                    ref={stdoutRef} 
                    className={`bg-secondary text-primary text-sm p-4 rounded overflow-auto font-mono ${
                      isAnimating ? 'opacity-80' : ''
                    }`}
                  />
                  {isAnimating && (
                    <div className="text-xs text-secondary mt-2">
                      Generating output...
                    </div>
                  )}
                </div>
              )}
            </div>

            {stderr && (
              <div className="bg-secondary/30 rounded-lg overflow-hidden">
                <button 
                  className="w-full flex justify-between items-center p-4 hover:bg-secondary/40 transition-colors"
                  onClick={() => toggleDetail('stderr')}
                >
                  <h3 className="font-medium">Error Output</h3>
                  <span>{showDetails.stderr ? '▲' : '▼'}</span>
                </button>
                {showDetails.stderr && (
                  <div className="p-4 pt-0">
                    <pre className="bg-error/10 text-error text-sm p-4 rounded overflow-auto font-mono">
                      {stderr}
                    </pre>
                    {stderr.includes("Invalid Git repository URL") && (
                      <div className="text-warning text-sm mt-2">
                        💡 Hint: Did you forget to add <code className="bg-secondary px-1 rounded">.git</code> at the end of the repo URL?
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <button
            onClick={() => {
              hasAnimatedRef.current = false; // reset for rerun
              navigate('/checker-submission', { state: { taskName, repoUrl } });
            }}
            className="button-primary flex-1 py-3 rounded-lg hover:scale-[1.02] transition-transform"
            disabled={isAnimating}
          >
            ↻ Rerun Check
          </button>
          <button
            onClick={() => navigate('/checker-submission')}
            className="button-secondary flex-1 py-3 rounded-lg hover:scale-[1.02] transition-transform"
          >
            ＋ New Check
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckerResult;