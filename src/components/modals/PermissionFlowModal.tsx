import React, { useEffect, useState, useRef } from 'react';
import { useAppPermissions } from '../../hooks/useAppPermissions';
import PermissionModal from './PermissionModal';
import Notificationreqsvg from '../../assets/svg/Notificationreqsvg';
import LocationPermissionsvg from '../../assets/svg/LocationPermissionsvg';
import { Alert, AppState, Linking, Platform } from 'react-native';
import { logger } from '../../utils/logger';
import { getToken } from '../../utils/token';


const PermissionFlowModal = ({ visible, onComplete }:any) => {

    const {
        checkNotificationPermission,
        checkLocationPermission,
        requestNotificationPermission,
        requestLocationPermission,
        isLocationEnabled
    } = useAppPermissions();

    const [step, setStep] = useState<null | 'notification' | 'location'>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const appState = useRef(AppState.currentState);
    const hasInitialized = useRef(false);

  
 
    useEffect(() => {
        const fetchToken = async () => {
            const token = await getToken()
            logger.log("token in permission modal==>", token)
        }
        fetchToken()
    }, [])
    // Initial permission check when modal becomes visible
    useEffect(() => {
        if (!visible) {
            setStep(null);
            setIsProcessing(false);
            hasInitialized.current = false;
            return;
        }

        if (hasInitialized.current) return;
        hasInitialized.current = true;

        (async () => {
            const hasNotification = await checkNotificationPermission();
            const hasLocation = await checkLocationPermission();

            // Location is MANDATORY, notification is optional
            if (!hasLocation) {
                setStep('location');
            } else if (!hasNotification) {
                setStep('notification');
            } else {
                // Both permissions granted, complete immediately
                onComplete?.();
            }
        })();
    }, [visible]);

    // Handle app state changes (when user returns from Settings)
    useEffect(() => {
        const subscription = AppState.addEventListener('change', async (nextAppState) => {
            // User returned from background (Settings) to active
            if (
                appState.current.match(/inactive|background/) &&
                nextAppState === 'active' &&
                visible &&
                !isProcessing
            ) {
                setIsProcessing(true);
                const hasNotification = await checkNotificationPermission();
                const hasLocation = await checkLocationPermission();

                // Location is MANDATORY, notification is optional
                if (hasLocation && hasNotification) {
                    // Both permissions granted, close modal and navigate
                    setStep(null);
                    setTimeout(() => {
                        onComplete?.();
                    }, 100);
                } else if (!hasLocation) {
                    // Still need location (priority)
                    setStep('location');
                } else if (hasLocation && !hasNotification) {
                    // Location granted, need notification
                    setStep('notification');
                } else {
                    // Both denied, prioritize location
                    setStep('location');
                }

                setIsProcessing(false);
            }

            appState.current = nextAppState;
        });

        return () => {
            subscription.remove();
        };
    }, [visible, step, isProcessing]);
    const promptEnableGPS = () => {
        Alert.alert(
            'Location Services Disabled',
            'Please enable location services in your device settings to continue.',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Open Settings',
                    onPress: () => {
                        if (Platform.OS === 'android') {
                            Linking.sendIntent('android.settings.LOCATION_SOURCE_SETTINGS');
                        } else {
                            Linking.openURL('app-settings:');
                        }
                    },
                },
            ]
        );
    };
    const checkGPSEnabled = async () => {
        if (Platform.OS === 'android') {
            // Check if location services are enabled
            const isEnabled = await isLocationEnabled?.();
            return isEnabled;
        }
        return true; // iOS handles this differently
    };
    const handleNext = async () => {
        if (isProcessing) return;
        setIsProcessing(true);

        try {
            if (step === 'location') {
                // Location is MANDATORY - handle it
                const granted = await requestLocationPermission();
                logger.log("location granted==>",granted);

                if (granted) {
                    const gpsEnabled = await checkGPSEnabled();
                    logger.log("gps enabled==>",gpsEnabled);
                    if (!gpsEnabled) {
                        promptEnableGPS();
                        setIsProcessing(false);
                        return;
                    }
                    // Location granted, check if notification is needed
                    const hasNotification = await checkNotificationPermission();
                    if (hasNotification) {
                        // Both granted, complete flow
                        setStep(null);
                        setTimeout(() => onComplete?.(), 100);
                    } else {
                        // Move to notification step (optional)
                        setStep('notification');
                    }
                } else {
                    // Location denied, stay on location step
                    setStep('location');
                }
            } else if (step === 'notification') {
                // Notification is OPTIONAL - accept whatever user chooses
                await requestNotificationPermission();
                
                // Regardless of notification choice, check location and complete
                const hasLocation = await checkLocationPermission();
                if (hasLocation) {
                    // Location granted, complete flow (notification choice doesn't matter)
                    setStep(null);
                    setTimeout(() => {
                        onComplete?.();
                    }, 100);
                } else {
                    // Location not granted, go to location step
                    setStep('location');
                }
            }
        } finally {
            setIsProcessing(false);
        }
    };

    if (!visible || !step) return null;

    return (
        <PermissionModal
            visible
            imageComponent={
                step === 'notification'
                    ? <Notificationreqsvg />
                    : <LocationPermissionsvg />
            }
            title={step === 'notification' ? 'Allow notifications!' : 'Allow location!'}
            description={
                step === 'notification'
                    ? 'To enjoy seamless updates and order notifications'
                    : 'Enable location to help us find nearby cabanas'
            }
            buttonText={
                step === 'notification' ? 'Allow Notification' : 'Allow Location'
            }
            onPressButton={handleNext}
        />
    );
};

export default PermissionFlowModal;