import { useLoader } from '@react-three/fiber';
import { MTLLoader } from 'three-stdlib';
import { OBJLoader } from 'three-stdlib';

const WeightMeterComputer = () => {
  const materials = useLoader(MTLLoader, '/models/map_object/CountdownMTL.mtl');
  const object = useLoader(OBJLoader, '/models/map_object/CountdownScreen.obj', (loader) => {
    materials.preload();
    loader.setMaterials(materials);
  });

  // Assuming you want to render the 3D object if available, otherwise show a fallback
  return object && <primitive object={object} />
};

export default WeightMeterComputer;