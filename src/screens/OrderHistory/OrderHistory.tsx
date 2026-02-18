import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import GradientContainer from '../../components/Gradient/GradientContainer'

import CustomHeader from '../../components/common/CustomHeader'
import CustomButton from '../../components/Buttons/CustomButton'
import BackButtonsvg from '../../assets/svg/BackButtonsvg'
import { commonStyle } from '../../styles/CommonStyles'
import { ms } from '../../utils/responsive'
import OrderHeaderCard from '../../components/cards/OrderHeaderCard'
import OrderHistoryCard from '../../components/cards/OrderHistoryCard'
import Colors from '../../utils/colors'
import { STRINGS } from '../../constants/string'

const OrderHistory = ({ navigation }) => {
    return (
        <GradientContainer
            colors={["#FFF7D0", "#A9EFF2"]}
            style={styles.container}
            locations={[0, 1]}
        >
            <CustomHeader
                title={STRINGS.ORDER_HISTORY}
                leftComponent={
                    <CustomButton
                        onPress={() => navigation.goBack()}
                        icon={<BackButtonsvg fill="black" />}
                        style={[commonStyle.TopbackButtonStyle, { backgroundColor: Colors.aquablue }]}
                    />

                }
            />
            <OrderHistoryCard />
        </GradientContainer>
    )
}

export default OrderHistory

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //paddingHorizontal:ms(10)
    }
})