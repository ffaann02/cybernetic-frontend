import { Item } from "../../../shared-object/object/Item";
import { Box, Sphere } from "@react-three/drei";
import FakeGlowMaterial from "../../../../components/FakeGlowMaterial";
import { RigidBody } from "@react-three/rapier";
import { degreeNumberToRadian } from "../../../../utils";

const WaterDrop = ({
    key,
    position,
    setWaterDrops
}) => {

    const removeWaterDrop = (key) => {
        setWaterDrops((prevWaterDrops) => prevWaterDrops.filter(drop => drop.key !== key));
    };

    const onWaterDropCollision = ({ other }) => {
        // if (other.rigidBodyObject && other.rigidBodyObject.name?.includes("Glass") && other.rigidBodyObject.name !== "WaterDrop" + key) {
            removeWaterDrop(key);
        // }
    };

    return (
        <>
            <RigidBody
                key={key}
                name={"WaterDrop" + key}
                colliders={"trimesh"}
                position={position}
                scale={[0.5, 0.5, 0.5]}
                lockRotations
                rotation={[
                    degreeNumberToRadian(-90),
                    degreeNumberToRadian(0),
                    degreeNumberToRadian(-90),
                ]}
                onCollisionEnter={onWaterDropCollision}
            >
                <Sphere args={[0.5, 1, 32]} position={[0, 0, 0]}>
                    <FakeGlowMaterial glowColor="cyan" opacity={0.4} />
                </Sphere>
            </RigidBody>
        </>
    );
};

export default WaterDrop;