import React, { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { useSpring } from '@react-spring/three';


interface SmoothCameraProps {
    targetPosition: number[];
    rotation?: number[];
}

const SmoothCamera: React.FC<SmoothCameraProps> = ({ targetPosition, rotation }) => {
    const cameraRef = useRef<any>();

    // Using react-spring for smooth transitions
    const [spring, set] = useSpring(() => ({
        position: [0, 0, 0],
        config: { mass: 1, tension: 280, friction: 60 },
    }));

    useEffect(() => {
        set({ position: targetPosition });
    }, [targetPosition, set]);

    useFrame(() => {
        if (cameraRef.current) {
            cameraRef.current.position.set(...spring.position.get());
            cameraRef.current.updateMatrixWorld();
            if(rotation) {
                cameraRef.current.rotation.set(...rotation);
            }
        }
    });
    
    return <PerspectiveCamera ref={cameraRef} makeDefault />;
};

export default SmoothCamera;
