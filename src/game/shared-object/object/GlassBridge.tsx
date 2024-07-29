import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { useEffect, useRef, useState } from "react";
import { degreeNumberToRadian } from "../../../utils";
import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI('AIzaSyAhCReLZWZubyrouegeI0rz0YJhToMbBnY');
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

const getRandomValue = (min, max) => {
  return Math.random() * (max - min) + min;
};

const callGeminiApi = async (cellData) => {
  console.log("Check Glass Type AI");
  const { type, breakable, ...filteredData } = cellData; // Filter out 'type' and 'breakable'
  const prompt = `Now you're AI Classification to classify glass as safe or dangerous. Respond only with "safe" or "danger". Here's the following glass data: ${JSON.stringify(filteredData)}`;
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = await response.text();
  console.log("Predicted Glass Type: " + text);
  return text;
};

const Cell = ({ cellData, position, fall, locked, setLocked, onReveal, answer }) => {
  const ref = useRef();
  const [revealedType, setRevealedType] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!locked && ref.current) {
      ref.current.lockTranslations(false);
    }
  }, [locked]);

  const handleCollision = async ({ other }) => {
    // console.log("Collision out");
    if (other.rigidBodyObject && (
      other.rigidBodyObject.name.includes("UFO-Glass-Scanner")
    ) && !revealedType && !isProcessing) {
      // console.log("Collision in");
      setIsProcessing(true);
      console.log("fetch");
      console.log(cellData);
      if (answer) {
        return;
      }
      const result = await callGeminiApi(cellData);
      setIsProcessing(false);
      setRevealedType(result);
      onReveal(result);
    }
    if(other.rigidBodyObject && other.rigidBodyObject.name==="player"){
      console.log(cellData.type);
      setLocked(false);
    }
  };

  const getCellColor = () => {
    if (answer) {
      // Show the actual color of the cell
      return cellData.color;
    }
    // Otherwise, show the color based on revealedType
    if (!revealedType) return "white";
    return revealedType === "safe" ? "green" : "red";
  };

  return (
    <RigidBody
      key={cellData.density}
      ref={ref}
      colliders={false}
      type={revealedType && revealedType === "safe" ? "fixed" : "dynamic"}
      position={position}
      scale={[3, 3, 0.2]}
      lockRotations
      lockTranslations={locked}
      rotation={[
        degreeNumberToRadian(90),
        degreeNumberToRadian(0),
        degreeNumberToRadian(0),
      ]}
      onCollisionEnter={handleCollision}
    >
      <CuboidCollider args={[0.4, 0.4, 0.02]} />
      <mesh castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color={getCellColor()}
          opacity={cellData.transparency}
          transparent={true}
        />
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
  answer = false, 
  fixed = false, 
  dangerArray = [],
  resetTrigger = 0  // New prop to trigger reset
}) => {
  const [cellStates, setCellStates] = useState(() => createInitialCellStates());
  const [visible, setVisible] = useState(true);

  function createInitialCellStates() {
    const initialCellStates = [];
    for (let i = 0; i < col; i++) {
      const column = [];
      let safeRowIndex;
      
      if (fixed && dangerArray[i] !== undefined) {
        safeRowIndex = dangerArray[i] - 1; // Convert 1-based to 0-based index
      } else {
        safeRowIndex = Math.floor(Math.random() * row);
      }

      for (let j = 0; j < row; j++) {
        column.push({
          name: "glass",
          type: j === safeRowIndex ? "safe" : "danger",
          color: j === safeRowIndex ? "green" : "red", // Original color
          thickness: getRandomValue(1, 5),
          transparency: getRandomValue(0.5, 1),
          density: getRandomValue(0.5, 1.5),
          weight: getRandomValue(1, 5),
          defect: j !== safeRowIndex,
          breakable: j !== safeRowIndex,
          position: [i * (3 + gap), 2, j * (3 + gap)],
          fall: j !== safeRowIndex,
          locked: true,
          revealedType: null,
        });
      }
      initialCellStates.push(column);
    }
    return initialCellStates;
  }

  const handleCellReveal = (i, j, revealedType) => {
    setCellStates(prevStates => {
      const newStates = [...prevStates];
      newStates[i][j].revealedType = revealedType;
      return newStates;
    });
  };

  // Effect to reset the pattern when resetTrigger changes
  useEffect(() => {
    console.log("reset"); 
    setVisible(false);
    setTimeout(() => {
      setCellStates(createInitialCellStates());
      setVisible(true);
    }, 1000); // Hide for 1 second before showing the new glass group
  }, [resetTrigger, row, col, fixed, gap, ...dangerArray]);

  return visible ? (
    <group position={position} rotation={rotation}>
      {cellStates.map((column, i) =>
        column.map((cell, j) => (
          <Cell
            key={`${i}-${j}`}
            cellData={cell}
            position={cell.position}
            fall={cell.fall}
            locked={cell.locked}
            setLocked={(value) => {
              setCellStates(prevStates => {
                const newStates = [...prevStates];
                newStates[i][j].locked = value;
                return newStates;
              });
            }}
            onReveal={(revealedType) => handleCellReveal(i, j, revealedType)}
            answer={answer}
          />
        ))
      )}
    </group>
  ) : null;
};

export default GlassBridge;
