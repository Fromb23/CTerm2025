import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateTask } from '../services/checkerService';

const CheckerSubmission = () => {
  const [formData, setFormData] = useState({
    taskName: '',
    repoUrl: '',
    stdout: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await validateTask(formData.taskName, formData.repoUrl);
      
      navigate('/result', {
        state: {
          taskName: formData.taskName,
          repoUrl: formData.repoUrl,
          stdout: result.stdout,
          stderr: result.stderr,
          exitCode: result.exit_code
        }
      });
    } catch (err) {
      const message = err.response?.data?.error || err.message || 'Validation failed';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary text-text">
      <div className="bg-secondary p-8 rounded-lg shadow-lg w-full max-w-md border border-accent/20">
        <h1 className="text-3xl font-bold mb-6 text-center text-accent">Task Checker</h1>

        {error && (
          <div className="mb-4 p-3 bg-error/20 text-error rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="taskName"
            value={formData.taskName}
            onChange={handleChange}
            placeholder="Task name"
            required
            className="w-full bg-primary border border-accent/20 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-text placeholder-text-muted"
          />
          <input
            type="url"
            name="repoUrl"
            value={formData.repoUrl}
            onChange={handleChange}
            placeholder="GitHub Repo URL"
            required
            className="w-full bg-primary border border-accent/20 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-text placeholder-text-muted"
          />
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-accent text-on-accent p-3 rounded-lg transition duration-300 font-medium shadow-lg hover:shadow-accent/20 flex justify-center items-center ${
              isLoading ? 'opacity-75 cursor-not-allowed' : 'hover:bg-accent-dark'
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Validating...
              </>
            ) : (
              'Validate'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckerSubmission;