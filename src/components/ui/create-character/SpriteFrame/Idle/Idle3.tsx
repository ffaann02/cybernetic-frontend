import Body from "../../../../create-character/Body";
import CharacterHead from "../../../../create-character/CharacterHead";
import LeftFoot from "../../../../create-character/LeftFoot";
import LeftHand from "../../../../create-character/LeftHand";
import LeftTopArm from "../../../../create-character/LeftTopArm";
import LeftTopLeg from "../../../../create-character/LeftTopLeg";
import RightFoot from "../../../../create-character/RightFoot";
import RightHand from "../../../../create-character/RightHand";
import RightTopArm from "../../../../create-character/RightTopArm";
import RightTopLeg from "../../../../create-character/RightTopLeg";

const Idle3 = () => {
  return (
    <>
      <div className="absolute top-[2.4rem] left-1/2 transform -translate-x-1/2 bg-transparent">
        <CharacterHead />
      </div>
      {/* BODY */}
      <div className="absolute top-[8.4rem] left-1/2 transform -translate-x-1/2 z-[4] bg-transparent">
        <Body />
      </div>
      {/* LEFT ARM */}
      <div className="absolute top-[37.5%] right-[23.5%] transform -translate-x-1/2 w-14 rotate-[70deg] z-10 bg-transparent">
        <LeftTopArm />
      </div>
      <div className="absolute top-[49%] right-[17.5%] transform -translate-x-1/2 w-[5rem] rotate-[105deg] z-10 bg-transparent">
        <LeftHand />
      </div>
      {/* RIGHT ARM */}
      <div className="absolute top-[37.5%] left-[38%] transform -translate-x-1/2 w-14 rotate-[-75deg] z-10 bg-transparent">
        <RightTopArm />
      </div>
      <div className="absolute top-[50%] left-[39%] transform -translate-x-1/2 w-[5rem] rotate-[-110deg] z-10 bg-transparent">
        <RightHand />
      </div>
      {/* LEFT LEG */}
      <div className="absolute top-[59%] right-[38.5%] transform -translate-x-1/2 w-6 z-[5] bg-transparent">
        <LeftTopLeg />
      </div>
      <div className="absolute top-[70%] right-[35.5%] transform -translate-x-1/2 w-8 z-[5] bg-transparent">
        <LeftFoot />
      </div>
      {/* RIGHT LEG */}
      <div className="absolute top-[59%] left-[45.5%] transform -translate-x-1/2 w-6 z-[5] bg-transparent">
        <RightTopLeg />
      </div>
      <div className="absolute top-[70%] left-[46.5%] transform -translate-x-1/2 w-8 z-[5] bg-transparent">
        <RightFoot />
      </div>
    </>
  );
};
export default Idle3;
