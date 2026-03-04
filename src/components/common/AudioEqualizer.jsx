import React from 'react';

const AudioEqualizer = ({ isListening }) => {
    if (!isListening) return null;

    return (
        <div className="flex items-center justify-center gap-[2px] h-4">
            <div className="w-1 bg-white rounded-full animate-equalizer-1"></div>
            <div className="w-1 bg-white rounded-full animate-equalizer-2"></div>
            <div className="w-1 bg-white rounded-full animate-equalizer-3"></div>
            <div className="w-1 bg-white rounded-full animate-equalizer-4"></div>
        </div>
    );
};

export default AudioEqualizer;
