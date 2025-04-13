import { useEffect, useRef } from 'react';

const Audio = ({ play }) => {
    const audioRef = useRef(null);

    useEffect(() => {
        // Verificamos que estamos en el cliente (navegador)
        if (typeof window !== 'undefined') {
        audioRef.current = new window.Audio('/intro.mp3');
        }

        return () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        };
    }, []);

    useEffect(() => {
        if (!audioRef.current) return;

        if (play) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(e => console.log('Error al reproducir audio:', e));
        } else {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        }
    }, [play]);

    return null;
};

export default Audio;