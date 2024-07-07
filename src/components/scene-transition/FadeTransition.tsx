import React, { useEffect, useState } from 'react';
import { ProgressBar } from 'primereact/progressbar';

interface FadeTransitionProps {
    fadeDuration?: number; // Duration of the fade effect in milliseconds
    visibleDuration?: number; // Duration the background remains fully visible before fading
    messages?: string[]; // List of messages to display while loading
}

const FadeTransition: React.FC<FadeTransitionProps> = ({
    fadeDuration = 500,
    visibleDuration = 2000,
    messages = ["กำลังดาวน์โหลดทรัพยากรเกม...", "กรุณารอสักครู่...","กำลังเริ่มเกม..."]
}) => {
    const [visible, setVisible] = useState(true);
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

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
            className={`fixed inset-0 bg-black transition-opacity duration-${fadeDuration} 
                ${visible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            style={{ transitionDuration: `${fadeDuration}ms` }}>
            <div>
                <div className='flex flex-col items-center justify-center w-full min-h-screen'>
                    <div className="card mx-auto w-1/3">
                        <ProgressBar mode="indeterminate" style={{ height: '6px', transitionDuration: `${fadeDuration}ms`}}></ProgressBar>
                    </div>
                    <div className="text-white mt-4">
                        {messages[currentMessageIndex]}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FadeTransition;
