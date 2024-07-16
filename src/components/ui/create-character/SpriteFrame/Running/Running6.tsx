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

const Running6 = () => {
  return (
    <>
      <div className="absolute top-[2.55rem] left-[55%] transform -translate-x-1/2 rotate-[10deg] bg-transparent">
        <CharacterHead />
      </div>
      {/* BODY */}
      <div className="absolute top-[8.6rem] left-1/2 transform -translate-x-1/2 rotate-[10deg] z-[4] bg-transparent">
        <Body />
      </div>
      {/* LEFT ARM */}
      <div className="absolute top-[42%] right-[24%] transform -translate-x-1/2 w-14 rotate-[60deg] z-[3] bg-transparent">
        <LeftTopArm />
      </div>
      <div className="absolute top-[39%] right-[12.5%] transform -translate-x-1/2 w-[5rem] rotate-[110deg] scale-x-[-1] z-[3] bg-transparent">
        <LeftHand />
      </div>
      {/* RIGHT ARM */}
      <div className="absolute top-[36.5%] left-[39%] transform -translate-x-1/2 w-14 rotate-[-20deg] z-10 bg-transparent">
        <RightTopArm />
      </div>
      <div className="absolute top-[46%] left-[32.5%] transform -translate-x-1/2 w-[5rem] rotate-[-80deg] z-10 bg-transparent">
        <RightHand />
      </div>
      {/* LEFT LEG */}
      <div className="absolute top-[58.75%] right-[43%] transform -translate-x-1/2 w-6 z-[5] rotate-[30deg] bg-transparent">
        <LeftTopLeg />
      </div>
      <div className="absolute top-[60.5%] right-[52%] transform -translate-x-1/2 w-8 z-[5] rotate-[100deg] bg-transparent">
        <LeftFoot />
      </div>
      {/* RIGHT LEG */}
      <div className="absolute top-[57.5%] left-[45%] transform -translate-x-1/2 w-6 z-[5] rotate-[-20deg] bg-transparent">
        <RightTopLeg />
      </div>
      <div className="absolute top-[67%] left-[48%] transform -translate-x-1/2 w-8 z-[5] rotate-[0deg] bg-transparent">
        <RightFoot />
      </div>
    </>
  );
};
export default Running6;
