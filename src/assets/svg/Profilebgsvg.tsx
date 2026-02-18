import * as React from "react";
import Svg, {
  G,
  Rect,
  Defs,
  ClipPath,
  LinearGradient,
  Stop,
} from "react-native-svg";
const Profilebgsvg = ({width,height,props}) => (
  <Svg
    width={width}
    height={height}
   // viewBox="0 0 440 386"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <G
      clipPath="url(#paint0_diamond_1_27201_clip_path)"
      data-figma-skip-parse="true"
    >
      <G transform="matrix(-0.005 -0.379 0.432021 -0.00569948 225 379)">
        <Rect
          x={0}
          y={0}
          width={1010.33}
          height={523.276}
          fill="url(#paint0_diamond_1_27201)"
          opacity={1}
          shapeRendering="crispEdges"
        />
        <Rect
          x={0}
          y={0}
          width={1010.33}
          height={523.276}
          transform="scale(1 -1)"
          fill="url(#paint0_diamond_1_27201)"
          opacity={1}
          shapeRendering="crispEdges"
        />
        <Rect
          x={0}
          y={0}
          width={1010.33}
          height={523.276}
          transform="scale(-1 1)"
          fill="url(#paint0_diamond_1_27201)"
          opacity={1}
          shapeRendering="crispEdges"
        />
        <Rect
          x={0}
          y={0}
          width={1010.33}
          height={523.276}
          transform="scale(-1)"
          fill="url(#paint0_diamond_1_27201)"
          opacity={1}
          shapeRendering="crispEdges"
        />
      </G>
    </G>
    <Rect
      width={440}
      height={386}
      data-figma-gradient-fill="{&#34;type&#34;:&#34;GRADIENT_DIAMOND&#34;,&#34;stops&#34;:[{&#34;color&#34;:{&#34;r&#34;:1.0,&#34;g&#34;:0.97399002313613892,&#34;b&#34;:0.77403843402862549,&#34;a&#34;:1.0},&#34;position&#34;:0.0},{&#34;color&#34;:{&#34;r&#34;:0.92156863212585449,&#34;g&#34;:0.98431372642517090,&#34;b&#34;:0.91764706373214722,&#34;a&#34;:1.0},&#34;position&#34;:0.71153843402862549}],&#34;stopsVar&#34;:[{&#34;color&#34;:{&#34;r&#34;:1.0,&#34;g&#34;:0.97399002313613892,&#34;b&#34;:0.77403843402862549,&#34;a&#34;:1.0},&#34;position&#34;:0.0},{&#34;color&#34;:{&#34;r&#34;:0.92156863212585449,&#34;g&#34;:0.98431372642517090,&#34;b&#34;:0.91764706373214722,&#34;a&#34;:1.0},&#34;position&#34;:0.71153843402862549}],&#34;transform&#34;:{&#34;m00&#34;:-9.9999952316284180,&#34;m01&#34;:864.04144287109375,&#34;m02&#34;:-202.02073669433594,&#34;m10&#34;:-758.0,&#34;m11&#34;:-11.398958206176758,&#34;m12&#34;:763.6994628906250},&#34;opacity&#34;:1.0,&#34;blendMode&#34;:&#34;NORMAL&#34;,&#34;visible&#34;:true}"
    />
    <Defs>
      <ClipPath id="paint0_diamond_1_27201_clip_path">
        <Rect width={440} height={386} />
      </ClipPath>
      <LinearGradient
        id="paint0_diamond_1_27201"
        x1={0}
        y1={0}
        x2={500}
        y2={500}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#FFF8C5" />
        <Stop offset={0.711538} stopColor="#EBFBEA" />
      </LinearGradient>
    </Defs>
  </Svg>
);
export default Profilebgsvg;
