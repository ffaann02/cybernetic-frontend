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

const Jump3 = () => {
  return (
    <>
      <div className="absolute top-[2.5rem] left-[50%] transform -translate-x-1/2 rotate-[-5deg] z-10 bg-transparent">
        <CharacterHead />
      </div>
      {/* BODY */}
      <div className="absolute top-[8.5rem] left-[50%] transform -translate-x-1/2 rotate-[-3deg] z-[4] bg-transparent">
        <Body />
      </div>
      {/* LEFT ARM */}
      <div className="absolute top-[30%] right-[26.5%] transform -translate-x-1/2 w-14 rotate-[-60deg] z-[3] bg-transparent">
        <LeftTopArm />
      </div>
      <div className="absolute top-[18%] right-[20.5%] transform -translate-x-1/2 w-[5rem] rotate-[-110deg] scale-y-[-1] z-[3] bg-transparent">
        <LeftHand />
      </div>
      {/* RIGHT ARM */}
      <div className="absolute top-[27%] left-[42.5%] transform -translate-x-1/2 w-14 rotate-[-100deg] scale-x-[-1] z-10 bg-transparent">
        <RightTopArm />
      </div>
      <div className="absolute top-[14%] left-[36%] transform -translate-x-1/2 w-[5rem] rotate-[60deg] z-10 bg-transparent">
        <RightHand />
      </div>
      {/* LEFT LEG */}
      <div className="absolute top-[58%] right-[37%] transform -translate-x-1/2 w-6 z-[5] rotate-[-10deg] bg-transparent">
        <LeftTopLeg />
      </div>
      <div className="absolute top-[68%] right-[34%] transform -translate-x-1/2 w-8 rotate-[10deg] z-[5] bg-transparent">
        <LeftFoot />
      </div>
      {/* RIGHT LEG */}
      <div className="absolute top-[58%] left-[48%] transform -translate-x-1/2 w-6 rotate-[-30deg] z-[5] bg-transparent">
        <RightTopLeg />
      </div>
      <div className="absolute top-[67%] left-[48%] transform -translate-x-1/2 w-8 rotate-[30deg] z-[5] bg-transparent">
        <RightFoot />
      </div>
    </>
  );
};
export default Jump3;
