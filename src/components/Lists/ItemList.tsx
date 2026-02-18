import React from 'react';
import { View, Text, Image, StyleSheet, ViewStyle } from 'react-native';
import { ms, vs, fontSize } from '../../utils/responsive';
import Colors from '../../utils/colors';
import { Typography } from '../../utils/typography';

interface ItemListProps {
    qty: number;
    title: string;
    image: any;
    containerStyle?: ViewStyle;
    backgroundColor?: string;
}

const ItemList: React.FC<ItemListProps> = ({
    qty,
    title,
    image,
    containerStyle,
    backgroundColor = Colors.orange,
}) => {
    console.log('bgcolor', backgroundColor);
    return (
        <View
            style={[
                styles.itemContainer,
                { backgroundColor },
                containerStyle,
            ]}
        >
            <Text style={styles.qtyText}>{qty} x</Text>

            <Image source={{ uri: image }} style={styles.itemImage} />

            <Text style={styles.title}>{title}</Text>
        </View>
    );
};

export default ItemList;

const styles = StyleSheet.create({
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: vs(10),
        paddingHorizontal: ms(14),
        borderRadius: ms(12),
        width: '100%',
        marginBottom: vs(10),
    },

    qtyText: {
        fontSize: fontSize(14),
        ...Typography.Medium,
        color: Colors.black,
        marginRight: ms(8),
    },

    itemImage: {
        width: ms(32),
        height: ms(32),
        borderRadius: ms(16),
        marginRight: ms(10),
    },

    title: {
        fontSize: fontSize(14),
        ...Typography.Medium,
        color: Colors.black,
    },
});
