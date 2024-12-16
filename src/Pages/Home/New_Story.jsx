// eslint-disable-next-line no-unused-vars
import React, { useState, useRef } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useNavigate } from "react-router-dom";
import {ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase';
import jsPDF from "jspdf";
import 'jspdf-autotable';
import NavBar from '../../Common_Parts/Common/NavBar';
import Footer from '../../Common_Parts/Common/Footer';
import { FaTimes } from 'react-icons/fa'; // Import FaTimes icon

import onboardImage from '/images/Onboarding/onboard01.webp';

const New_Story = () => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showStopButton, setShowStopButton] = useState(false);
  const [story, setStory] = useState(null);
  const [summary, setSummary] = useState(null); // State to store the summary
  const [languagePopup, setLanguagePopup] = useState(false);
  const navigate = useNavigate();
  const abortControllerRef = useRef(null);

  const genAI = new GoogleGenerativeAI(
    "AIzaSyCOMGMDGUv3IsJEB-xmTskv9wF-pW7qotc"
  );

    const translateToLanguage = async (storyText, language) => {
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const translationPrompt = `Please translate the following story into ${language}, ensuring all English words are converted into ${language} while keeping the story meaning intact:\n\n${storyText}`;

            const result = await model.generateContent(translationPrompt);
            let translatedText = result.response.text();

            console.log("Translated Story:", translatedText);
            return translatedText;
        } catch (error) {
            console.error("Translation Error:", error);
            return storyText; // Return original if translation fails
        }
    };


    const validateWord = (phrase) => {
    const words = phrase.split(" ");
    if (words.length < 1 || words.length > 50) return false;
    const regex = /^[A-Za-z]{3,}$/;
    return words.every(word => regex.test(word));
  };

  const generateStory = async (language) => {
    setLoading(true);
    setShowStopButton(true);

    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });                      //Give the maximum number of words you can build

        const prompt = `Write a long imaginative audio book story for relax mind, give that perfect and like real story in more than 20000 words based on the phrase . based on the phrase and the story should real wold story: ${input}. The story should be engaging and suitable for all ages. Please generate the story in ${language}.`;

        const result = await model.generateContent(prompt, { signal });
        let storyText = result.response.text();
        storyText = storyText.replace(/\*/g, "").replace(/\(.*?\)/g, "").trim();

        // If language is Tamil or Sinhala, translate English words
        if (language === "Tamil" || language === "Sinhala") {
            storyText = await translateToLanguage(storyText, language);
        }

        console.log("Final Story:", storyText);
        setStory(storyText);




        // Generate the summary
        const summaryPrompt = `Please summarize the following story in ${language}: ${storyText}`;
        const summaryResult = await model.generateContent(summaryPrompt, { signal });
        const storySummary = summaryResult.response.text();
        setSummary(storySummary);

        console.log("Story Summary:", storySummary);


        const [rawSubtopic, ...restOfStory] = storyText.split('\n\n');
        const subtopic = rawSubtopic.replace(/^##\s*/, '');
        const paragraphs = restOfStory.join('\n\n').split('\n\n');

        const doc = new jsPDF();

        // Set gray background color for the entire page
        doc.setFillColor(0, 0, 0); // RGB for gray
        doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, 'F'); // Fill the entire page

        // Define margins and image dimensions
        const marginLeft = 2;
        const marginRight = 2;
        const marginTop = 2;
        const imgWidth = 20;
        const imgHeight = 20;

        // Calculate image position based on margins
        const xPos = doc.internal.pageSize.width - imgWidth - marginRight; // X position for the right corner
        const yPos = marginTop; // Y position for the top

        // Add the image to the PDF
        doc.addImage(onboardImage, 'webp', xPos, yPos, imgWidth, imgHeight);

        doc.setFont("helvetica", "bold"); // Set the font to Helvetica bold
        doc.setFontSize(44);
        doc.setTextColor(255, 255, 255); // Set text color to white

        // Calculate the text width
        const textWidth = doc.getTextWidth(input.toUpperCase());

        // Calculate the position to center the text
        const centerX = (doc.internal.pageSize.width - textWidth) / 2;

        // Add the centered, bold, white text to the PDF
        doc.text(input.toUpperCase(), centerX, yPos + imgHeight + 20);
        // Adjust text position

        const adjustedMarginLeft = marginLeft + 15; // Increase marginLeft by 10 units for additional left margin
        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.setTextColor(255, 213, 128);   //255, 195, 0/255, 191, 0
        doc.text(subtopic, adjustedMarginLeft, yPos + imgHeight + 40);

        //doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.setTextColor(255, 255, 255);


        const paragraphMarginLeft = marginLeft + 15; // Add additional left margin for paragraphs
        const paragraphMarginRight = marginRight + 15; // Add additional right margin for paragraphs

        let yOffset = yPos + imgHeight + 60;
        const pageHeight = doc.internal.pageSize.height;
        const lineHeight = 7;
        const marginBottom = 20;

        paragraphs.forEach((paragraph) => {
            // Adjust the width available for text by subtracting both margins
            const availableWidth = doc.internal.pageSize.width - paragraphMarginLeft - paragraphMarginRight;
            const textLines = doc.splitTextToSize(paragraph, availableWidth);

            textLines.forEach((line) => {
                if (yOffset + lineHeight > pageHeight - marginBottom) {
                    doc.addPage();
                    // Add gray background for the new page
                    doc.setFillColor(0, 0, 0); // RGB for black
                    doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, 'F');

                    yOffset = marginTop + imgHeight + 20; // Start new page with margin top
                    // Optionally, add the image to each new page
                    doc.addImage(onboardImage, 'webp', xPos, marginTop, imgWidth, imgHeight);
                }
                doc.text(line, paragraphMarginLeft, yOffset); // Use paragraphMarginLeft here
                yOffset += lineHeight;
            });

            yOffset += lineHeight; // Add extra space between paragraphs

            if (yOffset + lineHeight > pageHeight - marginBottom) {
                doc.addPage();
                // Add gray background for the new page
                doc.setFillColor(64, 64, 64); // RGB for gray
                doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, 'F');

                yOffset = marginTop + imgHeight + 20;
                // Optionally, add the image to each new page
                doc.addImage(onboardImage, 'webp', xPos, marginTop, imgWidth, imgHeight);
            }
        });

        if (language === 'English') { // Only save if the language is English
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
        }

        setLoading(false);
        setShowStopButton(false);
        navigate("/display-story", { state: { story: storyText, input, summary: storySummary } });
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

  const handleGenerateClick = () => {
    if (!validateWord(input)) {
      setShowPopup(true);
      return;
    }
    setLanguagePopup(true);
  };

  const selectLanguage = (language) => {
    setLanguagePopup(false);
    generateStory(language);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-[#112233] to-[#000000] text-center text-white">
      <NavBar hideSearch={true} />

      <div className="flex-grow py-20 px-4 md:px-20 lg:px-60 mt-16">
        <h1 className="text-[54px] font-bold mb-4">Create Your Own Story</h1>

        <div className="flex flex-col items-center w-full max-w-md mx-auto mt-8 relative">
          <input
            type="text"
            placeholder="Enter your title to generate a story"
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
                &#x25A0;
              </button>
            </div>
          )}
        </div>

        <button
          className="bg-orange-500 text-white rounded-lg px-4 py-2 mt-6 text-[16px]"
          onClick={handleGenerateClick}
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Story"}
        </button>

        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <p className="text-red-500 text-xl font-bold mb-4">Enter the correct title</p>
              <button
                className="bg-orange-500 text-white rounded-lg px-4 py-2 text-[16px]"
                onClick={() => setShowPopup(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {languagePopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-gray-400 p-6 rounded-lg shadow-lg relative">
              <button
                className="absolute top-0 right-0 mt-2 mr-2 text-black"
                onClick={() => setLanguagePopup(false)}
              >
                <FaTimes size={20} />
              </button>
              <p className="text-black text-[24px] font-bold mb-4">Select language?</p>
              <div className="flex justify-between">
                <button
                  className="bg-orange-400 text-white rounded-lg px-4 py-2 text-[16px] mr-2"
                  onClick={() => selectLanguage('English')}
                >
                  English
                </button>
                <button
                  className="bg-orange-400 text-white rounded-lg px-4 py-2 text-[16px] mr-2"
                  onClick={() => selectLanguage('Sinhala')}
                >
                  Sinhala
                </button>
                <button
                  className="bg-orange-400 text-white rounded-lg px-4 py-2 text-[16px]"
                  onClick={() => selectLanguage('Tamil')}
                >
                  Tamil
                </button>
              </div>
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


        {story && (
          <div className="mt-8 text-left">
            <h3 className="text-[28px] font-bold mb-4">Story:</h3>
            <p className="text-[18px]">{story}</p>

            {summary && (
              <>
                <h3 className="text-[28px] font-bold mt-8 mb-4">Summary:</h3>
                <p className="text-[18px]">{summary}</p>
              </>
            )}
          </div>
        )}

      </div>

      <Footer />
    </div>
  );
};

export default New_Story;
