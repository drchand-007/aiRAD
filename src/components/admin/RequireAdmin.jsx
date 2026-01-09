// src/components/admin/RequireAdmin.jsx
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../../firebase'; // Adjust path if needed

const RequireAdmin = ({ children }) => {
    const [isAdmin, setIsAdmin] = useState(null); // null = loading, true = admin, false = denied
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    // User is logged in, check role in Firestore
                    const userDoc = await getDoc(doc(db, 'users', user.uid));
                    if (userDoc.exists() && userDoc.data().role === 'admin') {
                        setIsAdmin(true);
                    } else {
                        console.warn("User is logged in but NOT admin");
                        setIsAdmin(false);
                    }
                } catch (error) {
                    console.error("Admin check failed", error);
                    setIsAdmin(false);
                }
            } else {
                // User is not logged in
                setIsAdmin(false);
            }
            setLoading(false); // Auth check finished
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-slate-100 text-slate-500">
                Verifying Admin Permissions...
            </div>
        );
    }
    
    // If admin, show content. If not, redirect to Home.
    return isAdmin ? children : <Navigate to="/" replace />;
};

export default RequireAdmin;