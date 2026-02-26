import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ms, vs } from '../../utils/responsive';
import Colors from '../../utils/colors';
import { Typography } from '../../utils/typography';

interface DateSeparatorProps {
  // Option 1: Pass a label directly
  label?: string;
  // Option 2: Pass a date object and it will format automatically
  date?: Date;
}

/**
 * DateSeparator Component
 * Displays a date separator line in the chat
 * 
 * Usage:
 * <DateSeparator label="TODAY" />
 * <DateSeparator date={new Date()} />
 */
const DateSeparator: React.FC<DateSeparatorProps> = ({ label, date }) => {
  // Format date if provided
  const displayText = label || formatDate(date || new Date());

  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <Text style={styles.text}>{displayText}</Text>
      <View style={styles.line} />
    </View>
  );
};

/**
 * Format date for display
 * Returns: "TODAY", "YESTERDAY", or formatted date like "JAN 15, 2024"
 */
const formatDate = (date: Date): string => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Reset time part for comparison
  const resetTime = (d: Date) => {
    const newDate = new Date(d);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  };

  const messageDate = resetTime(date);
  const todayDate = resetTime(today);
  const yesterdayDate = resetTime(yesterday);

  // Check if today
  if (messageDate.getTime() === todayDate.getTime()) {
    return 'TODAY';
  }

  // Check if yesterday
  if (messageDate.getTime() === yesterdayDate.getTime()) {
    return 'YESTERDAY';
  }

  // Check if within this week
  const daysDiff = Math.floor((todayDate.getTime() - messageDate.getTime()) / (1000 * 60 * 60 * 24));
  if (daysDiff < 7) {
    const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    return days[date.getDay()];
  }

  // Format as date
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();

  // Show year only if different from current year
  if (year === today.getFullYear()) {
    return `${month} ${day}`;
  }

  return `${month} ${day}, ${year}`;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: vs(16),
    paddingHorizontal: ms(16),
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.borderColor || '#E5E5E5',
  },
  text: {
    marginHorizontal: ms(12),
    fontSize: ms(12),
    fontFamily: Typography.Medium?.fontFamily || 'System',
    color: Colors.gray || '#666666',
    letterSpacing: 0.5,
  },
});

export default DateSeparator;