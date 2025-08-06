import React from "react";

const Loading = () => {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="w-6 h-6 border-4 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  );
};

export default Loading;
