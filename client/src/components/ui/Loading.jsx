import React from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

const Loading = ({ message = 'Loading...', fullScreen = false }) => {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    if (fullScreen) {
      const interval = setInterval(() => {
        setProgress(prev => (prev >= 95 ? 95 : prev + 5));
      }, 300);
      return () => clearInterval(interval);
    }
  }, [fullScreen]);

  return (
    <div
      className={`w-full h-screen flex items-center justify-center px-4 ${fullScreen
        ? 'fixed inset-0 z-50 bg-primary/80 backdrop-blur-sm'
        : ''
        }`}
    >
      <div className="flex flex-col items-center gap-4 max-w-xs text-center">
        <div className="relative">
          <AiOutlineLoading3Quarters
            className="animate-spin text-4xl icon-primary"
            style={{ animationDuration: '1.2s' }}
          />
          {fullScreen && (
            <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-secondary">
              {progress}%
            </span>
          )}
        </div>

        <p className="text-sm animate-pulse text-accent" style={{ animationDuration: '1.5s' }}>
          {message}
        </p>

        {fullScreen && (
          <div className="w-full bg-secondary rounded-full h-1.5">
            <div
              className="bg-accent h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Loading;