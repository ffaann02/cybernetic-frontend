import { RigidBody } from "@react-three/rapier";
import { useEffect, useRef, useState } from "react";
import { degreeNumberToRadian } from "../../../utils";
import FakeGlowMaterial from "../../../components/FakeGlowMaterial";

const Cell = ({ initialColor, position, fall, locked, setLocked, predict, revealDelay, reAlign }) => {
  const ref = useRef();
  const [color, setColor] = useState("white"); // Initial color is white for reveal effect
  const [opacity, setOpacity] = useState(0); // Initial opacity is 0 for fade-in effect

  useEffect(() => {
    if (!locked && ref.current) {
      ref.current.lockTranslations(false);
    }
  }, [locked]);

  useEffect(() => {
    let timeout;
    if (predict) {
      timeout = setTimeout(() => {
        setOpacity(1); // Change this value as needed for the final opacity
        setColor(initialColor); // Reveal the true color
      }, revealDelay / 2);
    }
    return () => clearTimeout(timeout); // Clean up the timeout on unmount
  }, [revealDelay, initialColor, predict]);

  useEffect(() => {
    if (reAlign) {
      setColor("white");
      setOpacity(0);
    }
  }, [reAlign]);

  return (
    <RigidBody
      ref={ref}
      type={fall ? "dynamic" : "fixed"}
      position={position}
      scale={[3, 3, 0.3]}
      lockRotations
      lockTranslations={locked}
      rotation={[
        degreeNumberToRadian(90),
        degreeNumberToRadian(0),
        degreeNumberToRadian(0),
      ]}
      onCollisionEnter={({ other }) => {
        if (other.rigidBodyObject && other.rigidBodyObject.name === "player") {
          setLocked(false); // Unlock the cell when player collides with it
        }
      }}
    >
      <mesh castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color={predict ? color : "white"}
          opacity={opacity}
          transparent={true}
        />
        <FakeGlowMaterial glowColor={color} opacity={0.6} />
      </mesh>
    </RigidBody>
  );
};

const GlassBridge = ({
  row,
  col,
  gap = 0.5,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  predict = false,
  reAlign = false,
}) => {
  const generateInitialCellStates = () => {
    const initialCellStates = [];
    for (let i = 0; i < col; i++) {
      const column = [];
      const greenRowIndex = Math.floor(Math.random() * row);
      for (let j = 0; j < row; j++) {
        column.push({
          initialColor: j === greenRowIndex ? "green" : "red",
          position: [i * (3 + gap), 2, j * (3 + gap)],
          fall: j !== greenRowIndex,
          locked: true,
          revealDelay: (i * row + j) * 500,
        });
      }
      initialCellStates.push(column);
    }
    return initialCellStates;
  };

  const [cellStates, setCellStates] = useState(generateInitialCellStates);

  useEffect(() => {
    setCellStates(generateInitialCellStates());
  }, [reAlign]);

  return (
    <group position={position} rotation={rotation}>
      {cellStates.map((column, i) =>
        column.map((cell, j) => (
          <Cell
            key={`${i}-${j}`}
            initialColor={cell.initialColor}
            position={cell.position}
            fall={cell.fall}
            locked={cell.locked}
            setLocked={(value) => {
              const updatedCellStates = [...cellStates];
              updatedCellStates[i][j].locked = value;
              setCellStates(updatedCellStates);
            }}
            predict={predict}
            revealDelay={cell.revealDelay}
            reAlign={reAlign}
          />
        ))
      )}
    </group>
  );
};

export default GlassBridge;