import { useState, useEffect, useRef } from 'react';

export const useSpeech = () => {
  const [transcript, setTranscript] = useState('');
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Check SpeechRecognition browser support
    const SpeechRecognition = 
      window.SpeechRecognition || 
      window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      setSupported(true);
      const rec = new SpeechRecognition();
      rec.continuous = false; // Stop when user pauses
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onstart = () => {
        setListening(true);
        setTranscript('');
      };

      rec.onresult = (event) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
      };

      rec.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setListening(false);
      };

      rec.onend = () => {
        setListening(false);
      };

      recognitionRef.current = rec;
    }
  }, []);

  const startListening = () => {
    if (!supported || !recognitionRef.current) return;
    try {
      recognitionRef.current.start();
    } catch (err) {
      console.warn('Speech recognition start fail:', err);
    }
  };

  const stopListening = () => {
    if (!supported || !recognitionRef.current) return;
    try {
      recognitionRef.current.stop();
    } catch (err) {
      console.warn('Speech recognition stop fail:', err);
    }
  };

  return {
    transcript,
    listening,
    startListening,
    stopListening,
    supported
  };
};

export default useSpeech;
