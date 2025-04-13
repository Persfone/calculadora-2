import React from 'react';

const Animaciones = ({ show }) => {
    const imageUrls = [
    '/llamada.png',
    '/react.png',
    '/tarea.jpg'
    ];

    if (!show) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-10">
        <img 
            src={imageUrls[1]} 
            alt="momo 1" 
            className="absolute top-24 left-4 w-49 h-49 z-10 animate-pulse"
        />
        <img 
            src={imageUrls[0]} 
            alt="momo 2" 
            className="absolute bottom-16 right-80 w-48 h-48 z-10 animate-spin"
        />
        <img 
            src={imageUrls[2]} 
            alt="momo 3" 
            className="absolute top-24 right-32 w-50 h-50 z-0 animate-bounce"
        />
        </div>
    );
};

export default Animaciones;