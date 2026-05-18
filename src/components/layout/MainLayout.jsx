import React from 'react';

const MainLayout = ({ children }) => {
  return (
    <div className="w-full min-h-screen bg-gray-100">
      {children}
    </div>
  );
};

export default MainLayout;