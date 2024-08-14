import { useFrame, useThree } from '@react-three/fiber';
import React, { useContext, useRef, useState } from 'react';
import * as THREE from 'three';
import { GameContext } from '../contexts/GameContext';

interface Props {
    firstPersonCameraRef: React.MutableRefObject<any>
}

const SearchController: React.FC<Props> = ({
    firstPersonCameraRef,
}) => {

    const { currentScene, setSearchResult, searchDataNotify } = useContext(GameContext);
    const { scene } = useThree();
    const raycaster = useRef(new THREE.Raycaster());

    const [lastNotifyTime, setLastNotifyTime] = useState(0);
    const [previousObject, setPreviousObject] = useState<THREE.Object3D | null>(null);

    useFrame(() => {
        if (firstPersonCameraRef.current) {
            const camera = firstPersonCameraRef.current.camera;
            const direction = new THREE.Vector3();
            camera.getWorldDirection(direction);

            // Set the raycaster origin to the camera position and direction
            raycaster.current.set(camera.position, direction);

            // Get objects intersected by the ray
            const intersects = raycaster.current.intersectObjects(scene.children);
            let currentIntersectedObject: THREE.Object3D | null = null;

            if (intersects.length > 0) {
                const intersected = intersects.find(intersect => intersect.object);

                if (intersected) {
                    let intersectedObject;
                    if(currentScene.includes("level-1") || currentScene.includes("level-2") || currentScene.includes("level-3")) {
                        intersectedObject = intersected.object.parent?.parent;
                    }
                    currentIntersectedObject = intersectedObject || null;

                    if (intersectedObject?.name.includes("enemy")) {
                        const currentTime = new Date().getTime();
                            // console.log(intersectedObject.userData);
                            const enemyData = intersectedObject.userData;
                            setSearchResult(enemyData);
                            let imageLink = "";
                            if (enemyData.name === "Slime") {
                                imageLink = "/images/slime_default.png";
                            }
                            else if (enemyData.name === "Spider") {
                                imageLink = "/images/SpiderHead.png"
                            }
                            else if (enemyData.name === "Golem") {
                                imageLink = "/images/GolemHead.png"
                            }
                            if (currentTime - lastNotifyTime > 1200) {
                                searchDataNotify.current.show({
                                    unstyled: true,
                                    closable: false,
                                    life: 2000,
                                    content: (props) => (
                                        <div className="flex relative z-[100000] rounded-lg px-2.5 py-2 gap-x-2">
                                            <img
                                                src={imageLink}
                                                className="w-16 h-16 bg-white rounded-xl"
                                            />
                                            <div className="">
                                                <p className="text-2xl font-semibold text-white">
                                                    Data Collected!
                                                </p>
                                                <p className="text-lg font-semibold text-white">
                                                    {enemyData.name} data collected.
                                                </p>
                                            </div>
                                        </div>
                                    ),
                                });
                                setLastNotifyTime(currentTime);
                            }
                    }
                }
            }

            // If the current intersected object differs from the previous one, handle the "out" logic
            if (previousObject !== currentIntersectedObject) {
                if (previousObject !== null) {
                    // Handle "out" logic here
                    setSearchResult(null); // Clear the search result or perform any other action
                }
                // Update the previousObject with the current one
                setPreviousObject(currentIntersectedObject);
            }
        }
    });

    return (
        <>
        </>
    );
}

export default SearchController;
