import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { ms, vs, fontSize } from '../../utils/responsive';
import Colors from '../../utils/colors';
import { Typography } from '../../utils/typography';
interface InfoRowProps {
  Icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  containerStyle?: object;
  titleStyle?: object;
  subtitleStyle?: object;
  iconStyle?: object;
  IconPosition?:string

}
const InfoRow:React.FC<InfoRowProps> = ({
  Icon,
  title,
  subtitle,
  containerStyle,
  titleStyle,
  subtitleStyle,
  iconStyle,
  IconPosition = 'left',
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {/* First Row: Icon + Title */}
      <View style={styles.row}>
      {IconPosition ==='left' && Icon && <View style={[styles.iconWrapper, iconStyle]}>{Icon}</View>}
        <Text style={[styles.title, titleStyle]}>{title}</Text>
        {IconPosition === 'right' && Icon && <View style={[styles.iconWrapper, iconStyle]}>{Icon}</View>}
      </View>

      {/* Second Row: Subtitle */}
      {subtitle ? (
        <Text style={[styles.subtitle, subtitleStyle]}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
};

export default InfoRow;

const styles = StyleSheet.create({
  container: {
    marginBottom: vs(8),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    marginRight: ms(6),
  },
  title: {
    fontSize: fontSize(14),
    color: Colors.borderColor1,
    ...Typography.Regular,
    fontWeight:'400'
  },
  subtitle: {
    marginTop: vs(2),
    marginLeft: ms(20), // aligns text under title (after icon)
    fontSize: fontSize(13),
    color: Colors.black,
    ...Typography.Medium,
  },
});
