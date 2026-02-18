import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StyleProp,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { ms, wp, vs,s } from '../../utils/responsive';
import { Typography } from '../../utils/typography';
import { IconNode } from 'lucide-react-native';

interface CustomButtonProps {
  title?: string;
  subtitle?: string; 
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  icon?: React.ReactNode; 
  iconPosition?: 'left' | 'right';
  iconContainerStyle?: StyleProp<ViewStyle>;
  subtitleStyle?: StyleProp<TextStyle>;
  contentStyle?:StyleProp<ViewStyle>;
  disabled?: boolean;
  loading?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  subtitle,
  onPress,
  style,
  textStyle,
  icon,
  iconPosition = 'left',
  iconContainerStyle,
  subtitleStyle,
  contentStyle,
  disabled = false,
  loading = false,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={disabled || loading ? undefined : onPress}
     style={[
        styles.button,
        disabled && styles.disabledButton, // NEW
        style,
      ]}
    >
      <View style={[styles.content,contentStyle]}>
        {icon && iconPosition === 'left' && <View style={[styles.icon,iconContainerStyle]}>{icon}</View>}

       <View >
       {title ? <Text style={[styles. text, textStyle]}>{title}</Text> : null}
        {subtitle && (
            <Text style={[styles.subtitleStyle, subtitleStyle]}>{subtitle}</Text>
          )}
       </View>
        {icon && iconPosition === 'right' && <View style={[styles.icon,iconContainerStyle]}>{icon}</View>}
      </View>
      {loading && <ActivityIndicator size="small" color="#fff" />}
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  button: {
    width: wp(90),
    paddingVertical: vs(15),
    borderRadius: ms(10),
    justifyContent: 'center',
    alignItems: 'center',
    },
    disabledButton: {
  backgroundColor: '#CFCFCF',
},

  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginHorizontal: s(5),
  },
  text: {
    color: '#fff',
    fontSize: ms(18),
   // fontWeight: 'bold',
   fontFamily:Typography.Medium.fontFamily,
    // backgroundColor:"red"
  },
  subtitleStyle:{
    fontSize: ms(14),
    lineHeight: ms(14),
   // marginTop: -vs(2),   
    color: '#fff',   
    fontFamily:Typography.Regular.fontFamily,
  }
});
