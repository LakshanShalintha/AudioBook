import axios from 'axios';

const API_KEY = 'af6679bc4bmsh9b5d5c0d3dde824p1de68ejsndae170e5101c';
const API_HOST = 'cloudlabs-text-to-speech.p.rapidapi.com';
const API_URL = 'https://cloudlabs-text-to-speech.p.rapidapi.com/synthesize';

// Define available voices
const voices = {
    male: 'en-US-3',
    female: 'en-US-1'
};
const speakStory = async (text, voiceType = 'male') => { // Default to male voice
    try {
        const voiceCode = voices[voiceType] || voices.male; // Fallback to male if the provided type is invalid
        const response = await axios.post(API_URL, {
            text: text,
            voice: voiceCode, // Use the selected voice code
            speed: 0.5,       // Speed of speech, 1 is normal speed
            outputFormat: 'mp3'
        }, {
            headers: {
                'x-rapidapi-key': API_KEY,
                'x-rapidapi-host': API_HOST,
                'Content-Type': 'application/json'
            },
            responseType: 'blob' // This ensures we get the audio file as a Blob
        });

        const audioUrl = window.URL.createObjectURL(new Blob([response.data]));
        const audio = new Audio(audioUrl);
        audio.play(); // Automatically play the audio
    } catch (error) {
        console.error('Error during text-to-speech conversion:', error);
    }
};

export default speakStory;


