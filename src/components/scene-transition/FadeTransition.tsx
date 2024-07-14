import React, { useEffect, useState } from 'react';
import { ProgressBar } from 'primereact/progressbar';

interface FadeTransitionProps {
    loadingDescription?: string; // Description of the loading process
    tipMessage?: string; // Tip message to display while loading
    fadeDuration?: number; // Duration of the fade effect in milliseconds
    visibleDuration?: number; // Duration the background remains fully visible before fading
    messages?: string[]; // List of messages to display while loading
}

const FadeTransition: React.FC<FadeTransitionProps> = ({
    loadingDescription,
    tipMessage,
    fadeDuration = 500,
    visibleDuration = 2000,
    messages = ["Loading resources...", "Please wait...", "Starting the game..."]
}) => {

    const [visible, setVisible] = useState(true);
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

    const storageBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET_LINK;
    const path = `/assets/level-selection/LoadingBackground.png`;
    const url = `${storageBucket}${path}`;

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
        }, visibleDuration);
        return () => clearTimeout(timer);
    }, [visibleDuration]);

    useEffect(() => {
        if (messages.length > 1) {
            const messageInterval = setInterval(() => {
                setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
            }, visibleDuration / messages.length);
            return () => clearInterval(messageInterval);
        }
    }, [messages, visibleDuration]);

    return (
        <div
            className="fixed inset-0 flex items-center justify-center"
            style={{
                background: `linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url(${url})`,
                backgroundSize: 'cover',
                backgroundPosition: '50% 100%', // Center horizontally and bottom vertically
                transition: `opacity ${fadeDuration}ms`,
                opacity: visible ? 1 : 0,
                pointerEvents: visible ? 'auto' : 'none',
            }}>
            <div className='w-full'>
                <div className='w-full flex justify-center'>
                    <img src='/images/Logo_V1.png' alt='logo' className='w-96 h-full mt-[400px]' />
                </div>
                <div className='flex flex-col items-center w-full mt-60'>
  
                    <div className="w-2/3 text-white my-2 text-left">
                        {messages[currentMessageIndex]}
                    </div>
                    <div className="card mx-auto w-2/3">
                        <ProgressBar mode="indeterminate" style={{ height: '6px', transitionDuration: `${fadeDuration}ms` }}></ProgressBar>
                    </div>

                    {tipMessage &&
                        <>
                            <div className="w-2/3 flex text-white my-4 text-left border border-slate-400 rounded-md p-4">
                                <span className='text-cyan-400 mr-2 font-medium'>Tip: </span>
                                <span >{tipMessage}</span>
                            </div>
                        </>
                    }
                </div>
            </div>
        </div>
    );
};

export default FadeTransition;
