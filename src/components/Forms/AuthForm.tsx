import React from "react";
import { View, Text } from "react-native";
import CustomButton from "../../components/Buttons/CustomButton";
import CustomTextInput from "../../components/inputs/CustomTextInput";

const AuthForm = ({
  title,
  subtitle,
  fields,
  onSubmit,
  buttonText,
  extraContent
}) => {
  return (
    <View style={{ alignItems: "center" }}>
      <Text style={{ fontSize: 24 }}>{title}</Text>
      <Text style={{ fontSize: 16, opacity: 0.6 }}>{subtitle}</Text>

      {fields.map((item, index) => (
        <CustomTextInput
          key={index}
          label={item.label}
          placeholder={item.placeholder}
          leftIcon={item.leftIcon}
          rightIcon={item.rightIcon}
          secureTextEntry={item.secureTextEntry}
          value={item.value}
          onChangeText={item.onChangeText}
          style={{ width: "80%", marginTop: 15 }}
        />
      ))}

      <CustomButton
        title={buttonText}
        onPress={onSubmit}
        style={{ marginTop: 25, width: "80%" }}
      />

      {extraContent}
    </View>
  );
};

export default AuthForm;
