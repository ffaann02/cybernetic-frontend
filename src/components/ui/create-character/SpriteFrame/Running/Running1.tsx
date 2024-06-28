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

const Running1 = () => {
  return (
    <>
      <div className="absolute top-[2.8rem] left-[47%] transform -translate-x-1/2 rotate-[-20deg] bg-transparent">
        <CharacterHead />
      </div>
      {/* BODY */}
      <div className="absolute top-[8.5rem] left-[52%] transform -translate-x-1/2 z-[4] rotate-[-10deg] bg-transparent">
        <Body />
      </div>
      {/* LEFT ARM */}
      <div className="absolute top-[35%] right-[22.5%] transform -translate-x-1/2 w-14 rotate-[10deg] z-10 bg-transparent">
        <LeftTopArm />
      </div>
      <div className="absolute top-[27.5%] right-[10.5%] transform -translate-x-1/2 w-[5rem] rotate-[95deg] z-10 bg-transparent scale-x-[-1]">
        <LeftHand />
      </div>
      {/* RIGHT ARM */}
      <div className="absolute top-[40%] left-[38%] transform -translate-x-1/2 w-14 rotate-[-45deg] z-10 bg-transparent">
        <RightTopArm />
      </div>
      <div className="absolute top-[38%] left-[29%] transform -translate-x-1/2 w-[5rem] rotate-[60deg] z-10 bg-transparent">
        <RightHand />
      </div>
      {/* LEFT LEG */}
      <div className="absolute top-[56.5%] right-[37%] transform -translate-x-1/2 w-6 z-[5] rotate-[30deg] bg-transparent">
        <LeftTopLeg />
      </div>
      <div className="absolute top-[59%] right-[45%] transform -translate-x-1/2 w-8 z-[5] rotate-[90deg] bg-transparent">
        <LeftFoot />
      </div>
      {/* RIGHT LEG */}
      <div className="absolute top-[57%] left-[53%] transform -translate-x-1/2 w-6 z-[5] rotate-[-60deg] bg-transparent">
        <RightTopLeg />
      </div>
      <div className="absolute top-[65%] left-[58%] transform -translate-x-1/2 w-8 z-[5] rotate-[10deg] bg-transparent">
        <RightFoot />
      </div>
    </>
  );
};
export default Running1;
