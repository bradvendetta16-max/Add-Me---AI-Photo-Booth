
import React from 'react';

interface ResultDisplayProps {
  image: string | null;
  text: string | null;
  onReset: () => void;
  onRefine: () => void;
  refinementPrompt: string;
  setRefinementPrompt: (prompt: string) => void;
  isRefining: boolean;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ 
  image, 
  text, 
  onReset,
  onRefine,
  refinementPrompt,
  setRefinementPrompt,
  isRefining
}) => {
  if (!image) return null;

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && refinementPrompt.trim() && !isRefining) {
      onRefine();
    }
  };

  return (
    <div className="mt-8 w-full max-w-4xl flex flex-col items-center animate-fade-in">
      <h2 className="text-3xl font-bold text-center mb-4">Here's your new photo!</h2>
      <div className="bg-gray-800/50 p-4 rounded-2xl shadow-2xl mb-6">
        <img src={image} alt="Generated group" className="max-w-full h-auto rounded-lg" />
      </div>
      {text && <p className="text-gray-300 italic text-center mb-6 max-w-2xl">AI Note: "{text}"</p>}
      
      <div className="w-full max-w-2xl my-6 p-6 bg-gray-800/50 rounded-2xl">
        <label htmlFor="refine-prompt" className="block text-lg font-medium text-gray-200 mb-3 text-center">
          Want to make a change?
        </label>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            id="refine-prompt"
            type="text"
            value={refinementPrompt}
            onChange={(e) => setRefinementPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g., 'Change my shirt to blue'"
            disabled={isRefining}
            className="flex-grow bg-gray-700 border border-gray-600 text-white rounded-full px-5 py-3 focus:ring-indigo-500 focus:border-indigo-500 transition disabled:opacity-50"
            aria-label="Refinement prompt"
          />
          <button
            onClick={onRefine}
            disabled={isRefining || !refinementPrompt.trim()}
            className={`px-8 py-3 font-bold text-white rounded-full transition-all duration-300 ease-in-out flex items-center justify-center min-w-[150px]
              ${(isRefining || !refinementPrompt.trim())
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-700 hover:scale-105 active:scale-100 transform'
              }`}
          >
            {isRefining ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                <span>Refining...</span>
              </>
            ) : 'Refine'}
          </button>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <a
          href={image}
          download="ai-group-photo.png"
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-transform transform hover:scale-105"
        >
          Download Image
        </a>
        <button
          onClick={onReset}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-transform transform hover:scale-105"
        >
          Try Another
        </button>
      </div>
    </div>
  );
};

export default ResultDisplay;
