import { RigidBody } from "@react-three/rapier";
import { useEffect, useRef, useState } from "react";
import { degreeNumberToRadian } from "../../../utils";

const Cell = ({ color, position, fall, locked, setLocked }) => {
  const ref = useRef();

  useEffect(() => {
    if (!locked && ref.current) {
      ref.current.lockTranslations(false);
    }
  }, [locked]);

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
        <meshStandardMaterial color={color} opacity={0.5} transparent={true} />
      </mesh>
    </RigidBody>
  );
};

const GlassBridge = ({ row, col, gap = 0.5, position = [0, 0, 0], rotation = [0, 0, 0] }) => {
    const [cellStates, setCellStates] = useState(() => {
      const initialCellStates = [];
  
      for (let i = 0; i < col; i++) {
        const column = [];
        // Randomly select one row to be green
        const greenRowIndex = Math.floor(Math.random() * row);
        for (let j = 0; j < row; j++) {
          column.push({
            // color: j === greenRowIndex ? "green" : "red",
            color:"white",
            position: [i * (3 + gap), 2, j * (3 + gap)],
            fall: j !== greenRowIndex,
            locked: true,
          });
        }
        initialCellStates.push(column);
      }
  
      return initialCellStates;
    });
  
    return (
      <group position={position} rotation={rotation}>
        {cellStates.map((column, i) =>
          column.map((cell, j) => (
            <Cell
              key={`${i}-${j}`}
              color={cell.color}
              position={cell.position}
              fall={cell.fall}
              locked={cell.locked}
              setLocked={(value) => {
                const updatedCellStates = [...cellStates];
                updatedCellStates[i][j].locked = value;
                setCellStates(updatedCellStates);
              }}
            />
          ))
        )}
      </group>
    );
  };

export default GlassBridge;