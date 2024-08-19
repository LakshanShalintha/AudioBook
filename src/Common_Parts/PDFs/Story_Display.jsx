import React, { useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import NavBar from '../Common/NavBar';
import Footer from '../Common/Footer';
import { FaVolumeUp, FaStop } from "react-icons/fa"; // Import both speech and stop icons

const Story_Display = () => {
  const location = useLocation();
  const { story, input } = location.state || { story: "No story available", input: "Your Story" };

  const [rawSubtopic, ...restOfStory] = story.split('\n\n');
  const subtopic = rawSubtopic.replace(/^##\s*/, ''); // Remove the '## ' from the subtopic

  const paragraphs = restOfStory.join('\n\n').split('\n\n').map(paragraph => {
    return paragraph
      .replace(/([a-z])([A-Z])/g, '$1. $2')  // Add a period between lowercase and uppercase letters
      .replace(/([a-zA-Z])([0-9])/g, '$1, $2')  // Add a comma between letters and numbers
      .replace(/([0-9])([a-zA-Z])/g, '$1, $2'); // Add a comma between numbers and letters
  });

  const [isSpeaking, setIsSpeaking] = useState(false); // State to track whether speech is ongoing
  const [currentCharIndex, setCurrentCharIndex] = useState(0); // Track the current character index in the story

  const utteranceRef = useRef(null);

  const handleSpeechToggle = () => {
    if (isSpeaking) {
        window.speechSynthesis.cancel(); // Stop the speech
        setIsSpeaking(false); // Update state to reflect that speech has stopped
    } else {
        const cleanedStory = story.replace(/#\S+/g, ''); // Remove any #tags from the entire story text including the subtopic
        
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

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-[#112233] to-[#000000] text-center text-white relative">
      <NavBar hideSearch={true} />

      {/* Updated the CSS here */}
      <div className="fixed top-32 right-16">
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
      
      <div className="flex-grow py-20 px-4 md:px-20 lg:px-60 mt-16">
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
      </div>
      
      <Footer />
    </div>
  );
};

export default Story_Display;
