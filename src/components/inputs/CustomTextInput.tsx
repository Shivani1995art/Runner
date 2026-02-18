import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TextInputProps,
  StyleProp,
  ViewStyle,
  TextStyle,
  ImageSourcePropType,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { s, ms, vs } from '../../utils/responsive';
import Colors from '../../utils/colors';
import { Typography } from '../../utils/typography';

interface CustomTextInputProps extends TextInputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;

  leftIcon?: React.ReactNode | ImageSourcePropType;
  rightIcon?: React.ReactNode | ImageSourcePropType;

  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  inputStyle?: StyleProp<TextStyle>;
  secureToggle?: boolean;
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  leftIcon,
  rightIcon,
  style,
  labelStyle,
  inputStyle,
  secureToggle,
  ...props
}) => {
  const [showlabel ,setShowLabel]=useState(false)
  const renderIcon = (icon?: React.ReactNode | ImageSourcePropType, isRight = false) => {
    if (!icon) return null;

    if (React.isValidElement(icon)) {
      return (
        <TouchableOpacity style={[styles.iconWrapper, isRight && styles.rightIconWrapper]}>
          {icon}
        </TouchableOpacity>
      );
    }

    return (
      <Image
        source={icon as ImageSourcePropType}
        style={[styles.icon, isRight && styles.rightIcon]}
        resizeMode="contain"
      />
    );
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={[styles.container, style]}>
        { showlabel && label ? <Text style={[styles.label, labelStyle]}>{label}</Text> : null}

        <View style={styles.inputWrapper}>
          {renderIcon(leftIcon)}
          <TextInput
            style={[styles.input, inputStyle]}
            placeholder={placeholder}
            placeholderTextColor={Colors.borderColor1}
            value={value}
            onChangeText={onChangeText}
            onFocus={()=>setShowLabel(true)}
            {...props}
          />
          {renderIcon(rightIcon, true)}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default CustomTextInput;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: vs(5),
  },
  label: {
    fontSize: ms(14),
    color: "#0A0909",
     marginBottom: vs(1),
    fontFamily:Typography.Regular.fontFamily,
    fontWeight:"400",
    marginLeft:ms(15)
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: s(1),
    borderColor: Colors.borderColor,
    borderRadius: ms(10),
    paddingHorizontal: s(10),
    //backgroundColor: Colors.white,
  },
  iconWrapper: {
    marginRight: s(8),
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightIconWrapper: {
    marginRight: 0,
    marginLeft: s(8),
  },
  icon: {
    width: ms(20),
    height: ms(20),
    marginRight: s(8),
  },
  rightIcon: {
    marginRight: 0,
    marginLeft: s(8),
  },
  input: {
    flex: 1,
    height: vs(45),
    fontSize: ms(15),
    color: Colors.black,
  },
});
