import React, { useState } from "react";
import { Platform } from "react-native";
import { request, check, PERMISSIONS, RESULTS } from "react-native-permissions";
import PermissionModal from "./modals/PermissionModal";


const PermissionHandler = () => {
  const [modalVisible, setModalVisible] = useState(true);

  const checkPermission = async () => {
    const permission = Platform.OS === "ios"
      ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
      : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

    const status = await check(permission);

    if (status !== RESULTS.GRANTED) {
      // Show custom modal only if permission is not granted
      setModalVisible(true);
    } else {
      console.log("Permission already granted");
    }
  };

  const requestPermission = async () => {
    const permission = Platform.OS === "ios"
      ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
      : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

    const result = await request(permission); // System popup triggers here
    console.log("Permission result:", result);

    setModalVisible(false);
  };

  return (
    <>
      <PermissionModal
        visible={modalVisible}
        title="Location Permission"
        description="We need access to your location to show nearby places."
        buttonText="Allow"
        onPressButton={requestPermission}
        onClose={() => setModalVisible(false)}
      />
      {/* Somewhere in your app, call checkPermission() to trigger the modal */}
    </>
  );
};

export default PermissionHandler;
