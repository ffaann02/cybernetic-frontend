import { useRef, useState, useEffect } from "react";
import { RigidBody } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { degreeNumberToRadian } from "../../../utils";
import FakeGlowMaterial from "../../../components/FakeGlowMaterial";
import { Cylinder, Sphere } from "@react-three/drei";
import { Item } from "../../shared-object/object/Item";
import Enemy2DHoloGram from "./Enemy2DHoloGram";
import BossHologram from "./BossHologram";
import { Scanline } from "@react-three/postprocessing";

const SceneObjectNew = () => {
  const mesh1Ref = useRef();
  const mesh2Ref = useRef();
  const mesh3Ref = useRef();

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

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (mesh1Ref.current) {
      mesh1Ref.current.position.y = 22 + Math.sin(time * 1.5) * 2.5;
    }
    if (mesh2Ref.current) {
      mesh2Ref.current.position.y = 28 + Math.sin(time * 2) * 2.5;
    }
    if (mesh3Ref.current) {
      mesh3Ref.current.position.y = 26 + Math.sin(time * 1.7) * 3.5;
    }
  });

  const bossHoloGramRef = useRef();

  return (
    <>
      <ambientLight intensity={8} />
      <directionalLight
        position={[5, 4, 0]}
        intensity={0.01}
        scale={[0, 0, 0]}
      />
      {/* <BossHologram bossHoloGramRef={bossHoloGramRef} /> */}
      <RigidBody
        colliders={false}
        lockTranslations
        lockRotations
        position={[6, 6, -14]}
        scale={[90, 60, 90]}
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
            opacity={0.8}
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
      <mesh
        ref={mesh1Ref}
        position={[0, 20, -13]}
        scale={[-1, 1, 1]}
        rotation={[
          degreeNumberToRadian(0),
          degreeNumberToRadian(-60),
          degreeNumberToRadian(0),
        ]}
      >
        <Enemy2DHoloGram name="Golem" scale={5.5} />
      </mesh>
      <RigidBody
        colliders={false}
        lockTranslations
        lockRotations
        position={[-20, 6, 20]}
        scale={[90, 60, 90]}
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
            opacity={0.8}
          />
          {bubbles.map((bubble) => (
            <Sphere
              key={bubble.id}
              args={[0.15, 16, 16]}
              position={bubble.position}
            >
              <FakeGlowMaterial
                glowColor="green"
                falloff={2}
                glowInternalRadius={0}
                opacity={0.8}
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
      <mesh
        ref={mesh2Ref}
        position={[-24, 20, 20.5]}
        scale={[-1, 1, 1]}
        rotation={[
          degreeNumberToRadian(0),
          degreeNumberToRadian(-90),
          degreeNumberToRadian(0),
        ]}
      >
        <Enemy2DHoloGram name="Spider" scale={7} />
      </mesh>
      <RigidBody
        colliders={false}
        lockTranslations
        lockRotations
        position={[-44, 6, 52]}
        scale={[90, 60, 90]}
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
            opacity={0.8}
          />
          {bubbles.map((bubble) => (
            <Sphere
              key={bubble.id}
              args={[0.15, 16, 16]}
              position={bubble.position}
            >
              <FakeGlowMaterial
                glowColor="lightblue"
                falloff={2}
                glowInternalRadius={0}
                opacity={0.8}
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
      <mesh
        ref={mesh3Ref}
        position={[-48, 17, 52]}
        scale={[-1, 1, 1]}
        rotation={[
          degreeNumberToRadian(0),
          degreeNumberToRadian(-100),
          degreeNumberToRadian(0),
        ]}
      >
        <Enemy2DHoloGram name="Slime" scale={7} />
      </mesh>
      <Item
        item={{
          name: "ClassifyComputer",
          position: [2, 0, -48],
          rotation: [
            degreeNumberToRadian(90),
            degreeNumberToRadian(180),
            degreeNumberToRadian(130),
          ],
          scale: [2500, 2500, 2500],
          fileType: "glb",
        }}
      />
      <Item
        item={{
          name: "ScifiComputer",
          position: [-60, 0, 86],
          rotation: [
            degreeNumberToRadian(0),
            degreeNumberToRadian(-160),
            degreeNumberToRadian(0),
          ],
          scale: [3000, 2500, 3000],
          fileType: "glb",
        }}
      />
      {/* <Item
        item={{
          name: "Table",
          position: [-50, 1, 10],
          rotation: [
            degreeNumberToRadian(90),
            degreeNumberToRadian(-180),
            degreeNumberToRadian(-10),
          ],
          scale: [20, 20, 20],
          fileType: "glb",
        }}
      /> */}
      {/* <Item
        item={{
          name: "Monitor-Audio",
          position: [-50, 1, 10],
          rotation: [
            degreeNumberToRadian(90),
            degreeNumberToRadian(-180),
            degreeNumberToRadian(-10),
          ],
          scale: [0.15,0.15,0.15],
          fileType: "glb",
        }}
      /> */}
    </>
  );
};
export default SceneObjectNew;
