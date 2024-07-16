import Body from "../../../../create-character/Body";
import CharacterHead from "../../../../create-character/Head";
import LeftFoot from "../../../../create-character/BottomLeftLeg";
import LeftHand from "../../../../create-character/BottomLeftArm";
import LeftTopArm from "../../../../create-character/cut/LeftTopArm";
import LeftTopLeg from "../../../../create-character/TopLeftLeg";
import RightFoot from "../../../../create-character/cut/RightFoot";
import RightHand from "../../../../create-character/BottomRightArm";
import RightTopArm from "../../../../create-character/TopRightArm";
import RightTopLeg from "../../../../create-character/TopRightLeg";

const Running1 = () => {
  return (
    <>
      <div className="absolute top-[2.5rem] left-[54%] transform -translate-x-1/2 rotate-[10deg] bg-transparent">
        <CharacterHead />
      </div>
      {/* BODY */}
      <div className="absolute top-[8.5rem] left-1/2 transform -translate-x-1/2 rotate-[10deg] z-[4] bg-transparent">
        <Body />
      </div>
      {/* LEFT ARM */}
      <div className="absolute top-[42%] right-[24.5%] transform -translate-x-1/2 w-14 rotate-[65deg] z-[3] bg-transparent">
        <LeftTopArm />
      </div>
      <div className="absolute top-[43.5%] right-[9%] transform -translate-x-1/2 w-[5rem] rotate-[-20deg] scale-y-[-1] z-[3] bg-transparent">
        <LeftHand />
      </div>
      {/* RIGHT ARM */}
      <div className="absolute top-[37.5%] left-[40%] transform -translate-x-1/2 w-14 rotate-[-45deg] z-10 bg-transparent">
        <RightTopArm />
      </div>
      <div className="absolute top-[48.5%] left-[38%] transform -translate-x-1/2 w-[5rem] rotate-[-105deg] z-10 bg-transparent">
        <RightHand />
      </div>
      {/* LEFT LEG */}
      <div className="absolute top-[59%] right-[42%] transform -translate-x-1/2 w-6 z-[5] rotate-[15deg] bg-transparent">
        <LeftTopLeg />
      </div>
      <div className="absolute top-[70%] right-[43%] transform -translate-x-1/2 w-8 z-[5] rotate-[20deg] bg-transparent">
        <LeftFoot />
      </div>
      {/* RIGHT LEG */}
      <div className="absolute top-[57%] left-[46.4%] transform -translate-x-1/2 w-6 z-[5] rotate-[-30deg] bg-transparent">
        <RightTopLeg />
      </div>
      <div className="absolute top-[66%] left-[42.5%] transform -translate-x-1/2 w-8 z-[5] rotate-[45deg] bg-transparent">
        <RightFoot />
      </div>
    </>
  );
};
export default Running1;
