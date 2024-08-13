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

const LiftRunning6 = () => {
  return (
    <>
      <div className="absolute z-[50] top-[2rem] left-1/2 transform -translate-x-[46%] w-[8rem] bg-transparent rotate-[3deg]">
        <CharacterHead />
      </div>
      {/* BODY */}
      <div className="absolute top-[8.6rem] left-1/2 transform -translate-x-1/2 w-[5rem] z-[11] bg-transparent rotate-[5deg]">
        <Body />
      </div>
            {/* LEFT ARM */}
      <div className="absolute top-[38.5%] right-[20.5%] transform -translate-x-[70%] w-[3.25rem] rotate-[-15deg] z-[10] bg-transparent">
        <LeftTopArm />
      </div>
      <div className="absolute top-[30%] right-[10.5%] transform -translate-x-[60%] w-[4.5rem]  -scale-y-100 rotate-[-80deg] z-10 bg-transparent">
        <LeftHand />
      </div>
      {/* RIGHT ARM */}
      <div className="absolute top-[37%] left-[37.5%] transform -translate-x-1/2 w-[3.25rem] rotate-[40deg] z-[12] bg-transparent">
        <RightTopArm />
      </div>
      <div className="absolute top-[26.5%] left-[32.5%] transform -translate-x-1/2 w-[4.5rem] -scale-y-100 rotate-[80deg] z-[50] bg-transparent">
        <RightHand />
      </div>
      {/* LEFT LEG */}
      <div className="absolute top-[64%] right-[38.5%] transform -translate-x-1/2 w-[2rem] z-[3] bg-transparent rotate-[20deg]">
        <LeftTopLeg />
      </div>
      <div className="absolute top-[68%] right-[47.5%] transform -translate-x-1/2 w-[2.5rem] z-[2] bg-transparent rotate-[110deg]">
        <LeftFoot />
      </div>
      {/* RIGHT LEG */}
      <div className="absolute top-[64%] left-[45%] transform -translate-x-1/2 w-[2rem] z-[6] bg-transparent rotate-[-7.5deg]">
        <RightTopLeg />
      </div>
      <div className="absolute top-[76%] left-[48%] transform -translate-x-1/2 w-[2.5rem] z-[5] bg-transparent rotate-[-5deg]">
        <RightFoot />
      </div>
    </>
  );
};
export default LiftRunning6;
