import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { STRINGS } from '../../constants/strings'
import CustomButton from '../Buttons/CustomButton'
import PermissionModal from '../modals/PermissionModal'
import { fontSize, vs } from '../../utils/responsive'
import Colors from '../../utils/colors'

const EmptyCart = () => {
  return (
      <View style={styles.container}>
           <Image
             source={require('../../assets/Images/cartbg.png')}
             style={styles.image}
           />
           <Text style={styles.title}>{STRINGS.YOUR_TRAY_EMPTY}</Text>
   
           <Text style={styles.description}>
             {STRINGS.CART_SUB_TEXT}
           </Text>
           <CustomButton
             title={STRINGS.LETS_FIND}
             style={{ marginTop: vs(20) }}
             onPress={() => {}}
           />

           {/* <PermissionModal
             visible={loading}
             onClose={() => setLoading(false)}
             imageComponent={!notficationallow ? <Notificationreqsvg /> : <LocationPermissionsvg />}
             title="Allow notifications!"
             description={!notficationallow ? " To enjoy seamless updates and resort perks" : "Enable location to help us find the perfect cabana near you."}
             buttonText={!notficationallow ? "Allow Notification" : "Allow Location"}
             onPressButton={() => setNotficationallow(true)}
           /> */}
   
         </View>
  )
}

export default EmptyCart

const styles = StyleSheet.create({
    container: {


        paddingHorizontal: 20,
        alignItems: "center",
        justifyContent: "center",
        marginTop: vs(30)
    
      },
    
      headerContainer: {
        width: "100%",
        alignItems: "flex-start",
      },
      title: {
        fontSize: fontSize(24),
        fontWeight: "700",
        color: "#000",
        marginTop: 28,
        textAlign: "center",
      },
    
      description: {
        fontSize: fontSize(14),
        color: Colors.borderColor1,
        marginTop: 12,
        textAlign: "center",
        lineHeight: 22,
        paddingHorizontal: 10,
        
      },
      image: {
        width: "90%",
        resizeMode: "contain",
    
    
      }
})