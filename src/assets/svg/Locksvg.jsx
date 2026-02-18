import * as React from "react";
import Svg, { Path } from "react-native-svg";
const Locksvg = (props) => (
  <Svg
    width={32}
    height={32}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M13.8333 11.1667H15.9C16.2314 11.1667 16.5 11.4353 16.5 11.7667V21.2333C16.5 21.5647 16.2314 21.8333 15.9 21.8333H1.1C0.768629 21.8333 0.5 21.5647 0.5 21.2333V11.7667C0.5 11.4353 0.768629 11.1667 1.1 11.1667H3.16667M13.8333 11.1667V5.83333C13.8333 4.05556 12.7667 0.5 8.5 0.5C4.23333 0.5 3.16667 4.05556 3.16667 5.83333V11.1667M13.8333 11.1667H3.16667"
      stroke="#8F90A6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default Locksvg;
