import { Cylinder, Environment, Sphere } from "@react-three/drei";
import { MapRoom1 } from "../map/MapRoom1";
import { Item } from "../../shared-object/object/Item";
import { degreeNumberToRadian } from "../../../utils";
import { RigidBody } from "@react-three/rapier";
import FakeGlowMaterial from "../../../components/FakeGlowMaterial";
import { useFrame } from "@react-three/fiber";
import { useEffect, useState } from "react";

const SceneObject = ({
  startGame,
  waitingPositionRef1,
  waitingPositionRef2,
  waitingPositionRef3,
}) => {
  const [bubbles, setBubbles] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Generate a new bubble with random position and speed
      setBubbles((prevBubbles) => [
        ...prevBubbles,
        {
          id: Math.random(),
          position: [
            (Math.random() - 0.5) * 4, // random x position within the cylinder's radius
            3, // start below the cylinder
            (Math.random() - 0.5) * 4, // random z position within the cylinder's radius
          ],
          speed: Math.random() * 0.02 + 0.01, // random speed
        },
      ]);
    }, 750); // Adjust the interval for bubble generation frequency

    return () => clearInterval(interval);
  }, []);

  // console.log(bubbles);
  useFrame(() => {
    // console.log(bubbles);
    setBubbles(
      (prevBubbles) =>
        prevBubbles
          .map((bubble) => ({
            ...bubble,
            position: [
              bubble.position[0],
              bubble.position[1] - bubble.speed, // move the bubble up
              bubble.position[2],
            ],
          }))
          .filter((bubble) => bubble.position[1] > -3) // keep bubbles within the cylinder (fade out at the top)
    );
  });

  return (
    <>
      <Environment preset="dawn" environmentIntensity={0.5} />
      <directionalLight
        intensity={4}
        scale={100}
        castShadow
        shadow-mapSize-height={4096 * 3}
        shadow-mapSize-width={4096 * 3}
        rotation={[0, 0, 0]}
        position={[-2, 8, 2]}
        shadow-camera-left={-20}
        shadow-camera-right={40}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <RigidBody
        name="Platform01"
        type="fixed"
        colliders="trimesh"
        lockRotations
        lockTranslations
        position={[-3.6, 7.5, 11.4]}
        scale={[400, 400, 250]}
        mass={20}
        rotation={[
          degreeNumberToRadian(-90),
          degreeNumberToRadian(0),
          degreeNumberToRadian(90),
        ]}
      >
        <Item
          item={{
            name: "ScifiPlatform-01",
            position: [0, 0, 0],
            fileType: "glb",
            rotation: 0,
            scale: [1, 1, 1],
          }}
        />
      </RigidBody>
      <RigidBody
        ref={waitingPositionRef1}
        colliders={false}
        lockTranslations
        lockRotations
        position={[-20, 0, -18]}
        scale={[10, 10, 10]}
        rotation={[
          degreeNumberToRadian(180),
          degreeNumberToRadian(0),
          degreeNumberToRadian(0),
        ]}
      >
        <Cylinder
          scale={[0.05, 0.1, 0.05]}
          args={[3, 3, 6]}
          position={[0, -0.3, 0]}
          rotation={[
            degreeNumberToRadian(0),
            degreeNumberToRadian(0),
            degreeNumberToRadian(0),
          ]}
        >
          <FakeGlowMaterial
            glowColor="#02eeff"
            falloff={2}
            glowInternalRadius={0}
            opacity={0.5}
          />
          {bubbles.map((bubble) => (
            <Sphere
              key={bubble.id}
              args={[0.175, 16, 16]}
              position={bubble.position}
            >
              <FakeGlowMaterial
                glowColor="white"
                falloff={2}
                glowInternalRadius={0}
                opacity={0.2}
              />
            </Sphere>
          ))}
        </Cylinder>
        <Item
          item={{
            name: "PortalPad",
            position: [0, 0, 0],
            rotation: [0, 0, 0],
            scale: [0.1, 0.1, 0.1],
            fileType: "glb",
          }}
        />
      </RigidBody>
      <RigidBody
        ref={waitingPositionRef2}
        colliders={false}
        lockTranslations
        lockRotations
        position={[-14, 0, -18]}
        scale={[10, 10, 10]}
        rotation={[
          degreeNumberToRadian(180),
          degreeNumberToRadian(0),
          degreeNumberToRadian(0),
        ]}
      >
        <Cylinder
          scale={[0.05, 0.1, 0.05]}
          args={[3, 3, 6]}
          position={[0, -0.3, 0]}
          rotation={[
            degreeNumberToRadian(0),
            degreeNumberToRadian(0),
            degreeNumberToRadian(0),
          ]}
        >
          <FakeGlowMaterial
            glowColor="red"
            falloff={2}
            glowInternalRadius={0}
            opacity={0.5}
          />
          {bubbles.map((bubble) => (
            <Sphere
              key={bubble.id}
              args={[0.175, 16, 16]}
              position={bubble.position}
            >
              <FakeGlowMaterial
                glowColor="red"
                falloff={2}
                glowInternalRadius={0}
                opacity={0.6}
              />
            </Sphere>
          ))}
        </Cylinder>
        <Item
          item={{
            name: "PortalPad",
            position: [0, 0, 0],
            rotation: [0, 0, 0],
            scale: [0.1, 0.1, 0.1],
            fileType: "glb",
          }}
        />
      </RigidBody>
      <RigidBody
        ref={waitingPositionRef3}
        colliders={false}
        lockTranslations
        lockRotations
        position={[-8, 0, -18]}
        scale={[10, 10, 10]}
        rotation={[
          degreeNumberToRadian(180),
          degreeNumberToRadian(0),
          degreeNumberToRadian(0),
        ]}
      >
        <Cylinder
          scale={[0.05, 0.1, 0.05]}
          args={[3, 3, 6]}
          position={[0, -0.3, 0]}
          rotation={[
            degreeNumberToRadian(0),
            degreeNumberToRadian(0),
            degreeNumberToRadian(0),
          ]}
        >
          <FakeGlowMaterial
            glowColor="yellow"
            falloff={2}
            glowInternalRadius={0}
            opacity={0.5}
          />
          {bubbles.map((bubble) => (
            <Sphere
              key={bubble.id}
              args={[0.175, 16, 16]}
              position={bubble.position}
            >
              <FakeGlowMaterial
                glowColor="yellow"
                falloff={2}
                glowInternalRadius={0}
                opacity={0.6}
              />
            </Sphere>
          ))}
        </Cylinder>
        <Item
          item={{
            name: "PortalPad",
            position: [0, 0, 0],
            rotation: [0, 0, 0],
            scale: [0.1, 0.1, 0.1],
            fileType: "glb",
          }}
        />
      </RigidBody>
      <MapRoom1 />
    </>
  );
};
export default SceneObject;
