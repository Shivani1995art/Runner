import * as React from "react";
import Svg, { Path } from "react-native-svg";
const Emailsvg = (props) => (
  <Svg
    width={32}
    height={32}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M9.33325 12.0001L15.9999 16.6667L22.6666 12.0001"
      stroke="#8F90A6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M2.66675 23.3334V8.66675C2.66675 7.56218 3.56218 6.66675 4.66675 6.66675H27.3334C28.438 6.66675 29.3334 7.56218 29.3334 8.66675V23.3334C29.3334 24.438 28.438 25.3334 27.3334 25.3334H4.66675C3.56218 25.3334 2.66675 24.438 2.66675 23.3334Z"
      stroke="#8F90A6"
    />
  </Svg>
);
export default Emailsvg;
