import * as React from "react";
import Svg, { Rect, Circle } from "react-native-svg";
const RedDotsvg = ({width=18,height=18,fill="white",stroke= "#FB3838" ,dotfill="#FB3838",props}) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Rect
      x={0.5}
      y={0.5}
      width={17}
      height={17}
      rx={3.5}
      fill={fill}
      stroke={stroke}
    />
    <Circle cx={9} cy={9} r={5} fill={dotfill} />
  </Svg>
);
export default RedDotsvg;
