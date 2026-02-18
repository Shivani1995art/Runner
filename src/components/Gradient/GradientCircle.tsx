import React, { useState } from 'react';
import { View, Image, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const borderWidth = 2;

const GradientCircle = ({ imageUri, size: circleSize = 50 }: { imageUri: string; size?: number }) => {
  const [loading, setLoading] = useState(true);

  return (
    <View style={{ width: circleSize, height: circleSize, justifyContent: 'center', alignItems: 'center' }}>

      <LinearGradient
        colors={['#1BA09C','#FB3838','#06C270','#3B63FE','#FF8800','#FFCC00','#00CFDE','#1BA09C']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          width: circleSize,
          height: circleSize,
          borderRadius: circleSize / 2,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >

        <View
          style={{
            width: circleSize - borderWidth * 2,
            height: circleSize - borderWidth * 2,
            borderRadius: (circleSize - borderWidth * 2) / 2,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {loading && (
            <ActivityIndicator
              size="small"
              style={{ position: 'absolute' }}
            />
          )}

          <Image
            source={{ uri: imageUri }}
            style={{
              width: circleSize - borderWidth * 4,
              height: circleSize - borderWidth * 4,
              borderRadius: (circleSize - borderWidth * 4) / 2,
              resizeMode: 'cover'
            }}
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
          />
        </View>
      </LinearGradient>
    </View>
  );
};

export default GradientCircle;
