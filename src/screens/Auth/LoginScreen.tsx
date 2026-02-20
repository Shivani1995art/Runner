import { StyleSheet, Text, TouchableOpacity, View, Image, TextInput, ScrollView, KeyboardAvoidingView, Platform, StatusBar, Keyboard, Dimensions } from 'react-native';
import React, { useContext, useRef, useState } from 'react';
import GradientContainer from '../../components/Gradient/GradientContainer';
import { vs, ms, s, wp, hp, fontSize } from '../../utils/responsive';
import CustomButton from '../../components/Buttons/CustomButton';
import Colors from '../../utils/colors';
import { Typography } from '../../utils/typography';
import CustomTextInput from '../../components/inputs/CustomTextInput';
import Personsvg from '../../assets/svg/Personsvg'
import Locksvg from '../../assets/svg/Locksvg'
import Eyeclosesvg from '../../assets/svg/Eyeclosesvg'
import { commonStyle } from '../../styles/CommonStyles';
import { LoaderContext } from '../../context/LoaderContext';
import { logger } from '../../utils/logger';
import { useAuth } from '../../hooks/useAuth';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../../context/AuthContext';
import Toast from 'react-native-toast-message';
import { useAppPermissions } from '../../hooks/useAppPermissions';
import PermissionFlowModal from '../../components/modals/PermissionFlowModal';
const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_HEIGHT = SCREEN_HEIGHT * 0.65;
const LoginScreen = ({ navigation }) => {
    const [showrestroui, setShowrestroui] = useState(false);
    const passwordRef = useRef(null);

    const [resortId, setResortId] = useState('');
    const [userName, setUserName] = useState('')
    const [userPassword, setUserPassword] = useState('')
    const { checkNotificationPermission, checkLocationPermission } = useAppPermissions()
    const { loginUser } = useAuth()
    const [secure, setSecure] = useState(true);
    const [showPermission, setShowPermission] = useState(false)
    const pendingToken = useRef(null);
    const pendingUser = useRef(null);
    const pendingOutlet = useRef(null);
    const { login } = useContext(AuthContext);
    const { show, hide } = useContext(LoaderContext);
    const isFormValid = userName.trim().length > 0 && userPassword.trim().length > 0;
    // const handleLogin = async () => {
    //     show
    //     const token = "dummyToken";
    //     const userData = { name: "Sachin", email: "test@example.com" };
    //     await login(token, userData, userData);
    //              logger.log("login res==>")
    //    // login(token, userData);
    // };


    const handleLogin = async () => {
        logger.log("called===>")
        try {
            Keyboard.dismiss()
            //  show()
            const res = await loginUser(
                {
                    email: userName,
                    password: userPassword,
                }
            )
            logger.log("login res==>", res)

            if (res?.token) {
              
                login(res.token, res.user, res.outlet);

            }

        } catch (error) {

        } finally {
            hide()
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }} edges={['bottom']}>

            {/* <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
                removeClippedSubviews={false}
                automaticallyAdjustKeyboardInsets={Platform.OS === 'ios'}
            > */}

            <StatusBar
                barStyle="dark-content"
                backgroundColor="transparent"
                translucent
            />
            <View style={{ flex: 1 }}>
                <Image
                    source={require('../../assets/images/login.webp')}
                    resizeMode="cover"
                    style={styles.bgImageStyle}
                />
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 10}
                    style={{ flex: 1, justifyContent: "flex-end" }}
                    enabled={Platform.OS === 'ios'}
                >
                    <GradientContainer borderRadius={ms(50)} style={[commonStyle.customGradient, { height: CARD_HEIGHT, }]}>
                        <Text style={styles.welcomestyle}>Welcome Back!</Text>
                        <Text style={styles.headingStyle}>let’s make today a chill one</Text>

                        <CustomTextInput
                            value={userName}
                            leftIcon={<Personsvg />}
                            placeholder='Enter User Name'
                            style={styles.textInputStyle}
                            label='Enter User Name'
                            onChangeText={setUserName}
                            returnKeyType="next"
                            blurOnSubmit={false}
                            onSubmitEditing={() => passwordRef.current?.focus()}
                        />

                        <CustomTextInput
                            ref={passwordRef}
                            value={userPassword}
                            leftIcon={<Locksvg />}
                            placeholder='Enter Password'
                            style={styles.textInputStyle}
                            label='Password'
                            secureTextEntry={secure}
                            rightIcon={
                                <TouchableOpacity onPress={() => setSecure(!secure)}>
                                    <Eyeclosesvg color={secure ? Colors.black : Colors.darkGray} />
                                </TouchableOpacity>
                            }
                            onChangeText={setUserPassword}
                            returnKeyType="done"
                            onSubmitEditing={!isFormValid ? () => { } : handleLogin}
                        />
                        <Text style={styles.forgotpassstyle} onPress={() => navigation.navigate('ForgotPassword')} >Forgot Password ?</Text>
                        <View style={{ justifyContent: 'space-between', gap: 10 }}>
                            <CustomButton
                                title="Sign in"
                                disabled={!isFormValid}
                                onPress={handleLogin}
                                style={[commonStyle.btnStyle, { backgroundColor: !isFormValid ? Colors.borderColor : Colors.blue }]}
                                textStyle={{ fontSize: ms(18) }}
                            />
                        </View>


                        <PermissionFlowModal
                            visible={showPermission}
                            onComplete={async () => {
                                setShowPermission(false);
                                if (pendingToken.current) {
                                    login(pendingToken.current, pendingUser.current, pendingOutlet.current);
                                    pendingToken.current = null;
                                    pendingUser.current = null;
                                    pendingOutlet.current = null;
                                }
                            }}
                        />

                    </GradientContainer>
                </KeyboardAvoidingView>
            </View>
            {/* </ScrollView> */}
        </SafeAreaView>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({

    bgImageStyle: {
        width: wp(100),
        // height: hp(40),
        resizeMode: "cover"
    },

    welcomestyle: {
        fontSize: fontSize(24),
        fontFamily: Typography.Regular.fontFamily,
        color: Colors.black,
        marginTop: vs(20),
        fontWeight: "700"


    },
    Login_With_Resort_ID: {
        // textDecorationLine: 'underline',
        color: '#28293D',
        top: 10,
    },
    continuetextStyle: {
        color: '#28293D',
        fontSize: fontSize(14),


    },
    headingStyle: { fontSize: fontSize(16), color: Colors.borderColor1, marginTop: 10, marginBottom: 10 },
    subheadingStyle: { fontSize: fontSize(14), color: Colors.borderColor1 },
    textInput: {
        width: wp(80),
        height: vs(45),
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: ms(10),
        paddingHorizontal: wp(3),
        marginTop: vs(15),
        backgroundColor: '#fff',
    },
    textInputStyle: {
        width: wp(80),
        borderColor: Colors.borderColor1,

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
        width: wp(15),
        position: 'absolute',
        top: vs(30),
        left: ms(10),
        backgroundColor: Colors.bright_red
    },



    forgotpassstyle: {
        marginHorizontal: ms(20),
        marginLeft: ms(190)

    }
});
