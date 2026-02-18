import { NativeModules, NativeEventEmitter, Platform } from 'react-native';
import { logger } from '../utils/logger';

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude: number;
  speed: number;
  heading: number;
  timestamp: number;
}

interface LocationModuleInterface {
  getCurrentLocation: () => Promise<LocationData>;
  startLocationUpdates: (intervalMs: number) => Promise<string>;
  stopLocationUpdates: () => Promise<string>;
  checkLocationPermission: () => Promise<boolean>;
}

const { LocationModule } = NativeModules;

// if (!LocationModule) {
//   throw new Error(
//     'LocationModule native module is not available. Make sure you have rebuilt the app.'
//   );
// }

const locationModule: LocationModuleInterface = LocationModule;

// Create event emitter for location updates
let locationEventEmitter: NativeEventEmitter | null = null;

export interface LocationUpdateListener {
  (location: LocationData): void;
}

class LocationService {
  private listeners: LocationUpdateListener[] = [];
  private subscription: any = null;

  /**
   * Get current location once
   */
  async getCurrentLocation(): Promise<LocationData> {
    try {
      const location = await locationModule.getCurrentLocation();
      return location;
    } catch (error) {
      throw new Error(`Failed to get location: ${error}`);
    }
  }

  /**
   * Check if location permission is granted
   */
  async checkPermission(): Promise<boolean> {
    try {
      return await locationModule.checkLocationPermission();
    } catch (error) {
      logger.error('Error checking permission:', error);
      return false;
    }
  }

  /**
   * Start watching location updates
   * @param intervalMs Update interval in milliseconds
   * @param callback Function to call when location updates
   */
  startWatching(intervalMs: number, callback: LocationUpdateListener): void {
    this.listeners.push(callback);

    if (!this.subscription) {
      this.subscription = locationEventEmitter.addListener(
        'onLocationUpdate',
        (location: LocationData) => {
          this.listeners.forEach(listener => listener(location));
        }
      );

      locationModule
        .startLocationUpdates(intervalMs)
        .then(result => {
          logger.log('Location updates started:', result);
        })
        .catch(error => {
          logger.error('Error starting location updates:', error);
        });
    }
  }

  /**
   * Stop watching location updates
   */
  async stopWatching(): Promise<void> {
    try {
      if (this.subscription) {
        this.subscription.remove();
        this.subscription = null;
      }
      
      this.listeners = [];
      await locationModule.stopLocationUpdates();
      logger.log('Location updates stopped');
    } catch (error) {
      logger.error('Error stopping location updates:', error);
    }
  }

  /**
   * Remove a specific listener
   */
  removeListener(callback: LocationUpdateListener): void {
    const index = this.listeners.indexOf(callback);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }

    // If no more listeners, stop watching
    if (this.listeners.length === 0) {
      this.stopWatching();
    }
  }
}

export default new LocationService();
export { LocationData };