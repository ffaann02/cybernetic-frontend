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

const Running4 = () => {
  return (
    <>
      <div className="absolute top-[2.3rem] left-[54%] transform -translate-x-1/2 rotate-[10deg] bg-transparent">
        <CharacterHead />
      </div>
      {/* BODY */}
      <div className="absolute top-[8.3rem] left-1/2 transform -translate-x-1/2 rotate-[10deg] z-[4] bg-transparent">
        <Body />
      </div>
      {/* LEFT ARM */}
      <div className="absolute top-[39%] right-[30%] transform -translate-x-1/2 w-14 rotate-[150deg] z-[3] bg-transparent">
        <LeftTopArm />
      </div>
      <div className="absolute top-[40.5%] left-[48%] transform -translate-x-1/2 w-[5rem] rotate-[30deg] scale-y-[-1] z-[3] bg-transparent">
        <LeftHand />
      </div>
      {/* RIGHT ARM */}
      <div className="absolute top-[37%] left-[43.5%] transform -translate-x-1/2 w-14 rotate-[-110deg] z-10 bg-transparent">
        <RightTopArm />
      </div>
      <div className="absolute top-[42%] left-[52.5%] transform -translate-x-1/2 w-[5rem] rotate-[-185deg] z-10 bg-transparent">
        <RightHand />
      </div>
      {/* LEFT LEG */}
      <div className="absolute top-[57.75%] right-[40%] transform -translate-x-1/2 w-6 z-[5] rotate-[-10deg] bg-transparent">
        <LeftTopLeg />
      </div>
      <div className="absolute top-[67%] right-[40%] transform -translate-x-1/2 w-8 z-[5] rotate-[30deg] bg-transparent">
        <LeftFoot />
      </div>
      {/* RIGHT LEG */}
      <div className="absolute top-[57.5%] left-[44%] transform -translate-x-1/2 w-6 z-[5] rotate-[5deg] bg-transparent">
        <RightTopLeg />
      </div>
      <div className="absolute top-[67%] left-[41%] transform -translate-x-1/2 w-8 z-[5] rotate-[30deg] bg-transparent">
        <RightFoot />
      </div>
    </>
  );
};
export default Running4;
