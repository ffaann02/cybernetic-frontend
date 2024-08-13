import { useLoader } from '@react-three/fiber';
import { MTLLoader } from 'three-stdlib';
import { OBJLoader } from 'three-stdlib';

const GuardWireFrame = () => {
  const materials = useLoader(MTLLoader, '/models/map_object/guard-obj/materials.mtl');
  const object = useLoader(OBJLoader, '/models/map_object/guard-obj/model.obj', (loader) => {
    materials.preload();
    loader.setMaterials(materials);
  });

  // Set wireframe property to true for each material
  if (object) {
    object.traverse((child) => {
      if (child.isMesh) {
        child.material.wireframe = true;
      }
    });
  }

  // Render the 3D object as a wireframe
  return object && <primitive object={object} />;
};

export default GuardWireFrame;