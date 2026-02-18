import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnboardingScreen from '../../screens/OnBoarding/OnBoardingScreen';
import LoginScreen from '../../screens/Auth/LoginScreen';
import ForgotPasswordScreen from '../../screens/Auth/ForgotPasswordScreen';
import OtpScreen from '../../screens/Auth/OtpScreen';

const Stack = createNativeStackNavigator();

const AuthNavigation = ({ hasSeenOnboarding }: any) => {
  return (
    <Stack.Navigator
      initialRouteName={hasSeenOnboarding ? 'Login' : 'Onboarding'}
      screenOptions={{ headerShown: false }}
    >
      {!hasSeenOnboarding && (
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      )}

      <Stack.Screen name="Login" component={LoginScreen} />
       <Stack.Screen name="OtpScreen" component={OtpScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigation;
