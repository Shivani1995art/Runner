import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { launchImageLibrary, ImagePickerResponse, MediaType, PhotoQuality } from 'react-native-image-picker';
import { ms, vs, hp, wp } from '../../utils/responsive';
import Colors from '../../utils/colors';
import { Typography } from '../../utils/typography';
import { User, Mail, Phone, Lock, Camera } from 'lucide-react-native';
import { logger } from '../../utils/logger';
import GradientContainer from '../Gradient/GradientContainer';
import CustomHeader from '../common/CustomHeader';
import CustomButton from '../Buttons/CustomButton';
import BackButtonsvg from '../../assets/svg/BackButtonsvg';
import { commonStyle } from '../../styles/CommonStyles';
import CustomTextInput from '../inputs/CustomTextInput';
import CommonModal from './CommonModal';
import { useProfile } from '../../hooks/useProfile';
import { apiClient } from '../../api/axios';
import { ENDPOINTS } from '../../api/endpoints';
import { LoaderContext } from '../../context/LoaderContext';

interface EditProfileScreenProps {
  onUpdate?: (updatedData: any) => void;
}

const EditProfileScreen: React.FC<EditProfileScreenProps> = ({ onUpdate }) => {
  const route = useRoute();
    const { show, hide }  = useContext(LoaderContext);
  const navigation = useNavigation();
  const { userData } = route.params as { userData: any };
  const { saveProfile, isUpdating } = useProfile();

  const [formData, setFormData] = useState({
    display_name: userData.display_name || '',
    email:        userData.email        || '',
    phone:        userData.phone        || '',
    password:     '',
  });

  const [originalData, setOriginalData] = useState({
    display_name:  userData.display_name  || '',
    email:         userData.email         || '',
    phone:         userData.phone         || '',
    profile_image: userData.profile_image || '',
  });

  const [selectedImage, setSelectedImage] = useState<string | null>(userData.profile_image || null);

  const [alertModal, setAlertModal] = useState<{
    title:   string;
    message: string;
    type:    'error' | 'info' | 'success';
  } | null>(null);

  // Sync when userData changes
  useEffect(() => {
    setOriginalData({
      display_name:  userData.display_name  || '',
      email:         userData.email         || '',
      phone:         userData.phone         || '',
      profile_image: userData.profile_image || '',
    });
    setFormData({
      display_name: userData.display_name || '',
      email:        userData.email        || '',
      phone:        userData.phone        || '',
      password:     '',
    });
    setSelectedImage(null);
  }, [userData]);

  // ── Image Picker ────────────────────────────────────────────────────────────
  const handleImagePicker = () => {
    const options = {
      mediaType: 'photo' as MediaType,
      includeBase64: false,
      maxHeight: 2000,
      maxWidth:  2000,
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

  // ── Submit ──────────────────────────────────────────────────────────────────
  // const handleSubmit = async () => {
  //   if (!formData.display_name.trim()) {
  //     setAlertModal({ title: 'Error', message: 'Name is required', type: 'error' });
  //     return;
  //   }

  //   // Phone validation
  //   if (formData.phone && formData.phone !== originalData.phone) {
  //     const phoneRegex = /^[+]?[\d\s\-\(\)]+$/;
  //     if (!phoneRegex.test(formData.phone)) {
  //       setAlertModal({ title: 'Error', message: 'Please enter a valid phone number', type: 'error' });
  //       return;
  //     }
  //   }

  //   // Password validation
  //   if (formData.password.trim() && formData.password.length < 6) {
  //     setAlertModal({ title: 'Error', message: 'Password must be at least 6 characters', type: 'error' });
  //     return;
  //   }

  //   // Build payload — only changed fields
  //   // Matches: { display_name, phone, password, image: { uri, name, type } }
  //   const hasNameChange     = formData.display_name.trim() !== originalData.display_name;
  //   const hasPhoneChange    = formData.phone !== originalData.phone;
  //   const hasPasswordChange = !!formData.password.trim();
  //   const hasImageChange    = !!selectedImage;

  //   if (!hasNameChange && !hasPhoneChange && !hasPasswordChange && !hasImageChange) {
  //     setAlertModal({ title: 'Info', message: 'No changes to update', type: 'info' });
  //     return;
  //   }

  //   const payload: {
  //     display_name?: string;
  //     phone?:        string;
  //     password?:     string;
  //     image?:        { uri: string; name: string; type: string } | null;
  //   } = {};

  //   if (hasNameChange)     payload.display_name = formData.display_name.trim();
  //   if (hasPhoneChange)    payload.phone         = formData.phone;
  //   if (hasPasswordChange) payload.password      = formData.password.trim();
  //   if (hasImageChange)    payload.image         = selectedImage;

  //   logger.log('saveProfile payload:', payload);

  //   const res = await saveProfile(payload);
  //  logger.log('=====saveProfile res:>', res);
  //   if (res?.data.success) {
  //     if (onUpdate && res?.data) onUpdate(res.data);
  //     setAlertModal({ title: 'Success', message: res?.message || 'Profile updated successfully', type: 'success' });
  //     setTimeout(() => navigation.goBack(), 1500);
  //   }
  // };

// Inside your useProfile hook or API service
const handleSubmit = async () => {
  try {
    // 1. Validations
    if (!formData.display_name.trim()) {
      setAlertModal({ title: 'Error', message: 'Name is required', type: 'error' });
      return;
    }

    if (formData.phone && formData.phone !== originalData.phone) {
      const phoneRegex = /^[+]?[\d\s\-\(\)]+$/;
      if (!phoneRegex.test(formData.phone)) {
        setAlertModal({ title: 'Error', message: 'Please enter a valid phone number', type: 'error' });
        return;
      }
    }

    if (formData.password.trim() && formData.password.length < 6) {
      setAlertModal({ title: 'Error', message: 'Password must be at least 6 characters', type: 'error' });
      return;
    }

    show(); // Show loader

    // 2. Create Multipart Data
    const uploadData = new FormData();
    let hasChanges = false;

    if (formData.display_name.trim() !== originalData.display_name) {
      uploadData.append('display_name', formData.display_name.trim());
      hasChanges = true;
    }
    
    if (formData.phone !== originalData.phone) {
      uploadData.append('phone', formData.phone);
      hasChanges = true;
    }

    if (formData.password.trim()) {
      uploadData.append('password', formData.password.trim());
      hasChanges = true;
    }

    // 3. Handle Image
    if (selectedImage && selectedImage !== originalData.profile_image) {
      if (typeof selectedImage === 'string' && (selectedImage.startsWith('file://') || selectedImage.startsWith('content://'))) {
        const uri = selectedImage;
        const fileType = uri.split('.').pop()?.toLowerCase() || 'jpg';
        const validImageTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

        if (validImageTypes.includes(fileType)) {
          uploadData.append('image', {
            uri: uri,
            type: fileType === 'jpg' ? 'image/jpeg' : `image/${fileType}`,
            name: `profile.${fileType}`,
          } as any);
          hasChanges = true;
        } else {
          setAlertModal({ title: 'Error', message: 'Invalid image format.', type: 'error' });
          hide();
          return;
        }
      } else if (typeof selectedImage === 'string') {
        uploadData.append('image', selectedImage);
        hasChanges = true;
      }
    }

    if (!hasChanges) {
      setAlertModal({ title: 'Info', message: 'No changes detected.', type: 'info' });
      hide();
      return;
    }

    // 4. API Call - FIXED FOR ANDROID
    const response = await apiClient.put('/api/runner/auth/profile', uploadData, {
      headers: {
          'Content-Type': 'multipart/form-data',
        },
      // THIS IS THE CRITICAL FIX:
      // Prevent Axios from converting FormData into a plain object
      // transformRequest: (data) => {
      //   return data; 
      // },
    });

    logger.log('Profile update response:', response.data);

    if (response?.data?.success || response?.status === 200) {
      if (onUpdate && response?.data) {
        onUpdate(response.data);
      }
      setAlertModal({ 
        title: 'Success', 
        message: response?.data?.message || 'Profile updated successfully', 
        type: 'success' 
      });
      setTimeout(() => navigation.goBack(), 1500);
    }
  } catch (error: any) {
    logger.error('Update Profile Error:', error);
    setAlertModal({ 
      title: 'Error', 
      message: error.response?.data?.message || 'Network error. Please check your connection.', 
      type: 'error' 
    });
  } finally {
    hide();
  }
};

  // ── Reset / Back ────────────────────────────────────────────────────────────
  const handleClose = () => {
    setFormData({
      display_name: userData.display_name || '',
      email:        userData.email        || '',
      phone:        userData.phone        || '',
      password:     '',
    });
    setSelectedImage(null);
    navigation.goBack();
  };

  const profileImageUri = selectedImage?.uri || userData.profile_image || null;

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
            onPress={handleClose}
            icon={<BackButtonsvg fill="black" />}
            style={[commonStyle.TopbackButtonStyle, { backgroundColor: Colors.aquablue }]}
          />
        }
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Avatar */}
        <View style={styles.imageSection}>
          <View style={styles.imageContainer}>
            {profileImageUri ? (
              <Image source={{ uri: profileImageUri }} style={styles.profileImage} />
            ) : (
              <View style={styles.placeholderImage}>
                <Text style={styles.placeholderText}>
                  {formData.display_name.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
            <TouchableOpacity onPress={handleImagePicker} style={styles.cameraButton} activeOpacity={0.7}>
              <Camera size={20} color={Colors.white} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Form */}
        <View style={styles.formSection}>
          <CustomTextInput
            placeholder="Enter your name"
            value={formData.display_name}
            onChangeText={(text) => setFormData(prev => ({ ...prev, display_name: text }))}
            leftIcon={<User size={20} color={Colors.gray} />}
            showHelper={true}
            inputWrapperStyle={styles.inputWrapperStyle}
          />

          <CustomTextInput
            placeholder="Enter your email"
            value={formData.email}
            editable={false}
            leftIcon={<Mail size={20} color={Colors.gray} />}
            showHelper={true}
            inputWrapperStyle={styles.inputWrapperStyle}
          />

          <CustomTextInput
            placeholder="Enter your phone number"
            value={formData.phone}
            onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
            leftIcon={<Phone size={20} color={Colors.gray} />}
            keyboardType="phone-pad"
            showHelper={true}
            inputWrapperStyle={styles.inputWrapperStyle}
          />

          <CustomTextInput
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
          title={isUpdating ? 'Updating...' : 'Update Profile'}
          disabled={isUpdating}
          style={{ backgroundColor: Colors.green2, marginTop: vs(50) }}
        />
      </ScrollView>

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

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: wp(5),
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
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  formSection: {
    paddingTop: vs(20),
  },
  inputWrapperStyle: {
    borderColor: Colors.green2,
  },
});