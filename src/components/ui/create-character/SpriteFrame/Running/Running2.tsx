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

const Running2 = () => {
  return (
    <>
      <div className="absolute top-[2.5rem] left-[52%] transform -translate-x-1/2 rotate-[10deg] bg-transparent">
        <CharacterHead />
      </div>
      {/* BODY */}
      <div className="absolute top-[8.5rem] left-[48.5%] transform -translate-x-1/2 rotate-[5deg] z-[4] bg-transparent">
        <Body />
      </div>
      {/* LEFT ARM */}
      <div className="absolute top-[40%] right-[23.5%] transform -translate-x-1/2 w-14 rotate-[40deg] z-10 bg-transparent">
        <LeftTopArm />
      </div>
      <div className="absolute top-[46.5%] right-[19.5%] transform -translate-x-1/2 w-[5rem] rotate-[160deg] z-10 bg-transparent">
        <LeftHand />
      </div>
      {/* RIGHT ARM */}
      <div className="absolute top-[38.5%] left-[38%] transform -translate-x-1/2 w-14 rotate-[-45deg] z-10 bg-transparent">
        <RightTopArm />
      </div>
      <div className="absolute top-[36%] left-[30%] transform -translate-x-1/2 w-[5rem] rotate-[60deg] z-10 bg-transparent">
        <RightHand />
      </div>
      {/* LEFT LEG */}
      <div className="absolute top-[59%] right-[43%] transform -translate-x-1/2 w-6 z-[5] rotate-[30deg] bg-transparent">
        <LeftTopLeg />
      </div>
      <div className="absolute top-[62%] right-[49.5%] transform -translate-x-1/2 w-8 z-[5] rotate-[70deg] bg-transparent">
        <LeftFoot />
      </div>
      {/* RIGHT LEG */}
      <div className="absolute top-[56.5%] left-[45.5%] transform -translate-x-1/2 w-6 z-[5] rotate-[-45deg] bg-transparent">
        <RightTopLeg />
      </div>
      <div className="absolute top-[66%] left-[46.5%] transform -translate-x-1/2 w-8 z-[5] rotate-[30deg] bg-transparent">
        <RightFoot />
      </div>
    </>
  );
};
export default Running2;
