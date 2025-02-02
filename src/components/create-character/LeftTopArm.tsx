import OrangeLeftTopArm from "../../assets/orange-variant/Left_Shoulder.svg";

const LeftTopArm = ({choice = 2}) => {
    return (
      <div>
        {choice===1 && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 141.1 97.6">
          <defs>{/* <style>.cls-1{fill:#414042;}</style> */}</defs>
          <g id="Layer_2" data-name="Layer 2">
            <g id="Layer_3" data-name="Layer 3">
              <path
                id="TopLeftHand"
                className="cls-1"
                fill="#414042"
                d="M3.62,67.47l2,4.45a28,28,0,0,0,20,15.84L74.82,97.6l47.84-12.37,5.62-5.43A42,42,0,0,0,141.1,49.59h0A42,42,0,0,0,126,17.33l-8.58-7.16L83.07,0,52.28,12,36.49,9.27A24.88,24.88,0,0,0,10.66,21.49L5.26,31A40.1,40.1,0,0,0,3.62,67.47Z"
              />
            </g>
          </g>
        </svg>}
        {
          choice===2 && <img src={OrangeLeftTopArm} alt="Left Top Arm" className="" />
        }
      </div>
    );
  };
  export default LeftTopArm;
  