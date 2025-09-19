import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-gray-600">
            © 2025 Student Registration System. Built with React.
          </p>
          <p className="text-sm text-gray-500 mt-2 sm:mt-0">
            Data persisted to localStorage
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;