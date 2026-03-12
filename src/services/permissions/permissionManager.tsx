/**
 * ═══════════════════════════════════════════════════════════════════════════
 * PERMISSIONS MANAGER
 * 
 * Centralized permission management with denial tracking and smart flows
 * Handles: Location, Location Services, Notifications
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { Platform, Alert } from 'react-native';
import { openSettings } from 'react-native-permissions';
import { logger } from '../../utils/logger';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export type PermissionType = 'location' | 'notification' | 'locationServices';
export type PermissionStatus = 'OK' | 'NO_PERMISSION' | 'SERVICES_DISABLED' | 'NOTIF_DENIED' | 'UNKNOWN';

export interface PermissionConfig {
  title: string;
  description: string;
  buttonText: string;
}

interface PermissionDenialCounts {
  location: number;
  notification: number;
  locationServices: number;
}

interface PermissionFunctions {
  checkLocationPermission: () => Promise<boolean>;
  checkNotificationPermission: () => Promise<boolean>;
  isLocationEnabled: () => Promise<boolean>;
  requestLocationPermission: () => Promise<boolean>;
  requestNotificationPermission: () => Promise<boolean>;
  requestLocationServices: () => Promise<boolean>;
}

// ─────────────────────────────────────────────────────────────────────────────
// PERMISSION MANAGER CLASS
// ─────────────────────────────────────────────────────────────────────────────

class PermissionsManager {
  private denialCounts: PermissionDenialCounts = {
    location: 0,
    notification: 0,
    locationServices: 0,
  };

  private permissionFunctions: PermissionFunctions | null = null;
  private readonly DENIAL_THRESHOLD = 2; // After 2 denials, force settings

  /**
   * Initialize with permission checking functions from hooks
   */
  public initialize(functions: PermissionFunctions): void {
    this.permissionFunctions = functions;
    logger.log('✅ PermissionsManager initialized');
  }

  /**
   * Check all permissions in sequence
   * Returns the first failed permission type, or 'OK' if all pass
   */
  public async checkAllPermissions(): Promise<PermissionStatus> {
    if (!this.permissionFunctions) {
      logger.error('❌ PermissionsManager not initialized');
      return 'UNKNOWN';
    }

    try {
      logger.log('🔐 Checking all permissions...');

      // Check location permission
      const hasLocationPerm = await this.permissionFunctions.checkLocationPermission();
      if (!hasLocationPerm) {
        logger.log('❌ Location permission NOT granted');
        return 'NO_PERMISSION';
      }

      // Check location services
      const gpsEnabled = await this.permissionFunctions.isLocationEnabled();
      if (!gpsEnabled) {
        logger.log('❌ GPS services disabled');
        return 'SERVICES_DISABLED';
      }

      // Check notification permission
      const hasNotification = await this.permissionFunctions.checkNotificationPermission();
      if (!hasNotification) {
        logger.log('❌ Notifications NOT granted');
        return 'NOTIF_DENIED';
      }

      logger.log('✅ All permissions OK');
      return 'OK';
    } catch (error) {
      logger.error('❌ Permission check error:', error);
      return 'UNKNOWN';
    }
  }

  /**
   * Get modal config based on permission status
   */
  public getModalConfig(status: PermissionStatus): PermissionConfig {
    logger.log('🔍 Getting modal config for status:', status);

    const configs: Record<PermissionStatus, PermissionConfig> = {
      OK: {
        title: '✅ All Good',
        description: 'All permissions are enabled.',
        buttonText: 'Continue',
      },
      NO_PERMISSION: {
        title: '⚠️ Location Permission Required',
        description:
          Platform.OS === 'ios'
            ? 'Please enable Location Services in Settings > Privacy & Security > Location Services\n\nLocation is MANDATORY to access runner functionality.'
            : 'Please enable Location Services in your device settings.\n\nLocation is MANDATORY to use this app.',
        buttonText: 'Grant Permission',
      },
      SERVICES_DISABLED: {
        title: '📍 Enable Location Services',
        description: 'We need location services enabled to track deliveries and find nearby orders.\n\nThis is MANDATORY for the app to work.',
        buttonText: 'Enable Location',
      },
      NOTIF_DENIED: {
        title: '🔔 Notifications Required',
        description: 'To receive new order alerts and updates, notifications must be enabled.\n\nThis is MANDATORY for runners.',
        buttonText: 'Enable Notifications',
      },
      UNKNOWN: {
        title: '⚠️ Permission Check Failed',
        description: 'Unable to check permissions. Please try again.',
        buttonText: 'Retry',
      },
    };

    return configs[status];
  }

  /**
   * Handle permission request with denial tracking
   * Automatically opens settings after threshold is reached
   */
  public async requestPermission(
    permissionType: PermissionType
  ): Promise<boolean> {
    if (!this.permissionFunctions) {
      logger.error('❌ PermissionsManager not initialized');
      return false;
    }

    logger.log(`🔐 Requesting ${permissionType} permission...`);

    let result = false;

    try {
      switch (permissionType) {
        case 'location':
          result = await this.permissionFunctions.requestLocationPermission();
          break;
        case 'notification':
          result = await this.permissionFunctions.requestNotificationPermission();
          break;
        case 'locationServices':
          result = await this.permissionFunctions.requestLocationServices();
          break;
      }

      if (!result) {
        this.handleDenial(permissionType);
      } else {
        // Reset denial count on success
        this.denialCounts[permissionType] = 0;
        logger.log(`✅ ${permissionType} permission granted`);
      }
    } catch (error) {
      logger.error(`❌ Error requesting ${permissionType}:`, error);
    }

    return result;
  }

  /**
   * Handle permission denial with smart alert logic
   */
  private handleDenial(permissionType: PermissionType): void {
    this.denialCounts[permissionType]++;
    const count = this.denialCounts[permissionType];

    logger.log(
      `❌ ${permissionType} denied (attempt ${count}/${this.DENIAL_THRESHOLD})`
    );

    // Only show alert after threshold
    if (count >= this.DENIAL_THRESHOLD) {
      this.showForcedSettingsAlert(permissionType);
    }
  }

  /**
   * Show alert before forcing settings open
   */
  private showForcedSettingsAlert(permissionType: PermissionType): void {
    const alerts: Record<PermissionType, { title: string; message: string }> = {
      location: {
        title: '⚠️ Location Permission Required',
        message:
          'Location permission is mandatory to use this app. Please enable it in your device settings.',
      },
      notification: {
        title: '🔔 Notifications Required',
        message:
          'Notifications are mandatory for runners to receive order alerts. Please enable them in your device settings.',
      },
      locationServices: {
        title: '📍 Location Services Required',
        message:
          'Location services are mandatory for the app to work properly. Please enable them in your device settings.',
      },
    };

    const { title, message } = alerts[permissionType];

    logger.log(`⚠️ Showing forced settings alert for ${permissionType}`);

    Alert.alert(title, message, [
      {
        text: 'Cancel',
        onPress: () =>
          logger.log(`User dismissed ${permissionType} alert`),
        style: 'cancel',
      },
      {
        text: 'Open Settings',
        onPress: async () => {
          logger.log(`🔓 Opening settings for ${permissionType}`);
          await openSettings();
        },
      },
    ]);
  }

  /**
   * Reset denial counters
   */
  public resetDenialCounts(): void {
    this.denialCounts = {
      location: 0,
      notification: 0,
      locationServices: 0,
    };
    logger.log('🔄 Denial counters reset');
  }

  /**
   * Get current denial counts (for debugging)
   */
  public getDenialCounts(): PermissionDenialCounts {
    return { ...this.denialCounts };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// SINGLETON INSTANCE
// ─────────────────────────────────────────────────────────────────────────────

export const permissionsManager = new PermissionsManager();