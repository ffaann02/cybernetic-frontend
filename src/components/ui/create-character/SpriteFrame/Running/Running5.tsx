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

const Running5 = () => {
  return (
    <>
      <div className="absolute z-[50] top-[2.1rem] left-1/2 transform -translate-x-[44.5%] w-[8rem] bg-transparent rotate-[0deg]">
        <CharacterHead />
      </div>
      {/* BODY */}
      <div className="absolute top-[8.5rem] left-1/2 transform -translate-x-1/2 w-[5rem] z-[11] bg-transparent rotate-[5deg]">
        <Body />
      </div>
      {/* LEFT ARM */}
      <div className="absolute top-[43%] right-[25.5%] transform -translate-x-[70%] w-[3.25rem] rotate-[100deg] z-[10] bg-transparent">
        <LeftTopArm />
      </div>
      <div className="absolute top-[53%] right-[16.5%] transform -translate-x-[60%] w-[4.5rem] -scale-y-100 rotate-[10deg] z-10 bg-transparent">
        <LeftHand />
      </div>
      {/* RIGHT ARM */}
      <div className="absolute top-[40.5%] left-[38%] transform -translate-x-1/2 w-[3.25rem] rotate-[-60deg] z-[12] bg-transparent">
        <RightTopArm />
      </div>
      <div className="absolute top-[53%] left-[39%] transform -translate-x-1/2 w-[4.5rem] rotate-[-120deg] z-[12] bg-transparent">
        <RightHand />
      </div>
      {/* LEFT LEG */}
      <div className="absolute top-[64%] right-[37.5%] transform -translate-x-1/2 w-[2rem] z-[3] bg-transparent rotate-[5deg]">
        <LeftTopLeg />
      </div>
      <div className="absolute top-[72.5%] right-[43.5%] transform -translate-x-1/2 w-[2.5rem] z-[2] bg-transparent rotate-[80deg]">
        <LeftFoot />
      </div>
      {/* RIGHT LEG */}
      <div className="absolute top-[64%] left-[44.5%] transform -translate-x-1/2 w-[2rem] z-[6] bg-transparent rotate-[-7.5deg]">
        <RightTopLeg />
      </div>
      <div className="absolute top-[76%] left-[44.5%] transform -translate-x-1/2 w-[2.5rem] z-[5] bg-transparent rotate-[15deg]">
        <RightFoot />
      </div>
    </>
  );
};
export default Running5;
