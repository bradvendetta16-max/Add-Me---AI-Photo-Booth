
import React, { useState, useCallback } from 'react';
import type { ImageFile } from './types';
import { fileToImageFile, dataUrlToImageFile } from './utils/fileUtils';
import { addPersonToPhoto, refinePhoto } from './services/geminiService';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import ResultDisplay from './components/ResultDisplay';
import LoadingSpinner from './components/LoadingSpinner';

const App: React.FC = () => {
  const [groupPhoto, setGroupPhoto] = useState<ImageFile | null>(null);
  const [personPhoto, setPersonPhoto] = useState<ImageFile | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [resultText, setResultText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [refinementPrompt, setRefinementPrompt] = useState<string>('');

  const handleImageUpload = useCallback(async (
    file: File, 
    setter: React.Dispatch<React.SetStateAction<ImageFile | null>>
  ) => {
    try {
      const imageFile = await fileToImageFile(file);
      setter(imageFile);
      setError(null);
    } catch (err) {
      setError('Failed to process image file. Please try another one.');
      console.error(err);
    }
  }, []);

  const handleGenerate = async () => {
    if (!groupPhoto || !personPhoto) {
      setError('Please upload both a group photo and a photo of the person to add.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResultImage(null);
    setResultText(null);

    try {
      const result = await addPersonToPhoto(groupPhoto, personPhoto);
      if (result.image) {
        setResultImage(`data:image/png;base64,${result.image}`);
        setResultText(result.text);
      } else {
        setError(result.text || 'The AI could not generate an image. Please try again.');
      }
    } catch (err: any) {
      setError(`An error occurred: ${err.message}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefine = async () => {
    if (!resultImage || !refinementPrompt.trim()) {
      setError('Please enter a refinement instruction.');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const currentImageFile = dataUrlToImageFile(resultImage);
      const result = await refinePhoto(currentImageFile, refinementPrompt);
      if (result.image) {
        setResultImage(`data:image/png;base64,${result.image}`);
        setResultText(result.text);
        setRefinementPrompt('');
      } else {
        setError(result.text || 'The AI could not refine the image. Please try again.');
      }
    } catch (err: any) {
      setError(`An error occurred: ${err.message}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setGroupPhoto(null);
    setPersonPhoto(null);
    setResultImage(null);
    setResultText(null);
    setError(null);
    setIsLoading(false);
    setRefinementPrompt('');
  };

  const isButtonDisabled = !groupPhoto || !personPhoto || isLoading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-slate-800 flex flex-col items-center p-4 sm:p-6 md:p-8">
      <Header />
      
      {!resultImage && (
        <main className="w-full max-w-5xl flex flex-col items-center mt-8">
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <ImageUploader
              id="group-photo"
              title="1. Upload Group Photo"
              description="Select the main photo where you want to add someone."
              onImageUpload={(file) => handleImageUpload(file, setGroupPhoto)}
              imagePreview={groupPhoto?.previewUrl || null}
            />
            <ImageUploader
              id="person-photo"
              title="2. Upload Person's Photo"
              description="Select a clear photo of the person you want to add."
              onImageUpload={(file) => handleImageUpload(file, setPersonPhoto)}
              imagePreview={personPhoto?.previewUrl || null}
            />
          </div>

          {error && <p className="text-red-400 text-center mb-4">{error}</p>}
          
          <button
            onClick={handleGenerate}
            disabled={isButtonDisabled}
            className={`relative w-full max-w-xs px-8 py-4 text-lg font-bold text-white rounded-full transition-all duration-300 ease-in-out overflow-hidden
              ${isButtonDisabled 
                ? 'bg-gray-600 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700 hover:scale-105 active:scale-100 transform'
              }`}
          >
            {isLoading ? <LoadingSpinner /> : 'Add Me In!'}
          </button>
        </main>
      )}

      {resultImage && (
        <ResultDisplay 
          image={resultImage}
          text={resultText}
          onReset={handleReset}
          onRefine={handleRefine}
          refinementPrompt={refinementPrompt}
          setRefinementPrompt={setRefinementPrompt}
          isRefining={isLoading}
        />
      )}
    </div>
  );
};

export default App;
