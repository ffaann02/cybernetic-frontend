import OrangeTopRightArm from "../../assets/orange-variant/Right_Shoulder.svg";

const Top_RightArm = ({ choice = 2 }) => {
  return (
    <div>
      {choice === 1 && (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 141.1 97.6">
          <defs>{/* <style>.cls-1{fill:#414042;}</style> */}</defs>
          <g id="Layer_2" data-name="Layer 2">
            <g id="Layer_3" data-name="Layer 3">
              <path
                id="TopRightHand"
                className="cls-1"
                fill="#414042"
                d="M137.48,67.47l-2,4.45a28,28,0,0,1-20,15.84L66.28,97.6,18.44,85.23,12.82,79.8A42,42,0,0,1,0,49.59H0A42,42,0,0,1,15.09,17.33l8.58-7.16L58,0,88.82,12l15.79-2.71a24.88,24.88,0,0,1,25.83,12.22l5.4,9.48A40.1,40.1,0,0,1,137.48,67.47Z"
              />
            </g>
          </g>
        </svg>
      )}
      {choice === 2 && <img src={OrangeTopRightArm} alt="Left Top Arm" />}
    </div>
  );
};
export default Top_RightArm;
