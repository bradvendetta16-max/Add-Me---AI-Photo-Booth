
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="w-full text-center max-w-4xl mx-auto">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">
        AI Photo Booth: Add Me
      </h1>
      <p className="mt-4 text-lg text-gray-300">
        Ever take a great group photo but you're not in it? Upload the group shot, a photo of yourself, and let our AI magically add you in!
      </p>
    </header>
  );
};

export default Header;
