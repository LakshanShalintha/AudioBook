import React, { useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import NavBar from '../Common/NavBar';
import Footer from '../Common/Footer';
import { FaVolumeUp, FaStop, FaTimes } from "react-icons/fa"; // Import FaTimes icon
import MusicVisualizer from './MusicVisualizer'; // Import the visualizer component
import handleDownload from "../../Common_Parts/PDFs/handleDownload";
// Import the handleDownload function

const Story_Display = () => {
  const location = useLocation();
  const { story, input } = location.state || { story: "No story available", input: "Your Story" };

  const [rawSubtopic, ...restOfStory] = story.split('\n\n');
  const subtopic = rawSubtopic.replace(/^##\s*/, '');

  const paragraphs = restOfStory.join('\n\n').split('\n\n').map(paragraph => {
    return paragraph
      .replace(/([a-z])([A-Z])/g, '$1. $2')
      .replace(/([a-zA-Z])([0-9])/g, '$1, $2')
      .replace(/([0-9])([a-zA-Z])/g, '$1, $2');
  });

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMusicModalOpen, setIsMusicModalOpen] = useState(false);
  const [message, setMessage] = useState(""); // For showing download status messages

  const utteranceRef = useRef(null);
  const audioRef = useRef(null);

  const handleSpeechToggle = () => {
    if (isSpeaking) {
      stopSpeech();
    } else {
      setIsModalOpen(true);
    }
  };

  const stopSpeech = () => {
    window.speechSynthesis.cancel();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsSpeaking(false);
  };

  const handleModalClose = (addMusic) => {
    setIsModalOpen(false);
    
    if (addMusic) {
      setIsMusicModalOpen(true);
    } else {
      startSpeechWithMusic();
    }
  };

  const startSpeechWithMusic = (musicUrl = null) => {
    const cleanedStory = story.replace(/#\S+/g, '');
    
    const utterance = new SpeechSynthesisUtterance(cleanedStory.slice(currentCharIndex));
    utteranceRef.current = utterance;

    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        setCurrentCharIndex(currentCharIndex + event.charIndex);
      }
    };

    utterance.onend = () => {
      stopSpeech();
    };

    if (musicUrl) {
      audioRef.current = new Audio(musicUrl);
      audioRef.current.play().catch(error => {
        console.error("Error playing the audio", error);
      });
    }

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
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

    startSpeechWithMusic(musicUrl);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-[#112233] to-[#000000] text-center text-white relative">
      <NavBar hideSearch={true} />
      
      {/* Music Visualizer */}
      {isSpeaking && <MusicVisualizer className="mt-32" />}

      {/* First Modal */}
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

      {/* Second Modal for Music Selection */}
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

      <div className={`fixed right-16 z-10 transition-all duration-500 ${isSpeaking ? 'top-40' : 'top-16'}`}>
        {isSpeaking ? (
          <FaStop 
            onClick={handleSpeechToggle}
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
            onClick={handleSpeechToggle}
            className="cursor-pointer text-black p-2 border border-black mt-16" 
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
      
      <div className={`flex-grow py-20 px-4 md:px-20 lg:px-60 transition-all duration-500 ${isSpeaking ? 'mt-40' : 'mt-0'}`}>
        <h1 className="text-[84px] font-bold mb-4">{input.toUpperCase()}</h1>
        
        {subtopic && (
          <div className="bg-white text-red-500 p-4 rounded-lg mb-4">
            <h2 
              className="text-[32px] font-semibold overflow-hidden text-ellipsis whitespace-nowrap"
              style={{ width: '100%' }}
            >
              {subtopic}
            </h2>
          </div>
        )}
        
        <div className="bg-white text-black p-6 rounded-lg shadow-lg text-left">
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="text-[18px] mb-4">{paragraph}</p>
          ))}
        </div>
        
        {/* Download Button */}
        <div className="mt-8">
          <button
            className="bg-green-500 text-white py-2 px-4 rounded-lg"
            onClick={() => handleDownload(input, paragraphs, setMessage)}
          >
            Download PDF
          </button>
        </div>

        {/* Message Display */}
        {message && (
          <div className="bg-yellow-500 text-black py-2 px-4 rounded-lg mt-4">
            {message}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Story_Display;
