
// import {
//   View,
//   Text,
//   FlatList,
//   StyleSheet,
//   TouchableOpacity,
//   Image,
//   Alert,
//   ActivityIndicator,
//   KeyboardAvoidingView,
//   Platform,
// } from 'react-native';
// import { ArrowLeft } from 'lucide-react-native';
// import { SafeAreaView as SafeAreaViewEdge } from 'react-native-safe-area-context';
// import { ms, vs } from '../../utils/responsive';
// import Colors from '../../utils/colors';
// import { Typography } from '../../utils/typography';
// import { logger } from '../../utils/logger';
// import MessageBubble from '../../components/chat/MessageBubble';
// import MessageInput from '../../components/chat/MessageInput';
// import chatService, { ChatMessage, ChatRoom } from '../../services/Chat/ChatService';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { AuthContext } from '../../context/AuthContext';
// import { useContext, useEffect, useRef, useState, useCallback } from 'react';
// import { useFocusEffect } from '@react-navigation/native';
// import { apiClient } from '../../api/axios';

// interface ChatScreenProps {
//   navigation: any;
//   route: {
//     params: {
//       orderId: string;
//       runnerId?: string;
//       runnerName?: string;
//       runnerImage?: string;
//       customerId?: string;
//       customerName?: string;
//       customerImage?: string;
//     };
//   };
// }

// const ChatScreen: React.FC<ChatScreenProps> = ({ navigation, route }) => {
//   const {
//     orderId,
//     runnerId,
//     runnerName,
//     runnerImage,
//     customerId,
//     customerName = 'Customer',
//     customerImage,
//   } = route.params;

//   const [messages, setMessages] = useState<ChatMessage[]>([]);
//   const [chatRoom, setChatRoom] = useState<ChatRoom | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [sendingMessage, setSendingMessage] = useState(false);
//   const [otherUserStatus, setOtherUserStatus] = useState('offline');
//   const flatListRef = useRef<FlatList>(null);
//   const unsubscribeRef = useRef<(() => void) | null>(null);
//   const statusUnsubscribeRef = useRef<(() => void) | null>(null);

//   const { user, isLogin } = useContext(AuthContext);

//   const userId = user?.id || 'temp_user_id';
//   const isCustomer = !runnerId;

//   // Initialize chat when component mounts
//   useEffect(() => {
//     console.log('[ChatScreen] Auth state:', { isLogin, userId });

//     if (isLogin === null) return;

//     initializeChat();
//     chatService.setUserPresence(userId);
//     return () => {
//       unsubscribeRef.current?.();
//       statusUnsubscribeRef.current?.();
//     };
//   }, [isLogin]);

//   // Observe other user's status
//   useEffect(() => {
//     if (!userId || !chatRoom) return;
 
//     // Determine who the "other person" is
//     //const otherId = isCustomer ? runnerId : chatRoom?.participants?.customerId;
 
//    // if (customerId) {
//       console.log('[ChatScreen] Observing status for user:', customerId);
//       statusUnsubscribeRef.current = chatService.observeUserStatus(customerId, (status) => {
//         console.log('[ChatScreen] Other user status changed:', status);
//         setOtherUserStatus(status);
//       });
//    // }

//     return () => {
//       statusUnsubscribeRef.current?.();
//     };
//   }, [userId, chatRoom, isCustomer, runnerId]);

//   // Mark messages as read when viewing chat
//   useEffect(() => {
//     if (chatRoom && userId) {
//       chatService.markMessagesAsRead(chatRoom.id, userId);
//     }
//   }, [chatRoom, messages]);

//   // 🎯 Set activeRoomId when screen is focused/blurred
//   useFocusEffect(
//     useCallback(() => {
//       if (!userId || !chatRoom) return;

//       console.log('[ChatScreen] Screen focused - setting active room:', chatRoom.id);
//       // User is now viewing this chat room
//       chatService.setActiveRoom(userId, chatRoom.id);

//       // Cleanup: clear active room when leaving
//       return () => {
//         console.log('[ChatScreen] Screen blurred - clearing active room');
//         chatService.setActiveRoom(userId, null);
//       };
//     }, [userId, chatRoom])
//   );

//   const initializeChat = async () => {
//     try {
//       setLoading(true);
//       console.log('[ChatScreen] Initializing chat, orderId:', orderId, 'customerId:', customerId);

//       const chatRoomData = await chatService.getOrCreateChatRoom(
//         orderId,
//         userId,
//         customerName,
//         customerId,
//         runnerName
//       );

//       console.log('[ChatScreen] Chat room ready:', chatRoomData.id);
//       setChatRoom(chatRoomData);

//       unsubscribeRef.current = chatService.getMessages(
//         chatRoomData.id,
//         (fetchedMessages) => {
//           console.log('[ChatScreen] Messages updated:', fetchedMessages.length);
//           setMessages(fetchedMessages);
//           setTimeout(() => {
//             flatListRef.current?.scrollToEnd({ animated: true });
//           }, 100);
//         }
//       );
//     } catch (error) {
//       logger.error('Error initializing chat:', error);
//       Alert.alert('Error', 'Failed to load chat. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//  const handleSendMessage = async (text: string) => {
//     if (!chatRoom) {
//       Alert.alert('Error', 'Chat not ready yet');
//       return;
//     }

//     try {
//       setSendingMessage(true);

//       const receiverId = isCustomer
//         ? runnerId
//         : chatRoom.participants.customerId;
//       const receiverName = isCustomer
//         ? runnerName
//         : chatRoom.participants.customerName;

// logger.log('receiverId', receiverId);
// logger.log('customerId', customerId);

//       if (!receiverId) {
//         Alert.alert('Error', 'Cannot send message - recipient not found');
//         return;
//       }

//       // Step 1: Send message to Firebase (Firestore)
//       await chatService.sendMessage(chatRoom.id, {
//         text,
//         senderId: userId,
//         senderName: isCustomer ? customerName : runnerName || 'Runner',
//         senderImage: isCustomer ? customerImage : runnerImage,
//         customerId,
//         orderId,
//         type: 'text',
//       });

//       console.log('[ChatScreen] Message sent to Firebase successfully');

//       // Step 2: Call backend API to handle push notification
//       // Your backend will check if receiver is actively viewing the chat
//       // and only send notification if they're not
//       try {
      
  
//         console.log('[ChatScreen] Calling notification API:', {
//           userId: customerId,
//           order_id: orderId,
//           messagePreview: text.substring(0, 50)
//         });

//            const response = await apiClient.post(
//       '/api/runner/notifications/send-notification',
//       {
//         userId: Number(customerId),
//         message: text?.trim(),
//         order_id: Number(orderId),
//       },
//        {
//       //   headers: {
//       //     Authorization: `Bearer ${user?.token}`, // if required
//       //   },
//       }
//     );

//        console.log('✅ Message sent successfully:', response.data);

//         if (!response) {
//           console.warn('[ChatScreen] Notification API returned error:', {
//             status: response,
//             data: response
//           });
//           // Don't show error to user - message was still sent successfully
//         } else {
//           console.log('[ChatScreen] Notification API success:', response);
//         }
//       } catch (notificationError) {
//         // Log but don't fail the message send - the message was delivered
//         // The notification is a "nice to have" feature
//         console.error('[ChatScreen] Notification API error:', notificationError);
//         logger.error('Failed to call notification API:', notificationError);
//         // Message was still sent successfully, so don't show error to user
//       }

//     } catch (error) {
//       logger.error('Error sending message:', error);
//       Alert.alert('Error', 'Failed to send message. Please try again.');
//     } finally {
//       setSendingMessage(false);
//     }
//   };

//   const renderMessage = ({ item }: { item: ChatMessage }) => {
//     const isOwnMessage = item.senderId === userId;
//     return <MessageBubble message={item} isOwnMessage={isOwnMessage} />;
//   };

//   const renderHeader = () => (
//     <View style={styles.header}>
//       <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
//         <ArrowLeft size={ms(24)} color={Colors.black} />
//       </TouchableOpacity>

//       <View style={styles.headerInfo}>
//         <Text style={styles.headerTitle}>
//           {isCustomer ? runnerName || 'Runner' : customerName}
//         </Text>
//         <View style={styles.statusContainer}>
//           <View style={[
//             styles.statusDot, 
//             { backgroundColor: otherUserStatus === 'online' ? '#10B981' : '#9CA3AF' }
//           ]} />
//           <Text style={styles.headerSubtitle}>
//             {otherUserStatus === 'online' ? 'Online' : 'Offline'} • Order #{orderId}
//           </Text>
//         </View>
//       </View>

//       {(isCustomer ? runnerImage : customerImage) && (
//         <Image 
//           source={{ uri: isCustomer ? runnerImage : customerImage }} 
//           style={styles.headerAvatar} 
//         />
//       )}
//     </View>
//   );

//   if (loading) {
//     return (
//       <SafeAreaView style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color={Colors.blue} />
//         <Text style={styles.loadingText}>Loading chat...</Text>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaViewEdge style={styles.container} edges={['bottom']}>
//       <KeyboardAvoidingView
//         style={{ flex: 1 }}
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         keyboardVerticalOffset={0}
//       >
//         {renderHeader()}

//         <FlatList
//           ref={flatListRef}
//           data={messages}
//           renderItem={renderMessage}
//           keyExtractor={(item) => item.id}
//           style={styles.messagesList}
//           contentContainerStyle={styles.messagesContainer}
//           showsVerticalScrollIndicator={false}
//           onContentSizeChange={() =>
//             flatListRef.current?.scrollToEnd({ animated: false })
//           }
//           ListEmptyComponent={
//             <View style={styles.emptyContainer}>
//               <Text style={styles.emptyText}>No messages yet</Text>
//               <Text style={styles.emptySubtext}>
//                 Start the conversation by sending a message
//               </Text>
//             </View>
//           }
//         />

//         <MessageInput
//           onSendMessage={handleSendMessage}
//           placeholder="Type your message..."
//           disabled={sendingMessage}
//         />
//       </KeyboardAvoidingView>
//     </SafeAreaViewEdge>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: Colors.white },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: Colors.white,
//   },
//   loadingText: {
//     marginTop: vs(10),
//     fontSize: ms(16),
//     fontFamily: Typography.Regular.fontFamily,
//     color: Colors.black,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: ms(16),
//     paddingVertical: vs(12),
//     backgroundColor: Colors.white,
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.borderColor,
//   },
//   backButton: { padding: ms(8) },
//   headerInfo: { flex: 1, marginLeft: ms(12) },
//   headerTitle: {
//     fontSize: ms(16),
//     fontFamily: Typography.SemiBold.fontFamily,
//     color: Colors.black,
//   },
//   statusContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: vs(2),
//   },
//   statusDot: {
//     width: ms(8),
//     height: ms(8),
//     borderRadius: ms(4),
//     marginRight: ms(6),
//   },
//   headerSubtitle: {
//     fontSize: ms(12),
//     fontFamily: Typography.Regular.fontFamily,
//     color: Colors.borderColor1,
//   },
//   headerAvatar: {
//     width: ms(36),
//     height: ms(36),
//     borderRadius: ms(18),
//     borderWidth: 1,
//     borderColor: Colors.borderColor,
//   },
//   messagesList: { flex: 1 },
//   messagesContainer: { paddingVertical: vs(8), flexGrow: 1 },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingVertical: vs(60),
//   },
//   emptyText: {
//     fontSize: ms(16),
//     fontFamily: Typography.Medium.fontFamily,
//     color: Colors.borderColor1,
//     marginBottom: vs(8),
//   },
//   emptySubtext: {
//     fontSize: ms(14),
//     fontFamily: Typography.Regular.fontFamily,
//     color: Colors.borderColor1,
//     textAlign: 'center',
//   },
// });

// export default ChatScreen;

// import React, { useContext, useEffect, useRef, useState } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   StyleSheet,
//   TouchableOpacity,
//   Image,
//   Alert,
//   ActivityIndicator,
//   KeyboardAvoidingView,
//   Platform,
//   AppState,
//   AppStateStatus,
// } from 'react-native';
// import { ArrowLeft, Phone } from 'lucide-react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { ms, vs } from '../../utils/responsive';
// import Colors from '../../utils/colors';
// import { Typography } from '../../utils/typography';
// import { logger } from '../../utils/logger';
// import MessageBubble from '../../components/chat/MessageBubble';
// import MessageInput from '../../components/chat/MessageInput';
// import chatService, { ChatMessage } from '../../services/Chat/ChatService';
// import { AuthContext } from '../../context/AuthContext';
// import { useKeyboardHandler } from 'react-native-keyboard-controller';
// import { runOnJS } from 'react-native-reanimated';
// import { makePhoneCall } from '../../utils/phoneCall';
// import { useToast } from '../../hooks/ToastProvider';
// import { runnerSendChatNotification } from '../../api/notification';
// import DateSeparator from '../../components/chat/DateSeparator';

// interface ChatScreenProps {
//   navigation: any;
//   route: {
//     params: {
//       orderId: string;
//       customerId: string;
//       customerName: string;
//       customerImage?: string;
//       customerPhone?: string;
//       runnerName?: string;
//       runnerImage?: string;
//     };
//   };
// }

// const ChatScreen: React.FC<ChatScreenProps> = ({ navigation, route }) => {
//   const {
//     orderId,
//     customerId,
//     customerName = 'Customer',
//     customerImage,
//     customerPhone,
//     runnerName,
//     runnerImage,
//   } = route.params;

//   // Log all route parameters for debugging
//   logger.log("ChatScreen route params:", {
//     orderId,
//     customerId,
//     customerName,
//     customerImage,
//     customerPhone,
//     runnerName,
//     runnerImage,
//   });
//   const { toast }   = useToast();
//   const [messages, setMessages] = useState<ChatMessage[]>([]);
//   const [chatRoom, setChatRoom] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [sendingMessage, setSendingMessage] = useState(false);
//   const flatListRef = useRef<FlatList>(null);
//   const unsubscribeRef = useRef<(() => void) | null>(null);
//   const statusUnsubscribeRef = useRef<(() => void) | null>(null);
//     const { user,isLogin }    = useContext(AuthContext) || {};
//   const [customerStatus, setCustomerStatus] = useState<string>('offline');
  


//   const userId = user?.id || 'temp_user_id';
//   logger.log("userId==>", user);

//   // Runner is the cabana boy
//   const cabanaBoyId = userId;
//   const cabanaBoyName = runnerName || user?.name || 'Runner';
//   const cabanaBoyImage = runnerImage || user?.image;

//   const scrollToBottom = (animated = true) => {
//     flatListRef.current?.scrollToEnd({ animated });
//   };

//   /*
//    * useKeyboardHandler — fires on the UI thread on every keyboard frame.
//    */
//   useKeyboardHandler(
//     {
//       onStart: () => {
//         'worklet';
//       },
//       onEnd: (e) => {
//         'worklet';
//         if (e.height > 0) {
//           runOnJS(scrollToBottom)();
//         }
//       },
//     },
//     []
//   );

//   // Handle app state changes (background/foreground)
//   // useEffect(() => {
//   //   if (!user?.id) return;

//   //   // 1. Initial Presence Setup
//   //   chatService.setUserPresence(user.id, orderId);

//   //   // 2. Handle Screen Lock / Backgrounding
//   //   const handleAppStateChange = (nextAppState: AppStateStatus) => {
//   //     if (nextAppState === 'active') {
//   //       // User came back/unlocked screen
//   //       chatService.updateStatusManual(user.id, 'online', orderId);
//   //     } else {
//   //       // User locked screen ('inactive') or minimized app ('background')
//   //       chatService.updateStatusManual(user.id, 'offline');
//   //     }
//   //   };

//   //   const subscription = AppState.addEventListener('change', handleAppStateChange);

//   //   // 3. Listen to the CUSTOMER's status
//   //   if (customerId) {
//   //     logger.log("Observing customer status for:", customerId);
//   //     statusUnsubscribeRef.current = chatService.observeUserPresence(customerId,orderId, (status) => {
//   //       logger.log("Customer status updated:", status);
//   //       setCustomerStatus(status);
//   //     });
//   //   }

//   //   // 4. CLEANUP (Navigating back)
//   //   return () => {
//   //     subscription.remove();
//   //     chatService.updateStatusManual(user.id, 'offline');
//   //     if (statusUnsubscribeRef.current) statusUnsubscribeRef.current();
//   //   };
//   // }, [user?.id, customerId]);

// useEffect(() => {
//   if (!user?.id) return;

//   // 1. Initial Presence Setup (Online)
//   chatService.setUserPresence(user.id, orderId);

//   // 2. Handle Screen Lock / Backgrounding
//   const handleAppStateChange = (nextAppState: AppStateStatus) => {
//     if (nextAppState === 'active') {
//       chatService.updateStatusManual(user.id, 'online', orderId);
//     } else {
//       // Logic: User left the app or locked screen
//       chatService.updateStatusManual(user.id, 'offline');
//     }
//   };

//   const subscription = AppState.addEventListener('change', handleAppStateChange);

//   // 3. Listen to the CUSTOMER's status
//   let customerUnsubscribe: (() => void) | null = null;
  
//   if (customerId) {
//     logger.log("Observing customer status for:", customerId);
//     customerUnsubscribe = chatService.observeUserPresence(customerId, orderId, (status) => {
//       logger.log("Customer status updated:", status);
//       setCustomerStatus(status);
//     });
//     // Keep the ref updated just in case you need it elsewhere
//     statusUnsubscribeRef.current = customerUnsubscribe;
//   }

//   // 4. CLEANUP
//   return () => {
//     subscription.remove();
//     // Mark self as offline when leaving the screen
//     chatService.updateStatusManual(user.id, 'offline');
    
//     // Clean up the customer listener
//     if (customerUnsubscribe) {
//       customerUnsubscribe();
//       statusUnsubscribeRef.current = null;
//     }
//   };
// }, [user?.id, customerId, orderId]); // Added orderId to dependencies to be safe

//   useEffect(() => {
//     if (isLogin === null) return;
//     initializeChat();
//     return () => {
//       unsubscribeRef.current?.();
//     };
//   }, [isLogin]);

//   useEffect(() => {
//     if (chatRoom && userId) {
//       chatService.markMessagesAsRead(chatRoom.id, userId);
//     }
//   }, [chatRoom, messages]);

//   // Scroll to bottom on every new message
//   useEffect(() => {
//     if (messages.length > 0) {
//       setTimeout(() => scrollToBottom(true), 100);
//     }
//   }, [messages]);

//   const initializeChat = async () => {
//     try {
//       setLoading(true);
      
//       // Runner creates/gets chat room with themselves as cabanaBoy
//       const chatRoomData = await chatService.getOrCreateChatRoom(
//         orderId,
//         cabanaBoyId,
//         cabanaBoyName,
//         customerId,
//         customerName
//       );
      
//       setChatRoom(chatRoomData);
      
//       unsubscribeRef.current = chatService.getMessages(
//         chatRoomData.id,
//         (fetchedMessages) => {
//           setMessages(fetchedMessages);
//           logger.log("fetchedMessages", fetchedMessages);
//         }
//       );
//     } catch (error) {
//       logger.error('Error initializing chat:', error);
//       Alert.alert('Error', 'Failed to load chat. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSendMessage = async (text: string) => {
//     logger.log("Runner sending message:", text);
//     logger.log("userId", userId);
    
//     if (!chatRoom) return;
    
//     try {
//       setSendingMessage(true);
      
//       // Runner sends to customer
//       const receiverId = customerId;
      
//       if (!receiverId) {
//         Alert.alert('Error', 'Customer not found');
//         return;
//       }

//       await chatService.sendMessage(chatRoom.id, {
//         text,
//         senderId: userId,
//         senderName: cabanaBoyName,
//         senderImage: cabanaBoyImage,
//         receiverId,
//         orderId,
//         type: 'text',
//       });

//       // Send notification to customer
//       try {
//         if(customerStatus === 'offline'){
//           const res = await runnerSendChatNotification({
//           userId: customerId,
//           message: text,
//           order_id: orderId,
//         });
//         logger.log("Notification sent:", res);
//         }
//       } catch (notificationError) {
//         logger.error("Notification error:", notificationError);
//         // Don't fail the message send if notification fails
//       }

//     } catch (error) {
//       logger.error('Error sending message:', error);
//       Alert.alert('Error', 'Failed to send message.');
//     } finally {
//       setSendingMessage(false);
//     }
//   };

//   const handleCall = async () => {
//   await makePhoneCall(customerPhone || '', 'Customer', toast);
//   };

//   const renderMessage = ({ item, index }: { item: ChatMessage; index: number }) => {
//     //logger.log("--->", item);
//     const isOwnMessage = item.senderId === userId;
//     return (
//       <>
//         {index === 0 && <DateSeparator label="TODAY" />}
//         <MessageBubble message={item} isOwnMessage={isOwnMessage} />
//       </>
//     );
//   };

//   if (loading) {
//     return (
//       <SafeAreaView style={styles.loadingContainer} edges={['top', 'bottom']}>
//         <ActivityIndicator size="large" color="#00D46A" />
//         <Text style={styles.loadingText}>Loading chat...</Text>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container} edges={['top']}>
//       {/* HEADER */}
//       <View style={styles.header}>
//         <TouchableOpacity 
//           style={styles.backButton} 
//           onPress={() => navigation.goBack()}
//         >
//           <ArrowLeft size={ms(22)} color="#1A1A1A" />
//         </TouchableOpacity>

//         <View style={styles.headerAvatarContainer}>
//           {customerImage ? (
//             <Image source={{ uri: customerImage }} style={styles.headerAvatar} />
//           ) : (
//             <View style={[styles.headerAvatar, styles.headerAvatarPlaceholder]}>
//               <Text style={styles.avatarText}>
//                 {customerName.charAt(0).toUpperCase()}
//               </Text>
//             </View>
//           )}
//           {/* DYNAMIC DOT COLOR based on customer status */}
//           <View
//             style={[
//               styles.onlineDot,
//               { backgroundColor: customerStatus === 'online' ? '#00D46A' : '#999' },
//             ]}
//           />
//         </View>

//         <View style={styles.headerInfo}>
//           <Text style={styles.headerTitle} numberOfLines={1}>
//             {customerName}
//           </Text>
//           {/* DYNAMIC TEXT AND COLOR */}
//           <Text
//             style={[
//               styles.activeText,
//               { color: customerStatus === 'online' ? '#00D46A' : '#888' },
//             ]}
//           >
//             {customerStatus === 'online' ? 'ACTIVE NOW' : 'OFFLINE'} #{orderId}
//           </Text>
//         </View>

//         {customerPhone && (
//           <TouchableOpacity activeOpacity={0.8} onPress={handleCall}>
//             <View style={styles.callButtonInner}>
//               <Phone size={ms(20)} color={Colors.white} />
//             </View>
//           </TouchableOpacity>
//         )}
//       </View>

//       <KeyboardAvoidingView
//         style={styles.keyboardArea}
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         keyboardVerticalOffset={0}
//       >
//         <FlatList
//           ref={flatListRef}
//           data={messages}
//           renderItem={renderMessage}
//           keyExtractor={(item) => item.id}
//           style={styles.messagesList}
//           contentContainerStyle={styles.messagesContainer}
//           showsVerticalScrollIndicator={false}
//           onContentSizeChange={() => scrollToBottom(true)}
//           onLayout={() => scrollToBottom(false)}
//           ListEmptyComponent={
//             <View style={styles.emptyContainer}>
//               <Text style={styles.emptyText}>No messages yet</Text>
//               <Text style={styles.emptySubtext}>Start the conversation!</Text>
//             </View>
//           }
//         />

//         <MessageInput
//           onSendMessage={handleSendMessage}
//           placeholder="Type a message..."
//           disabled={sendingMessage}
//         />
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Colors.white,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: Colors.white,
//   },
//   loadingText: {
//     marginTop: vs(10),
//     fontSize: ms(16),
//     fontFamily: Typography.Regular.fontFamily,
//     color: Colors.black,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: ms(16),
//     paddingVertical: vs(12),
//     backgroundColor: Colors.white,
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.borderColor,
//   },
//   backButton: {
//     padding: ms(8),
//   },
//   headerAvatarContainer: {
//     position: 'relative',
//     marginLeft: ms(8),
//   },
//   headerAvatar: {
//     width: ms(40),
//     height: ms(40),
//     borderRadius: ms(20),
//     borderWidth: 1,
//     borderColor: Colors.borderColor,
//   },
//   headerAvatarPlaceholder: {
//     backgroundColor: Colors.green2,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   avatarText: {
//     fontSize: ms(18),
//     fontFamily: Typography.SemiBold.fontFamily,
//     color: Colors.white,
//   },
//   onlineDot: {
//     position: 'absolute',
//     bottom: 0,
//     right: 0,
//     width: ms(12),
//     height: ms(12),
//     borderRadius: ms(6),
//     borderWidth: 2,
//     borderColor: Colors.white,
//   },
//   headerInfo: {
//     flex: 1,
//     marginLeft: ms(12),
//   },
//   headerTitle: {
//     fontSize: ms(16),
//     fontFamily: Typography.SemiBold.fontFamily,
//     color: Colors.black,
//   },
//   activeText: {
//     fontSize: ms(12),
//     fontFamily: Typography.Medium.fontFamily,
//     marginTop: vs(2),
//   },
//   callButtonInner: {
//     width: ms(40),
//     height: ms(40),
//     borderRadius: ms(20),
//     backgroundColor: Colors.green2,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   keyboardArea: {
//     flex: 1,
//   },
//   messagesList: {
//     flex: 1,
//   },
//   messagesContainer: {
//     paddingVertical: vs(8),
//     flexGrow: 1,
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingVertical: vs(60),
//   },
//   emptyText: {
//     fontSize: ms(16),
//     fontFamily: Typography.Medium.fontFamily,
//     color: Colors.borderColor1,
//     marginBottom: vs(8),
//   },
//   emptySubtext: {
//     fontSize: ms(14),
//     fontFamily: Typography.Regular.fontFamily,
//     color: Colors.borderColor1,
//     textAlign: 'center',
//   },
// });

// export default ChatScreen;


import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  AppState,
  AppStateStatus,
} from 'react-native';
import { ArrowLeft, Phone } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ms, vs } from '../../utils/responsive';
import Colors from '../../utils/colors';
import { Typography } from '../../utils/typography';
import { logger } from '../../utils/logger';
import MessageBubble from '../../components/chat/MessageBubble';
import MessageInput from '../../components/chat/MessageInput';
import chatService, { ChatMessage } from '../../services/Chat/ChatService';
import { AuthContext } from '../../context/AuthContext';
import { useKeyboardHandler } from 'react-native-keyboard-controller';
import { runOnJS } from 'react-native-reanimated';
import { makePhoneCall } from '../../utils/phoneCall';
import { useToast } from '../../hooks/ToastProvider';
import { runnerSendChatNotification } from '../../api/notification';
import DateSeparator from '../../components/chat/DateSeparator';
import { useOrderDetail } from '../../hooks/useOrderDetail';


interface ChatScreenProps {
  navigation: any;
  route: {
    params: {
      orderId: string;
      customerId?: string;
      customerName?: string;
      customerImage?: string;
      customerPhone?: string;
      runnerName?: string;
      runnerImage?: string;
       fromNotification?: boolean;
    };
  };
}

const quickMessages = [
  { id: '1', label: 'On the way' },
  { id: '2', label: 'Reached location' },
  { id: '3', label: '5 mins away' },
  { id: '4', label: 'Please come outside' },
];

const ChatScreen: React.FC<ChatScreenProps> = ({ navigation, route }) => {
  const { toast } = useToast();
  const { user, isLogin } = useContext(AuthContext) || {};
  const { order, fetchOrderDetail } = useOrderDetail();
  
  // ✅ Handle case where only orderId is provided (from notification)
  const [orderData, setOrderData] = useState<any>(null);
  const [isFetchingOrder, setIsFetchingOrder] = useState(false);

  // Use route params if provided, otherwise will be fetched from order
  const [customerData, setCustomerData] = useState({
    customerId: route.params?.customerId || '',
    customerName: route.params?.customerName || 'Customer',
    customerImage: route.params?.customerImage || '',
    customerPhone: route.params?.customerPhone || '',
  });

  const orderId = route.params?.orderId;
  const fromNotification = route.params?.fromNotification || false; // ✅ Check if opened from notification
  const runnerName = route.params?.runnerName || user?.display_name || 'Runner';
  const runnerImage = route.params?.runnerImage || user?.image_url;

  // Log all route parameters for debugging
  logger.log("ChatScreen route params:", route.params);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatRoom, setChatRoom] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const statusUnsubscribeRef = useRef<(() => void) | null>(null);
  const [customerStatus, setCustomerStatus] = useState<string>('offline');

  const userId = user?.id || 'temp_user_id';
  logger.log("userId==>", user);

  // Runner is the cabana boy
  const cabanaBoyId = userId;
  const cabanaBoyName = runnerName;
  const cabanaBoyImage = runnerImage;

// ✅ Fetch order details if customer data is missing
  useEffect(() => {
    const fetchOrderIfNeeded = async () => {
      if (customerData.customerId) {
        logger.log("✅ Customer data already available");
        return;
      }

      if (orderId && !customerData.customerId) {
        logger.log("🔍 Fetching order details for orderId:", orderId);
        setIsFetchingOrder(true);

        try {
          await fetchOrderDetail(Number(orderId));
        } catch (error) {
          logger.error("❌ Error fetching order:", error);
          Alert.alert('Error', 'Failed to load customer information');
          navigation.goBack();
        } finally {
          setIsFetchingOrder(false);
        }
      }
    };

    fetchOrderIfNeeded();
  }, [orderId, customerData.customerId]);

// ✅ FIXED: Handle order data when it arrives

  useEffect(() => {
    if (!order) return;

    logger.log("✅ Order fetched:", order);
    
    // ✅ ALWAYS set customer data when order is available
    setCustomerData({
      customerId: order?.User?.id || '',
      customerName: order?.User?.display_name || 'Customer',
      customerImage: order?.User?.image_url || '',
      customerPhone: order?.User?.phone || '',
    });

    // ✅ NEW: Only check status if NOT opened from notification
    if (!fromNotification) {
      logger.log("🔍 Checking order status (not from notification)");
      
      // Only navigate away if order status is not picked_up
      if (order?.status !== "picked_up") {
        logger.log("⚠️ Order status is not 'picked_up', navigating away");
        
        // Optional: Show a message to user
        toast?.('Order not yet picked up', 'info');
        
        // Navigate to home
        setTimeout(() => {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
          });
        }, 1500);
      }
    } else {
      logger.log("📲 Opened from notification - staying on chat regardless of status");
      
      // Optional: Show info if order is not picked up yet
      if (order?.status !== "picked_up") {
        logger.log("ℹ️ Order status:", order?.status);
        // You can optionally show a message but don't navigate away
        // toast?.(`Order status: ${order?.status}`, 'info', 3000);
      }
    }
  }, [order, fromNotification]);

  const scrollToBottom = (animated = true) => {
    flatListRef.current?.scrollToEnd({ animated });
  };

  /*
   * useKeyboardHandler — fires on the UI thread on every keyboard frame.
   */
  useKeyboardHandler(
    {
      onStart: () => {
        'worklet';
      },
      onEnd: (e) => {
        'worklet';
        if (e.height > 0) {
          runOnJS(scrollToBottom)();
        }
      },
    },
    []
  );

  // Handle app state changes (background/foreground)
  useEffect(() => {
    if (!user?.id) return;

    // 1. Initial Presence Setup
    chatService.setUserPresence(user.id, orderId);

    // 2. Handle Screen Lock / Backgrounding
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        chatService.updateStatusManual(user.id, 'online', orderId);
      } else {
        chatService.updateStatusManual(user.id, 'offline');
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    // 3. Listen to the CUSTOMER's status (wait until we have customerId)
    if (customerData.customerId) {
      logger.log("Observing customer status for:", customerData.customerId);
      statusUnsubscribeRef.current = chatService.observeUserPresence(
        customerData.customerId,
        orderId,
        (status) => {
          logger.log("Customer status updated:", status);
          setCustomerStatus(status);
        }
      );
    }

    // 4. CLEANUP
    return () => {
      subscription.remove();
      chatService.updateStatusManual(user.id, 'offline');
      if (statusUnsubscribeRef.current) statusUnsubscribeRef.current();
    };
  }, [user?.id, customerData.customerId, orderId]);

  useEffect(() => {
    // Wait until we have customer data before initializing chat
    if (isLogin === null || !customerData.customerId || isFetchingOrder) return;
    
    initializeChat();
    return () => {
      unsubscribeRef.current?.();
    };
  }, [isLogin, customerData.customerId, isFetchingOrder]);

  useEffect(() => {
    if (chatRoom && userId) {
      chatService.markMessagesAsRead(chatRoom.id, userId);
    }
  }, [chatRoom, messages]);

  // Scroll to bottom on every new message
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => scrollToBottom(true), 100);
    }
  }, [messages]);

  const initializeChat = async () => {
    try {
      setLoading(true);
      
      // Runner creates/gets chat room with themselves as cabanaBoy
      const chatRoomData = await chatService.getOrCreateChatRoom(
        orderId,
        cabanaBoyId,
        cabanaBoyName,
        customerData.customerId,
        customerData.customerName
      );
      
      setChatRoom(chatRoomData);
      
      unsubscribeRef.current = chatService.getMessages(
        chatRoomData.id,
        (fetchedMessages) => {
          setMessages(fetchedMessages);
          logger.log("fetchedMessages", fetchedMessages);
        }
      );
    } catch (error) {
      logger.error('Error initializing chat:', error);
      Alert.alert('Error', 'Failed to load chat. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (text: string) => {
    logger.log("Runner sending message:", text);
    logger.log("userId", userId);
    
    if (!chatRoom) return;
    
    try {
      setSendingMessage(true);
      
      const receiverId = customerData.customerId;
      
      if (!receiverId) {
        Alert.alert('Error', 'Customer not found');
        return;
      }

      await chatService.sendMessage(chatRoom.id, {
        text,
        senderId: userId,
        senderName: cabanaBoyName,
        senderImage: cabanaBoyImage,
        receiverId,
        orderId,
        type: 'text',
      });

      // Send notification to customer
      try {
        if (customerStatus === 'offline') {
          const res = await runnerSendChatNotification({
            userId: customerData.customerId,
            message: text,
            order_id: orderId,
          });
          logger.log("Notification sent:", res);
        }
      } catch (notificationError) {
        logger.error("Notification error:", notificationError);
      }

    } catch (error) {
      logger.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message.');
    } finally {
      setSendingMessage(false);
    }
  };

const handleQuickMessage = async (text: string) => {
  if (!chatRoom) return;

 try {
      setSendingMessage(true);
      
      const receiverId = customerData.customerId;
      
      if (!receiverId) {
        Alert.alert('Error', 'Customer not found');
        return;
      }

      await chatService.sendMessage(chatRoom.id, {
        text,
        senderId: userId,
        senderName: cabanaBoyName,
        senderImage: cabanaBoyImage,
        receiverId,
        orderId,
        type: 'text',
      });

      // Send notification to customer
      try {
        if (customerStatus === 'offline') {
          const res = await runnerSendChatNotification({
            userId: customerData.customerId,
            message: text,
            order_id: orderId,
          });
          logger.log("Notification sent:", res);
        }
      } catch (notificationError) {
        logger.error("Notification error:", notificationError);
      }

    } catch (error) {
      logger.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message.');
    } finally {
      setSendingMessage(false);
    }
};

  const handleCall = async () => {
    await makePhoneCall(customerData.customerPhone || '', 'Customer', toast);
  };

  const renderMessage = ({ item, index }: { item: ChatMessage; index: number }) => {
    const isOwnMessage = item.senderId === userId;
    return (
      <>
        {index === 0 && <DateSeparator label="TODAY" />}
        <MessageBubble message={item} isOwnMessage={isOwnMessage} />
      </>
    );
  };

  const GOBACK = () => {
   if (navigation.canGoBack()) {
  navigation.goBack();
} else {
navigation.navigate('CustomerInfoScreen');
  
//  navigation.reset({
//             index: 0,
//             routes: [{ name: 'Home' }],
//           });
}
  };

  // Show loading while fetching order details
  if (loading) {//isFetchingOrder || 
    return (
      <SafeAreaView style={styles.loadingContainer} edges={['top', 'bottom']}>
        <ActivityIndicator size="large" color="#00D46A" />
        <Text style={styles.loadingText}>
          {isFetchingOrder ? 'Loading customer info...' : 'Loading chat...'}
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={GOBACK}
        >
          <ArrowLeft size={ms(22)} color="#1A1A1A" />
        </TouchableOpacity>

        <View style={styles.headerAvatarContainer}>
          {customerData.customerImage ? (
            <Image source={{ uri: customerData.customerImage }} style={styles.headerAvatar} />
          ) : (
            <View style={[styles.headerAvatar, styles.headerAvatarPlaceholder]}>
              <Text style={styles.avatarText}>
                {customerData.customerName.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          {/* DYNAMIC DOT COLOR based on customer status */}
          <View
            style={[
              styles.onlineDot,
              { backgroundColor: customerStatus === 'online' ? Colors.green2 : '#999' },
            ]}
          />
        </View>

        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {customerData.customerName}
          </Text>
          {/* DYNAMIC TEXT AND COLOR */}
          {/* <Text
            style={[
              styles.activeText,
              { color: customerStatus === 'online' ? '#00D46A' : '#888' },
            ]}
          >
            {customerStatus === 'online' ? 'ACTIVE NOW' : 'OFFLINE'} #{orderId}
          </Text> */}
        </View>

        {customerData.customerPhone && (
          <TouchableOpacity activeOpacity={0.8} onPress={handleCall}>
            <View style={styles.callButtonInner}>
              <Phone size={ms(20)} color={Colors.white} />
            </View>
          </TouchableOpacity>
        )}
      </View>



      <KeyboardAvoidingView
        style={styles.keyboardArea}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollToBottom(true)}
          onLayout={() => scrollToBottom(false)}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No messages yet</Text>
              <Text style={styles.emptySubtext}>Start the conversation!</Text>
            </View>
          }
        />

<View style={styles.quickContainer}>
  <FlatList
    data={quickMessages}
    horizontal
    showsHorizontalScrollIndicator={false}
    keyExtractor={(item) => item.id}
    renderItem={({ item }) => (
      <TouchableOpacity
        style={styles.quickBadge}
        onPress={() => handleSendMessage(item.label)}
      >
        <Text style={styles.quickText}>{item.label}</Text>
      </TouchableOpacity>
    )}
  />
</View>

        <MessageInput
          onSendMessage={handleSendMessage}
          placeholder="Type a message..."
          disabled={sendingMessage}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  loadingText: {
    marginTop: vs(10),
    fontSize: ms(16),
    fontFamily: Typography.Regular.fontFamily,
    color: Colors.black,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: ms(16),
    paddingVertical: vs(12),
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderColor,
  },
  backButton: {
    padding: ms(8),
  },
  headerAvatarContainer: {
    position: 'relative',
    marginLeft: ms(8),
  },
  headerAvatar: {
    width: ms(40),
    height: ms(40),
    borderRadius: ms(20),
    borderWidth: 1,
    borderColor: Colors.borderColor,
  },
  headerAvatarPlaceholder: {
    backgroundColor: Colors.green2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: ms(18),
    fontFamily: Typography.SemiBold.fontFamily,
    color: Colors.white,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: ms(12),
    height: ms(12),
    borderRadius: ms(6),
    borderWidth: 2,
    borderColor: Colors.white,
  },
  headerInfo: {
    flex: 1,
    marginLeft: ms(12),
  },
  headerTitle: {
    fontSize: ms(16),
    fontFamily: Typography.SemiBold.fontFamily,
    color: Colors.black,
  },
  activeText: {
    fontSize: ms(12),
    fontFamily: Typography.Medium.fontFamily,
    marginTop: vs(2),
  },
  callButtonInner: {
    width: ms(40),
    height: ms(40),
    borderRadius: ms(20),
    backgroundColor: Colors.green2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickContainer: {
  paddingVertical: vs(8),
  paddingLeft: ms(12),
},

quickBadge: {
  //backgroundColor: Colors.green2,
  paddingHorizontal: ms(14),
  paddingVertical: vs(6),
  borderRadius: ms(20),
  marginRight: ms(10),
  borderColor: Colors.green2,
  borderWidth: ms(1.5),
},

quickText: {
  color: Colors.green2,
  fontSize: ms(13),
  fontFamily: Typography.Medium.fontFamily,
},
  keyboardArea: {
    flex: 1,
  },
  messagesList: {
    flex: 1,
  },
  messagesContainer: {
    paddingVertical: vs(8),
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: vs(60),
  },
  emptyText: {
    fontSize: ms(16),
    fontFamily: Typography.Medium.fontFamily,
    color: Colors.borderColor1,
    marginBottom: vs(8),
  },
  emptySubtext: {
    fontSize: ms(14),
    fontFamily: Typography.Regular.fontFamily,
    color: Colors.borderColor1,
    textAlign: 'center',
  },
});

export default ChatScreen;