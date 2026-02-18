    import { StyleSheet, Text, TouchableOpacity, View, Image, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
    import React, {useContext, useRef, useState } from 'react';
    import GradientContainer from '../../components/Gradient/GradientContainer';
    import { vs, ms, s, wp, hp, fontSize } from '../../utils/responsive';
    import CustomButton from '../../components/Buttons/CustomButton';
    import Colors from '../../utils/colors';
    import { Typography } from '../../utils/typography';
    import CustomTextInput from '../../components/inputs/CustomTextInput';
    import Greenticksvg from '../../assets/svg/Greenticksvg'
    import Emailsvg from '../../assets/svg/Emailsvg'
    import Locksvg from '../../assets/svg/Locksvg';
    import InfoModal from '../../components/modals/InfoModal';
    import SuccessModal from '../../components/modals/SuccessModal';
    import LoaderModal from '../../components/modals/LoaderModal';
    import { useAuth } from '../../hooks/useAuth';
    import { logger } from '../../utils/logger';
    import { isPasswordInvalid } from '../../utils/isPasswordInvalid';
    import { STRINGS } from '../../constants/string';
    import { LoaderContext } from '../../context/LoaderContext';
    import { commonStyle } from '../../styles/CommonStyles';

    const ForgotPasswordScreen = ({ navigation, route }) => {
      
        const { fromOtp = false, email = '', reset_token = '' } = route.params || {};
        const [showInfoModal, setShowInfoModal] = useState(false);
        const [showSuccessModal, setShowSuccessModal] = useState(false);
        const { forgotPasswordAuth, setNewPasswordAuth } = useAuth()
        const { show, hide } = useContext(LoaderContext)
        const [useremail, setUserEmail] = useState('')
        const [newPassword, setnewPassWord] = useState("")
        const [confirmNewPassword, setConfirmNewPassword] = useState('')
        const [errors, setErrors] = useState({
            email: '',
            password: '',
            confirmPassword: '',
        });
        const [passwordTouched, setPasswordTouched] = useState(false);
        const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
        logger.log("Email and reset_token", email, reset_token)

        const isEmailValid =
            useremail.trim().length > 0 &&
            /\S+@\S+\.\S+/.test(useremail);
        const isPasswordValid =
            newPassword.length >=8 &&
            confirmNewPassword.length >= 8 &&
            newPassword === confirmNewPassword;

        const isFormValid = fromOtp ? isPasswordValid : isEmailValid;
        const validate = () => {
            let valid = true;

            let newErrors = {
                email: '',
                password: '',
                confirmPassword: '',
            };
            if (!email.trim()) {
                newErrors.email = 'Email is required';
                valid = false;
            } else if (!/\S+@\S+\.\S+/.test(email)) {
                newErrors.email = 'Enter a valid email address';
                valid = false;
            }
            if (!newPassword.trim()) {
                newErrors.password = 'Password is required';
                valid = false;
            } else if (newPassword.length < 8) {
                newErrors.password = 'Password must be at least 8 characters';
                valid = false;
            } else if (!/[a-zA-Z]/.test(newPassword)) {
                newErrors.password = 'Password must contain at least one letter';
                valid = false;
            } else if (!/[0-9]/.test(newPassword)) {
                newErrors.password = 'Password must contain at least one number';
                valid = false;
            } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
                newErrors.password = 'Password must contain at least one special character';
                valid = false;
            }

            // Confirm password validation
            if (!confirmNewPassword.trim()) {
                newErrors.confirmPassword = 'Confirm password is required';
                valid = false;
            } else if (newPassword !== confirmNewPassword) {
                newErrors.confirmPassword = 'Passwords do not match';
                valid = false;
            }

            setErrors(newErrors);
            return valid;
        };



        logger.log("password and email", email, newPassword)
        logger.log("fromOtp", fromOtp);
        const isforgot = true
        const onPressResetPassword = async () => {
            // if (!validate()) return;
            logger.log("reset callled")
            try {
              //  show()
                const res = await forgotPasswordAuth({
                    email: useremail,

                })
                logger.log("===============res===============", res)
                // setShowInfoModal(true)
                // setReset_Token(res?.reset_token)
                navigation.navigate('OtpScreen', {
                    isforgot: true,
                    email: useremail,
                })
            } catch (error) {
                logger.log("error", error)
            } finally {
                hide()
            }
        }

        const onPressUpdatePassword = async () => {
            logger.log("callled")
            if (!validate()) return
            try {
              //  show()
                const res = await setNewPasswordAuth({
                    email,
                    new_password: newPassword,
                    reset_token
                })
                logger.log("res", res)
                setShowSuccessModal(true)
            } catch (error) {
                logger.log("erorr", error)
            } finally {
                hide()
            }
        }

        const handleOnpress = async () => {
            if (!fromOtp) {
                onPressResetPassword()
            } else {
                onPressUpdatePassword()
            }
        }
        return (
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={{ flex: 1 }}>
                        <Image
                            source={require('../../assets/images/forgotbg.png')}
                             //source={require('../../assets/images/login.webp')} 
                        resizeMode="cover"
                            style={styles.bgImageStyle}
                        />
                        <CustomButton
                            onPress={() => navigation.navigate('Login')}
                            title='cancel'
                            style={styles.backButtonStyle}
                        />
                         <GradientContainer borderRadius={ms(50)} style={[commonStyle.customGradient, { height: hp(54), }]}>
                            <Text style={styles.welcomestyle}>{!fromOtp ? "Forgot Password" : "Set a new password!"}</Text>
                            <Text style={commonStyle.headingStyle}>
                                {!fromOtp
                                    ? `No big deal! Let’s help you get back in quickly! Please enter your email to reset the password.`
                                    : `Create a new password. Ensure it differs from previous ones for security`}
                            </Text>
                            {fromOtp ? (
                                <>
                                    <CustomTextInput
                                        leftIcon={<Locksvg />}
                                        placeholder='Set Password'
                                        style={styles.textInputStyle}
                                        label='Set Password'
                                        value={newPassword}
                                        error={errors.password}
                                        helperText={STRINGS.PASSWORD_INFO}
                                        showHelper={
                                            passwordTouched &&
                                            isPasswordInvalid(newPassword) &&
                                            !errors.password
                                        }
                                        onChangeText={(text) => {
                                            setnewPassWord(text);
                                            if (errors.password) {
                                                setErrors(prev => ({ ...prev, password: '' }));
                                            }
                                            if (confirmNewPassword && text !== confirmNewPassword) {
                                                setErrors(prev => ({
                                                    ...prev,
                                                    confirmPassword: 'Passwords do not match'
                                                }));
                                            } else if (confirmNewPassword && text === confirmNewPassword) {
                                                setErrors(prev => ({
                                                    ...prev,
                                                    confirmPassword: ''
                                                }));
                                            }

                                            if (typingTimeout.current) {
                                                clearTimeout(typingTimeout.current);
                                            }

                                            typingTimeout.current = setTimeout(() => {
                                                setPasswordTouched(true);
                                            }, 500);
                                        }}
                                        onBlur={() => setPasswordTouched(true)}
                                        isPassword
                                    />

                                    <CustomTextInput
                                        leftIcon={<Locksvg />}
                                        placeholder='Confirm Password'
                                        style={styles.textInputStyle}
                                        label='Confirm Password'
                                        value={confirmNewPassword}
                                        error={errors.confirmPassword}
                                        showHelper={
                                            passwordTouched &&
                                            isPasswordInvalid(confirmNewPassword) &&
                                            !errors.confirmPassword
                                        }
                                        onChangeText={(text) => {
                                            setConfirmNewPassword(text);
                                            if (newPassword && text !== newPassword) {
                                                setErrors(prev => ({
                                                    ...prev,
                                                    confirmPassword: 'Passwords do not match'
                                                }));
                                            } else if (text === newPassword) {
                                                setErrors(prev => ({
                                                    ...prev,
                                                    confirmPassword: ''
                                                }));
                                            }
                                            if (typingTimeout.current) {
                                                clearTimeout(typingTimeout.current);
                                            }
                                            typingTimeout.current = setTimeout(() => {
                                                setPasswordTouched(true);
                                            }, 500);
                                        }}
                                        onBlur={() => setPasswordTouched(true)}
                                        isPassword
                                    />
                                </>
                            ) : (
                                <CustomTextInput
                                    value={useremail}
                                    leftIcon={<Emailsvg />}
                                    placeholder="Enter Email address"
                                    style={commonStyle.textInputStyle}
                                    label="Enter Email address"
                                    labelStyle={{ paddingLeft: ms(10) }}
                                    onChangeText={setUserEmail}
                                />
                            )}
                            {/* <CustomButton
                                title={fromOtp ? "Upadte Password" : " Reset Password"}
                                onPress={handleOnpress}
                                // onPress={() => setShowInfoModal(true)}
                                style={[commonStyle.btnStyle, { backgroundColor: fromOtp ? Colors.green2 : Colors.borderColor1, marginBottom: 20 }]}
                                textStyle={{ fontSize: ms(20), fontFamily: Typography.Medium.fontFamily, fontWeight: "500" }}
                                disable={!isEmailValid} 
                            /> */}
                            <CustomButton
                                title={fromOtp ? "Upadte Password" : " Reset Password"}
                                onPress={handleOnpress}
                                // onPress={() => setShowInfoModal(true)}
                                style={[commonStyle.btnStyle, {
                                    backgroundColor: isFormValid
                                        ? Colors.green2
                                        : Colors.borderColor1, marginBottom: 20
                                }]}
                                textStyle={{ fontSize: ms(20), fontFamily: Typography.Medium.fontFamily, fontWeight: "500" }}
                                disable={!isFormValid}
                            />
                        </GradientContainer>
                    </View>

                    <InfoModal
                        visible={showInfoModal}
                        title="Password reset"

                        message="Your password has been successfully reset. click confirm to set a new password"
                        buttonText="confirm"
                        onPress={() => {
                            setShowInfoModal(false);
                            //  setShowSuccessModal(true)

                        }}
                    />
                    <SuccessModal
                        visible={showSuccessModal}
                        title="Successful"
                        message="Congratulations! Your password has
                        been changed. Click continue to login"
                        buttonText="Continue"
                        icon={Greenticksvg}
                        onPress={() => {
                            setShowSuccessModal(false);
                            navigation.navigate('Login');

                        }} />

                </ScrollView>
            </KeyboardAvoidingView>
        );
    };

    export default ForgotPasswordScreen;

    const styles = StyleSheet.create({

        bgImageStyle: {
            width: wp(100),
            //height: hp(65),
        },
        welcomestyle: {
            fontSize: fontSize(24),
            marginVertical: vs(10),
            color: Colors.black,
            fontFamily: Typography.Bold.fontFamily,
            fontWeight: "700"


        },

        continuetextStyle: {
            color: '#28293D',
            fontSize: fontSize(14)

        },

        idAvailableStyle: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',

            marginRight: ms(170),
            gap: 5,
            marginTop: vs(20)


        },
        backButtonStyle: {
            height: hp(8),
            width: wp(25),
            position: 'absolute',
            top: vs(30),
            right: ms(10),
            backgroundColor: Colors.bright_red
        },

        textInputStyle: {
            width: wp(80),
            borderColor: Colors.borderColor1,
        },

    });
