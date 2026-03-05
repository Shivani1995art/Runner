// import React, { useEffect, useRef } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   Animated,
//   Easing,
//   Image,
//   Dimensions,
// } from 'react-native';
// import { ms, vs, fontSize, hp, wp } from '../../utils/responsive';
// import Colors from '../../utils/colors';
// import { Typography } from '../../utils/typography';
// import { Package, MapPin, Zap, Car, Store } from 'lucide-react-native';

// const { width, height } = Dimensions.get('window');

// interface LoadingScreenProps {
//   message?: string;
// }

// const LoadingScreen: React.FC<LoadingScreenProps> = ({
//   message = 'Getting ready...',
// }) => {
//   // Animation values
//   const pulseAnim = useRef(new Animated.Value(1)).current;
//   const rotateAnim = useRef(new Animated.Value(0)).current;
//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const slideAnim = useRef(new Animated.Value(50)).current;
  
//   // Dot animations
//   const dot1 = useRef(new Animated.Value(0)).current;
//   const dot2 = useRef(new Animated.Value(0)).current;
//   const dot3 = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     // Fade in animation
//     Animated.timing(fadeAnim, {
//       toValue: 1,
//       duration: 400,
//       useNativeDriver: true,
//     }).start();

//     // Slide up animation
//     Animated.timing(slideAnim, {
//       toValue: 0,
//       duration: 500,
//       easing: Easing.out(Easing.cubic),
//       useNativeDriver: true,
//     }).start();

//     // Pulse animation
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(pulseAnim, {
//           toValue: 1.15,
//           duration: 1000,
//           easing: Easing.inOut(Easing.ease),
//           useNativeDriver: true,
//         }),
//         Animated.timing(pulseAnim, {
//           toValue: 1,
//           duration: 1000,
//           easing: Easing.inOut(Easing.ease),
//           useNativeDriver: true,
//         }),
//       ])
//     ).start();

//     // Rotate animation
//     Animated.loop(
//       Animated.timing(rotateAnim, {
//         toValue: 1,
//         duration: 2000,
//         easing: Easing.linear,
//         useNativeDriver: true,
//       })
//     ).start();

//     // Dot animation sequence
//     const animateDots = () => {
//       Animated.loop(
//         Animated.stagger(200, [
//           Animated.sequence([
//             Animated.timing(dot1, {
//               toValue: 1,
//               duration: 400,
//               useNativeDriver: true,
//             }),
//             Animated.timing(dot1, {
//               toValue: 0,
//               duration: 400,
//               useNativeDriver: true,
//             }),
//           ]),
//           Animated.sequence([
//             Animated.timing(dot2, {
//               toValue: 1,
//               duration: 400,
//               useNativeDriver: true,
//             }),
//             Animated.timing(dot2, {
//               toValue: 0,
//               duration: 400,
//               useNativeDriver: true,
//             }),
//           ]),
//           Animated.sequence([
//             Animated.timing(dot3, {
//               toValue: 1,
//               duration: 400,
//               useNativeDriver: true,
//             }),
//             Animated.timing(dot3, {
//               toValue: 0,
//               duration: 400,
//               useNativeDriver: true,
//             }),
//           ]),
//         ])
//       ).start();
//     };

//     animateDots();
//   }, []);

//   const spin = rotateAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: ['0deg', '360deg'],
//   });

//   return (
//     <View style={styles.container}>
//       {/* Background gradient effect */}
//       <View style={styles.gradientOverlay} />

//       {/* Animated content */}
//       <Animated.View
//         style={[
//           styles.contentContainer,
//           {
//             opacity: fadeAnim,
//             transform: [{ translateY: slideAnim }],
//           },
//         ]}
//       >
//         {/* Main icon with pulse */}
//         <Animated.View
//           style={[
//             styles.iconContainer,
//             {
//               transform: [{ scale: pulseAnim }],
//             },
//           ]}
//         >
//           <View style={styles.iconCircle}>
//             <Store size={ms(50)} color={Colors.white} strokeWidth={2.5} />
//           </View>

//           {/* Rotating ring */}
//           <Animated.View
//             style={[
//               styles.rotatingRing,
//               {
//                 transform: [{ rotate: spin }],
//               },
//             ]}
//           >
//             <View style={styles.ringDot} />
//             <View style={[styles.ringDot, styles.ringDot2]} />
//             <View style={[styles.ringDot, styles.ringDot3]} />
//           </Animated.View>
//         </Animated.View>

//         {/* App name */}
//         {/* <Text style={styles.appName}>Runner</Text> */}

//         {/* Loading message */}
//         <View style={styles.messageContainer}>
//           <Text style={styles.loadingText}>{message}</Text>
          
//           {/* Animated dots */}
//           <View style={styles.dotsContainer}>
//             <Animated.View
//               style={[
//                 styles.dot,
//                 {
//                   opacity: dot1,
//                   transform: [
//                     {
//                       translateY: dot1.interpolate({
//                         inputRange: [0, 1],
//                         outputRange: [0, -8],
//                       }),
//                     },
//                   ],
//                 },
//               ]}
//             />
//             <Animated.View
//               style={[
//                 styles.dot,
//                 {
//                   opacity: dot2,
//                   transform: [
//                     {
//                       translateY: dot2.interpolate({
//                         inputRange: [0, 1],
//                         outputRange: [0, -8],
//                       }),
//                     },
//                   ],
//                 },
//               ]}
//             />
//             <Animated.View
//               style={[
//                 styles.dot,
//                 {
//                   opacity: dot3,
//                   transform: [
//                     {
//                       translateY: dot3.interpolate({
//                         inputRange: [0, 1],
//                         outputRange: [0, -8],
//                       }),
//                     },
//                   ],
//                 },
//               ]}
//             />
//           </View>
//         </View>

//         {/* Feature hints */}
       
//       </Animated.View>

//       {/* Bottom branding */}
//       <View style={styles.bottomBranding}>

//  <View style={styles.featuresContainer}>
//           <View style={styles.featureItem}>
//             <Zap size={ms(16)} color={Colors.orange} />
//             <Text style={styles.featureText}>Fast Delivery</Text>
//           </View>
//           <View style={styles.featureDivider} />
//           <View style={styles.featureItem}>
//             <MapPin size={ms(16)} color={Colors.orange} />
//             <Text style={styles.featureText}>Real-time Tracking</Text>
//           </View>
//         </View>

//         {/* <Text style={styles.brandingText}>Powered by Runner</Text> */}
//         {/* <Text style={styles.versionText}>v1.0.0</Text> */}
//       </View>
//     </View>
//   );
// };

// export default LoadingScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Colors.white,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   gradientOverlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: Colors.white,
//   },
//   contentContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   iconContainer: {
//     position: 'relative',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: vs(32),
//   },
//   iconCircle: {
//     width: ms(120),
//     height: ms(120),
//     borderRadius: ms(60),
//     backgroundColor: Colors.orange,
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: Colors.orange,
//     shadowOffset: {
//       width: 0,
//       height: 8,
//     },
//     shadowOpacity: 0.3,
//     shadowRadius: 16,
//     elevation: 12,
//   },
//   rotatingRing: {
//     position: 'absolute',
//     width: ms(160),
//     height: ms(160),
//     borderRadius: ms(80),
//     borderWidth: 2,
//     borderColor: Colors.orange,
//     opacity: 0.3,
//   },
//   ringDot: {
//     position: 'absolute',
//     width: ms(10),
//     height: ms(10),
//     borderRadius: ms(5),
//     backgroundColor: Colors.orange,
//     top: -ms(5),
//     left: '50%',
//     marginLeft: -ms(5),
//   },
//   ringDot2: {
//     top: '50%',
//     left: -ms(5),
//     marginTop: -ms(5),
//     marginLeft: 0,
//   },
//   ringDot3: {
//     top: '50%',
//     right: -ms(5),
//     left: 'auto',
//     marginTop: -ms(5),
//   },
//   appName: {
//     fontSize: fontSize(32),
//     fontFamily: Typography.Bold.fontFamily,
//     color: Colors.black,
//     marginBottom: vs(8),
//     letterSpacing: 1,
//   },
//   messageContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: vs(40),
//     height: vs(30),
//   },
//   loadingText: {
//     fontSize: fontSize(16),
//     fontFamily: Typography.Medium.fontFamily,
//     color: Colors.borderColor1,
//     marginRight: ms(4),
//   },
//   dotsContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: ms(4),
//     paddingTop: vs(2),
//   },
//   dot: {
//     width: ms(6),
//     height: ms(6),
//     borderRadius: ms(3),
//     backgroundColor: Colors.orange,
//   },
//   featuresContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: Colors.cardbg,
//     paddingHorizontal: ms(20),
//     paddingVertical: vs(12),
//     borderRadius: ms(24),
//     gap: ms(16),
//   },
//   featureItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: ms(6),
//   },
//   featureDivider: {
//     width: 1,
//     height: vs(20),
//     backgroundColor: Colors.borderColor,
//   },
//   featureText: {
//     fontSize: fontSize(13),
//     fontFamily: Typography.Medium.fontFamily,
//     color: Colors.black,
//   },
//   bottomBranding: {
//     position: 'absolute',
//     bottom: vs(40),
//     alignItems: 'center',
//   },
//   brandingText: {
//     fontSize: fontSize(12),
//     fontFamily: Typography.Regular.fontFamily,
//     color: Colors.borderColor1,
//     marginBottom: vs(4),
//   },
//   versionText: {
//     fontSize: fontSize(10),
//     fontFamily: Typography.Regular.fontFamily,
//     color: Colors.borderColor1,
//   },
// });

// import React, { useEffect, useRef, useState } from 'react';
// import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
// import { vs, ms, fontSize } from '../../utils/responsive';
// import Colors from '../../utils/colors';
// import { Typography } from '../../utils/typography';

// interface LoadingScreenProps {
//   onReady: () => void;
//   message?: string;
//   subtitle?: string;
// }

// const LoadingScreen = ({ 
//   onReady, 
//   message = "Loading your orders...",
//   subtitle = "Almost there!"
// }: LoadingScreenProps) => {
//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const scaleAnim = useRef(new Animated.Value(0.8)).current;
//   const progressAnim = useRef(new Animated.Value(0)).current;
//   const [loadingText, setLoadingText] = useState('Fetching avaiable orders');

//   useEffect(() => {
//     // Entrance animation
//     Animated.parallel([
//       Animated.timing(fadeAnim, {
//         toValue: 1,
//         duration: 500,
//         useNativeDriver: true,
//       }),
//       Animated.spring(scaleAnim, {
//         toValue: 1,
//         friction: 8,
//         tension: 40,
//         useNativeDriver: true,
//       }),
//     ]).start();

//     // Progress bar animation
//     Animated.timing(progressAnim, {
//       toValue: 1,
//       duration: 1500,
//       easing: Easing.bezier(0.25, 0.1, 0.25, 1),
//       useNativeDriver: false,
//     }).start();

//     // Change loading text like Zomato does
//     const textTimer1 = setTimeout(() => {
//       setLoadingText('Loading your favorites');
//     }, 500);

//     const textTimer2 = setTimeout(() => {
//       setLoadingText('Getting everything ready');
//     }, 1000);

//     // Call onReady after animation completes
//     const readyTimer = setTimeout(() => {
//       onReady();
//     }, 1500);

//     return () => {
//       clearTimeout(textTimer1);
//       clearTimeout(textTimer2);
//       clearTimeout(readyTimer);
//     };
//   }, [onReady]);

//   const progressWidth = progressAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: ['0%', '100%'],
//   });

//   return (
//     <View style={styles.container}>
//       <Animated.View 
//         style={[
//           styles.content,
//           {
//             opacity: fadeAnim,
//             transform: [{ scale: scaleAnim }],
//           },
//         ]}
//       >
//         {/* Logo or Icon */}
//         <View style={styles.iconContainer}>
//           <View style={styles.logo}>
//             <Text style={styles.logoText}>🏖️</Text>
//           </View>
//         </View>

//         {/* Animated Loading Dots */}
//         <View style={styles.dotsContainer}>
//           <LoadingDot delay={0} />
//           <LoadingDot delay={200} />
//           <LoadingDot delay={400} />
//         </View>

//         {/* Title */}
//         <Text style={styles.title}>{message}</Text>
        
//         {/* Animated subtitle */}
//         <Text style={styles.subtitle}>{loadingText}</Text>

//         {/* Progress Bar */}
//         <View style={styles.progressBarContainer}>
//           <Animated.View 
//             style={[
//               styles.progressBar,
//               { width: progressWidth }
//             ]} 
//           />
//         </View>
//       </Animated.View>
//     </View>
//   );
// };

// // Animated Loading Dot Component
// const LoadingDot = ({ delay }: { delay: number }) => {
//   const bounceAnim = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(bounceAnim, {
//           toValue: 1,
//           duration: 400,
//           delay,
//           useNativeDriver: true,
//         }),
//         Animated.timing(bounceAnim, {
//           toValue: 0,
//           duration: 400,
//           useNativeDriver: true,
//         }),
//       ])
//     ).start();
//   }, []);

//   const translateY = bounceAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: [0, -10],
//   });

//   return (
//     <Animated.View
//       style={[
//         styles.dot,
//         {
//           transform: [{ translateY }],
//         },
//       ]}
//     />
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   content: {
//     alignItems: 'center',
//     paddingHorizontal: ms(40),
//   },
//   iconContainer: {
//     marginBottom: vs(30),
//   },
//   logo: {
//     width: ms(80),
//     height: ms(80),
//     borderRadius: ms(40),
//     backgroundColor: Colors.cyan || '#E8F5F5',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   logoText: {
//     fontSize: fontSize(40),
//   },
//   dotsContainer: {
//     flexDirection: 'row',
//     marginBottom: vs(20),
//     gap: ms(8),
//   },
//   dot: {
//     width: ms(8),
//     height: ms(8),
//     borderRadius: ms(4),
//     backgroundColor: Colors.Green || '#00A699',
//   },
//   title: {
//     fontSize: fontSize(22),
//     fontFamily: Typography.Bold.fontFamily,
//     color: Colors.black || '#000',
//     marginBottom: vs(8),
//     textAlign: 'center',
//   },
//   subtitle: {
//     fontSize: fontSize(14),
//     fontFamily: Typography.Regular.fontFamily,
//     color: '#666',
//     marginBottom: vs(30),
//     textAlign: 'center',
//   },
//   progressBarContainer: {
//     width: ms(200),
//     height: vs(4),
//     backgroundColor: '#E0E0E0',
//     borderRadius: vs(2),
//     overflow: 'hidden',
//   },
//   progressBar: {
//     height: '100%',
//     backgroundColor: Colors.Green || '#00A699',
//     borderRadius: vs(2),
//   },
// });

// export default LoadingScreen;

import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { vs, ms, fontSize } from '../../utils/responsive';
import Colors from '../../utils/colors';
import { Typography } from '../../utils/typography';

interface LoadingScreenProps {
  message?: string;
}

const LoadingScreen = ({ 
  message = "Loading your orders..."
}: LoadingScreenProps) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  
  // New: Scooter vibration and road movement
  const driveAnim = useRef(new Animated.Value(0)).current;
  
  const [loadingText, setLoadingText] = useState('Fetching available orders');

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Scooter Vibration loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(driveAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(driveAnim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Progress bar animation
    Animated.loop(
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 1500,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        useNativeDriver: false,
      })
    ).start();

    const textTimer1 = setTimeout(() => setLoadingText('Checking permissions'), 800);
    const textTimer2 = setTimeout(() => setLoadingText('Getting everything ready'), 1600);
    const textTimer3 = setTimeout(() => setLoadingText('Almost there'), 2400);

    return () => {
      clearTimeout(textTimer1);
      clearTimeout(textTimer2);
      clearTimeout(textTimer3);
    };
  }, []);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  // Scooter "bumpy road" translation
  const scooterTranslateY = driveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -2],
  });

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Animated Scooter Section */}
        <View style={styles.scooterWrapper}>
          <Animated.View style={[styles.logo, { transform: [{ translateY: scooterTranslateY }] }]}>
            <Text style={[styles.logoText, { transform: [{ scaleX: -1 }] }]}>
              🛵
            </Text>
          </Animated.View>
          
          {/* Moving Road Lines */}
          <View style={styles.road}>
            <RoadLine delay={0} />
            <RoadLine delay={500} />
            <RoadLine delay={1000} />
          </View>
        </View>

        <View style={styles.dotsContainer}>
          <LoadingDot delay={0} />
          <LoadingDot delay={200} />
          <LoadingDot delay={400} />
        </View>

        <Text style={styles.title}>{message}</Text>
        <Text style={styles.subtitle}>{loadingText}</Text>

        <View style={styles.progressBarContainer}>
          <Animated.View style={[styles.progressBar, { width: progressWidth }]} />
        </View>
      </Animated.View>
    </View>
  );
};

// Component for the moving lines under the scooter
const RoadLine = ({ delay }: { delay: number }) => {
  const lineAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(lineAnim, {
        toValue: 1,
        duration: 800,
        delay,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const translateX = lineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [40, -40], // Moves from right to left
  });

  const opacity = lineAnim.interpolate({
    inputRange: [0, 0.2, 0.8, 1],
    outputRange: [0, 1, 1, 0], // Fade in and out
  });

  return (
    <Animated.View
      style={[
        styles.roadLine,
        {
          opacity,
          transform: [{ translateX }],
        },
      ]}
    />
  );
};

const LoadingDot = ({ delay }: { delay: number }) => {
  const bounceAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, { toValue: 1, duration: 400, delay, useNativeDriver: true }),
        Animated.timing(bounceAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  return (
    <Animated.View style={[styles.dot, { transform: [{ translateY: bounceAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -10] }) }] }]} />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: ms(40),
  },
  scooterWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: vs(40),
  },
  logo: {
    width: ms(90),
    height: ms(90),
    borderRadius: ms(45),
    backgroundColor: Colors.orange || '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    elevation: 10,
    shadowColor: Colors.orange,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  logoText: {
    fontSize: fontSize(45),
  },
  road: {
    flexDirection: 'row',
    width: ms(100),
    height: vs(3),
    marginTop: vs(10),
    overflow: 'hidden',
    justifyContent: 'center',
  },
  roadLine: {
    position: 'absolute',
    width: ms(20),
    height: vs(3),
    backgroundColor: '#E0E0E0',
    borderRadius: vs(2),
  },
  dotsContainer: {
    flexDirection: 'row',
    marginBottom: vs(20),
    gap: ms(8),
  },
  dot: {
    width: ms(8),
    height: ms(8),
    borderRadius: ms(4),
    backgroundColor: Colors.orange || '#FF6B35',
  },
  title: {
    fontSize: fontSize(22),
    fontFamily: Typography.Bold.fontFamily,
    color: '#000',
    marginBottom: vs(8),
    textAlign: 'center',
  },
  subtitle: {
    fontSize: fontSize(14),
    fontFamily: Typography.Regular.fontFamily,
    color: '#666',
    marginBottom: vs(30),
    textAlign: 'center',
  },
  progressBarContainer: {
    width: ms(200),
    height: vs(4),
    backgroundColor: '#F0F0F0',
    borderRadius: vs(2),
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.orange || '#FF6B35',
  },
});

export default LoadingScreen;