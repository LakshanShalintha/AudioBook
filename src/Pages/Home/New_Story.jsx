import React, { useState, useRef } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useNavigate } from "react-router-dom";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase';
import jsPDF from "jspdf";
import NavBar from '../../Common_Parts/Common/NavBar';
import Footer from '../../Common_Parts/Common/Footer';
import speakStory from '../../Common_Parts/API_Parts/APIServices'; // Import the speech service
import { FaVolumeUp } from 'react-icons/fa'; // Import the speech icon

const New_Story = () => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showStopButton, setShowStopButton] = useState(false);
  const [story, setStory] = useState(null); // State to store the generated story
  const navigate = useNavigate();
  const abortControllerRef = useRef(null);

  const genAI = new GoogleGenerativeAI(
    "AIzaSyBSjI-d3vJnbEcADHl_NWnadU_KB7NXy2I"
  );

  const validateWord = (word) => {
    const regex = /^[A-Za-z]{3,}$/;
    return regex.test(word);
  };

  const generateStory = async () => {
    if (!validateWord(input)) {
        setShowPopup(true);
        return;
    }

    setLoading(true);
    setShowStopButton(true);

    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

<<<<<<< HEAD
        const prompt = `Write a long imaginative audio book story for relax mined, give that perfect and like real story in 20000 words based on the word: ${input}. The story should be engaging and suitable for all ages.`;
=======
        const prompt = `Write a long imaginative audio book story for relax mined in 15000 words based on the word: ${input}. The story should be engaging and suitable for all ages.`;
>>>>>>> 46197457c9546c4070be63de12004d6eb700cc24

        const result = await model.generateContent(prompt, { signal });
        let storyText = result.response.text();

        // Remove star marks (*) from the story text
        storyText = storyText.replace(/\*/g, "");
        console.log("Generated Story:", storyText);

        setStory(storyText); // Save the story to state

        const [rawSubtopic, ...restOfStory] = storyText.split('\n\n');
        const subtopic = rawSubtopic.replace(/^##\s*/, ''); 
        const paragraphs = restOfStory.join('\n\n').split('\n\n');

        const doc = new jsPDF();

        doc.setFontSize(24);
        doc.setTextColor(0, 0, 0); 
        doc.text(input.toUpperCase(), 20, 30);

        doc.setFontSize(18);
        doc.setTextColor(255, 0, 0); 
        doc.text(subtopic, 20, 50);

        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0); 

        let yOffset = 70;
        const pageHeight = doc.internal.pageSize.height;
        const marginBottom = 20;

        paragraphs.forEach((paragraph) => {
            const textLines = doc.splitTextToSize(paragraph, 180);
            textLines.forEach((line) => {
                if (yOffset > pageHeight - marginBottom) {
                    doc.addPage();
                    yOffset = 20;
                }
                doc.text(line, 20, yOffset);
                yOffset += 10;
            });

            yOffset += 10;

            if (yOffset > pageHeight - marginBottom) {
                doc.addPage();
                yOffset = 20;
            }
        });

        const pdfBlob = doc.output("blob");

        const pdfName = `${input}.pdf`;
        const storageRef = ref(storage, `stories/${pdfName}`);
        const uploadTask = uploadBytesResumable(storageRef, pdfBlob);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
            },
            (error) => {
                console.error("Error uploading file:", error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log('File available at', downloadURL);
                    window.open(downloadURL, '_blank');
                });
            }
        );

        setLoading(false);
        setShowStopButton(false);
        navigate("/display-story", { state: { story: storyText, input } });
    } catch (error) {
        if (error.name === 'AbortError') {
            console.log("Story generation process was aborted");
        } else {
            console.log("Error: ", error);
        }
        setLoading(false);
        setShowStopButton(false);
    }
};


  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setLoading(false);
      setShowStopButton(false);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("Selected file:", file);

      const storageRef = ref(storage, `files/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
        },
        (error) => {
          console.error("Error uploading file:", error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('File available at', downloadURL);
            
            // Navigate to PDFViewer page and pass the downloadURL as a state
            navigate('/pdf-viewer', { state: { pdfUrl: downloadURL, story: file.name } });
          });
        }
      );
    }
  };


  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-[#112233] to-[#000000] text-center text-white">
      <NavBar hideSearch={true} />

      <div className="flex-grow py-20 px-4 md:px-20 lg:px-60 mt-16">
        <h1 className="text-[54px] font-bold mb-4">Create Your Own Story</h1>

        <div className="flex flex-col items-center w-full max-w-md mx-auto mt-8 relative">
          <input
            type="text"
<<<<<<< HEAD
            placeholder="Enter your title to generate a story"
=======
            placeholder="Enter a word to generate a story"
>>>>>>> 46197457c9546c4070be63de12004d6eb700cc24
            className="border rounded-lg p-2 w-full text-black text-[16px]"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          {showStopButton && (
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 mr-4">
              <button
                className="text-black"
                onClick={handleStop}
                disabled={!loading}
                style={{ fontSize: '20px', background: 'none', border: 'none', padding: '0' }}
              >
                &#x25A0; {/* Black square icon representing the stop button */}
              </button>
            </div>
          )}
        </div>

        <button
          className="bg-orange-500 text-white rounded-lg px-4 py-2 mt-6 text-[16px]"
          onClick={generateStory}
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Story"}
        </button>

        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
<<<<<<< HEAD
              <p className="text-red-500 text-xl font-bold mb-4">Enter the correct title</p>
=======
              <p className="text-red-500 text-xl font-bold mb-4">Enter correct words</p>
>>>>>>> 46197457c9546c4070be63de12004d6eb700cc24
              <button
                className="bg-orange-500 text-white rounded-lg px-4 py-2 text-[16px]"
                onClick={() => setShowPopup(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}

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

        {/* Conditionally render the speech button */}
        {story && (
          <div className="mt-8">
            <button
              className="text-white bg-blue-500 p-2 rounded-full"
              onClick={() => speakStory(story)}
            >
              <FaVolumeUp size={24} />
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default New_Story;
