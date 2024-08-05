import { useState } from "react";
import { LaserTargetObjectProps } from "./LaserTargetObject";
import { LaserTargetObjectData } from "./LaserTargetObjectData";

const Room2 = () => {

  const [objectData, setObjectData] = useState<LaserTargetObjectProps[]>(
    LaserTargetObjectData
  );
  const [dropedObject, setDropedObject] = useState<LaserTargetObjectProps[]>();
  const [currentLaserTarget, setCurrentLaserTarget] = useState<string | null>(
    null
  );

  return (
    <>
    </>
  )
}
export default Room2