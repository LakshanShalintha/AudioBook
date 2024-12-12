// eslint-disable-next-line no-unused-vars
import React, {useEffect, useRef, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {FaStop, FaTimes, FaVolumeUp} from 'react-icons/fa';
import NavBar from '../../Common_Parts/Common/NavBar';
import MusicVisualizer from './MusicVisualizer';
import * as pdfjsLib from "pdfjs-dist/webpack";
import {getDownloadURL, getStorage, ref} from "firebase/storage";

// Set worker source directly from a CDN
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js`;

const PDFViewer = () => {

    const location = useLocation();
    const navigate = useNavigate();

    // State variables
    const {pdfUrl} = location.state || {};
    const [extractedText, setExtractedText] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isMusicModalOpen, setIsMusicModalOpen] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false); // For TTS
    const [currentCharIndex, setCurrentCharIndex] = useState(0); // TTS character index
    const [showVisualizer, setShowVisualizer] = useState(false); // Toggle MusicVisualizer
    const [gender, setGender] = useState("Male"); // Default to "Male"

    // Refs
    const audioRef = useRef(null);
    const utteranceRef = useRef(null); // TTS utterance reference

    // Extract URL from search params
    const searchParams = new URLSearchParams(location.search);
    const urlFromParams = searchParams.get('pdfUrl');
    const finalPdfUrl = pdfUrl || urlFromParams;
    searchParams.get('story');

    // Speech control functions
    const handleSpeechToggle = () => {
        if (isSpeaking) {
            stopSpeech(); // Stop speech and MusicVisualizer
        } else {
            setIsModalOpen(true); // Open modal to ask about background music
        }
    };
    const stopSpeech = () => {
        window.speechSynthesis.cancel();
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        setShowVisualizer(false); // Hide visualizer
        setIsSpeaking(false);
        setIsPlaying(false);
    };
    // Set up speech with slower speed
    const startSpeechWithMusic = (musicUrl = null) => {
        if (extractedText.length === 0) return;

        const text = extractedText.join(" ");
        const utterance = new SpeechSynthesisUtterance(text.slice(currentCharIndex)); // Resume from `currentCharIndex`
        utteranceRef.current = utterance;

        utterance.rate = 0.75; // Set the speech rate (0.8 for slower speech)
        utterance.pitch = 1; // Optionally adjust pitch
        utterance.voice = window.speechSynthesis
            .getVoices()
            .find((voice) => (gender === "Male" ? voice.name.includes("Male") : voice.name.includes("Female"))) || null;

        utterance.onboundary = (event) => {
            if (event.name === "word") {
                setCurrentCharIndex(currentCharIndex + event.charIndex); // Update the index as the speech progresses
            }
        };

        utterance.onend = () => {
            stopSpeech(); // Ensure cleanup after speech ends
        };

        if (musicUrl) {
            audioRef.current = new Audio(musicUrl);
            audioRef.current.play().catch((error) => {
                console.error("Error playing the audio", error);
            });
        }

        window.speechSynthesis.speak(utterance);
        setIsSpeaking(true);
    };


    // Modal handling functions
    const handleModalClose = (addMusic) => {
        setIsModalOpen(false);


        if (addMusic) {
            setIsMusicModalOpen(true); // Open the music selection modal
        } else {
            startSpeechWithMusic(); // Start TTS without music
            setIsPlaying(true);
        }
    };

    const handleMusicSelection = (music) => {
        setIsMusicModalOpen(false);
        setIsPlaying(true);

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

        startSpeechWithMusic(musicUrl); // Start TTS with selected music
    };

    // PDF text extraction functions
    const extractTextFromPDF = async (filePath) => {
        setLoading(true);

        try {
            if (!filePath) {
                throw new Error("The PDF URL is invalid or undefined.");
            }

            const storage = getStorage();
            const fileRef = ref(storage, filePath);
            const url = await getDownloadURL(fileRef);

            // Fetch the PDF file
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to fetch the PDF. HTTP Status: ${response.status}`);
            }

            const arrayBuffer = await response.arrayBuffer();
            const typedArray = new Uint8Array(arrayBuffer);

            const pdf = await pdfjsLib.getDocument(typedArray).promise;
            let paragraphs = [];

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const content = await page.getTextContent();

                // Group text items into paragraphs
                const groupedParagraphs = groupTextIntoParagraphs(content.items);
                paragraphs.push(...groupedParagraphs);
            }

            setExtractedText(paragraphs);
        } catch (error) {
            console.error("Error extracting text from PDF:", error.message);
            setExtractedText(["Failed to extract text from the PDF.", error.message]);
        } finally {
            setLoading(false);
        }
    };

    // Helper function to group text into paragraphs
    const groupTextIntoParagraphs = (textItems) => {
        const lines = [];

        textItems.forEach((item) => {
            const y = Math.round(item.transform[5]); // Use the y-coordinate
            const text = item.str;

            // Find a line with a similar y-coordinate
            const existingLine = lines.find(
                (line) => Math.abs(line.y - y) < 5 // Adjust threshold for better grouping
            );

            if (existingLine) {
                existingLine.text += ` ${text}`; // Append text to the existing line
            } else {
                lines.push({y, text});
            }
        });

        // Sort lines by y-coordinate (descending for PDF rendering order)
        lines.sort((a, b) => b.y - a.y);

        // Combine lines into paragraphs based on proximity
        const paragraphs = [];
        let currentParagraph = "";

        lines.forEach((line, index) => {
            if (index === 0 || Math.abs(line.y - lines[index - 1].y) > 15) {
                // New paragraph if y-coordinate difference exceeds threshold
                if (currentParagraph.trim()) {
                    paragraphs.push(currentParagraph.trim());
                }
                currentParagraph = line.text;
            } else {
                currentParagraph += ` ${line.text}`; // Continue the current paragraph
            }
        });

        if (currentParagraph.trim()) {
            paragraphs.push(currentParagraph.trim()); // Add the last paragraph
        }

        return paragraphs;
    };

    // UseEffect to load the PDF
    useEffect(() => {
        if (urlFromParams) {
            console.log(urlFromParams);
            extractTextFromPDF(urlFromParams);
        } else if (urlFromParams == null) {
            console.log(pdfUrl)
            extractTextFromPDF(pdfUrl);
        } else {
            console.log("Invalid PDF URL");
            console.log(urlFromParams);
            setExtractedText(["Failed to extract text because the URL is invalid."]);
        }
    }, [urlFromParams]);

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
        <div className="relative min-h-screen bg-gray-900">
            <NavBar hideSearch={true}/>

            {/* Music Visualizer */}
            {isPlaying && (
                <div className="flex justify-center bg-gray-900 mt-[-20px]">
                    <MusicVisualizer/> {/* Positioned to stay in place */}
                </div>
            )}

            <div className={`pt-[92px] ${isPlaying ? 'mt-48' : ''}`}> {/* Adjusted margin when music is playing */}
                <iframe
                    src={finalPdfUrl}
                    className="w-full"
                    title="PDF Viewer"
                    style={{height: 'calc(100vh - 100px)', width: '100%'}}
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
                                onClick={() => handleModalClose(false)} // No music
                            >
                                No
                            </button>
                            <button
                                className="bg-green-500 text-white py-2 px-4 rounded-lg"
                                onClick={() => handleModalClose(true)} // Yes, add music
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

            {/* Display extracted text */}
            {/*<div className="bg-white p-4 rounded-md shadow-md">
                <h2 className="text-2xl font-bold text-gray-700 mb-4">Extracted Text</h2>
                {loading ? (
                    <p className="text-gray-500">Extracting text, please wait...</p>
                ) : (
                    <div className="bg-gray-100 p-4 rounded-md overflow-y-auto" style={{ maxHeight: "300px" }}>
                        {extractedText.map((paragraph, index) => (
                            <p key={index} className="text-sm text-gray-600 mb-4">
                                {paragraph}
                            </p>
                        ))}
                    </div>
                )}
            </div>*/}


            {/* Speaker Button and Gender Dropdown */}
            <div className={`fixed right-8 transition-all duration-500 ${isPlaying ? 'top-80' : 'top-36'}`}>
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

                {/* Gender Dropdown */}
                <div className="mt-4">
                    <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="bg-gray-700 text-white py-2 px-1 rounded-lg"
                    >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </div>
            </div>
        </div>
    );
};
export default PDFViewer;
