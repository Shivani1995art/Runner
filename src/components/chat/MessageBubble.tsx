import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { ms, vs } from '../../utils/responsive';
import Colors from '../../utils/colors';
import { Typography } from '../../utils/typography';
import { ChatMessage } from '../../services/Chat/ChatService';
 
interface MessageBubbleProps {
  message: ChatMessage;
  isOwnMessage: boolean;
}
 
const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOwnMessage }) => {
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };
 
  return (
    <View style={[
      styles.container,
      isOwnMessage ? styles.ownMessage : styles.otherMessage,
    ]}>
      {!isOwnMessage && message.senderImage && (
        <Image source={{ uri: message.senderImage }} style={styles.avatar} />
      )}
      
      <View style={[
        styles.bubble,
        isOwnMessage ? styles.ownBubble : styles.otherBubble,
      ]}>
        {!isOwnMessage && (
          <Text style={styles.senderName}>{message.senderName}</Text>
        )}
        
        <Text style={[
          styles.messageText,
          isOwnMessage ? styles.ownMessageText : styles.otherMessageText,
        ]}>
          {message.text}
        </Text>
        
        <Text style={[
          styles.timestamp,
          isOwnMessage ? styles.ownTimestamp : styles.otherTimestamp,
        ]}>
          {formatTime(message.timestamp)}
          {isOwnMessage && (
            <Text style={styles.readStatus}>
              {message.isRead ? ' ✓✓' : ' ✓'}
            </Text>
          )}
        </Text>
      </View>
    </View>
  );
};
 
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: vs(4),
    paddingHorizontal: ms(16),
    alignItems: 'flex-end',
  },
  ownMessage: {
    justifyContent: 'flex-end',
  },
  otherMessage: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: ms(32),
    height: ms(32),
    borderRadius: ms(16),
    marginRight: ms(8),
    borderWidth: 1,
    borderColor: Colors.borderColor,
  },
  bubble: {
    maxWidth: '75%',
    paddingVertical: vs(8),
    paddingHorizontal: ms(12),
    borderRadius: ms(16),
    marginHorizontal: ms(4),
  },
  ownBubble: {
    backgroundColor: Colors.blue,
    borderBottomRightRadius: ms(4),
  },
  otherBubble: {
    backgroundColor: Colors.gray1,
    borderWidth: 1,
    borderColor: Colors.borderColor,
    borderBottomLeftRadius: ms(4),
  },
  senderName: {
    fontSize: ms(12),
    fontFamily: Typography.Medium.fontFamily,
    color: Colors.black,
    marginBottom: vs(2),
  },
  messageText: {
    fontSize: ms(14),
    fontFamily: Typography.Regular.fontFamily,
    lineHeight: vs(20),
  },
  ownMessageText: {
    color: Colors.white,
  },
  otherMessageText: {
    color: Colors.black,
  },
  timestamp: {
    fontSize: ms(10),
    fontFamily: Typography.Regular.fontFamily,
    marginTop: vs(4),
    alignSelf: 'flex-end',
  },
  ownTimestamp: {
    color: Colors.white + '80',
  },
  otherTimestamp: {
    color: Colors.borderColor1,
  },
  readStatus: {
    fontSize: ms(10),
  },
});
 
export default MessageBubble;