import React, { useState, useRef, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
    Pressable,
    ActivityIndicator,
    AppState,
} from 'react-native';
import GradientContainer from '../../components/Gradient/GradientContainer';
import { vs, ms, wp, hp, fontSize, s } from '../../utils/responsive';
import CustomButton from '../../components/Buttons/CustomButton';
import Colors from '../../utils/colors';

import { Typography } from '../../utils/typography';
import { useAuth } from '../../hooks/useAuth';
import SuccessModal from '../../components/modals/SuccessModal';
import Greenticksvg from '../../assets/svg/Greenticksvg';
import InfoModal from '../../components/modals/InfoModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getToken, setToken } from '../../utils/token'
import { logger } from '../../utils/logger';
import { commonStyle } from '../../styles/CommonStyles';

const OtpScreen = ({ navigation, route }: any) => {
    const { isRegister = false, email, password, isforgot = false } = route.params || {};
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [reset_token, setReset_Token] = useState('')
    const [showInfoModal, setShowInfoModal] = useState(false);
    logger.log("email and password", email, password)

    const OTP_LENGTH = 4;
    const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
    const { verifyForgotOtpAuth,setNewPasswordAuth,forgotPasswordAuth } = useAuth()

    // Timer states
    const [timerSeconds, setTimerSeconds] = useState(120); // 2 minutes
    const [isTimerActive, setIsTimerActive] = useState(true);
    const [canResend, setCanResend] = useState(false);
    const [isResending, setIsResending] = useState(false);
    
    // Background timer tracking
    const timerStartTime = useRef<number | null>(null);
    const backgroundTime = useRef<number | null>(null);

    const inputRefs = useRef(
        Array.from({ length: OTP_LENGTH }, () => React.createRef<TextInput>())
    );

    // Timer effect
    useEffect(() => {
        let interval = null;

        if (isTimerActive && timerSeconds > 0) {
            // Record start time when timer begins
            if (!timerStartTime.current) {
                timerStartTime.current = Date.now();
            }
            
            interval = setInterval(() => {
                setTimerSeconds(seconds => seconds - 1);
            }, 1000);
        } else if (timerSeconds === 0) {
            setIsTimerActive(false);
            setCanResend(true);
            timerStartTime.current = null; // Reset start time
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isTimerActive, timerSeconds]);

    // Handle app state changes (background/foreground)
    useEffect(() => {
        const handleAppStateChange = (nextAppState: string) => {
            if (nextAppState === 'background' && isTimerActive && timerStartTime.current) {
                // Record when app goes to background
                backgroundTime.current = Date.now();
                logger.log('App went to background, timer at:', timerSeconds);
            } else if (nextAppState === 'active' && backgroundTime.current && timerStartTime.current) {
                // Calculate elapsed time when app comes to foreground
                const elapsedSeconds = Math.floor((Date.now() - backgroundTime.current) / 1000);
                const newTimerSeconds = Math.max(0, timerSeconds - elapsedSeconds);
                
                logger.log('App came to foreground, elapsed:', elapsedSeconds, 'new timer:', newTimerSeconds);
                
                // Update timer with adjusted time
                setTimerSeconds(newTimerSeconds);
                backgroundTime.current = null;
                
                // If timer reached zero during background
                if (newTimerSeconds === 0) {
                    setIsTimerActive(false);
                    setCanResend(true);
                    timerStartTime.current = null;
                }
            }
        };

        const subscription = AppState.addEventListener('change', handleAppStateChange);

        return () => {
            subscription?.remove();
        };
    }, [isTimerActive, timerSeconds]);

    // Format timer display
    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };
    const handleChange = (text: string, index: number) => {
        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);

        if (text && index < OTP_LENGTH - 1) {
            inputRefs.current[index + 1].current?.focus();
        }

        if (!text && index > 0) {
            inputRefs.current[index - 1].current?.focus();
        }
    };
    logger.log("isfrom forgot", isforgot)
    const finalOTP = otp.join("");
    logger.log("final otp", typeof (finalOTP), finalOTP)

    const onPressVerifyOtpForgotPass = async () => {
        if (finalOTP.length !== OTP_LENGTH) return;
        logger.log("onPressVerifyOtpForgotPass")
        try {
            const response = await verifyForgotOtpAuth({
                email,
                otp: finalOTP,

            });

            logger.log('VERIFY OTP RESPONSE', response);
            const resetToken = response?.reset_token
            setReset_Token(resetToken)

            if (response) {
                setShowInfoModal(true);
            }
        } catch (error) {
            logger.log('VERIFY OTP ERROR', error);

        }
    };


    const onPressVerifyOtp = async () => {
        if (finalOTP.length !== OTP_LENGTH) return;

        try {
            const response = await setNewPasswordAuth({
                reset_token,
                new_password: password,
            });

            logger.log('VERIFY OTP RESPONSE', response);
            //const token =response.token
            //await setToken(token)
            if (response) {
                setShowSuccessModal(true);
            }
        } catch (error) {
            logger.log('VERIFY OTP ERROR', error);

        }
    };

    const onPressResendOtpUser = async () => {
        if (!canResend || isResending) return; // Prevent resend if timer is active or already resending

        setIsResending(true);

        // Clear OTP immediately for better UX
        setOtp(Array(OTP_LENGTH).fill(""));
        setFocusedIndex(-1);

        try {
            await forgotPasswordAuth({
                email,
            });

            // Start timer only after successful API call
            setTimerSeconds(120);
            setIsTimerActive(true);
            setCanResend(false);
            timerStartTime.current = Date.now(); // Reset start time for new timer
        } catch (error) {
            logger.log('RESEND OTP ERROR', error);
            // If API fails, keep canResend true so user can try again immediately
            // No timer changes - user can retry immediately
        } finally {
            setIsResending(false);
        }
    }

    const handleOnPressVerify = async () => {
        if (isforgot) {
            onPressVerifyOtpForgotPass()
        } else {
            onPressVerifyOtp()
        }
    }
    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
            >
                <View style={{ flex: 1 }}>
                    <Image
                     source={require('../../assets/images/otpbg.png')} 
                       // source={require('../../assets/Images/otpbg.png')}
                        resizeMode="cover"
                        style={styles.bgImageStyle}
                    />

                    <GradientContainer borderRadius={ms(50)} style={[commonStyle.customGradient, { height: hp(54), }]}>
                        <Text style={commonStyle.welcomestyle}>
                            {isRegister ? "Verification code!" : "Check your email"}
                        </Text>

                        <Text style={[commonStyle.headingStyle, { paddingBottom: vs(20), }]}>
                            {isRegister
                                ? "We’ve sent you a code! Open your email to continue the vibe"
                                : "We sent a reset link to your email address. Enter the 4-digit code that was mentioned in the email."}
                        </Text>
                        <View style={[styles.otpContainer, { flexDirection: "row" }]}>
                            {otp.map((item, index) => (
                                <TextInput
                                    key={index}
                                    ref={inputRefs.current[index]}
                                    value={item}
                                    onChangeText={(text) => handleChange(text, index)}
                                    maxLength={1}
                                    placeholder='-'
                                    placeholderTextColor={Colors.borderColor1}
                                    keyboardType="number-pad"
                                    style={[
                                        styles.otpBox,
                                        {
                                            borderColor:
                                                focusedIndex === index
                                                    ? Colors.blue
                                                    : item
                                                        ? Colors.blue
                                                        : Colors.borderColor
                                        }
                                    ]}
                                    textAlign="center"
                                    onFocus={() => setFocusedIndex(index)}
                                    onBlur={() => setFocusedIndex(-1)}
                                />
                            ))}
                        </View>
                        <CustomButton
                            title="Verify Code"
                            onPress={handleOnPressVerify}
                            style={[
                                styles.btnStyle,
                                {
                                    backgroundColor:
                                        finalOTP.length === 4 ? Colors.green2 : Colors.borderColor,
                                },
                            ]}
                            textStyle={{ fontSize: ms(18), color: finalOTP.length === 4 ? Colors.white : Colors.borderColor1, }}
                        />

                        <View style={commonStyle.orContinueWithContainer}>
                            {isTimerActive ? (
                                <Text style={styles.textstyle}>
                                    <Text style={{ color: Colors.gray }}>Resend in </Text>
                                    <Text style={{ color: Colors.blue }}>{formatTime(timerSeconds)}</Text>
                                </Text>
                            ) : (
                                <>
                                    <Text style={styles.textstyle}>Didn't get the email yet?</Text>
                                    {isResending ? (
                                        <Text style={[styles.textstyle, { color: Colors.blue }]}>
                                            {' '}
                                            <ActivityIndicator size="small" color={Colors.blue} />
                                            {' '}
                                        </Text>
                                    ) : (
                                        <Pressable onPress={onPressResendOtpUser}>
                                            <Text style={[styles.textstyle, { color: Colors.blue }]}>
                                                {' '}Resend
                                            </Text>
                                        </Pressable>
                                    )}
                                </>
                            )}
                        </View>
                    </GradientContainer>
                </View>
            </ScrollView>
            <InfoModal
                visible={showInfoModal}
                title="Password reset"
                message="Your password has been successfully reset. click confirm to set a new password"
                buttonText="confirm"
                onPress={() => {
                    setShowInfoModal(false);
                    //  setShowSuccessModal(true)
                    navigation.navigate('ForgotPassword', {
                        email,
                        reset_token,
                        fromOtp: true
                    })

                }}
            />
            <SuccessModal
                visible={showSuccessModal}
                title="Successfully Register!"
                message="Registration complete now, let’s make it chill"
                buttonText="Continue"
                icon={Greenticksvg}
                onPress={() => {
                    setShowSuccessModal(false);
                    navigation.navigate('WelcomeScreen');

                }} />
        </KeyboardAvoidingView>
    );
};

export default OtpScreen;
const styles = StyleSheet.create({
    bgImageStyle: {
        width: wp(100),
        //height: hp(65),
    },
    otpContainer: {
        // marginTop: vs(25),
        width: wp(80),
        justifyContent: "space-between",
    },

    otpBox: {
        width: ms(50),
        height: ms(50),
        borderWidth: 1,
        borderRadius: ms(10),
        borderColor: '#E4E4EB',
        fontSize: ms(20),
        color: Colors.black,

    },

    btnStyle: {
        marginTop: vs(30),
        width: wp(80),
    },

    textstyle: {
        fontSize: fontSize(16),
        color: Colors.borderColor1,
        marginTop: vs(20)
    },
});
