// import React, { useState, useEffect, useContext } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Image,
//   ScrollView,
//   Platform,
// } from 'react-native';
// import { useRoute, useNavigation } from '@react-navigation/native';
// import { launchImageLibrary, ImagePickerResponse, MediaType, PhotoQuality } from 'react-native-image-picker';
// import { ms, vs, hp, wp } from '../../utils/responsive';
// import Colors from '../../utils/colors';
// import { Typography } from '../../utils/typography';
// import { User, Mail, Phone, Lock, Camera } from 'lucide-react-native';
// import { logger } from '../../utils/logger';
// import GradientContainer from '../Gradient/GradientContainer';
// import CustomHeader from '../common/CustomHeader';
// import CustomButton from '../Buttons/CustomButton';
// import BackButtonsvg from '../../assets/svg/BackButtonsvg';
// import { commonStyle } from '../../styles/CommonStyles';
// import CustomTextInput from '../inputs/CustomTextInput';
// import CommonModal from './CommonModal';
// import { useProfile } from '../../hooks/useProfile';
// import { apiClient } from '../../api/axios';
// import { ENDPOINTS } from '../../api/endpoints';
// import { LoaderContext } from '../../context/LoaderContext';

// interface EditProfileScreenProps {
//   onUpdate?: (updatedData: any) => void;
// }

// const EditProfileScreen: React.FC<EditProfileScreenProps> = ({ onUpdate }) => {
//   const route = useRoute();
//     const { show, hide }  = useContext(LoaderContext);
//   const navigation = useNavigation();
//   const { userData } = route.params as { userData: any };
//   const { saveProfile, isUpdating } = useProfile();

//   const [formData, setFormData] = useState({
//     display_name: userData.display_name || '',
//     email: userData.email || '',
//     profile_image: userData.profile_image || '',
//     phone: userData.phone || '',
//     password: '',
//   });


//  const [originalData, setOriginalData] = useState({
//     display_name: userData.display_name || '',
//     email: userData.email || '',
//     profile_image: userData.profile_image || '',
//     phone: userData.phone || '',
//     password: '',
//   });

//   const [selectedImage, setSelectedImage] = useState<string | null>(userData.profile_image || null);

//   const [alertModal, setAlertModal] = useState<{
//     title:   string;
//     message: string;
//     type:    'error' | 'info' | 'success';
//   } | null>(null);



//   // ── Image Picker ────────────────────────────────────────────────────────────
//   const handleImagePicker = () => {
//     const options = {
//       mediaType: 'photo' as MediaType,
//       includeBase64: false,
//       maxHeight: 2000,
//       maxWidth:  2000,
//       quality:   0.8 as PhotoQuality,
//     };

//       launchImageLibrary(options, (response: ImagePickerResponse) => {
//       logger.log('Image picker response:', response);

//       if (response.didCancel) {
//         logger.log('User cancelled image picker');
//         return;
//       }

//       if (response.errorMessage) {
//         logger.log('Image picker error:', response.errorMessage);
//         setAlertModal({
//           title: 'Error',
//           message: `Image picker error: ${response.errorMessage}`,
//           type: 'error'
//         });
//         return;
//       }

//       if (response.assets && response.assets[0]) {
//         const imageUri = response.assets[0].uri;
//         logger.log('Selected image URI:', imageUri);

//         if (imageUri) {
//           setSelectedImage(imageUri);
//           setFormData(prev => ({ ...prev, profile_image: imageUri }));
//           logger.log('Image selected and state updated');
//         }
//       } else {
//         logger.log('No assets in response');
//         setAlertModal({
//           title: 'Error',
//           message: 'No image selected',
//           type: 'error'
//         });
//       }
//     });
// //     launchImageLibrary(options, (response: ImagePickerResponse) => {
// //       if (response.didCancel) return;

// //       if (response.errorMessage) {
// //         setAlertModal({ title: 'Error', message: response.errorMessage, type: 'error' });
// //         return;
// //       }
// // logger.log('Image picker response:', response);
// //       if (response.assets?.[0]?.uri) {
// //         const uri      = response.assets[0].uri!;
// //         const fileType = uri.split('.').pop()?.toLowerCase() || 'jpg';
// //         const mimeType = fileType === 'jpg' ? 'image/jpeg' : `image/${fileType}`;

// //         const validTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
// //         if (!validTypes.includes(fileType)) {
// //           setAlertModal({ title: 'Error', message: 'Invalid image format. Use JPG, PNG, GIF or WebP.', type: 'error' });
// //           return;
// //         }

// //         setSelectedImage({ uri, name: `profile.${fileType}`, type: mimeType });
// //         logger.log('Image selected:', uri);
// //       }
// //     });
//   };

//   // ── Submit ──────────────────────────────────────────────────────────────────
//   // const handleSubmit = async () => {
//   //   if (!formData.display_name.trim()) {
//   //     setAlertModal({ title: 'Error', message: 'Name is required', type: 'error' });
//   //     return;
//   //   }

//   //   // Phone validation
//   //   if (formData.phone && formData.phone !== originalData.phone) {
//   //     const phoneRegex = /^[+]?[\d\s\-\(\)]+$/;
//   //     if (!phoneRegex.test(formData.phone)) {
//   //       setAlertModal({ title: 'Error', message: 'Please enter a valid phone number', type: 'error' });
//   //       return;
//   //     }
//   //   }

//   //   // Password validation
//   //   if (formData.password.trim() && formData.password.length < 6) {
//   //     setAlertModal({ title: 'Error', message: 'Password must be at least 6 characters', type: 'error' });
//   //     return;
//   //   }

//   //   // Build payload — only changed fields
//   //   // Matches: { display_name, phone, password, image: { uri, name, type } }
//   //   const hasNameChange     = formData.display_name.trim() !== originalData.display_name;
//   //   const hasPhoneChange    = formData.phone !== originalData.phone;
//   //   const hasPasswordChange = !!formData.password.trim();
//   //   const hasImageChange    = !!selectedImage;

//   //   if (!hasNameChange && !hasPhoneChange && !hasPasswordChange && !hasImageChange) {
//   //     setAlertModal({ title: 'Info', message: 'No changes to update', type: 'info' });
//   //     return;
//   //   }

//   //   const payload: {
//   //     display_name?: string;
//   //     phone?:        string;
//   //     password?:     string;
//   //     image?:        { uri: string; name: string; type: string } | null;
//   //   } = {};

//   //   if (hasNameChange)     payload.display_name = formData.display_name.trim();
//   //   if (hasPhoneChange)    payload.phone         = formData.phone;
//   //   if (hasPasswordChange) payload.password      = formData.password.trim();
//   //   if (hasImageChange)    payload.image         = selectedImage;

//   //   logger.log('saveProfile payload:', payload);

//   //   const res = await saveProfile(payload);
//   //  logger.log('=====saveProfile res:>', res);
//   //   if (res?.data.success) {
//   //     if (onUpdate && res?.data) onUpdate(res.data);
//   //     setAlertModal({ title: 'Success', message: res?.message || 'Profile updated successfully', type: 'success' });
//   //     setTimeout(() => navigation.goBack(), 1500);
//   //   }
//   // };

// // Inside your useProfile hook or API service
// const handleSubmit = async () => {
//   try {
//     // 1. Validations
//     if (!formData.display_name.trim()) {
//       setAlertModal({ title: 'Error', message: 'Name is required', type: 'error' });
//       return;
//     }

//     if (formData.phone && formData.phone !== originalData.phone) {
//       const phoneRegex = /^[+]?[\d\s\-\(\)]+$/;
//       if (!phoneRegex.test(formData.phone)) {
//         setAlertModal({ title: 'Error', message: 'Please enter a valid phone number', type: 'error' });
//         return;
//       }
//     }

//     if (formData.password.trim() && formData.password.length < 6) {
//       setAlertModal({ title: 'Error', message: 'Password must be at least 6 characters', type: 'error' });
//       return;
//     }

//     show(); // Show loader

//     // 2. Create Multipart Data
//     const uploadData = new FormData();
//     let hasChanges = false;

//     if (formData.display_name.trim() !== originalData.display_name) {
//       uploadData.append('display_name', formData.display_name.trim());
//       hasChanges = true;
//     }
    
//     if (formData.phone !== originalData.phone) {
//       uploadData.append('phone', formData.phone);
//       hasChanges = true;
//     }

//     if (formData.password.trim()) {
//       uploadData.append('password', formData.password.trim());
//       hasChanges = true;
//     }

//     // 3. Handle Image
//     // if (selectedImage && selectedImage !== originalData.profile_image) {
//     //   if (typeof selectedImage === 'string' && (selectedImage.startsWith('file://') || selectedImage.startsWith('content://'))) {
//     //     const uri = selectedImage;
//     //     const fileType = uri.split('.').pop()?.toLowerCase() || 'jpg';
//     //     const validImageTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

//     //     if (validImageTypes.includes(fileType)) {
//     //       uploadData.append('image', {
//     //         uri: uri,
//     //         type: fileType === 'jpg' ? 'image/jpeg' : `image/${fileType}`,
//     //         name: `profile.${fileType}`,
//     //       } as any);
//     //       hasChanges = true;
//     //     } else {
//     //       setAlertModal({ title: 'Error', message: 'Invalid image format.', type: 'error' });
//     //       hide();
//     //       return;
//     //     }
//     //   } else if (typeof selectedImage === 'string') {
//     //     uploadData.append('image', selectedImage);
//     //     hasChanges = true;
//     //   }
//     // }

//   if (selectedImage && selectedImage !== originalData.profile_image) {
//         if (selectedImage.startsWith('file://') || selectedImage.startsWith('content://')) {
//           // Local file - create file object
//           const uri = selectedImage;
//           const fileType = uri.split('.').pop()?.toLowerCase() || 'jpg';
//           const validImageTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

//           if (validImageTypes.includes(fileType)) {
//             // uploadData.append('image', {
//             //   uri: uri,
//             //   type: "image/jpeg",
//             //   name: `profile.${fileType}`,
//             // } as any);


// const file = {
//   uri: Platform.OS === "android" ? uri : uri.replace("file://", ""),
//   type: `image/${fileType === "jpg" ? "jpeg" : fileType}`,
//   name: `profile.${fileType}`,
// };

// uploadData.append("image", file as any);

//             hasChanges = true;


//             logger.log('Local file - create file object', {
//               uri: uri,
//               type: `image/${fileType}`,
//               name: `profile.${fileType}`,
//             });

//           } else {
//             setAlertModal({ title: 'Error', message: 'Invalid image format. Please select JPG, PNG, GIF, or WebP.', type: 'error' });
//             hide();
//             return;
//           }
//         } else {
//           logger.log('Remote URL - send as string', selectedImage);
//           // Remote URL - send as string
//           uploadData.append('image', selectedImage);
//           hasChanges = true;
//         }
//       }

//     if (!hasChanges) {
//       setAlertModal({ title: 'Info', message: 'No changes detected.', type: 'info' });
//       hide();
//       return;
//     }

//     logger.log('About to make API call with data:', uploadData);
//     // 4. API Call - FIXED FOR ANDROID
// const response = await apiClient.put(ENDPOINTS.RUNNER_AUTH.PROFILE,
//   uploadData,
//   {
//     headers: { 'Content-Type': 'multipart/form-data' },
//    // transformRequest: [(data) => data],  // ← ADD THIS LINE
//   }



// );

//     logger.log('Profile update response:', response.data);

//     if (response?.data?.success || response?.status === 200) {
//       // if (onUpdate && response?.data) {
//       //   onUpdate(response.data);
//       // }
//       setAlertModal({ 
//         title: 'Success', 
//         message: response?.data?.message || 'Profile updated successfully', 
//         type: 'success' 
//       });
//       setTimeout(() => navigation.goBack(), 1500);
//     }
//   } catch (error: any) {
//     logger.error('Update Profile Error:', error);
//     setAlertModal({ 
//       title: 'Error', 
//       message: error.response?.data?.message || 'Network error. Please check your connection.', 
//       type: 'error' 
//     });
//   } finally {
//     hide();
//   }
// };

//   // ── Reset / Back ────────────────────────────────────────────────────────────
//   // const handleClose = () => {
//   //   setFormData({
//   //     display_name: userData.display_name || '',
//   //     email:        userData.email        || '',
//   //     phone:        userData.phone        || '',
//   //     password:     '',
//   //   });
//   //   setSelectedImage(null);
//   //   navigation.goBack();
//   // };
//   const handleClose = () => {
//     setFormData({
//       display_name: userData.display_name || '',
//       email: userData.email || '',
//       profile_image: userData.profile_image || '',
//       phone: userData.phone || '',
//       password: '',
//     });
//     setOriginalData({
//       display_name: userData.display_name || '',
//       email: userData.email || '',
//       profile_image: userData.profile_image || '',
//       phone: userData.phone || '',
//       password: '',
//     });
//     setSelectedImage(userData.profile_image || null);
//     navigation.goBack();
//   };
//   const profileImageUri = selectedImage || userData.profile_image || null;

//   return (
//     <GradientContainer
//       colors={["#FFF7D0", "#A9EFF2"]}
//       style={styles.container}
//       locations={[0, 1]}
//     >
//       <CustomHeader
//         title="Edit Profile"
//         leftComponent={
//           <CustomButton
//             onPress={handleClose}
//             icon={<BackButtonsvg fill="black" />}
//             style={[commonStyle.TopbackButtonStyle, { backgroundColor: Colors.aquablue }]}
//           />
//         }
//       />

//       <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
//         {/* Avatar */}
//         <View style={styles.imageSection}>
//           <View style={styles.imageContainer}>
//             {profileImageUri ? (
//               <Image source={{ uri: profileImageUri }} style={styles.profileImage} />
//             ) : (
//               <View style={styles.placeholderImage}>
//                 <Text style={styles.placeholderText}>
//                   {formData.display_name.charAt(0).toUpperCase()}
//                 </Text>
//               </View>
//             )}
//             <TouchableOpacity onPress={handleImagePicker} style={styles.cameraButton} activeOpacity={0.7}>
//               <Camera size={20} color={Colors.white} />
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* Form */}
//         <View style={styles.formSection}>
//           <CustomTextInput
//             placeholder="Enter your name"
//             value={formData.display_name}
//             onChangeText={(text) => setFormData(prev => ({ ...prev, display_name: text }))}
//             leftIcon={<User size={20} color={Colors.gray} />}
//             showHelper={true}
//             inputWrapperStyle={styles.inputWrapperStyle}
//           />

//           <CustomTextInput
//             placeholder="Enter your email"
//             value={formData.email}
//             editable={false}
//             leftIcon={<Mail size={20} color={Colors.gray} />}
//             showHelper={true}
//             inputWrapperStyle={styles.inputWrapperStyle}
//           />

//           <CustomTextInput
//             placeholder="Enter your phone number"
//             value={formData.phone}
//             onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
//             leftIcon={<Phone size={20} color={Colors.gray} />}
//             keyboardType="phone-pad"
//             showHelper={true}
//             inputWrapperStyle={styles.inputWrapperStyle}
//           />

//           <CustomTextInput
//             placeholder="Enter new password"
//             value={formData.password}
//             onChangeText={(text) => setFormData(prev => ({ ...prev, password: text }))}
//             leftIcon={<Lock size={20} color={Colors.gray} />}
//             isPassword={true}
//             showHelper={true}
//             secureToggle={true}
//             autoCapitalize="none"
//             inputWrapperStyle={styles.inputWrapperStyle}
//           />
//         </View>

//         <CustomButton
//           onPress={handleSubmit}
//           title={isUpdating ? 'Updating...' : 'Update Profile'}
//           disabled={isUpdating}
//           style={{ backgroundColor: Colors.green2, marginTop: vs(50) }}
//         />
//       </ScrollView>

//       <CommonModal
//         visible={!!alertModal}
//         title={alertModal?.title}
//         message={alertModal?.message}
//         primaryText="OK"
//         onPrimaryPress={() => setAlertModal(null)}
//       />
//     </GradientContainer>
//   );
// };

// export default EditProfileScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Colors.white,
//   },
//   content: {
//     flex: 1,
//     paddingHorizontal: wp(5),
//   },
//   imageSection: {
//     alignItems: 'center',
//     paddingVertical: vs(10),
//   },
//   imageContainer: {
//     position: 'relative',
//     marginBottom: vs(15),
//     zIndex: 1,
//   },
//   profileImage: {
//     width: ms(120),
//     height: ms(120),
//     borderRadius: ms(60),
//     backgroundColor: Colors.white,
//   },
//   placeholderImage: {
//     width: ms(120),
//     height: ms(120),
//     borderRadius: ms(60),
//     backgroundColor: Colors.cardbg,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   placeholderText: {
//     fontSize: ms(40),
//     fontWeight: '600',
//     color: Colors.white,
//     fontFamily: Typography.SemiBold.fontFamily,
//   },
//   cameraButton: {
//     position: 'absolute',
//     bottom: 0,
//     right: 0,
//     backgroundColor: Colors.blue,
//     width: ms(36),
//     height: ms(36),
//     borderRadius: ms(18),
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 3,
//     borderColor: Colors.white,
//     zIndex: 10,
//     elevation: 5,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//   },
//   formSection: {
//     paddingTop: vs(20),
//   },
//   inputWrapperStyle: {
//     borderColor: Colors.green2,
//   },
// });

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { launchImageLibrary, ImagePickerResponse, MediaType, PhotoQuality } from 'react-native-image-picker';
import { ms, vs, hp, wp } from '../../utils/responsive';
import Colors from '../../utils/colors';
import { Typography } from '../../utils/typography';
import { User, Mail, Phone, Lock, Camera } from 'lucide-react-native';
import { logger } from '../../utils/logger';
import { apiClient } from '../../api/axios';
import { ENDPOINTS } from '../../api/endpoints';
import { useContext } from 'react';
import CustomHeader from '../../components/common/CustomHeader';
import CustomTextInput from '../inputs/CustomTextInput';
import CommonModal from './CommonModal';
import GradientContainer from '../Gradient/GradientContainer';
import CustomButton from '../Buttons/CustomButton';
import BackButtonsvg from '../../assets/svg/BackButtonsvg';
import { LoaderContext } from '../../context/LoaderContext';
import { getToken } from '../../utils/token';
import axios from 'axios';



interface EditProfileScreenProps {
  onUpdate?: (updatedData: any) => void;
}

const EditProfileScreen: React.FC<EditProfileScreenProps> = ({
  onUpdate,
}) => {
  const route = useRoute();
  const navigation = useNavigation();
  const { userData } = route.params as { userData: any };

  const [formData, setFormData] = useState({
    display_name: userData.display_name || '',
    email: userData.email || '',
    profile_image: userData.profile_image || '',
    phone: userData.phone || '',
    password: '',
  });

  // Track original values to detect changes
  const [originalData, setOriginalData] = useState({
    display_name: userData.display_name || '',
    email: userData.email || '',
    profile_image: userData.profile_image || '',
    phone: userData.phone || '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(userData.profile_image || null);
  const [alertModal, setAlertModal] = useState<{ title: string; message: string; type: 'error' | 'info' | 'success' } | null>(null);
  const { show, hide } = useContext(LoaderContext);


const requestGalleryPermission = async () => {
  if (Platform.OS !== 'android') return true;

  try {
    const permission =
      Platform.Version >= 33
        ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
        : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

    const granted = await PermissionsAndroid.request(permission);

    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    logger.log('Permission error:', err);
    return false;
  }
};
  // ── Image Picker ────────────────────────────────────────────────────────────
  const handleImagePicker = () => {
    const options = {
      mediaType: 'photo' as MediaType,
      includeBase64: false,
      maxHeight: 500,
      maxWidth:  500,
      quality:   0.8 as PhotoQuality,
    };

      launchImageLibrary(options, (response: ImagePickerResponse) => {
      logger.log('Image picker response:', response);

      if (response.didCancel) {
        logger.log('User cancelled image picker');
        return;
      }

      if (response.errorMessage) {
        logger.log('Image picker error:', response.errorMessage);
        setAlertModal({
          title: 'Error',
          message: `Image picker error: ${response.errorMessage}`,
          type: 'error'
        });
        return;
      }

      if (response.assets && response.assets[0]) {
        const imageUri = response.assets[0].uri;
        logger.log('Selected image URI:', imageUri);

        if (imageUri) {
          setSelectedImage(imageUri);
          setFormData(prev => ({ ...prev, profile_image: imageUri }));
          logger.log('Image selected and state updated');
        }
      } else {
        logger.log('No assets in response');
        setAlertModal({
          title: 'Error',
          message: 'No image selected',
          type: 'error'
        });
      }
    });
//     launchImageLibrary(options, (response: ImagePickerResponse) => {
//       if (response.didCancel) return;

//       if (response.errorMessage) {
//         setAlertModal({ title: 'Error', message: response.errorMessage, type: 'error' });
//         return;
//       }
// logger.log('Image picker response:', response);
//       if (response.assets?.[0]?.uri) {
//         const uri      = response.assets[0].uri!;
//         const fileType = uri.split('.').pop()?.toLowerCase() || 'jpg';
//         const mimeType = fileType === 'jpg' ? 'image/jpeg' : `image/${fileType}`;

//         const validTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
//         if (!validTypes.includes(fileType)) {
//           setAlertModal({ title: 'Error', message: 'Invalid image format. Use JPG, PNG, GIF or WebP.', type: 'error' });
//           return;
//         }

//         setSelectedImage({ uri, name: `profile.${fileType}`, type: mimeType });
//         logger.log('Image selected:', uri);
//       }
//     });
  };


const handleSubmit = async () => {
    if (!formData.display_name.trim()) {
      setAlertModal({ title: 'Error', message: 'Name is required', type: 'error' });
      return;
    }
setTimeout(async () => {
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      let hasChanges = false;

      // Only send fields that have changed
      if (formData.display_name.trim() !== originalData.display_name) {
        formDataToSend.append('display_name', formData.display_name.trim());
        hasChanges = true;
      }

      if (formData.phone !== originalData.phone) {
        // Basic phone number validation
        const phoneRegex = /^[+]?[\d\s\-\(\)]+$/;
        if (formData.phone && !phoneRegex.test(formData.phone)) {
          setAlertModal({ title: 'Error', message: 'Please enter a valid phone number', type: 'error' });
          setLoading(false);
          return;
        }
        formDataToSend.append('phone', formData.phone);
        hasChanges = true;
      }

      // Only send password if it's not empty
      if (formData.password.trim()) {
        // Basic password validation
        if (formData.password.length < 6) {
          setAlertModal({ title: 'Error', message: 'Password must be at least 6 characters long', type: 'error' });
          setLoading(false);
          return;
        }
        formDataToSend.append('password', formData.password.trim());
        hasChanges = true;
      }

      // Handle image upload
      // if (selectedImage && selectedImage !== originalData.profile_image) {
      //   if (selectedImage.startsWith('file://') || selectedImage.startsWith('content://')) {
      //     // Local file - create file object
      //     const uri = selectedImage;
      //     const fileType = uri.split('.').pop()?.toLowerCase() || 'jpg';
      //     const validImageTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

      //     if (validImageTypes.includes(fileType)) {
      //       formDataToSend.append('image', {
      //         uri: uri,
      //         //type: `image/${fileType === 'jpg' ? 'jpeg' : fileType}`,
      //         type: `image/jpeg`,
      //         name: `profile.${fileType}`,
      //       } as any);
      //       hasChanges = true;
      //     } else {
      //       setAlertModal({ title: 'Error', message: 'Invalid image format. Please select JPG, PNG, GIF, or WebP.', type: 'error' });
      //       setLoading(false);
      //       return;
      //     }
      //   } else {
      //     logger.log('=====file url=======', selectedImage);
      //     // Remote URL - send as string
      //     formDataToSend.append('image', selectedImage);
      //     hasChanges = true;
      //   }
      // }
// Replace the image handling section in handleSubmit with this:

if (selectedImage && selectedImage !== originalData.profile_image) {
  if (selectedImage.startsWith('file://') || selectedImage.startsWith('content://')) {
   // const uri = selectedImage;
const uri = Platform.OS === 'android' 
  ? selectedImage 
  : selectedImage.replace('file://', '');

    const filename = uri.split('/').pop() || 'profile.jpg';
    const fileType = filename.split('.').pop()?.toLowerCase() || 'jpg';
    const mimeType = 'image/jpeg'; // Always use jpeg for safety

    const validImageTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

    if (!validImageTypes.includes(fileType)) {
      setAlertModal({ 
        title: 'Error', 
        message: 'Invalid image format. Please select JPG, PNG, GIF, or WebP.', 
        type: 'error' 
      });
      setLoading(false);
      return;
    }

    // ✅ CORRECT: This is how React Native expects file objects
    formDataToSend.append('image', {
      uri: uri,
      type: mimeType,
      name: filename,
    });
    hasChanges = true;
    
    logger.log('Image added to FormData:', { uri, mimeType, filename });
  } else {
    // Remote URL - send as string
    formDataToSend.append('image', selectedImage);
    hasChanges = true;
  }
}

      if (!hasChanges) {
        setAlertModal({ title: 'Info', message: 'No changes to update', type: 'info' });
        setLoading(false);
        return;
      }

      show(); // Show loader

      logger.log('Updating profile with form data:', formDataToSend);

//       const response = await apiClient.put(ENDPOINTS.RUNNER_AUTH.PROFILE, formDataToSend,
//        {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       }
// );

// ✅ THIS WILL WORK
const response = await apiClient.put(ENDPOINTS.RUNNER_AUTH.PROFILE, formDataToSend, {
  headers: {
    'Content-Type': 'multipart/form-data',
    // Ensure 'Content-Type' is NOT here. 
    // If it's being added by an interceptor, you might need to delete it:
    // 'Content-Type': null 
  },
  // This tells Axios not to try and serialize the FormData as a string
  transformRequest: [(data) => data], 
});


      // Call onUpdate with the response data to update parent state
      if (onUpdate && response.data) {
        onUpdate(response.data);
      }

      hide(); // Hide loader
      setAlertModal({ title: 'Success', message: 'Profile updated successfully', type: 'success' });
      setTimeout(() => {
        navigation.goBack();
      }, 1500); 
      
    
      // Auto close after 1.5 seconds
    } catch (error: any) {
      hide(); // Hide loader on error
      logger.error('Error updating profile:', error);

      // Extract more detailed error information
      let errorMessage = 'Failed to update profile';
      if (error.response) {
        // Server responded with error status
        errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
        logger.error('API Error Response:', error.response.data);
      } else if (error.request) {
        // Network error
        errorMessage = 'Network error. Please check your connection.';
        logger.error('Network Error:', error.request);
      } else {
        // Other error
        errorMessage = error.message || 'An unexpected error occurred';
        logger.error('Other Error:', error.message);
      }

      setAlertModal({ title: 'Error', message: errorMessage, type: 'error' });
    } finally {
      setLoading(false);
    }
      }, 500);
  };


  // const handleSubmit = async () => {
  //   if (!formData.display_name.trim()) {
  //     setAlertModal({ title: 'Error', message: 'Name is required', type: 'error' });
  //     return;
  //   }

  //   setLoading(true);
  //   try {
  //     const formDataToSend = new FormData();
  //     let hasChanges = false;

  //     // Only send fields that have changed
  //     if (formData.display_name.trim() !== originalData.display_name) {
  //       formDataToSend.append('display_name', formData.display_name.trim());
  //       hasChanges = true;
  //     }

  //     if (formData.phone !== originalData.phone) {
  //       // Basic phone number validation
  //       const phoneRegex = /^[+]?[\d\s\-\(\)]+$/;
  //       if (formData.phone && !phoneRegex.test(formData.phone)) {
  //         setAlertModal({ title: 'Error', message: 'Please enter a valid phone number', type: 'error' });
  //         setLoading(false);
  //         return;
  //       }
  //       formDataToSend.append('phone', formData.phone);
  //       hasChanges = true;
  //     }

  //     // Only send password if it's not empty
  //     if (formData.password.trim()) {
  //       // Basic password validation
  //       if (formData.password.length < 6) {
  //         setAlertModal({ title: 'Error', message: 'Password must be at least 6 characters long', type: 'error' });
  //         setLoading(false);
  //         return;
  //       }
  //       formDataToSend.append('password', formData.password.trim());
  //       hasChanges = true;
  //     }

  //     // Handle image upload
  //     if (selectedImage && selectedImage !== originalData.profile_image) {
  //       if (selectedImage.startsWith('file://') || selectedImage.startsWith('content://')) {
  //         // Local file - create file object
  //         const uri = selectedImage;
  //         const fileType = uri.split('.').pop()?.toLowerCase() || 'jpg';
  //         const validImageTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

  //         if (validImageTypes.includes(fileType)) {
  //           formDataToSend.append('image', {
  //             uri: uri,
  //             type: `image/jpeg`,
  //             name: `profile.${fileType}`,
  //           } as any);
  //           hasChanges = true;
  //         } else {
  //           setAlertModal({ title: 'Error', message: 'Invalid image format. Please select JPG, PNG, GIF, or WebP.', type: 'error' });
  //           setLoading(false);
  //           return;
  //         }
  //       } else {
  //         logger.log('=====file url=======',selectedImage)
  //         // Remote URL - send as string
  //         formDataToSend.append('image', selectedImage);
  //         hasChanges = true;
  //       }
  //     }

  //     if (!hasChanges) {
  //       setAlertModal({ title: 'Info', message: 'No changes to update', type: 'info' });
  //       setLoading(false);
  //       return;
  //     }

  //     show(); // Show loader

  //     logger.log('Updating profile with form data:', formDataToSend);

  //     const response = await apiClient.put(ENDPOINTS.RUNNER_AUTH.PROFILE, formDataToSend, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       },
  //     });

  //     logger.log('Profile update response:', response.data);

  //     // Call onUpdate with the response data to update parent state
  //     if (onUpdate && response.data) {
  //       onUpdate(response.data);
  //     }

  //     hide(); // Hide loader
  //     setAlertModal({ title: 'Success', message: 'Profile updated successfully', type: 'success' });
  //     setTimeout(() => {
  //       navigation.goBack();
  //     }, 1500); // Auto close after 1.5 seconds
  //   } catch (error: any) {
  //     hide(); // Hide loader on error
  //     logger.error('Error updating profile:', error);

  //     // Extract more detailed error information
  //     let errorMessage = 'Failed to update profile';
  //     if (error.response) {
  //       // Server responded with error status
  //       errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
  //       logger.error('API Error Response:', error.response.data);
  //     } else if (error.request) {
  //       // Network error
  //       errorMessage = 'Network error. Please check your connection.';
  //       logger.error('Network Error:', error.request);
  //     } else {
  //       // Other error
  //       errorMessage = error.message || 'An unexpected error occurred';
  //       logger.error('Other Error:', error.message);
  //     }

  //     setAlertModal({ title: 'Error', message: errorMessage, type: 'error' });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleClose = () => {
    setFormData({
      display_name: userData.display_name || '',
      email: userData.email || '',
      profile_image: userData.profile_image || '',
      phone: userData.phone || '',
      password: '',
    });
    setOriginalData({
      display_name: userData.display_name || '',
      email: userData.email || '',
      profile_image: userData.profile_image || '',
      phone: userData.phone || '',
      password: '',
    });
    setSelectedImage(userData.profile_image || null);
    navigation.goBack();
  };

  // Update original data when userData changes (when modal opens)
  useEffect(() => {
    const newOriginalData = {
      display_name: userData.display_name || '',
      email: userData.email || '',
      profile_image: userData.profile_image || '',
      phone: userData.phone || '',
      password: '',
    };
    setOriginalData(newOriginalData);
    setFormData(newOriginalData);
    setSelectedImage(userData.profile_image || null);
  }, [userData]);

  return (
    <GradientContainer
      colors={["#FFF7D0", "#A9EFF2"]}
      style={styles.container}
      locations={[0, 1]}
    >
      <CustomHeader
        title="Edit Profile"
        leftComponent={
          <CustomButton
            onPress={() => navigation.goBack()}
            icon={<BackButtonsvg fill="black" />}
            style={[styles.TopbackButtonStyle, { backgroundColor: Colors.aquablue }]}
          />

        }

      />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}
        automaticallyAdjustKeyboardInsets
      >
        <View style={styles.imageSection}>
          <View style={styles.imageContainer}>
            {selectedImage ? (
              <Image source={{ uri: selectedImage }} style={styles.profileImage} />
            ) : (
              <View style={styles.placeholderImage}>
                <Text style={styles.placeholderText}>
                  {formData.display_name.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
            <TouchableOpacity
              onPress={handleImagePicker}
              style={styles.cameraButton}
              activeOpacity={0.7}
            >
              <Camera size={20} color={Colors.white} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.formSection}>
          <CustomTextInput
            //label="Name"
            placeholder="Enter your name"
            value={formData.display_name}
            onChangeText={(text) => setFormData(prev => ({ ...prev, display_name: text }))}
            leftIcon={<User size={20} color={Colors.gray} />}
            showHelper={true}
            inputWrapperStyle={styles.inputWrapperStyle}
          />

          <CustomTextInput
            //label="Email"
            placeholder="Enter your email"
            value={formData.email}
            editable={false}
            leftIcon={<Mail size={20} color={Colors.gray} />}
            showHelper={true}
            inputWrapperStyle={styles.inputWrapperStyle}
          />

          <CustomTextInput
            //label="Phone Number"
            placeholder="Enter your phone number"
            value={formData.phone}
            onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
            leftIcon={<Phone size={20} color={Colors.gray} />}
            keyboardType="phone-pad"
            showHelper={true}
            inputWrapperStyle={styles.inputWrapperStyle}
          />

          <CustomTextInput
            // label="New Password (Optional)"
            placeholder="Enter new password"
            value={formData.password}
            onChangeText={(text) => setFormData(prev => ({ ...prev, password: text }))}
            leftIcon={<Lock size={20} color={Colors.gray} />}
            isPassword={true}
            showHelper={true}
            secureToggle={true}
            autoCapitalize="none"
            inputWrapperStyle={styles.inputWrapperStyle}
          />
        </View>
        <CustomButton
          onPress={handleSubmit}
          title='Update profile'
          style={{ backgroundColor: Colors.green2, marginTop: vs(50) }}

        />
      </ScrollView>

      {/* Alert Modal */}
      <CommonModal
        visible={!!alertModal}
        title={alertModal?.title}
        message={alertModal?.message}
        primaryText="OK"
        onPrimaryPress={() => setAlertModal(null)}
      />
    </GradientContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    // height:hp(40)
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(5),
    paddingVertical: vs(15),
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderColor,
  },
  title: {
    fontSize: ms(18),
    fontWeight: '600',
    color: Colors.black,
    fontFamily: Typography.SemiBold.fontFamily,
  },
  cancelButton: {
    paddingVertical: vs(5),
  },
  cancelText: {
    fontSize: ms(16),
    color: Colors.gray,
    fontFamily: Typography.Medium.fontFamily,
  },
  saveButton: {
    paddingVertical: vs(5),
  },
  saveText: {
    fontSize: ms(16),
    color: Colors.blue,
    fontWeight: '600',
    fontFamily: Typography.SemiBold.fontFamily,
  },
  saveTextDisabled: {
    color: Colors.gray,
  },
  content: {
    flex: 1,
    paddingHorizontal: wp(5),
  },
  TopbackButtonStyle:{
 width: ms(45),
        height: ms(45),
        borderRadius: ms(12),
        alignItems: "center",
        justifyContent: "center",
  },
  imageSection: {
    alignItems: 'center',
    paddingVertical: vs(10),
  },
  imageContainer: {
    position: 'relative',
    marginBottom: vs(15),
    zIndex: 1,
  },
  profileImage: {
    width: ms(120),
    height: ms(120),
    borderRadius: ms(60),
    backgroundColor: Colors.gray,
  },
  placeholderImage: {
    width: ms(120),
    height: ms(120),
    borderRadius: ms(60),
    backgroundColor: Colors.cardbg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: ms(40),
    fontWeight: '600',
    color: Colors.white,
    fontFamily: Typography.SemiBold.fontFamily,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.blue,
    width: ms(36),
    height: ms(36),
    borderRadius: ms(18),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.white,
    zIndex: 10,
    elevation: 5, // For Android
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cameraButtonText: {
    fontSize: ms(16),
  },
  changePhotoButton: {
    paddingVertical: vs(8),
    paddingHorizontal: wp(20),
    backgroundColor: Colors.cardbg,
    borderRadius: ms(20),
    elevation: 2, // For Android
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  changePhotoText: {
    fontSize: ms(14),
    color: Colors.blue,
    fontWeight: '500',
    fontFamily: Typography.Medium.fontFamily,
  },
  formSection: {
    paddingTop: vs(20),
  },
  inputGroup: {
    marginBottom: vs(20),
  },
  label: {
    fontSize: ms(16),
    fontWeight: '500',
    color: Colors.black,
    marginBottom: vs(8),
    fontFamily: Typography.Medium.fontFamily,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderColor,
    borderRadius: ms(12),
    backgroundColor: Colors.white,
  },
  inputIcon: {
    marginLeft: wp(15),
  },
  inputWithIcon: {
    flex: 1,
    paddingHorizontal: wp(15),
    paddingVertical: vs(12),
    fontSize: ms(16),
    color: Colors.black,
    fontFamily: Typography.Regular.fontFamily,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.borderColor,
    borderRadius: ms(12),
    paddingHorizontal: wp(15),
    paddingVertical: vs(12),
    fontSize: ms(16),
    color: Colors.black,
    backgroundColor: Colors.white,
    fontFamily: Typography.Regular.fontFamily,
  },
  disabledInput: {
    backgroundColor: Colors.cardbg,
    color: Colors.gray,
  },
  inputWrapperStyle: {
    borderColor: Colors.green2,
  }
});

export default EditProfileScreen;