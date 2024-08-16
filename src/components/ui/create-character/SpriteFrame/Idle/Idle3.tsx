import Body from "../../../../create-character/Body";
import CharacterHead from "../../../../create-character/Head";
import LeftFoot from "../../../../create-character/BottomLeftLeg";
import LeftHand from "../../../../create-character/BottomLeftArm";
import LeftTopArm from "../../../../create-character/LeftTopArm";
import LeftTopLeg from "../../../../create-character/TopLeftLeg";
import RightFoot from "../../../../create-character/RightFoot";
import RightHand from "../../../../create-character/BottomRightArm";
import RightTopArm from "../../../../create-character/TopRightArm";
import RightTopLeg from "../../../../create-character/TopRightLeg";

const Idle3 = () => {
  return (
    <>
      <div className="absolute z-[50] top-[1.9rem] rotate-[2deg] left-1/2 transform -translate-x-1/2 w-[8rem] bg-transparent">
        <CharacterHead />
      </div>
      {/* BODY */}
      <div className="absolute top-[8.4rem] left-1/2 transform -translate-x-1/2 w-[5rem] z-[11] bg-transparent">
        <Body />
      </div>
      {/* LEFT ARM */}
      <div className="absolute top-[41%] right-[23.5%] transform -translate-x-[68%] w-[3.25rem] rotate-[60deg] z-[10] bg-transparent">
        <LeftTopArm />
      </div>
      <div className="absolute top-[51.5%] right-[17.5%] transform -translate-x-[58%] w-[4.5rem] rotate-[95deg] z-10 bg-transparent">
        <LeftHand />
      </div>
      {/* RIGHT ARM */}
      <div className="absolute top-[40%] left-[38%] transform -translate-x-1/2 w-[3.25rem] rotate-[-80deg] z-[12] bg-transparent">
        <RightTopArm />
      </div>
      <div className="absolute top-[53%] left-[38%] transform -translate-x-1/2 w-[4.5rem] rotate-[-100deg] z-[12] bg-transparent">
        <RightHand />
      </div>
      {/* LEFT LEG */}
      <div className="absolute top-[63.5%] right-[36.5%] transform -translate-x-1/2 w-[2rem] z-[6] bg-transparent">
        <LeftTopLeg />
      </div>
      <div className="absolute top-[73%] right-[33%] transform -translate-x-1/2 w-[2.5rem] z-[5] bg-transparent">
        <LeftFoot />
      </div>
      {/* RIGHT LEG */}
      <div className="absolute top-[63.5%] left-[44.5%] transform -translate-x-1/2 w-[2rem] z-[6] bg-transparent">
        <RightTopLeg />
      </div>
      <div className="absolute top-[73%] left-[46%] transform -translate-x-1/2 w-[2.5rem] z-[5] bg-transparent">
        <RightFoot />
      </div>
    </>
  );
};
export default Idle3;
