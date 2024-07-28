import { useFrame } from "@react-three/fiber";
import {
  CuboidCollider,
  CylinderCollider,
  RigidBody,
  vec3,
} from "@react-three/rapier";
import { Item } from "../../../shared-object/object/Item";
import { degreeNumberToRadian } from "../../../../utils";
import { useContext, useRef, useState } from "react";
import { BlurPass, Resizer, KernelSize, Effect } from "postprocessing";
import { GameContext } from "../../../../contexts/GameContext";
import {
  Bloom,
  EffectComposer,
  SelectiveBloom,
} from "@react-three/postprocessing";
import {
  Box,
  Circle,
  Cylinder,
  Outlines,
  Sky,
  Sparkles,
  Sphere,
  Stars,
  useKeyboardControls,
} from "@react-three/drei";
import { Controls } from "../../../../controllers/CharacterController";
import FakeGlowMaterial from "../../../../components/FakeGlowMaterial";
import { Color, Light, MeshStandardMaterial } from "three";
import EnemyPatrolController from "../../../../controllers/EnemyPatrolController";
import { enemyPatrolProps } from "../EnemyDataProps";
import SpeakerObject from "./SpeakerObject";
import FlameBox from "./FlameBox";

const bloomColor = new Color("#ff0000");
bloomColor.multiplyScalar(1.2);

const Room1 = ({
  isOpenAudioInput,
  setIsOpenAudioInput,
  isOpenVideoFootage,
  setIsOpenVideoFootage,
  isPlayingSound,
  setIsPlayingSound,
  parentLight,
  speakerMeshRef,
}) => {
  const {
    currentHit,
    setCurrentHit,
    setIsInteracting,
    isInteracting,
    playerRigidBody,
    isCarryingObject,
    setIsCarryingObject,
    isUsingSecurityCamera,
    setIsUsingSecurityCamera,
  } = useContext(GameContext);

  const wPressed = useKeyboardControls((state) => state[Controls.forward]);
  const sPressed = useKeyboardControls((state) => state[Controls.backward]);
  const aPressed = useKeyboardControls((state) => state[Controls.left]);
  const dPressed = useKeyboardControls((state) => state[Controls.right]);
  const ePressed = useKeyboardControls((state) => state[Controls.coding]);
  const spacePressed = useKeyboardControls((state) => state[Controls.jump]);
  const [boxPosition, setBoxPosition] = useState([16, 0, 0]);
  const [speakerSparklePosition, setSpeakerSparklePosition] = useState([
    0, 0, 0,
  ]);
  const [enemies, setEnemies] = useState(enemyPatrolProps);

  const kaboomDangerHitBox = useRef();

  const onPlayerEnterComputer = ({ other }) => {
    if (other.rigidBodyObject.name === "player") {
      console.log("player enter");
      setCurrentHit("Crane-Computer-Level-3");
    }
  };

  const onPlayerExitComputer = ({ other }) => {
    if (other.rigidBodyObject.name === "player") {
      console.log("player exit");
      setCurrentHit("");
    }
  };

  const [ufoY, setUfoY] = useState(0);
  const [ufoRotationY, setUfoRotationY] = useState(0); // Step 1

  const meshRef1 = useRef();
  const light1 = useRef();
  const UFO = useRef();
  const [kaboom, setKaboom] = useState(false);
  const speaker = useRef();
  const [initSpeakerPosition, setInitSpeakerPosition] = useState([-20, 0, -16]);
  const [trackSpeakerPosition, setTrackSpeakerPosition] = useState([0, 0, 0]);
  const [lastPressTime, setLastPressTime] = useState(0);
  const [currentCarryObject, setCurrentCarryObject] = useState("");
  const [speakerRotation, setSpeakerRotation] = useState([0, 0, 0]);
  const [showUFO, setShowUFO] = useState(false);
  const speakerSparkle = useRef();

  useFrame((state, delta) => {
    if (ePressed && currentHit === "Crane-Computer-Level-3") {
      const currentTime = new Date().getTime();
      if (currentTime - lastPressTime > 200) {
        console.log("test");
        // 500 milliseconds debounce time
        // setShowDialog((prev) => !prev);
        setIsUsingSecurityCamera((prev) => !prev);
        setIsInteracting((prev) => !prev);
        if(kaboom){
          setKaboom(false);
        }
        // setCurrentHit("");
        setLastPressTime(currentTime);
      }
    }

    if (ePressed && currentHit === "StereoRack-Level3") {
      const currentTime = new Date().getTime();
      if (currentTime - lastPressTime > 200) {
        // 500 milliseconds debounce time
        // setShowDialog((prev) => !prev);
        setIsOpenAudioInput((prev) => !prev);
        setIsInteracting((prev) => !prev);
        // setCurrentHit("");
        setLastPressTime(currentTime);
      }
    }

    if (UFO.current) {
      // const ufoPosition = vec3(UFO.current.translation());
      const t = state.clock.getElapsedTime();
      const yOffset = Math.sin(t * 3) * 0.05; // Floating effect
      // Update the RigidBody's translation
      UFO.current.setTranslation({
        x: boxPosition[0],
        y: ufoY + yOffset,
        z: boxPosition[2],
      });
      setUfoY(ufoY + yOffset);
    }
    if (currentHit === "Crane-Computer-Level-3" && isInteracting) {
      setBoxPosition((prevPosition) => {
        const moveSpeed = 0.2;
        let [x, y, z] = prevPosition;
        if (wPressed) {
          z -= moveSpeed;
        }
        if (sPressed) z += moveSpeed;
        if (aPressed) x -= moveSpeed;
        if (dPressed) x += moveSpeed;
        return [x, y, z];
      });

      setUfoRotationY((prevRotationY) => {
        let rotationSpeed = 60; // Adjust rotation speed as needed
        if (aPressed || sPressed) return prevRotationY - rotationSpeed * delta; // A - rotate left
        if (dPressed || wPressed) return prevRotationY + rotationSpeed * delta; // D - rotate right
        return prevRotationY; // No change
      });
    }

    if (
      spacePressed &&
      currentHit === "Crane-Computer-Level-3" &&
      isInteracting &&
      !kaboom
    ) {
      setKaboom(true);
    }

    if (ePressed && currentHit === "Speaker-Level3") {
      console.log("pick");
      const currentTime = new Date().getTime();
      if (currentTime - lastPressTime > 300) {
        // Debounce time check
        setIsCarryingObject((prev) => !prev);
        setLastPressTime(currentTime); // Update the last press time
        if (!isCarryingObject) {
          setCurrentCarryObject("Speaker-Level3");
        } else {
          setCurrentCarryObject(""); // Clear the current carry object when dropped
        }
      }
    }

    if (isCarryingObject && currentCarryObject === "Speaker-Level3") {
      const playerPosition = vec3(playerRigidBody.current.translation());
      // Update the speaker's translation
      speaker.current.setTranslation({
        x: playerPosition.x + 2.5,
        y: playerPosition.y + 8,
        z: playerPosition.z,
      });
    }
    if (
      ePressed &&
      isCarryingObject &&
      currentCarryObject === "Speaker-Level3"
    ) {
      const playerPosition = vec3(playerRigidBody.current.translation());
      console.log("leave");
      const currentTime = new Date().getTime();
      if (currentTime - lastPressTime > 300) {
        speaker.current.setTranslation({
          x: playerPosition.x - 0.5,
          y: playerPosition.y + 10,
          z: playerPosition.z + 5,
        });
        setIsCarryingObject(false);
        setCurrentCarryObject("");
      }
    }

    if (ePressed && currentHit === "ComputerVideo-Level3") {
      const currentTime = new Date().getTime();
      if (currentTime - lastPressTime > 200) {
        // 500 milliseconds debounce time
        // setShowDialog((prev) => !prev);
        setIsOpenVideoFootage((prev) => !prev);
        setIsInteracting((prev) => !prev);
        // setCurrentHit("");
        setLastPressTime(currentTime);
      }
    }

    const speakerPosition = vec3(speaker.current.translation());
    if (isPlayingSound && speakerSparkle.current) {
      speakerSparkle.current.position.set(
        speakerPosition.x,
        speakerPosition.y,
        speakerPosition.z
      );
      // speakerSparkle.current.setTranslation({
      //   x: speakerPosition.x - 0.5,
      //   y: speakerPosition.y + 10,
      //   z: speakerPosition.z + 5,
      // });
      setSpeakerSparklePosition([
        speakerPosition.x,
        speakerPosition.y + 3,
        speakerPosition.z,
      ]);
    }
    // console.log(speakerSparkle.current);
  });

  const [destroyKaboom, setDestroyKaboom] = useState(false);

  const handleKaboomFall = ({ other }) => {
    console.log("test");
    if (other.rigidBodyObject.includes("enemy")) {
      console.log("hit enemy");
      // if (kaboom) {
      //   setDestroyKaboom(true);
      // }
    }
  };

  const onPlayerEnterSpeaker = ({ other }) => {
    if (other.rigidBodyObject.name === "player") {
      setCurrentHit("Speaker-Level3");
    }
  };

  const onPlayerExitSpeaker = ({ other }) => {
    if (
      other.rigidBodyObject.name === "player" &&
      currentHit === "Speaker-Level3"
    ) {
      setCurrentHit("");
    }
  };

  const onPlayerEnterStereoMixer = ({ other }) => {
    if (other.rigidBodyObject.name === "player") {
      setCurrentHit("StereoRack-Level3");
    }
  };

  const onPlayerExitStereoMixer = ({ other }) => {
    if (
      other.rigidBodyObject.name === "player" &&
      currentHit === "StereoRack-Level3"
    ) {
      setCurrentHit("");
    }
  };

  const onPlayerEnterComputerVideoFootage = ({ other }) => {
    if (other.rigidBodyObject.name === "player") {
      setCurrentHit("ComputerVideo-Level3");
    }
  };

  const onPlayerExitComputerVideoFootage = ({ other }) => {
    if (
      other.rigidBodyObject.name === "player" &&
      currentHit === "ComputerVideo-Level3"
    ) {
      setCurrentHit("");
    }
  };

  return (
    <>
      {/* <SelectiveBloom
        lights={[parentLight]} // ⚠️ REQUIRED! all relevant lights
        selection={[speakerMeshRef]} // selection of objects that will have bloom effect
        selectionLayer={10} // selection layer
        intensity={1.0} // The bloom intensity.
        blurPass={undefined} // A blur pass.
        width={Resizer.AUTO_SIZE} // render width
        height={Resizer.AUTO_SIZE} // render height
        kernelSize={KernelSize.LARGE} // blur kernel size
        luminanceThreshold={0.9} // luminance threshold. Raise this value to mask out darker elements in the scene.
        luminanceSmoothing={0.025} // smoothness of the luminance threshold. Range is [0, 1]
      /> */}
      <ambientLight ref={light1} intensity={0.5} color={"lightblue"} />
      <RigidBody
        type="fixed"
        colliders={false}
        lockTranslations
        lockRotations
        position={[-23, 3.5, -18.2]}
        scale={[10, 10, 10]}
        rotation={[
          degreeNumberToRadian(0),
          degreeNumberToRadian(90), // Apply Y-axis rotation
          degreeNumberToRadian(90),
        ]}
        onCollisionEnter={onPlayerEnterStereoMixer}
        onCollisionExit={onPlayerExitStereoMixer}
      >
        <Item
          item={{
            name: "SimpleButton",
            position: [0, -0.15, 0],
            scale: [1, 0.75, 1],
            fileType: "glb",
          }}
        />
      </RigidBody>
      <RigidBody
        type="fixed"
        colliders={false}
        lockTranslations
        lockRotations
        position={[-28, 5, -19]}
        scale={[8, 8, 8]}
        rotation={[
          degreeNumberToRadian(0),
          degreeNumberToRadian(0), // Apply Y-axis rotation
          degreeNumberToRadian(0),
        ]}
        onCollisionEnter={onPlayerEnterStereoMixer}
        onCollisionExit={onPlayerExitStereoMixer}
      >
        <Item
          item={{
            name: "StereoRack",
            position: [0, -0.15, 0],
            scale: [1, 0.75, 1],
            fileType: "glb",
          }}
        />
        <Item
          item={{
            name: "StereoSmall",
            position: [0, 0.45, 0.35],
            scale: [70, 70, 70],
            fileType: "glb",
            rotation: [
              degreeNumberToRadian(-90),
              degreeNumberToRadian(0), // Apply Y-axis rotation
              degreeNumberToRadian(0),
            ],
          }}
        />
        <Item
          item={{
            name: "AudioMixer",
            position: [-0.63, -0.25, 0.38],
            scale: [0.2, 0.2, 0.15],
            fileType: "glb",
            rotation: [
              degreeNumberToRadian(0),
              degreeNumberToRadian(-90), // Apply Y-axis rotation
              degreeNumberToRadian(0),
            ],
          }}
        />
        <Item
          item={{
            name: "MetalTable",
            position: [-0.6, -0.45, 0.35],
            scale: [0.6, 0.5, 0.6],
            fileType: "glb",
            rotation: [
              degreeNumberToRadian(0),
              degreeNumberToRadian(90), // Apply Y-axis rotation
              degreeNumberToRadian(0),
            ],
          }}
        />
        <CuboidCollider
          args={[0.2, 0.1, 0.05]}
          position={[0.55, -0.14, -0.05]}
          rotation={[
            degreeNumberToRadian(0),
            degreeNumberToRadian(0),
            degreeNumberToRadian(0),
          ]}
        />
        <CuboidCollider
          args={[0.36, 0.7, 0.3]}
          position={[0, 0.12, 0.18]}
          rotation={[
            degreeNumberToRadian(0),
            degreeNumberToRadian(0),
            degreeNumberToRadian(0),
          ]}
        />
      </RigidBody>
      <RigidBody
        type="fixed"
        colliders={false}
        lockTranslations
        lockRotations
        position={[-10, -1.5, 10]}
        scale={[10, 10, 10]}
      >
        <CuboidCollider
          args={[1.2, 0.02, 0.4]}
          position={[-0.8, 0.7, 0.5]}
          rotation={[
            degreeNumberToRadian(0),
            degreeNumberToRadian(0),
            degreeNumberToRadian(-35),
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
        type="fixed"
        colliders={"trimesh"}
        lockTranslations
        lockRotations
        position={[-32, 12, 13]}
        scale={[400, 500, 400]}
        rotation={[
          degreeNumberToRadian(90),
          degreeNumberToRadian(180),
          degreeNumberToRadian(0),
        ]}
      >
        <Item
          item={{
            name: "ScifiPlatform-01",
            position: [0, 0, 0],
            scale: [1, 1, 1],
            fileType: "glb",
          }}
        />
      </RigidBody>
      <RigidBody
        type="fixed"
        colliders={false}
        lockTranslations
        lockRotations
        position={[-34, 12, 10]}
        scale={[500, 500, 500]}
        rotation={[
          degreeNumberToRadian(90),
          degreeNumberToRadian(180),
          degreeNumberToRadian(-135),
        ]}
        onCollisionEnter={onPlayerEnterComputerVideoFootage}
        onCollisionExit={onPlayerExitComputerVideoFootage}
      >
        <CuboidCollider
          args={[0.002, 0.003, 0.005]}
          position={[0, 0, 0.006]}
          rotation={[
            degreeNumberToRadian(0),
            degreeNumberToRadian(0),
            degreeNumberToRadian(0),
          ]}
        />
        <Item
          item={{
            name: "ComputerVideo",
            position: [0, 0, 0],
            scale: [1, 1, 1],
            fileType: "glb",
          }}
        />
      </RigidBody>
      <RigidBody
        type="fixed"
        colliders={"trimesh"}
        lockTranslations
        lockRotations
        position={[-32, 16, 3]}
        scale={[7, 7, 7.8]}
        rotation={[
          degreeNumberToRadian(0),
          degreeNumberToRadian(87),
          degreeNumberToRadian(0),
        ]}
      >
        <Item
          item={{
            name: "ControlPanel",
            position: [0, 0, 0],
            scale: [1, 1, 1],
            fileType: "glb",
          }}
        />
      </RigidBody>
      <RigidBody
        type="fixed"
        colliders={false}
        lockTranslations
        lockRotations
        position={[-32, 16, 3]}
        scale={[7, 7, 7.8]}
        rotation={[
          degreeNumberToRadian(0),
          degreeNumberToRadian(87),
          degreeNumberToRadian(0),
        ]}
        onCollisionEnter={onPlayerEnterComputer}
        onCollisionExit={onPlayerExitComputer}
      >
        <CuboidCollider
          args={[0.04, 0.2, 0.3]}
          position={[0.05, 0, 0]}
          rotation={[
            degreeNumberToRadian(0),
            degreeNumberToRadian(5),
            degreeNumberToRadian(0),
          ]}
        />
      </RigidBody>
      <RigidBody
        ref={speaker}
        type="dynamic"
        mass={20}
        colliders={false}
        name="Speaker-Level3"
        lockTranslations={isCarryingObject || isPlayingSound}
        lockRotations
        position={initSpeakerPosition}
        scale={[550, 700, 550]}
        onCollisionEnter={onPlayerEnterSpeaker}
        onCollisionExit={onPlayerExitSpeaker}
        rotation={
          isCarryingObject
            ? [
                degreeNumberToRadian(0),
                degreeNumberToRadian(0),
                degreeNumberToRadian(90),
              ]
            : [
                degreeNumberToRadian(0),
                degreeNumberToRadian(0),
                degreeNumberToRadian(0),
              ]
        }
      >
        <Sphere
          visible={isPlayingSound}
          // ref={speakerGlow}
          args={[0.014, 20, 20]} // args=[radius, widthSegments, heightSegments]
          position={[0, 0.0035, 0]}
        >
          <meshStandardMaterial
            attach="material"
            color={"gray"}
            transparent
            opacity={1}
          />
          <FakeGlowMaterial
            glowInternalRadius={4}
            glowColor={"cyan"}
            falloff={1.5}
            opacity={0.4}
            glowSharpness={0}
          />
        </Sphere>
        <CuboidCollider
          args={[0.003, 0.0035, 0.002]}
          position={[0, 0.004, 0]}
        />
        <Item
          ref={speakerMeshRef}
          item={{
            name: "Speaker",
            position: [0, 0, 0],
            scale: [1, 1, 1],
            fileType: "glb",
          }}
          isOutlined
          outlineColor="white"
        />
      </RigidBody>
      {/* <Sparkles
        ref={speakerSparkle}
        position={[
          speakerSparklePosition[0] - 0.5,
          speakerSparklePosition[1] + 1,
          speakerSparklePosition[2],
        ]}
        rotation={[
          degreeNumberToRadian(0),
          degreeNumberToRadian(45),
          degreeNumberToRadian(0),
        ]}
        speed={30}
        count={20}
        size={!isPlayingSound ? 100 : 0}
        scale={!isPlayingSound ? [10, 10, 10] : [0, 0, 0]}
        color={"yellow"}
        opacity={0.7}
      /> */}

      {enemies.map((enemyPartrolProp, index) => (
        <EnemyPatrolController
          id={enemyPartrolProp.id}
          key={enemyPartrolProp.id}
          name={enemyPartrolProp.name}
          waypoints={enemyPartrolProp.waypoints}
          angle={enemyPartrolProp.angle}
          idleTime={enemyPartrolProp.idleTime}
          chaseTimeLimit={enemyPartrolProp.chaseTimeLimit}
          patrolType={enemyPartrolProp.patrolType}
          showPath={enemyPartrolProp.showPath}
          data={enemyPartrolProp.data}
          setEnemyPatrolInScene={setEnemies}
          isPlayingSound={isPlayingSound}
          speakerRef={speaker}
        />
      ))}

      <>
        {!destroyKaboom && (
          <RigidBody
            name="Kaboom-Level3"
            colliders={false}
            lockTranslations={true}
            lockRotations
            position={[boxPosition[0], boxPosition[1], boxPosition[2]]}
            scale={[47, 10, 43]}
            onCollisionEnter={handleKaboomFall}
          >
            {kaboom && (
              <CylinderCollider
                args={[0.002, 0.7, 20, 50]}
                position={[0, 0.08, 0]}
              />
            )}
            <Sphere
              args={[0.15, 20, 20]} // args=[radieus, widthSegments, heightSegments]
              position={[0, 0, 0]}
            >
              <meshStandardMaterial
                attach="material"
                color={kaboom?"green":"blue"}
                emissive="green"
                emissiveIntensity={4}
                opacity={1}
                // visible={
                //   currentHit === "Crane-Computer-Level-3" && isInteracting
                // }
                visible={false}
                transparent={true}
              />
              {/* <FakeGlowMaterial glowColor={"green"} opacity={0.4} /> */}
            </Sphere>
          </RigidBody>
        )}
        <RigidBody
          type="fixed"
          colliders={false}
          lockTranslations
          lockRotations
          position={[boxPosition[0], ufoY, boxPosition[2]]}
          ref={UFO}
          scale={[50, 0.2, 50]}
          rotation={[
            degreeNumberToRadian(0),
            degreeNumberToRadian(ufoRotationY), // Apply Y-axis rotation
            degreeNumberToRadian(0),
          ]}
        >
          <Item
            item={{
              name: "BlueUFO",
              position: [0, 180, 0],
              scale: [0.0005, 0.2, 0.0005],
              fileType: "glb",
            }}
          />
        </RigidBody>
        <RigidBody
          type="fixed"
          colliders={false}
          lockTranslations
          lockRotations
          position={boxPosition}
          scale={[50, 0.2, 50]}
          rotation={[
            degreeNumberToRadian(0),
            degreeNumberToRadian(87),
            degreeNumberToRadian(0),
          ]}
        >
          <Cylinder
            args={[0.06, 0.15, 180, 50]} // args=[radiusTop, radiusBottom, height, radialSegments]
            position={[0, 90, 0]}
          >
            <meshStandardMaterial
              attach="material"
              color="red"
              emissive="red"
              opacity={0.5}
              transparent={true}
            />
            <FakeGlowMaterial
              glowColor={"red"}
              opacity={0.7}
              side={"THREE.DoubleSide"}
              // glowInternalRadius={2}
            />
          </Cylinder>
          {kaboom && <Cylinder
            args={[0.06, 0.15, 180, 50]} // args=[radiusTop, radiusBottom, height, radialSegments]
            position={[0, 90, 0]}
          >
            <meshStandardMaterial
              attach="material"
              color="red"
              emissive="red"
              opacity={0.2}
              transparent={true}
            />
            <FakeGlowMaterial
              glowColor={"orange"}
              opacity={0.7}
              side={"THREE.DoubleSide"}
              glowInternalRadius={2}
            />
          </Cylinder>}
          <Sphere
            ref={meshRef1}
            args={[0.15, 20, 20]} // args=[radius, widthSegments, heightSegments]
            position={[0, 0, 0]}
          >
            <meshStandardMaterial
              attach="material"
              color="red"
              emissive="blue"
              opacity={0.2}
              transparent={true}
            />
            {/* <FakeGlowMaterial glowColor={"red"} opacity={0.5} /> */}
          </Sphere>
          <pointLight
            position={[0, 0, 0]}
            color={"red"}
            intensity={1}
            distance={5}
            decay={2}
          />
        </RigidBody>
      </>
    </>
  );
};

export default Room1;
