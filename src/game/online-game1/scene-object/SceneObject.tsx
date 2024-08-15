import {
  CameraControls,
  Cylinder,
  Environment,
  Sphere,
  useKeyboardControls,
} from "@react-three/drei";
import { MapRoom1 } from "../map/MapRoom1";
import { Item } from "../../shared-object/object/Item";
import { degreeNumberToRadian } from "../../../utils";
import { CuboidCollider, RigidBody, vec3 } from "@react-three/rapier";
import FakeGlowMaterial from "../../../components/FakeGlowMaterial";
import { useFrame } from "@react-three/fiber";
import { useContext, useEffect, useRef, useState } from "react";
import { GoodBot } from "../../../GoodBot";
import GlobalGameUI from "../../../components/ui/GlobalGameUI";
import { GameContext } from "../../../contexts/GameContext";
import { Controls } from "../../../controllers/CharacterController";

const SceneObject = ({
  startGame,
  waitingPositionRef1,
  waitingPositionRef2,
  waitingPositionRef3,
  waitingCameraPointer,
  players,
  isOpenComputer,
  setIsOpenComputer,
  isOpenLoot,
  setIsOpenLoot,
  isDuelTime,
  setIsDuelTime,
}) => {

  const [bubbles, setBubbles] = useState([]);
  const [lastPressTime, setLastPressTime] = useState(0);

  const cameraWaitingRef = useRef();
  const { currentHit, setCurrentHit, setIsInteracting } =
    useContext(GameContext);
  const ePressed = useKeyboardControls((state) => state[Controls.coding]);

  const [yPosition, setYPosition] = useState(30);
  const [isAirdrop1ReachFloor, setIsAirdrop1ReachFloor] = useState(false);
  // const airDrop1 = useRef();

  const cameraFollow = () => {
    let adjustZoom = { x: -1, y: -5, z: 0 };
    if(isDuelTime){
      adjustZoom = { x: -1, y: 4, z: 4 };
    };
    if (cameraWaitingRef.current && waitingCameraPointer.current) {
      const cameraDistanceY = window.innerWidth < 1024 ? 10 : 8;
      const cameraDistanceZ = window.innerWidth < 1024 ? 14 : 12;
      const playerWorldPos = vec3(waitingCameraPointer?.current.translation());
      cameraWaitingRef.current.setLookAt(
        playerWorldPos.x + 1 + adjustZoom.x,
        playerWorldPos.y + cameraDistanceY + 0 + adjustZoom.y,
        playerWorldPos.z + cameraDistanceZ + 3 + adjustZoom.z,
        playerWorldPos.x + 1 + adjustZoom.x,
        playerWorldPos.y - 4,
        playerWorldPos.z - 8 + adjustZoom.z,
        true
      );
    }
  };

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
    if (!startGame) {
      cameraFollow();
    }
    if (isDuelTime) {
      cameraFollow();
    }
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

    if (startGame) {
      setYPosition((prevY) => {
        if (prevY <= 2) {
          setIsAirdrop1ReachFloor(true);
          return 2;
        }
        return prevY - 0.1;
      });
    }

    if (ePressed && currentHit === "Online1-Computer") {
      const currentTime = new Date().getTime();
      if (currentTime - lastPressTime > 200) {
        setIsInteracting((prev) => !prev);
        setIsOpenComputer((prev) => !prev);
        setLastPressTime(currentTime);
      }
    }

    if (ePressed && currentHit === "Online1-Loot") {
      const currentTime = new Date().getTime();
      if (currentTime - lastPressTime > 200) {
        setIsInteracting((prev) => !prev);
        setIsOpenLoot((prev) => !prev);
        setLastPressTime(currentTime);
      }
    }
  });

  const onPlayerEnterComputer = ({ other }) => {
    if (other.rigidBodyObject && other.rigidBodyObject.name === "player") {
      setCurrentHit("Online1-Computer");
    }
  };

  const onPlayerExitComputer = ({ other }) => {
    if (other.rigidBodyObject && other.rigidBodyObject.name === "player") {
      setCurrentHit("");
    }
  };

  const onPlayerEnterLoot = ({ other }) => {
    if (other.rigidBodyObject && other.rigidBodyObject.name === "player") {
      setCurrentHit("Online1-Loot");
    }
  };

  const onPlayerExitLoot = ({ other }) => {
    if (other.rigidBodyObject && other.rigidBodyObject.name === "player") {
      setCurrentHit("");
    }
  };

  return (
    <>
      {!startGame && <CameraControls ref={cameraWaitingRef} />}
      {isDuelTime &&  <CameraControls ref={cameraWaitingRef} />}

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
      {startGame && (
        <>
          <RigidBody
            // ref={airDrop1}
            name="Airdrop1"
            type="dynamic"
            colliders={false}
            lockRotations
            lockTranslations
            position={[-3, yPosition, -13.5]}
            scale={[400, 400, 250]}
            mass={1}
            rotation={[
              degreeNumberToRadian(-90),
              degreeNumberToRadian(0),
              degreeNumberToRadian(90),
            ]}
            onCollisionEnter={onPlayerEnterLoot}
            onCollisionExit={onPlayerExitLoot}
          >
            <CuboidCollider
              args={[0.0033, 0.0033, 0.0033]}
              position={[-0.001, -0.003, -0.004]}
              rotation={[
                degreeNumberToRadian(0),
                degreeNumberToRadian(0),
                degreeNumberToRadian(0),
              ]}
            />
            {!isAirdrop1ReachFloor && (
              <Item
                item={{
                  name: "HotAirBalloon",
                  position: [0, 0, 0],
                  fileType: "glb",
                  scale: [0.0001, 0.0001, 0.0001],
                }}
                isOutlined
                outlineColor="cyan"
                outlineThickness={3}
              />
            )}
            <Item
              item={{
                name: "ScifiLoot",
                position: [-0.001, -0.0025, -0.005],
                fileType: "glb",
                scale: [1.6, 1.75, 1.6],
                rotation: [
                  degreeNumberToRadian(90),
                  degreeNumberToRadian(180),
                  degreeNumberToRadian(0),
                ],
              }}
              isOutlined
              outlineColor="cyan"
              outlineThickness={3}
            />
          </RigidBody>
          <RigidBody
            // ref={airDrop1}
            name="Airdrop1"
            type="dynamic"
            colliders={false}
            lockRotations
            lockTranslations
            position={[-24, yPosition, 6]}
            scale={[400, 400, 250]}
            mass={1}
            rotation={[
              degreeNumberToRadian(-90),
              degreeNumberToRadian(0),
              degreeNumberToRadian(90),
            ]}
            onCollisionEnter={onPlayerEnterLoot}
            onCollisionExit={onPlayerExitLoot}
          >
            <CuboidCollider
              args={[0.0033, 0.0033, 0.0033]}
              position={[-0.001, -0.003, -0.004]}
              rotation={[
                degreeNumberToRadian(0),
                degreeNumberToRadian(0),
                degreeNumberToRadian(0),
              ]}
            />
            {!isAirdrop1ReachFloor && (
              <Item
                item={{
                  name: "HotAirBalloon",
                  position: [0, 0, 0],
                  fileType: "glb",
                  scale: [0.0001, 0.0001, 0.0001],
                }}
                isOutlined
                outlineColor="cyan"
                outlineThickness={3}
              />
            )}
            <Item
              item={{
                name: "ScifiLoot",
                position: [-0.001, -0.0025, -0.005],
                fileType: "glb",
                scale: [1.6, 1.75, 1.6],
                rotation: [
                  degreeNumberToRadian(90),
                  degreeNumberToRadian(180),
                  degreeNumberToRadian(0),
                ],
              }}
              isOutlined
              outlineColor="cyan"
              outlineThickness={3}
            />
          </RigidBody>
        </>
      )}
      <RigidBody
        type="fixed"
        colliders={false}
        lockTranslations
        lockRotations
        position={[-24, -2, 18]}
        scale={[10, 8, 10]}
        rotation={[
          degreeNumberToRadian(0),
          degreeNumberToRadian(180),
          degreeNumberToRadian(0),
        ]}
      >
        <CuboidCollider
          args={[1.2, 0.02, 0.4]}
          position={[-0.8, 0.7, 0.4]}
          rotation={[
            degreeNumberToRadian(0),
            degreeNumberToRadian(0),
            degreeNumberToRadian(-25),
          ]}
        />
        <Item
          item={{
            name: "Ladder-Slope",
            position: [0, 0, 0],
            scale: [1, 1, 1],
            fileType: "glb",
          }}
        />
      </RigidBody>
      <RigidBody
        name="Platform01"
        type="fixed"
        colliders="trimesh"
        lockRotations
        lockTranslations
        position={[-1.5, 8.4, 13.5]}
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
        {startGame && players.length >= 1 && (
          <mesh
            position={[0, 0, 0.02]}
            scale={[0.11, 0.11, 0.11]}
            rotation={[
              degreeNumberToRadian(180),
              degreeNumberToRadian(0),
              degreeNumberToRadian(0),
            ]}
          >
            <GoodBot animation_index={0} wireframe wireframeColor={"cyan"} />
          </mesh>
        )}
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
        {startGame && players.length >= 2 && (
          <mesh
            position={[0, 0, 0.02]}
            scale={[0.11, 0.11, 0.11]}
            rotation={[
              degreeNumberToRadian(180),
              degreeNumberToRadian(0),
              degreeNumberToRadian(0),
            ]}
          >
            <GoodBot animation_index={0} wireframe wireframeColor={"cyan"} />
          </mesh>
        )}
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
        {startGame && players.length >= 3 && (
          <mesh
            position={[0, 0, 0.02]}
            scale={[0.11, 0.11, 0.11]}
            rotation={[
              degreeNumberToRadian(180),
              degreeNumberToRadian(0),
              degreeNumberToRadian(0),
            ]}
          >
            <GoodBot animation_index={0} wireframe wireframeColor={"cyan"} />
          </mesh>
        )}
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
        colliders={false}
        lockTranslations
        lockRotations
        position={[-20, 0, -14]}
        scale={[200, 200, 200]}
        rotation={[
          degreeNumberToRadian(0),
          degreeNumberToRadian(0),
          degreeNumberToRadian(0),
        ]}
        onCollisionEnter={onPlayerEnterComputer}
        onCollisionExit={onPlayerExitComputer}
      >
        <CuboidCollider args={[0.005, 0.01, 0.005]} position={[0, 0.01, 0]} />
        <Item
          item={{
            name: "ScifiComputer",
            position: [0, 0, 0],
            rotation: [0, 0, 0],
            scale: [1, 1, 1],
            fileType: "glb",
          }}
          outlineColor="white"
          isOutlined
          outlineThickness={4}
        />
      </RigidBody>
      <MapRoom1 />
    </>
  );
};
export default SceneObject;
