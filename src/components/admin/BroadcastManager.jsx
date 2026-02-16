import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, deleteDoc, doc, serverTimestamp, orderBy, query } from 'firebase/firestore';
import { db } from '../../firebase';
import { Megaphone, Trash2, Send, AlertCircle, Info } from 'lucide-react';
import { toast } from 'react-hot-toast';

const BroadcastManager = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [type, setType] = useState('info'); // info, warning, critical

    useEffect(() => {
        const q = query(collection(db, 'system_announcements'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setAnnouncements(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        return () => unsubscribe();
    }, []);

    const handlePost = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            await addDoc(collection(db, 'system_announcements'), {
                message: newMessage,
                type,
                isActive: true,
                createdAt: serverTimestamp()
            });
            setNewMessage('');
            toast.success("Announcement broadcasted!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to post announcement.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Remove this announcement?")) {
            await deleteDoc(doc(db, 'system_announcements', id));
            toast.success("Announcement removed.");
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Megaphone className="text-blue-500" /> Broadcast Center
            </h2>

            {/* Creation Form */}
            <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-white/10">
                <form onSubmit={handlePost} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Message</label>
                        <input
                            type="text"
                            className="w-full p-2 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-black/40 text-white placeholder-slate-500"
                            placeholder="e.g. Maintenance scheduled for tonight..."
                            value={newMessage}
                            onChange={e => setNewMessage(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-4 items-center">
                        <select
                            value={type}
                            onChange={e => setType(e.target.value)}
                            className="p-2 border border-white/10 rounded-lg bg-black/40 text-white outline-none"
                        >
                            <option value="info" className="bg-slate-900">Information (Blue)</option>
                            <option value="warning" className="bg-slate-900">Warning (Yellow)</option>
                            <option value="critical" className="bg-slate-900">Critical (Red)</option>
                        </select>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition">
                            <Send size={16} /> Broadcast Now
                        </button>
                    </div>
                </form>
            </div>

            {/* Active Announcements List */}
            <div className="space-y-3">
                <h3 className="font-semibold text-slate-400">Active Announcements</h3>
                {announcements.length === 0 && <p className="text-slate-500 italic">No active announcements.</p>}
                {announcements.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg shadow-sm hover:bg-white/10 transition">
                        <div className="flex items-center gap-3">
                            {item.type === 'critical' ? <AlertCircle className="text-red-400" /> : <Info className="text-blue-400" />}
                            <div>
                                <p className="font-medium text-slate-200">{item.message}</p>
                                <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${item.type === 'critical' ? 'bg-red-500/20 text-red-300' :
                                        item.type === 'warning' ? 'bg-yellow-500/20 text-yellow-300' :
                                            'bg-blue-500/20 text-blue-300'
                                    }`}>
                                    {item.type}
                                </span>
                                <span className="text-xs text-slate-500 ml-2">
                                    {item.createdAt?.toDate().toLocaleString()}
                                </span>
                            </div>
                        </div>
                        <button onClick={() => handleDelete(item.id)} className="text-red-400 hover:text-red-300 p-2 hover:bg-red-500/10 rounded-full transition">
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BroadcastManager;