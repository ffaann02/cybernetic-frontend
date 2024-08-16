import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { GameContext } from '../../../../contexts/GameContext';
import { PerspectiveCamera, useKeyboardControls } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Bullet } from '../../../shared-object/object/Bulllet';
import { BulletHit } from '../../../shared-object/object/BulletHit';
import { CuboidCollider, RigidBody } from '@react-three/rapier';
import { degreeNumberToRadian } from '../../../../utils';
import { Item } from '../../../shared-object/object/Item';
import { Controls } from '../../../../controllers/CharacterController';

interface bulletConfig {
    bulletName: string;
    bulletColor: string;
    damage: number;
    bulletSpeed: number;
    firerate: number;
    weaponOffset: { x: number; y: number; z: number; };
    turretRotateZ: number;
}

const TurretGunControl = ({
    leftTurretGunPosition,
    middleTurretGunPosition,
    rightTurretGunPosition,
    config,
}) => {

    const { currentHit, setTurretData, setBossParameter } = useContext(GameContext);

    const turretGunRef = useRef<any>();
    const [currentTurret, setCurrentTurret] = useState<bulletConfig>();

    const lastShootTime = useRef(0);
    const [bullets, setBullets] = useState([]);
    const [bulletHit, setBulletHit] = useState([]);

    const spacePressed = useKeyboardControls((state) => state[Controls.jump]);

    const [keys, setKeys] = useState({
        w: false,
        a: false,
        s: false,
        d: false,
        ArrowUp: false,
        ArrowDown: false,
    });

    useEffect(() => {
        const handleKeyDown = (event) => {
            setKeys((prevKeys) => ({ ...prevKeys, [event.key]: true }));
        };
        const handleKeyUp = (event) => {
            setKeys((prevKeys) => ({ ...prevKeys, [event.key]: false }));
        };
        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, []);

    useEffect(() => {
        if (currentHit === 'LeftTurretGun') {
            const data = config.find((item) => item.bulletName === 'LeftTurretBullet');
            setCurrentTurret(data);
            setTurretData(data);
            setBossParameter((prev) => ({
                ...prev,
                lastActiveTurret: "left"
            }))
            turretGunRef.current.position.set(leftTurretGunPosition.x, leftTurretGunPosition.y + 5, leftTurretGunPosition.z);
            turretGunRef.current.rotation.set(degreeNumberToRadian(0), degreeNumberToRadian(-30), degreeNumberToRadian(0));
        }
        else if (currentHit === 'MiddleTurretGun') {
            const data = config.find((item) => item.bulletName === 'MiddleTurretBullet');
            setCurrentTurret(data);
            setTurretData(data);
            setBossParameter((prev) => ({
                ...prev,
                lastActiveTurret: "middle"
            }))
            turretGunRef.current.position.set(middleTurretGunPosition.x, middleTurretGunPosition.y + 5, middleTurretGunPosition.z);
            turretGunRef.current.rotation.set(degreeNumberToRadian(0), degreeNumberToRadian(0), degreeNumberToRadian(0));
        }
        else if (currentHit === 'RightTurretGun') {
            const data = config.find((item) => item.bulletName === 'RightTurretBullet');
            setCurrentTurret(data);
            setTurretData(data);
            setBossParameter((prev) => ({
                ...prev,
                lastActiveTurret: "right"
            }))
            turretGunRef.current.position.set(rightTurretGunPosition.x, rightTurretGunPosition.y + 5, rightTurretGunPosition.z);
            turretGunRef.current.rotation.set(degreeNumberToRadian(0), degreeNumberToRadian(30), degreeNumberToRadian(0));
            console.log(currentHit);
        }
    }, [currentHit]);

    useFrame(() => {
        if (turretGunRef && turretGunRef.current) {
            const { position, rotation } = turretGunRef.current;
            let moveSpeed = 0.1;
            let rotationSpeed = 0.02;

            const rotationYInDegrees = rotation.y * (180 / Math.PI);

            if (rotationYInDegrees > 180 || rotationYInDegrees < -180) {
                console.log("out");
            }

            // Update horizontal rotation (left/right) with clamping
            if (keys.a) rotation.y += rotationSpeed;
            if (keys.d) rotation.y -= rotationSpeed;

            // Update vertical position (up/down) instead of rotation
            if (((keys.w) || keys.ArrowUp) && position.y < 15) {
                position.y += moveSpeed; // Move up
            }
            if ((keys.s || keys.ArrowDown) && position.y > 5) {
                position.y -= moveSpeed; // Move down
            }

            if (spacePressed) {
                if (Date.now() - lastShootTime.current > currentTurret.firerate) {
                    lastShootTime.current = Date.now();
                    onFire(position, rotation);
                }
            }

            // Clamping x rotation to avoid flipping over
            rotation.x = Math.max(Math.min(rotation.x, Math.PI / 2), -Math.PI / 2);

            // Ensure y rotation wraps around, creating a continuous rotation effect
            if (rotation.y > Math.PI) rotation.y -= 2 * Math.PI;
            else if (rotation.y < -Math.PI) rotation.y += 2 * Math.PI;
        }
    });

    const onFire = (position, rotation) => {
        const bullet = {
            id: "bullet" + Date.now(),
            angle: rotation.y, // Use the turret's rotation.y for the bullet angle
            position: { x: position.x, y: position.y, z: position.z },
        };
        setBullets((bullets) => [...bullets, bullet]);
    };

    const onBulletHit = (bulletId, position) => {
        setBullets((bullets) => bullets.filter((bullet) => bullet.id !== bulletId));
        setBulletHit((bulletHit) => [...bulletHit, { id: bulletId, position }]);
    }

    const onBulletEnded = (bulletId) => {
        setBulletHit((bulletHit) => bulletHit.filter((bullet) => bullet.id !== bulletId));
    }

    return (
        <>
            {bullets.map((bullet, index) => (
                <Bullet key={index} {...bullet} config={currentTurret} onHit={(position) => onBulletHit(bullet.id, position)} />
            ))
            }
            {bulletHit.map((hit, index) => (
                <BulletHit key={index} position={hit.position} config={currentTurret} minScale={0.3} maxScale={0.5} onEnded={onBulletEnded} />
            ))}
            <group ref={turretGunRef}>
                <PerspectiveCamera makeDefault />
                <RigidBody
                name='LeftTurret'
                colliders={false}
                lockTranslations
                lockRotations
                position={[0, -3.4, 0]}
                scale={[500, 500, 500]}
                rotation={[degreeNumberToRadian(-90), degreeNumberToRadian(0), degreeNumberToRadian(-180)]}
                >
                <Item
                    item={
                        {
                            name: "TurretCannon",
                            position: [0, 0, 0],
                            rotation: [0, 0, 0],
                            scale: [1, 1, 1],
                            fileType: "glb",
                        }
                    }
                    isOutlined={true}
                    outlineColor={currentTurret?.bulletColor}
                    outlineThickness={3}
                />
                </RigidBody>
            </group>
        </>

    );
};

export default TurretGunControl;
