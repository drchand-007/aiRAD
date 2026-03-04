import React from 'react';
import { X, Mic, FileText, LayoutTemplate, SquareChartGantt, BrainCircuit, CheckSquare, MessageSquare } from 'lucide-react';

export default function VoiceCommandsModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    const commandCategories = [
        {
            title: "Navigation & UI",
            icon: LayoutTemplate,
            color: "text-blue-400",
            commands: [
                { trigger: '"Change Modality to Ultrasound"', desc: 'Switches the active modality' },
                { trigger: '"Use the Pelvis Template"', desc: 'Loads a specific report template' },
                { trigger: '"Open Shortcuts"', desc: 'Opens the macros manager' },
            ]
        },
        {
            title: "Editor Actions",
            icon: FileText,
            color: "text-emerald-400",
            commands: [
                { trigger: '"New Paragraph"', desc: 'Enters a line break' },
                { trigger: '"Clear the Report"', desc: 'Erases all text in the editor' },
                { trigger: '"Replace [word] with [word]"', desc: 'Finds and replaces text' },
                { trigger: '"Format text: Make [word] bold"', desc: 'Applies bold, italic, or underline' },
            ]
        },
        {
            title: "AI Measurements",
            icon: SquareChartGantt,
            color: "text-purple-400",
            commands: [
                { trigger: '"Add a liver size of 12 cm"', desc: 'Inserts into the Liver dimensions placeholder' },
                { trigger: '"Right kidney is 10 by 5 cm"', desc: 'Fills the Right Kidney dimensions' },
                { trigger: '"Clear all measurements"', desc: 'Resets all extracted AI measurements' },
            ]
        },
        {
            title: "Macros & Automation",
            icon: CheckSquare,
            color: "text-orange-400",
            commands: [
                { trigger: '"Insert Normal Liver"', desc: 'Inserts your saved "Normal Liver" macro text' },
                { trigger: '"Create a macro called Normal Appendix that says The appendix is 5mm"', desc: 'Instantly saves a new macro to your profile' },
            ]
        },
        {
            title: "AI Copilot Integration",
            icon: BrainCircuit,
            color: "text-pink-400",
            commands: [
                { trigger: '"Ask Copilot to summarize this report"', desc: 'Sends the editor text to Copilot for a summary' },
                { trigger: '"Ask Copilot to translate the Findings to Spanish"', desc: 'Generates a translated version in the chat' },
            ]
        }
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm sm:p-4 animate-in fade-in duration-200">
            <div className="bg-background w-full h-full sm:h-auto sm:max-w-2xl sm:rounded-2xl shadow-2xl border border-border flex flex-col md:max-h-[85vh]">

                {/* Header */}
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border bg-muted/30 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/20 rounded-xl">
                            <Mic className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-foreground">Voice Commands Guide</h2>
                            <p className="text-sm text-muted-foreground">Speak naturally. Say these phrases to control the app hands-free.</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
                    <div className="space-y-6">
                        {commandCategories.map((cat, idx) => (
                            <div key={idx} className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                                <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b border-border">
                                    <cat.icon className={`w-5 h-5 ${cat.color}`} />
                                    <h3 className="font-bold text-foreground tracking-wide">{cat.title}</h3>
                                </div>
                                <div className="divide-y divide-border">
                                    {cat.commands.map((cmd, i) => (
                                        <div key={i} className="px-4 py-3 hover:bg-muted transition-colors">
                                            <p className="font-mono text-sm text-primary/90 mb-1">{cmd.trigger}</p>
                                            <p className="text-sm text-muted-foreground">{cmd.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 p-4 bg-primary/10 border border-primary/20 rounded-xl flex gap-3 text-sm text-foreground/90">
                        <MessageSquare className="w-5 h-5 flex-shrink-0 mt-0.5 text-primary" />
                        <p><strong>Magic Mode:</strong> For general reporting, just speak your findings naturally. The AI will automatically clean up your grammar and insert it into the editor. You only need the specific commands above for special actions.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
