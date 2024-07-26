import { RigidBody } from "@react-three/rapier";
import { Item } from "../../../shared-object/object/Item";
import { degreeNumberToRadian } from "../../../../utils";
import { Box } from "@react-three/drei";
import FakeGlowMaterial from "../../../../components/FakeGlowMaterial";

const Room2 = () => {
  return (
    <>
      <RigidBody
        type="fixed"
        colliders={"trimesh"}
        position={[0, 0, 0]}
        lockRotations
        lockTranslations
      >
        <Item
          item={{
            name: "WallCornerDiagonal",
            position: [-16, 0, -15],
            rotation: [
              degreeNumberToRadian(0),
              degreeNumberToRadian(135),
              degreeNumberToRadian(0),
            ],
            scale: [6, 0.8, 6],
            fileType: "glb",
          }}
        />
        <Box
          args={[8.2, 0.2, 4]}
          position={[-16, 4, -19]}
          rotation={[
            degreeNumberToRadian(90),
            degreeNumberToRadian(0),
            degreeNumberToRadian(0),
          ]}
        >
          <meshStandardMaterial color="#6495ED" transparent opacity={0.4} />
        </Box>
        <Box
          args={[6, 0.2, 4]}
          position={[-22.3, 4, -16.7]}
          rotation={[
            degreeNumberToRadian(90),
            degreeNumberToRadian(0),
            degreeNumberToRadian(-45),
          ]}
        >
          <meshStandardMaterial color="#6495ED" transparent opacity={0.4} />
          </Box>
        <Box
          args={[6, 0.2, 4]}
          position={[-9.7, 4, -16.7]}
          rotation={[
            degreeNumberToRadian(90),
            degreeNumberToRadian(0),
            degreeNumberToRadian(45),
          ]}
        >
          <meshStandardMaterial color="#6495ED" transparent opacity={0.4} />
          </Box>
      </RigidBody>
      <RigidBody
        type="fixed"
        colliders={"trimesh"}
        position={[-16, 0, -17]}
        scale={[0.1, 0.1, 0.1]}
        lockRotations
        lockTranslations
        rotation={[
          degreeNumberToRadian(0),
          degreeNumberToRadian(-90),
          degreeNumberToRadian(0),
        ]}
      >
        <Item
          item={{
            name: "Speaker01",
            position: [0, 0, 0],
            scale: [1, 1, 1],
            fileType: "glb",
          }}
        />
      </RigidBody>
    </>
  );
};
export default Room2;
