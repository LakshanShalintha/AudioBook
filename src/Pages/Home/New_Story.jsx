import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../Common_Parts/Common/NavBar';
import Footer from '../../Common_Parts/Common/Footer';

function New_Story() {
  const [storyInput, setStoryInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreateClick = () => {
    if (storyInput.trim() !== '') {
      setIsLoading(true);
      setTimeout(() => {
        navigate('/create-story', { state: { storyInput } });
      }, 2000);
    } else {
      alert('Please enter a word or phrase to create a story.');
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log('File uploaded:', file.name);
      // Handle file upload logic here
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-[#112233] to-[#000000] text-center text-white">
      <NavBar hideSearch={true} />

      <div className="flex-grow py-20 px-4 md:px-20 lg:px-60 mt-16">
        <h1 className="text-[54px] font-bold mb-4">Create Your Own Story</h1>

        <div className="flex flex-col items-center w-full max-w-md mx-auto mt-8">
          <input
            type="text"
            placeholder="Enter a word or phrase..."
            value={storyInput}
            onChange={(e) => setStoryInput(e.target.value)}
            className="border rounded-lg p-2 w-full text-black text-[16px]"
          />

          <button
            onClick={handleCreateClick}
            className={`bg-orange-500 text-white rounded-lg px-4 py-2 mt-6 text-[16px] ${
              isLoading ? 'cursor-not-allowed' : ''
            }`}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Create'}
          </button>
        </div>

        <div className="flex flex-col items-center w-full mx-auto mt-24 mb-8">
          <div className="relative w-full" style={{ maxWidth: '90rem' }}>
            <div className="absolute inset-x-0 top-0 flex justify-center -translate-y-1/2">
              <h2 className="bg-gray-100 text-[#112233] px-2 text-[20px] font-semibold">AudiRAB</h2>
            </div>
            <div className="border-b-2 border-gray-300 w-full"></div>
          </div>
        </div>

        <h2 className="text-[24px] font-bold mb-4 mt-28">Upload Your Story</h2>

        <label className="bg-orange-500 text-white rounded-lg px-4 py-2 text-[16px] cursor-pointer">
          Browse
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      <Footer />
    </div>
  );
}

export default New_Story;
