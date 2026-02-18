import * as React from "react";
import Svg, { Path } from "react-native-svg";
const Location2svg = (props) => (
  <Svg
    width={18}
    height={18}
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M15 7.5C15 10.8137 9 16.5 9 16.5C9 16.5 3 10.8137 3 7.5C3 4.18629 5.68629 1.5 9 1.5C12.3137 1.5 15 4.18629 15 7.5Z"
      stroke="#8F90A6"
    />
    <Path
      d="M9 8.25C9.41421 8.25 9.75 7.91421 9.75 7.5C9.75 7.08579 9.41421 6.75 9 6.75C8.58579 6.75 8.25 7.08579 8.25 7.5C8.25 7.91421 8.58579 8.25 9 8.25Z"
      fill="#8F90A6"
      stroke="#8F90A6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default Location2svg;
