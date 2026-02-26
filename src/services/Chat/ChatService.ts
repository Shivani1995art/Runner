// import { logger } from '../../utils/logger';
// import {
//   getDatabase,
//   ref,
//   onValue,
//   off,
//   set,
//   update,
//   get,
//   onDisconnect,
  
// } from '@react-native-firebase/database';
//  import {
//   getFirestore,
//   collection,
//   doc,
//   addDoc,
//   updateDoc,
//   getDocs,
//   getDoc,
//   query,
//   where,
//   orderBy,
//   limit,
//   onSnapshot,
//   writeBatch,
//   serverTimestamp
// } from '@react-native-firebase/firestore';
// export interface ChatMessage {
//   id: string;
//   text: string;
//   senderId: string;
//   senderName: string;
//   senderImage?: string;
//   receiverId: string;
//   orderId: string;
//   timestamp: any; // Firestore Timestamp
//   isRead: boolean;
//   type: 'text' | 'image' | 'system';
// }
 
// export interface ChatRoom {
//   id: string;
//   orderId: string;
//   participants: {
//     customerId: string;
//     cabanaBoyId?: string;
//     customerName: string;
//     cabanaBoyName?: string;
//   };
//   lastMessage?: {
//     text: string;
//     timestamp: any;
//     senderId: string;
//   };
//   createdAt: any;
//   updatedAt: any;
// }
 
// class ChatService {
//   private db = getFirestore();
// private realtimeDb = getDatabase();
//   private presenceInitialized = false;
 
//   async getOrCreateChatRoom(
//     orderId: string,
//     customerId: string,
//     customerName: string,
//     cabanaBoyId?: string,
//     cabanaBoyName?: string
//   ): Promise<ChatRoom> {
//     try {
//       console.log('[ChatService] getOrCreateChatRoom called:', { orderId, customerId });
//       const chatRoomsRef = collection(this.db, 'chatRooms');
      
//       // orderId must be stored as string consistently
//       const snapshot = await chatRoomsRef
//         .where('orderId', '==', String(orderId))
//         .limit(1)
//         .get();
 
//       if (!snapshot.empty) {
//         const doc = snapshot.docs[0];
//         console.log('[ChatService] Found existing chat room:', doc.id);
//         return { id: doc.id, ...doc.data() } as ChatRoom;
//       }
 
//       const newChatRoom = {
//         orderId: String(orderId), // always store as string
//         participants: {
//           customerId,
//           ...(cabanaBoyId && { cabanaBoyId }),
//           customerName,
//           ...(cabanaBoyName && { cabanaBoyName }),
//         },
//         createdAt: serverTimestamp(),
//         updatedAt: serverTimestamp(),
//       };
 
//       const docRef = await chatRoomsRef.add(newChatRoom);
//       console.log('[ChatService] Created new chat room:', docRef.id);
//       return { id: docRef.id, ...newChatRoom } as ChatRoom;
//     } catch (error) {
//       logger.error('Error creating/getting chat room:', error);
//       throw error;
//     }
//   }
 
//   async sendMessage(
//     chatRoomId: string,
//     message: Omit<ChatMessage, 'id' | 'timestamp' | 'isRead'>
//   ): Promise<void> {
//     try {
//       console.log('[ChatService] Sending message to room:', chatRoomId, message);
 
//       // ✅ NO Firebase auth check - we use custom backend auth
//       const fullMessage = {
//         ...message,
//         timestamp: firestore.FieldValue.serverTimestamp(),
//         isRead: false,
//       };
 
//       await this.db
//         .collection('chatRooms')
//         .doc(chatRoomId)
//         .collection('messages')
//         .add(fullMessage);
 
//       await collection(this.db, 'chatRooms').doc(chatRoomId).update({
//         lastMessage: {
//           text: message.text,
//           timestamp: firestore.FieldValue.serverTimestamp(),
//           senderId: message.senderId,
//         },
//         updatedAt: firestore.FieldValue.serverTimestamp(),
//       });
 
//       console.log('[ChatService] Message sent successfully');
//     } catch (error) {
//       logger.error('Error sending message:', error);
//       throw error;
//     }
//   }
 
//   getMessages(chatRoomId: string, callback: (messages: ChatMessage[]) => void) {
//     console.log('[ChatService] Subscribing to messages for room:', chatRoomId);
 
//     // ✅ Use only the old-style API consistently (no mixing with modular imports)
//     const unsubscribe = this.db
//       .collection('chatRooms')
//       .doc(chatRoomId)
//       .collection('messages')
//       .orderBy('timestamp', 'asc') // ✅ asc so no need to reverse
//       .onSnapshot(
//         (snapshot) => {
//           console.log('[ChatService] Snapshot received, docs:', snapshot.docs.length);
//           const messages: ChatMessage[] = snapshot.docs.map((doc) => {
//             const data = doc.data();
//             return {
//               id: doc.id,
//               ...data,
//               // ✅ Convert Firestore Timestamp to JS Date
//               timestamp: data.timestamp?.toDate?.() || new Date(),
//             } as ChatMessage;
//           });
//           console.log('[ChatService] Processed messages:', messages.length);
//           callback(messages);
//         },
//         (error) => {
//           console.error('[ChatService] Snapshot error:', error);
//           logger.error('Error listening to messages:', error);
//         }
//       );
 
//     return unsubscribe;
//   }
 
//   async markMessagesAsRead(chatRoomId: string, userId: string): Promise<void> {
//     try {
//       const unreadMessages = await this.db
//         .collection('chatRooms')
//         .doc(chatRoomId)
//         .collection('messages')
//         .where('receiverId', '==', userId)
//         .where('isRead', '==', false)
//         .get();
 
//       if (unreadMessages.empty) return;
 
//       const batch = writeBatch(this.db);
//       unreadMessages.forEach((doc) => {
//         batch.update(doc.ref, { isRead: true });
//       });
//       await batch.commit();
//     } catch (error) {
//       logger.error('Error marking messages as read:', error);
//     }
//   }
 
//   getUserChatRooms(userId: string, callback: (chatRooms: ChatRoom[]) => void) {
//     return this.db
//       .collection('chatRooms')
//       .where('participants.customerId', '==', userId)
//       .orderBy('updatedAt', 'desc')
//       .onSnapshot(
//         (snapshot) => {
//           const chatRooms: ChatRoom[] = snapshot.docs.map((doc) => ({
//             id: doc.id,
//             ...doc.data(),
//           })) as ChatRoom[];
//           callback(chatRooms);
//         },
//         (error) => {
//           logger.error('Error listening to chat rooms:', error);
//         }
//       );
//   }
 
//   async getUnreadMessageCount(chatRoomId: string, userId: string): Promise<number> {
//     try {
//       const snapshot = await this.db
//         .collection('chatRooms')
//         .doc(chatRoomId)
//         .collection('messages')
//         .where('receiverId', '==', userId)
//         .where('isRead', '==', false)
//         .get();
//       return snapshot.size;
//     } catch (error) {
//       logger.error('Error getting unread count:', error);
//       return 0;
//     }
//   }

//   /**
//    * Set user's general online presence
//    * Called once when app opens or user logs in
//    */
// setUserPresence(userId: string) {
  
//   if (this.presenceInitialized) {
//     console.log('[ChatService] Presence already initialized, skipping');
//     return;
//   }

//   try {
//     const statusRef = ref(this.realtimeDb, `/status/${userId}`);
//     const connectedRef = ref(this.realtimeDb, '.info/connected');

//     onValue(connectedRef, (snapshot) => {
//       const isConnected = snapshot.val();

//       if (!isConnected) {
//         console.log('[ChatService] Not connected');
//         return;
//       }

//       console.log('[ChatService] Connected, setting presence');

//       onDisconnect(statusRef)
//         .set({
//           state: 'offline',
//           last_changed: serverTimestamp(),
//           activeRoomId: null,
//         })
//         .then(() => {
//           return set(statusRef, {
//             state: 'online',
//             last_changed: serverTimestamp(),
//             activeRoomId: null,
//           });
//         })
//         .then(() => {
//           this.presenceInitialized = true;
//           console.log('[ChatService] Presence initialized');
//         })
//         .catch((error) => {
//           console.error('[ChatService] Presence error:', error);
//         });
//     });
//   } catch (error) {
//     console.error('[ChatService] Error in setUserPresence:', error);
//   }
// }
 
//   /**
//    * Update which chat room the user is actively viewing
//    * @param userId - The user ID
//    * @param chatRoomId - The chat room ID they're viewing, or null if not in any room
//    */
// async setActiveRoom(userId: string, chatRoomId: string | null): Promise<void> {
//   try {
//     const statusRef = ref(this.realtimeDb, `/status/${userId}`);

//     await update(statusRef, {
//       activeRoomId: chatRoomId,
//       last_changed: serverTimestamp(),
//     });

//     console.log('[ChatService] Active room updated:', { userId, chatRoomId });
//   } catch (error) {
//     console.error('[ChatService] Error setting active room:', error);
//   }
// }
 
//   /**
//    * Observe user's online/offline status
//    * @param userId - The user to observe
//    * @param callback - Called with 'online' or 'offline'
//    */
// observeUserStatus(
//   userId: string,
//   callback: (status: string) => void
// ): () => void {
//   try {
//     const statusRef = ref(this.realtimeDb, `/status/${userId}`);
// console.log("====statusRef=========",statusRef);

//     const unsubscribe = onValue(statusRef, (snapshot) => {
//       logger.log('[ChatService] User status changed:', snapshot.val());
//       const status = snapshot.val()?.state || 'offline';
//       callback(status);
//     });

//     return unsubscribe; // important
//   } catch (error) {
//     console.error('[ChatService] Error observing user status:', error);
//     return () => {};
//   }
// }
 
//   /**
//    * Check if a user is actively viewing a specific chat room
//    * Used to determine if push notifications should be sent
//    * @param userId - The user to check
//    * @param chatRoomId - The chat room to check
//    * @returns Promise<boolean> - true if user is actively viewing this room
//    */
//   async isUserInActiveRoom(
//   userId: string,
//   chatRoomId: string
// ): Promise<boolean> {
//   try {
//     const statusRef = ref(this.realtimeDb, `/status/${userId}`);
//     const snapshot = await get(statusRef);
//     const status = snapshot.val();

//     const isInRoom =
//       status?.state === 'online' &&
//       status?.activeRoomId === chatRoomId;

//     return isInRoom;
//   } catch (error) {
//     console.error('[ChatService] Error checking active room:', error);
//     return false;
//   }
// }
// }
 
// export default new ChatService();
import firestore from '@react-native-firebase/firestore';
import {
  getDatabase,
  ref,
  set,
  update,
  onValue,
  onDisconnect,
  serverTimestamp,
  off,
} from '@react-native-firebase/database';
import { logger } from '../../utils/logger';

export interface ChatMessage {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  senderImage?: string;
  receiverId: string;
  orderId: string;
  timestamp: any; // Firestore Timestamp
  isRead: boolean;
  type: 'text' | 'image' | 'system';
}

export interface ChatRoom {
  id: string;
  orderId: string;
  participants: {
    customerId: string;
    cabanaBoyId?: string;
    customerName: string;
    cabanaBoyName?: string;
  };
  lastMessage?: {
    text: string;
    timestamp: any;
    senderId: string;
  };
  createdAt: any;
  updatedAt: any;
}

class ChatService {
  private db = firestore();
private rtdb = getDatabase();

  /**
   * Set user presence when entering chat
   * @param userId - The runner's user ID
   * @param currentOrderId - The order ID they're chatting about
   */
setUserPresence(userId: string, currentOrderId: string) {
  if (!userId) return;

  const userStatusRef = ref(this.rtdb, `/status/${userId}`);
  const connectedRef = ref(this.rtdb, '.info/connected');

  onValue(connectedRef, async (snapshot) => {
    if (snapshot.val() === false) return;

    await onDisconnect(userStatusRef).set({
      state: 'offline',
      activeOrderId: null,
      last_changed: serverTimestamp(),
    });

    await set(userStatusRef, {
      state: 'online',
      activeOrderId: currentOrderId,
      last_changed: serverTimestamp(),
    });
  });
}

  /**
   * Observe another user's presence (customer in this case)
   * @param userId - The customer's user ID to observe
   * @param orderId - The order ID to observe
   * @param callback - Function to call with status updates
   */
//   observeUserPresence(userId: string, orderId: string, callback: (status: string) => void) {
//     const userStatusRef = this.rtdb.ref(`/status/${userId}`);
// //activeOrderId
// //{state: 'online', last_changed: 1772006284129, activeOrderId: '421'}
//     const onValueChange = userStatusRef.on('value', (snapshot) => {
//   const data = snapshot.val();

//   logger.log("orderId -->:", orderId);
//   logger.log("User status updated:", data);

//   const isOnlineForThisOrder =
//     data?.state == 'online' &&
//     data?.activeOrderId == orderId;

//   const status = isOnlineForThisOrder ? 'online' : 'offline';

//   callback(status);
// });

//     return () => userStatusRef.off('value', onValueChange);
//   }
// observeUserPresence(
//   userId: string,
//   orderId: string,
//   callback: (status: string) => void
// ) {
//   const userStatusRef = ref(this.rtdb, `/status/${userId}`);

//   const unsubscribe = onValue(userStatusRef, (snapshot) => {
//     const data = snapshot.val();

//     const isOnlineForThisOrder =
//       data?.state === 'online' &&
//       data?.activeOrderId === orderId;

//     callback(isOnlineForThisOrder ? 'online' : 'offline');
//   });

//   return () => off(userStatusRef);
// }

observeUserPresence(
  userId: string,
  orderId: string,
  callback: (status: string) => void
) {
  const userStatusRef = ref(this.rtdb, `/status/${userId}`);
logger.log("==OUP====userStatusRef======",userStatusRef)
  // onValue returns the unsubscribe function directly
  const unsubscribe = onValue(userStatusRef, (snapshot) => {
    const data = snapshot.val();
logger.log("==OUP====data======",data)
    const isOnlineForThisOrder =
  data?.state === 'online' &&
  String(data?.activeOrderId) === String(orderId);

    callback(isOnlineForThisOrder ? 'online' : 'offline');
  });

  // Return the unsubscribe function provided by Firebase
  return unsubscribe;
}

  /**
   * Manually set user offline
   * @param userId - The runner's user ID
   */
async setOffline(userId: string) {
  if (!userId) return;

  const userStatusRef = ref(this.rtdb, `/status/${userId}`);
logger.log("==OFFLINE====userStatusRef=======",userStatusRef)
  await set(userStatusRef, {
    state: 'offline',
    activeOrderId: null,
    last_changed: serverTimestamp(),
  });
}

  /**
   * Manually update status (for app state changes)
   * @param userId - The runner's user ID
   * @param status - 'online' or 'offline'
   * @param currentOrderId - The current order ID (optional)
   */
async updateStatusManual(
  userId: string,
  status: 'online' | 'offline',
  currentOrderId?: string
) {
  if (!userId) return;

  try {
    const userStatusRef = ref(this.rtdb, `/status/${userId}`);
logger.log("userStatusRef -->:", userStatusRef);
    await update(userStatusRef, {
      state: status,
      activeOrderId: status === 'online' ? (currentOrderId || null) : null,
      last_changed: serverTimestamp(),
    });
  } catch (error) {
    logger.error('Error updating status manually:', error);
  }
}

  /**
   * Get or create a chat room for an order
   * FOR RUNNER APP: Runner is the cabanaBoy, Customer is the other party
   * @param orderId - The order ID
   * @param cabanaBoyId - The runner's (cabana boy) ID
   * @param cabanaBoyName - The runner's name
   * @param customerId - The customer's ID
   * @param customerName - The customer's name
   */
  async getOrCreateChatRoom(
    orderId: string,
    cabanaBoyId: string,
    cabanaBoyName: string,
    customerId?: string,
    customerName?: string
  ): Promise<ChatRoom> {
    try {
      console.log('[ChatService] getOrCreateChatRoom called:', { 
        orderId, 
        cabanaBoyId, 
        customerId 
      });
      
      const chatRoomsRef = this.db.collection('chatRooms');

      // Search for existing chat room by orderId
      const snapshot = await chatRoomsRef
        .where('orderId', '==', String(orderId))
        .limit(1)
        .get();

      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        console.log('[ChatService] Found existing chat room:', doc.id);
        return { id: doc.id, ...doc.data() } as ChatRoom;
      }

      // Create new chat room with runner as cabanaBoy
      const newChatRoom = {
        orderId: String(orderId),
        participants: {
          cabanaBoyId,
          cabanaBoyName,
          ...(customerId && { customerId }),
          ...(customerName && { customerName }),
        },
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      };

      const docRef = await chatRoomsRef.add(newChatRoom);
      console.log('[ChatService] Created new chat room:', docRef.id);
      return { id: docRef.id, ...newChatRoom } as ChatRoom;
    } catch (error) {
      logger.error('Error creating/getting chat room:', error);
      throw error;
    }
  }

  /**
   * Send a message in the chat
   * @param chatRoomId - The chat room ID
   * @param message - The message data (without id, timestamp, isRead)
   */
  async sendMessage(
    chatRoomId: string,
    message: Omit<ChatMessage, 'id' | 'timestamp' | 'isRead'>
  ): Promise<void> {
    try {
      console.log('[ChatService] Sending message to room:', chatRoomId, message);

      const fullMessage = {
        ...message,
        timestamp: firestore.FieldValue.serverTimestamp(),
        isRead: false,
      };

      await this.db
        .collection('chatRooms')
        .doc(chatRoomId)
        .collection('messages')
        .add(fullMessage);

      await this.db.collection('chatRooms').doc(chatRoomId).update({
        lastMessage: {
          text: message.text,
          timestamp: firestore.FieldValue.serverTimestamp(),
          senderId: message.senderId,
        },
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });

      console.log('[ChatService] Message sent successfully');
    } catch (error) {
      logger.error('Error sending message:', error);
      throw error;
    }
  }

  /**
   * Subscribe to messages in a chat room
   * @param chatRoomId - The chat room ID
   * @param callback - Function to call with updated messages
   * @returns Unsubscribe function
   */
  getMessages(chatRoomId: string, callback: (messages: ChatMessage[]) => void) {
    console.log('[ChatService] Subscribing to messages for room:', chatRoomId);

    const unsubscribe = this.db
      .collection('chatRooms')
      .doc(chatRoomId)
      .collection('messages')
      .orderBy('timestamp', 'asc')
      .onSnapshot(
        (snapshot) => {
          console.log('[ChatService] Snapshot received, docs:', snapshot.docs.length);
          const messages: ChatMessage[] = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
              timestamp: data.timestamp?.toDate?.() || new Date(),
            } as ChatMessage;
          });
          console.log('[ChatService] Processed messages:', messages.length);
          callback(messages);
        },
        (error) => {
          console.error('[ChatService] Snapshot error:', error);
          logger.error('Error listening to messages:', error);
        }
      );

    return unsubscribe;
  }

  /**
   * Mark messages as read
   * @param chatRoomId - The chat room ID
   * @param userId - The runner's user ID (who is reading the messages)
   */
  async markMessagesAsRead(chatRoomId: string, userId: string): Promise<void> {
    try {
      const unreadMessages = await this.db
        .collection('chatRooms')
        .doc(chatRoomId)
        .collection('messages')
        .where('receiverId', '==', userId)
        .where('isRead', '==', false)
        .get();

      if (unreadMessages.empty) return;

      const batch = this.db.batch();
      unreadMessages.forEach((doc) => {
        batch.update(doc.ref, { isRead: true });
      });
      await batch.commit();
    } catch (error) {
      logger.error('Error marking messages as read:', error);
    }
  }

  /**
   * Get all chat rooms for this runner
   * @param cabanaBoyId - The runner's (cabana boy) ID
   * @param callback - Function to call with updated chat rooms
   * @returns Unsubscribe function
   */
  getCabanaBoyChats(cabanaBoyId: string, callback: (chatRooms: ChatRoom[]) => void) {
    return this.db
      .collection('chatRooms')
      .where('participants.cabanaBoyId', '==', cabanaBoyId)
      .orderBy('updatedAt', 'desc')
      .onSnapshot(
        (snapshot) => {
          const chatRooms: ChatRoom[] = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as ChatRoom[];
          callback(chatRooms);
        },
        (error) => {
          logger.error('Error listening to cabana boy chat rooms:', error);
        }
      );
  }

  /**
   * Get unread message count for a chat room
   * @param chatRoomId - The chat room ID
   * @param userId - The runner's user ID
   */
  async getUnreadMessageCount(chatRoomId: string, userId: string): Promise<number> {
    try {
      const snapshot = await this.db
        .collection('chatRooms')
        .doc(chatRoomId)
        .collection('messages')
        .where('receiverId', '==', userId)
        .where('isRead', '==', false)
        .get();
      return snapshot.size;
    } catch (error) {
      logger.error('Error getting unread count:', error);
      return 0;
    }
  }
}

export default new ChatService();