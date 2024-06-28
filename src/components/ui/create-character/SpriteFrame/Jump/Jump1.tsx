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

const Jump1 = () => {
  return (
    <>
      <div className="absolute top-[2.5rem] left-[52%] transform -translate-x-1/2 rotate-[5deg] bg-transparent">
        <CharacterHead />
      </div>
      {/* BODY */}
      <div className="absolute top-[8.5rem] left-1/2 transform -translate-x-1/2 rotate-[5deg] z-[4] bg-transparent">
        <Body />
      </div>
      {/* LEFT ARM */}
      <div className="absolute top-[35%] right-[23.5%] transform -translate-x-1/2 w-14 rotate-[-10deg] z-[3] bg-transparent">
        <LeftTopArm />
      </div>
      <div className="absolute top-[27%] right-[11%] transform -translate-x-1/2 w-[5rem] rotate-[-80deg] scale-y-[-1] z-10 bg-transparent">
        <LeftHand />
      </div>
      {/* RIGHT ARM */}
      <div className="absolute top-[39.5%] left-[43%] transform -translate-x-1/2 w-14 rotate-[-120deg] z-10 bg-transparent">
        <RightTopArm />
      </div>
      <div className="absolute top-[36%] left-[47%] transform -translate-x-1/2 w-[5rem] rotate-[105deg] z-10 bg-transparent">
        <RightHand />
      </div>
      {/* LEFT LEG */}
      <div className="absolute top-[59%] right-[40%] transform -translate-x-1/2 w-6 z-[5] rotate-[5deg] bg-transparent">
        <LeftTopLeg />
      </div>
      <div className="absolute top-[70%] right-[39%] transform -translate-x-1/2 w-8 rotate-[10deg] z-[5] bg-transparent">
        <LeftFoot />
      </div>
      {/* RIGHT LEG */}
      <div className="absolute top-[59%] left-[43.5%] transform -translate-x-1/2 w-6 rotate-[10deg] z-[5] bg-transparent">
        <RightTopLeg />
      </div>
      <div className="absolute top-[69%] left-[42%] transform -translate-x-1/2 w-8 rotate-[12.5deg] z-[5] bg-transparent">
        <RightFoot />
      </div>
    </>
  );
};
export default Jump1;
