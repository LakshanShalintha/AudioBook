import React, { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
<<<<<<< HEAD
import { FaVolumeUp, FaStop, FaTimes } from 'react-icons/fa';
import NavBar from '../../Common_Parts/Common/NavBar';
import MusicVisualizer from './MusicVisualizer';
=======
import { FaVolumeUp, FaStop } from 'react-icons/fa';
import NavBar from '../../Common_Parts/Common/NavBar';
>>>>>>> 46197457c9546c4070be63de12004d6eb700cc24

const PDFViewer = () => {
  const location = useLocation();
  const navigate = useNavigate();

<<<<<<< HEAD
  const { pdfUrl, story } = location.state || {};

=======
  // Destructure with a fallback to query parameters
  const { pdfUrl, story } = location.state || {};

  // If state is null, parse query parameters
>>>>>>> 46197457c9546c4070be63de12004d6eb700cc24
  const searchParams = new URLSearchParams(location.search);
  const urlFromParams = searchParams.get('pdfUrl');
  const storyFromParams = searchParams.get('story');

  const finalPdfUrl = pdfUrl || urlFromParams;
  const finalStory = story || storyFromParams;

<<<<<<< HEAD
  const [isPlaying, setIsPlaying] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMusicModalOpen, setIsMusicModalOpen] = useState(false);

  const audioRef = useRef(null);

  const handleMusicToggle = () => {
    if (isPlaying) {
      stopMusic();
    } else {
      setIsModalOpen(true); // Open the initial modal to ask about background music
    }
  };

  const stopMusic = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
  };

  const handleModalClose = (addMusic) => {
    setIsModalOpen(false);
    
    if (addMusic) {
      setIsMusicModalOpen(true); // Open the music selection modal
    } else {
      startMusic("https://firebasestorage.googleapis.com/v0/b/audirab-44b07.appspot.com/o/animation?alt=media"); // Play silent audio if "No" is selected
    }
  };

  const startMusic = (musicUrl) => {
    audioRef.current = new Audio(musicUrl);
    audioRef.current.play().catch(error => {
      console.error("Error playing the audio", error);
    });
    setIsPlaying(true);
  };

  const handleMusicSelection = (music) => {
    setIsMusicModalOpen(false);

    let musicUrl = "";
    if (music === "Nature") {
      musicUrl = "https://firebasestorage.googleapis.com/v0/b/audirab-44b07.appspot.com/o/Background%20Music%2FNature.mp3?alt=media";
    } else if (music === "Rain") {
      musicUrl = "https://firebasestorage.googleapis.com/v0/b/audirab-44b07.appspot.com/o/Background%20Music%2FRain.mp3?alt=media";
    } else if (music === "Calm") {
      musicUrl = "https://firebasestorage.googleapis.com/v0/b/audirab-44b07.appspot.com/o/Background%20Music%2FCalm.mp3?alt=media";
    } else if (music === "Water") {
      musicUrl = "https://firebasestorage.googleapis.com/v0/b/audirab-44b07.appspot.com/o/Background%20Music%2FWater.mp3?alt=media";
    } else if (music === "Horror") {
      musicUrl = "https://firebasestorage.googleapis.com/v0/b/audirab-44b07.appspot.com/o/Background%20Music%2FHorror.mp3?alt=media";
    } else if (music === "Classic") {
      musicUrl = "https://firebasestorage.googleapis.com/v0/b/audirab-44b07.appspot.com/o/Background%20Music%2FClassic.mp3?alt=media";
    } else if (music === "Action") {
      musicUrl = "https://firebasestorage.googleapis.com/v0/b/audirab-44b07.appspot.com/o/Background%20Music%2FAction.mp3?alt=media";
    }

    startMusic(musicUrl);
  };

=======
  // State to track whether speech is ongoing
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentCharIndex, setCurrentCharIndex] = useState(0); // Track the current character index in the story
  const utteranceRef = useRef(null);

  const handleSpeechToggle = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel(); // Stop the speech
      setIsSpeaking(false); // Update state to reflect that speech has stopped
    } else {
      const cleanedStory = finalStory || "No story available"; // Fallback if story is not available

      const utterance = new SpeechSynthesisUtterance(cleanedStory.slice(currentCharIndex));
      utteranceRef.current = utterance;

      utterance.onboundary = (event) => {
        if (event.name === 'word') {
          setCurrentCharIndex(currentCharIndex + event.charIndex);
        }
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setCurrentCharIndex(0); // Reset the character index when speech ends naturally
      };

      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true); // Update state to reflect that speech has started
    }
  };

>>>>>>> 46197457c9546c4070be63de12004d6eb700cc24
  // If there's no pdfUrl, show an error message and navigate back to the gallery
  if (!finalPdfUrl) {
    return (
      <div className="text-center mt-20">
        <p className="text-red-500">No PDF selected. Redirecting to the gallery...</p>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
          onClick={() => navigate('/')}
        >
          Go to Gallery
        </button>
      </div>
    );
  }

  return (
<<<<<<< HEAD
    <div className="relative min-h-screen bg-gray-900">
      <NavBar hideSearch={true} />
      
      {/* Music Visualizer */}
      {isPlaying && (
        <div className="flex justify-center bg-gray-900 mt-[-20px]">
          <MusicVisualizer /> {/* Positioned to stay in place */}
        </div>
      )}

      <div className={`pt-[80px] ${isPlaying ? 'mt-52' : ''}`}> {/* Adjusted margin when music is playing */}
        <iframe
          src={finalPdfUrl}
          className="w-full"
          title="PDF Viewer"
          style={{ height: 'calc(100vh - 100px)', width: '100%' }}
        ></iframe>
      </div>

      {/* First Modal to ask about background music */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg text-white relative">
            <FaTimes
              className="absolute top-2 right-2 text-gray-600 cursor-pointer"
              onClick={() => setIsModalOpen(false)}
            />
            <h2 className="text-lg font-semibold mb-4">Do you want to add background music?</h2>
            <div className="flex justify-end">
              <button
                className="bg-red-500 text-white py-2 px-4 rounded-lg mr-2"
                onClick={() => handleModalClose(false)}
              >
                No
              </button>
              <button
                className="bg-green-500 text-white py-2 px-4 rounded-lg"
                onClick={() => handleModalClose(true)}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Second Modal for music selection */}
      {isMusicModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg text-white relative">
            <FaTimes
              className="absolute top-2 right-2 text-gray-600 cursor-pointer"
              onClick={() => setIsMusicModalOpen(false)}
            />
            <h2 className="text-lg font-semibold mb-4">Select Background Music</h2>
            <div className="flex flex-col space-y-2">
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded-lg"
                onClick={() => handleMusicSelection("Nature")}
              >
                Nature
              </button>
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded-lg"
                onClick={() => handleMusicSelection("Rain")}
              >
                Rain
              </button>
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded-lg"
                onClick={() => handleMusicSelection("Calm")}
              >
                Calm
              </button>
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded-lg"
                onClick={() => handleMusicSelection("Water")}
              >
                Water
              </button>
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded-lg"
                onClick={() => handleMusicSelection("Horror")}
              >
                Horror
              </button>
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded-lg"
                onClick={() => handleMusicSelection("Classic")}
              >
                Classic
              </button>
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded-lg"
                onClick={() => handleMusicSelection("Action")}
              >
                Action
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Speaker Button */}
      <div className={`fixed right-8 transition-all duration-500 ${isPlaying ? 'top-80' : 'top-32'}`}>
        {isPlaying ? (
          <FaStop 
            onClick={handleMusicToggle}
=======
    <div className="relative min-h-screen bg-gray-100">
      <NavBar hideSearch={true} />

      <div style={{ paddingTop: '18px' }}></div>

      <iframe
        src={finalPdfUrl}
        className="w-full"
        title="PDF Viewer"
        style={{ height: 'calc(100vh - 64px)', marginTop: '64px' }} // Adjusting for the NavBar height
      ></iframe>

      {/* Speaker Button */}
      <div className="fixed top-40 right-16">
        {isSpeaking ? (
          <FaStop 
            onClick={handleSpeechToggle}
>>>>>>> 46197457c9546c4070be63de12004d6eb700cc24
            className="cursor-pointer text-black p-2 border border-black" 
            style={{ 
              fontSize: '30px',
              borderRadius: '10px',
              backgroundColor: 'white',
              width: '40px',
              height: '40px',
            }} 
          />
        ) : (
          <FaVolumeUp 
<<<<<<< HEAD
            onClick={handleMusicToggle}
=======
            onClick={handleSpeechToggle}
>>>>>>> 46197457c9546c4070be63de12004d6eb700cc24
            className="cursor-pointer text-black p-2 border border-black" 
            style={{ 
              fontSize: '40px',
              borderRadius: '10px',
              backgroundColor: 'orange',
              width: '50px',
              height: '50px',
            }} 
          />
        )}
      </div>
    </div>
  );
};

export default PDFViewer;
