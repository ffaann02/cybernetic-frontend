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

const Running5 = () => {
  return (
    <>
      <div className="absolute top-[2.4rem] left-[52.5%] transform -translate-x-1/2 rotate-[5deg] bg-transparent">
        <CharacterHead />
      </div>
      {/* BODY */}
      <div className="absolute top-[8.4rem] left-1/2 transform -translate-x-1/2 rotate-[5deg] z-[4] bg-transparent">
        <Body />
      </div>
      {/* LEFT ARM */}
      {/* <div className="absolute top-[39%] right-[32%] transform -translate-x-1/2 w-14 rotate-[150deg] z-[3] bg-transparent">
        <LeftTopArm />
      </div> */}
      <div className="absolute top-[46%] right-[19%] transform -translate-x-1/2 w-[5rem] rotate-[30deg] z-[3] bg-transparent">
        <LeftHand />
      </div>
      {/* RIGHT ARM */}
      <div className="absolute top-[39%] left-[42.5%] transform -translate-x-1/2 w-14 rotate-[-60deg] z-10 bg-transparent">
        <RightTopArm />
      </div>
      <div className="absolute top-[50%] left-[43.5%] transform -translate-x-1/2 w-[5rem] rotate-[-120deg] z-10 bg-transparent">
        <RightHand />
      </div>
      {/* LEFT LEG */}
      <div className="absolute top-[58.75%] right-[41%] transform -translate-x-1/2 w-6 z-[5] rotate-[5deg] bg-transparent">
        <LeftTopLeg />
      </div>
      <div className="absolute top-[61.5%] right-[46.5%] transform -translate-x-1/2 w-8 z-[5] rotate-[100deg] bg-transparent">
        <LeftFoot />
      </div>
      {/* RIGHT LEG */}
      <div className="absolute top-[56.5%] left-[44%] transform -translate-x-1/2 w-6 z-[5] rotate-[-10deg] bg-transparent">
        <RightTopLeg />
      </div>
      <div className="absolute top-[67%] left-[44.5%] transform -translate-x-1/2 w-8 z-[5] rotate-[10deg] bg-transparent">
        <RightFoot />
      </div>
    </>
  );
};
export default Running5;
