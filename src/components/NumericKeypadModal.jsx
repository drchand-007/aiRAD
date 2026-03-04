import React, { useState } from 'react';
import { X, Delete } from 'lucide-react';

export default function NumericKeypadModal({ isOpen, onClose, onInsert, initialValue = "" }) {
    const [value, setValue] = useState(initialValue);

    if (!isOpen) return null;

    const handlePress = (key) => {
        if (key === 'C') {
            setValue("");
        } else if (key === 'DEL') {
            setValue(prev => prev.slice(0, -1));
        } else {
            setValue(prev => prev + key);
        }
    };

    const handleInsert = () => {
        onInsert(value);
        onClose();
        setValue("");
    };

    const buttons = [
        '7', '8', '9',
        '4', '5', '6',
        '1', '2', '3',
        'C', '0', '.',
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm sm:p-4 animate-in fade-in duration-200">
            <div className="bg-card w-full h-full sm:h-auto sm:max-w-xs sm:rounded-2xl shadow-2xl border border-border overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
                    <h3 className="font-semibold text-foreground">Enter Measurement</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-muted text-muted-foreground transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Display */}
                <div className="p-6 bg-background border-b border-border flex items-center justify-between flex-shrink-0">
                    <div className="text-4xl font-bold tracking-wider text-foreground min-h-[40px] flex items-center">
                        {value || <span className="text-muted-foreground/50">_</span>}
                    </div>
                    <button onClick={() => handlePress('DEL')} className="p-3 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-xl transition-colors">
                        <Delete size={28} />
                    </button>
                </div>

                {/* Keypad */}
                <div className="p-4 grid grid-cols-3 gap-3 bg-muted/10 flex-1 content-center">
                    {buttons.map((btn) => (
                        <button
                            key={btn}
                            onClick={() => handlePress(btn)}
                            className={`h-16 rounded-xl text-2xl font-medium transition-all active:scale-95 ${btn === 'C' ? 'bg-orange-500/10 text-orange-400 hover:bg-orange-500/20' :
                                    'bg-background text-foreground hover:bg-muted border border-border shadow-sm'
                                }`}
                        >
                            {btn}
                        </button>
                    ))}
                </div>

                {/* Action */}
                <div className="p-4 pt-0 mt-auto sm:mt-0 flex-shrink-0">
                    <button
                        onClick={handleInsert}
                        disabled={!value}
                        className="w-full py-4 rounded-xl font-bold text-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-all shadow-md shadow-primary/20"
                    >
                        Insert Value
                    </button>
                </div>
            </div>
        </div>
    );
}
