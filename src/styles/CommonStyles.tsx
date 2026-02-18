import { StyleSheet } from "react-native";
import { fontSize, hp, ms, vs, wp } from "../utils/responsive";
import Colors from "../utils/colors";
import { Typography } from "../utils/typography";

export const commonStyle = StyleSheet.create({
    MainContainer: {
        flex: 1,
        backgroundColor: Colors.white
    },
    TopbackButtonStyle: {
        width: ms(45),
        height: ms(45),
        borderRadius: ms(12),
        alignItems: "center",
        justifyContent: "center",
    },
    socialIconsContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "wrap",
        gap: wp(4),
        //marginTop: vs(10),
        //backgroundColor:"red",

       
    },
    orContinueWithContainer: {
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: 'center',
         
        gap: 10,
        

    },
    socialbtnstyle: {
        width: wp(14),
        height: wp(14),
        borderRadius: ms(10),
        borderWidth: 0.7,
        borderColor: Colors.borderColor,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.white,
   
    },
    btnStyle: {
        backgroundColor: '#FFFFFF',
        marginTop: vs(20),
        borderWidth: 0,
        width: wp(80),
        
    },
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
        marginTop: vs(40)
    },
    infoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: vs(-4),
        paddingHorizontal: ms(20),
        gap: 10,
        marginLeft: ms(45),
        marginBottom: vs(13)
    },
    headingStyle: {
        fontSize: fontSize(16),
        color: Colors.borderColor1,
        textAlign: "center",
        paddingTop: 10,
        paddingHorizontal: ms(10),
        fontFamily: Typography.Regular.fontFamily,
        fontWeight: '400'
    },
    customGradient: {
        width: wp(100),
        // height: hp(70),
        alignItems: 'center',
        bottom: 0,
        position: 'absolute',
        justifyContent: 'flex-start',
        //paddingTop: vs(30),
   
    },
    welcomestyle: {
        fontSize: fontSize(24),
         marginVertical:vs(10),
        color: Colors.black,
        fontFamily:Typography.Bold.fontFamily,
        fontWeight:"700"

    },
})