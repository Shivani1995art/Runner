import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Keyboard } from 'react-native';
import { Send } from 'lucide-react-native';
import { ms, vs } from '../../utils/responsive';
import Colors from '../../utils/colors';
import { Typography } from '../../utils/typography';
 
interface MessageInputProps {
  onSendMessage: (text: string) => void;
  placeholder?: string;
  disabled?: boolean;
}
 
const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  placeholder = 'Type a message...',
  disabled = false,
}) => {
  const [message, setMessage] = useState('');
 
  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
      Keyboard.dismiss();
    }
  };
 
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={message}
        onChangeText={setMessage}
        placeholder={placeholder}
        placeholderTextColor={Colors.borderColor1}
        multiline
        maxLength={500}
        editable={!disabled}
        textAlignVertical="center"
      />
      
      <TouchableOpacity
        style={[
          styles.sendButton,
          (!message.trim() || disabled) && styles.sendButtonDisabled,
        ]}
        onPress={handleSend}
        disabled={!message.trim() || disabled}
      >
        <Send
          size={ms(20)}
          color={message.trim() && !disabled ? Colors.white : Colors.borderColor1}
        />
      </TouchableOpacity>
    </View>
  );
};
 
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: ms(16),
    paddingVertical: vs(12),
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.borderColor,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.borderColor,
    borderRadius: ms(20),
    paddingHorizontal: ms(16),
    paddingVertical: vs(10),
    fontSize: ms(14),
    fontFamily: Typography.Regular.fontFamily,
    color: Colors.black,
    maxHeight: vs(100),
    marginRight: ms(12),
    backgroundColor: Colors.white,
  },
  sendButton: {
    width: ms(40),
    height: ms(40),
    borderRadius: ms(20),
    backgroundColor: Colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: Colors.borderColor,
  },
});
 
export default MessageInput;