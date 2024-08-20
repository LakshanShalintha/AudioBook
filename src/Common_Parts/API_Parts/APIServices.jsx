import axios from 'axios';

const API_KEY = 'af6679bc4bmsh9b5d5c0d3dde824p1de68ejsndae170e5101c';
const API_HOST = 'cloudlabs-text-to-speech.p.rapidapi.com';
const API_URL = 'https://cloudlabs-text-to-speech.p.rapidapi.com/synthesize';

const speakStory = async (text, voiceCode = 'en-US-4') => { // Default to a known working voice code
    try {
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
