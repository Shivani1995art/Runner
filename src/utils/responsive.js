// 📱 src/utils/responsive.js
import {
    scale,
    verticalScale,
    moderateScale,
    moderateVerticalScale,
  } from 'react-native-size-matters';
  import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from 'react-native-responsive-screen';
  // Horizontal scaling (width-based)
  export const s = (size) => scale(size);
  
  // Vertical scaling (height-based)
  export const vs = (size) => verticalScale(size);
  
  // Moderate scaling (for font size, border radius, etc.)
  export const ms = (size, factor = 0.5) => moderateScale(size, factor);
  
  // Moderate vertical scaling (for balanced vertical spacing)
  export const mvs = (size, factor = 0.5) => moderateVerticalScale(size, factor);
  
  // Percentage-based width and height
  export { wp, hp };
  

  export const fontSize = (size) => moderateScale(size);
  

  const Metrics = {
    s,
    vs,
    ms,
    mvs,
    wp,
    hp,
    fontSize,
  };
  
  export default Metrics;
  