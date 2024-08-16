import { RigidBody } from "@react-three/rapier";
import { Item } from "../../../shared-object/object/Item";
import { degreeNumberToRadian } from "../../../../utils";

const Spike = ({
  position = [-31, 0.5, -16],
  scale = [500, 400, 500],
  rotation = [
    degreeNumberToRadian(0),
    degreeNumberToRadian(90),
    degreeNumberToRadian(0),
  ],
}) => {
  return (
    <>
      <RigidBody
        colliders="trimesh"
        name="spiker-danger"
        type="fixed"
        lockRotations
        lockTranslations
        position={position}
        scale={scale}
        rotation={rotation}
      >
        <Item
          item={{
            name: "Spike",
            position: [0, -0.001, 0],
            fileType: "glb",
            rotation: [
              degreeNumberToRadian(-90),
              degreeNumberToRadian(0),
              degreeNumberToRadian(0),
            ],
            scale: [1, 1, 1],
          }}
          isOutlined
          outlineColor="red"
          outlineThickness={2}
        />
        <Item
          item={{
            name: "Spike",
            position: [-0.018, -0.001, 0],
            fileType: "glb",
            rotation: [
              degreeNumberToRadian(-90),
              degreeNumberToRadian(0),
              degreeNumberToRadian(0),
            ],
            scale: [1, 1, 1],
          }}
          isOutlined
          outlineColor="red"
          outlineThickness={2}
        />
        <Item
          item={{
            name: "Spike",
            position: [-0.018, -0.001, 0.018],
            fileType: "glb",
            rotation: [
              degreeNumberToRadian(-90),
              degreeNumberToRadian(0),
              degreeNumberToRadian(0),
            ],
            scale: [1, 1, 1],
          }}
          isOutlined
          outlineColor="red"
          outlineThickness={2}
        />
        <Item
          item={{
            name: "Spike",
            position: [0, -0.001, 0.018],
            fileType: "glb",
            rotation: [
              degreeNumberToRadian(-90),
              degreeNumberToRadian(0),
              degreeNumberToRadian(0),
            ],
            scale: [1, 1, 1],
          }}
          isOutlined
          outlineColor="red"
          outlineThickness={2}
        />
        <Item
          item={{
            name: "Spike",
            position: [-0.018, -0.001, 0.036],
            fileType: "glb",
            rotation: [
              degreeNumberToRadian(-90),
              degreeNumberToRadian(0),
              degreeNumberToRadian(0),
            ],
            scale: [1, 1, 1],
          }}
          isOutlined
          outlineColor="red"
          outlineThickness={2}
        />
        <Item
          item={{
            name: "Spike",
            position: [0, -0.001, 0.036],
            fileType: "glb",
            rotation: [
              degreeNumberToRadian(-90),
              degreeNumberToRadian(0),
              degreeNumberToRadian(0),
            ],
            scale: [1, 1, 1],
          }}
          isOutlined
          outlineColor="red"
          outlineThickness={2}
        />
      </RigidBody>
    </>
  );
};
export default Spike;
