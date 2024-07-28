import { RigidBody, vec3 } from "@react-three/rapier";
import { useEffect, useRef } from "react";
import { MeshBasicMaterial } from "three";

export const Bullet = ({ angle, position, onHit, config }) => {

    const rigidbody = useRef<any>();
    const { bulletName, bulletSpeed, bulletColor, damage, weaponOffset } = config;

    const bulletMaterial = new MeshBasicMaterial({
        color: bulletColor,
        toneMapped: false,
    });
    bulletMaterial.color.multiplyScalar(42);

    useEffect(() => {
        const velocity = {
            x: (-Math.sin(angle)) * bulletSpeed,
            y: 0,
            z: (-Math.cos(angle)) * bulletSpeed,
        };

        rigidbody.current.setLinvel(velocity, true);
    }, [angle]);

    return (
        <group position={[position.x, position.y, position.z]} rotation-y={angle}>
            <group
                position-x={weaponOffset.x}
                position-y={weaponOffset.y}
                position-z={weaponOffset.z}
            >
                <RigidBody
                    name={bulletName}
                    ref={rigidbody}
                    gravityScale={0}
                    onIntersectionEnter={(e) => {
                        if (e.other.rigidBody.userData?.bulletName !== bulletName) {
                            rigidbody.current.setEnabled(false);
                            onHit(vec3(rigidbody.current.translation()));
                        }
                    }}
                    sensor
                    userData={{
                        bulletName: bulletName,
                        damage: damage,
                    }}
                >
                    <mesh position-z={0.25} material={bulletMaterial} castShadow>
                        <boxGeometry args={[1, 1, 1]} />
                    </mesh>
                </RigidBody>
            </group>
        </group>
    );
};
