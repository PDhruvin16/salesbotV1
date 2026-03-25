import * as ExpoLocation from 'expo-location';
import { Linking, PermissionsAndroid, Platform, Alert, AppState } from 'react-native';
import { promptForEnableLocationIfNeeded } from 'react-native-android-location-enabler';
import axios from 'axios';
import storage from '../utils/Storage';

// Types
interface Coordinates {
  latitude: number;
  longitude: number;
  accuracy?: number | null;
}

interface Address {
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  landmark: string;
}

interface LocationData {
  coordinates: Coordinates;
  address: Address;
  formatted: string;
}

interface GeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

interface StoredLocation extends Coordinates {
  timestamp: number;
  date: string;
  address?: string;
}

// Configuration
const CONFIG = {
  GOOGLE_MAPS_API_KEY: 'AIzaSyAWDIFCW4vdMbLpdLT0u2rF2Fw23gJ1Wxk',
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
  DEFAULT_TIMEOUT: 30000,
  HIGH_ACCURACY_TIMEOUT: 10000,
  IOS_TIMEOUT: 15000,
  IOS_MAX_AGE: 300000,
  TRACKING_INTERVAL: 60000, // 1 minute
  LOCATION_HISTORY_LIMIT: 100,
};

// Location Cache Manager
class LocationCache {
  private data: Coordinates | null = null;
  private timestamp: number | null = null;
  private readonly duration: number = CONFIG.CACHE_DURATION;

  set(data: Coordinates): void {
    this.data = data;
    this.timestamp = Date.now();
  }

  get(): Coordinates | null {
    if (!this.data || !this.timestamp) return null;

    const now = Date.now();
    const isExpired = now - this.timestamp > this.duration;

    if (isExpired) {
      this.clear();
      return null;
    }

    return this.data;
  }

  clear(): void {
    this.data = null;
    this.timestamp = null;
  }

  isValid(): boolean {
    return this.data !== null && this.timestamp !== null;
  }

  getStatus() {
    return {
      hasData: this.isValid(),
      timestamp: this.timestamp,
      data: this.data,
    };
  }
}

// Main Location Service Class
class LocationService {
  private cache: LocationCache;
  private watchId: ExpoLocation.LocationSubscription | null = null;
  private locationInterval: ReturnType<typeof setInterval> | null = null;
  private appStateSubscription: ReturnType<typeof AppState.addEventListener> | null = null;
  private isTracking: boolean = false;
  private lastSaveTime: number = 0;

  constructor() {
    this.cache = new LocationCache();
  }

  // ==================== Permission Methods ====================
  async checkPermissions(): Promise<boolean> {
    try {
      if (Platform.OS === 'ios') {
        return this.checkIOSPermission();
      }
      return await this.checkAndroidPermission();
    } catch (error) {
      console.error('Error checking permissions:', this.getErrorMessage(error));
      return false;
    }
  }

  private async checkIOSPermission(): Promise<boolean> {
    const { status } = await ExpoLocation.getForegroundPermissionsAsync();
    return status === ExpoLocation.PermissionStatus.GRANTED;
  }

  private async checkAndroidPermission(): Promise<boolean> {
    const fineLocation = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    return fineLocation;
  }

  async requestLocationPermission(): Promise<boolean> {
    try {
      if (Platform.OS === 'ios') {
        return await this.requestIOSPermission();
      }
      return await this.requestAndroidPermission();
    } catch (error) {
      console.error(' Permission request error:', this.getErrorMessage(error));
      return false;
    }
  }

  private async requestIOSPermission(): Promise<boolean> {
    console.log('🔄 Requesting iOS location permission...');
    const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
    const granted = status === ExpoLocation.PermissionStatus.GRANTED;
    console.log(granted ? ' iOS Location permission granted' : 'iOS permission denied');
    return granted;
  }

  private async requestAndroidPermission(): Promise<boolean> {
    const fineLocation = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location Permission',
        message: 'This app needs location access to track your field visits.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );

    if (fineLocation !== PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Fine location denied, trying coarse location');

      const coarseLocation = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        {
          title: 'Approximate Location Permission',
          message: 'Allow approximate location access for basic services.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );

      if (coarseLocation !== PermissionsAndroid.RESULTS.GRANTED) {
        console.log(' Coarse location also denied');
        return false;
      }
    }

    // Request background location permission for Android 10+
    if (Platform.OS === 'android' && Platform.Version >= 29) {
      try {
        const backgroundLocation = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
          {
            title: 'Background Location Permission',
            message: 'Allow location access in background to track field visits.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        console.log('Background location permission:', backgroundLocation);
      } catch (error) {
        console.log('Background location permission failed:', this.getErrorMessage(error));
      }
    }

    // Request notification permission
    try {
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    } catch (error) {
      console.log('Notification permission failed:', this.getErrorMessage(error));
    }

    console.log('Location permissions granted');
    return true;
  }

  // ==================== Location Retrieval Methods ====================
  async getCurrentLocation(options: GeolocationOptions = {}): Promise<Coordinates> {
    const highAccuracy = options.enableHighAccuracy ?? (Platform.OS !== 'ios');
    try {
      const position = await ExpoLocation.getCurrentPositionAsync({
        accuracy: highAccuracy
          ? ExpoLocation.Accuracy.High
          : ExpoLocation.Accuracy.Balanced,
        mayShowUserSettingsDialog: true,
      });

      if (!this.isValidPosition(position)) {
        throw new Error('Invalid position data received');
      }

      const { latitude, longitude, accuracy } = position.coords;
      console.log('Location obtained:', { latitude, longitude, accuracy });
      return { latitude, longitude, accuracy: accuracy ?? null };
    } catch (error) {
      console.log('Location error:', this.getErrorMessage(error));
      const errorMessage = await this.handleLocationError(error);
      throw new Error(errorMessage);
    }
  }

  async getCurrentLocationWithFallback(): Promise<Coordinates> {
    try {
      // iOS specific flow
      if (Platform.OS === 'ios') {
        return await this.getIOSLocationWithFallback();
      }

      // Android flow
      return await this.getAndroidLocationWithFallback();
    } catch (error) {
      this.showLocationPermissionAlert();
      console.error(' All location attempts failed:', this.getErrorMessage(error));
      throw error;
    }
  }

  private async getIOSLocationWithFallback(): Promise<Coordinates> {
    try {
      console.log('Trying iOS location with conservative settings...');
      const locationData = await this.getCurrentLocation({
        enableHighAccuracy: false,
        timeout: CONFIG.IOS_TIMEOUT,
        maximumAge: CONFIG.IOS_MAX_AGE,
      });

      this.cache.set(locationData);
      return locationData;
    } catch (error) {
      console.log('iOS location failed:', this.getErrorMessage(error));

      if (this.getErrorMessage(error).includes('permission')) {
        throw new Error('Location permission not granted');
      }

      // Try with high accuracy
      console.log('Trying iOS location with high accuracy...');
      const locationData = await this.getCurrentLocation({
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      });

      this.cache.set(locationData);
      return locationData;
    }
  }

  private async getAndroidLocationWithFallback(): Promise<Coordinates> {
    const hasPermission = await this.checkPermissions();
    if (!hasPermission) {
      throw new Error('Location permission not granted');
    }

    try {
      console.log('Trying high accuracy location...');
      const locationData = await this.getCurrentLocation({
        enableHighAccuracy: true,
        timeout: CONFIG.HIGH_ACCURACY_TIMEOUT,
        maximumAge: 30000,
      });

      this.cache.set(locationData);
      return locationData;
    } catch (error) {
      console.log('High accuracy failed:', this.getErrorMessage(error));

      // Fallback to low accuracy
      console.log('Trying low accuracy location...');
      const locationData = await this.getCurrentLocation({
        enableHighAccuracy: false,
        timeout: CONFIG.DEFAULT_TIMEOUT,
        maximumAge: CONFIG.IOS_MAX_AGE,
      });

      this.cache.set(locationData);
      return locationData;
    }
  }

  // ==================== Background Tracking Methods ====================
  async startBackgroundTracking(): Promise<void> {
    try {
      if (this.isTracking) {
        console.log('Background tracking already running');
        return;
      }

      console.log('Starting background location tracking...');

      // Check permissions
      const hasPermission = await this.checkPermissions();
      if (!hasPermission) {
        console.log('Location permission not granted');
        const granted = await this.requestLocationPermission();
        if (!granted) {
          throw new Error('Location permission denied');
        }
      }

      // Setup AppState listener
      this.setupAppStateListener();

      // Start watchPosition for continuous GPS tracking
      this.startWatchingPosition();

      // Start interval for guaranteed 1-minute updates
      this.startLocationInterval();

      this.isTracking = true;
      console.log('Background location tracking started');
    } catch (error) {
      console.error('Error starting background tracking:', this.getErrorMessage(error));
      throw error;
    }
  }

  private setupAppStateListener(): void {
    this.appStateSubscription = AppState.addEventListener('change', (nextAppState) => {
      console.log('App State changed:', nextAppState);

      if (nextAppState === 'background' || nextAppState === 'inactive') {
        console.log(' App in background - saving last location');
        this.saveLastLocationToStorage();
      } else if (nextAppState === 'active') {
        console.log(' App in foreground - tracking active');
        // Immediately fetch fresh location when coming to foreground
        this.fetchAndSaveLocation('foreground');
      }
    });
  }

  private startWatchingPosition(): void {
    ExpoLocation.watchPositionAsync(
      {
        accuracy: ExpoLocation.Accuracy.High,
        distanceInterval: 10,
        timeInterval: CONFIG.TRACKING_INTERVAL,
      },
      (position) => {
        if (!this.isValidPosition(position)) {
          console.log('Invalid position in watch');
          return;
        }

        const { latitude, longitude, accuracy } = position.coords;
        const locationData: Coordinates = {
          latitude,
          longitude,
          accuracy: accuracy ?? null,
        };

        console.log(' Watch position updated:', locationData);
        this.cache.set(locationData);
        this.saveLocationWithTimeCheck(locationData, 'watch');
      },
    ).then((subscription) => {
      this.watchId = subscription;
      console.log('Watch position started');
    }).catch((error) => {
      console.log('Watch position error:', this.getErrorMessage(error));
    });
  }

  private startLocationInterval(): void {
    this.locationInterval = setInterval(async () => {
      await this.fetchAndSaveLocation('interval');
    }, CONFIG.TRACKING_INTERVAL);

    console.log('Location interval started (every 1 minute)');
  }

  private async fetchAndSaveLocation(source: string): Promise<void> {
    try {
      console.log(`Fetching location from ${source}...`);
      const location = await this.getCurrentLocationWithFallback();

      if (location) {
        console.log(`Location fetched (${source}):`, location);
        this.saveLocationWithTimeCheck(location, source);
      }
    } catch (error) {
      console.log(`Location fetch failed (${source}):`, this.getErrorMessage(error));
    }
  }

  private saveLocationWithTimeCheck(location: Coordinates, source: string): void {
    const now = Date.now();
    const timeSinceLastSave = now - this.lastSaveTime;

    // Always save if it's been more than 1 minute
    if (timeSinceLastSave >= CONFIG.TRACKING_INTERVAL) {
      console.log(
        `Saving location (${source}) - ${Math.round(timeSinceLastSave / 1000)}s since last save`,
      );
      this.lastSaveTime = now;
      this.saveLocationToStorage(location);
    } else {
      // Just update cache, don't save to storage
      const timeUntilNextSave = Math.round((CONFIG.TRACKING_INTERVAL - timeSinceLastSave) / 1000);
      console.log(`Location updated in cache (${source}) - next save in ${timeUntilNextSave}s`);
    }
  }

  stopBackgroundTracking(): void {
    console.log('Stopping background location tracking...');

    // Clear watch position
    if (this.watchId !== null) {
      this.watchId.remove();
      this.watchId = null;
      console.log('Watch position cleared');
    }

    // Clear interval
    if (this.locationInterval) {
      clearInterval(this.locationInterval);
      this.locationInterval = null;
      console.log('Location interval cleared');
    }

    // Remove AppState listener
    if (this.appStateSubscription) {
      this.appStateSubscription.remove();
      this.appStateSubscription = null;
      console.log('AppState listener removed');
    }

    // Save last location before stopping
    this.saveLastLocationToStorage();

    this.isTracking = false;
    console.log('Background tracking stopped');
  }

  getTrackingStatus(): boolean {
    return this.isTracking;
  }

  // ==================== MMKV Storage Methods ====================
  private saveLocationToStorage(location: Coordinates, address?: string): void {
    try {
      const storedLocation: StoredLocation = {
        ...location,
        timestamp: Date.now(),
        date: new Date().toISOString(),
        address,
      };

      storage.setJSON('employee_current_location', storedLocation);
      this.saveToLocationHistory(storedLocation);
      this.updateLocationStats();

      console.log('Location saved to MMKV storage', storedLocation);
    } catch (error) {
      console.error(' Error saving location to storage:', this.getErrorMessage(error));
    }
  }

  private saveToLocationHistory(location: StoredLocation): void {
    try {
      // Get existing history safely
      const existingHistory = storage.getJSON<StoredLocation[]>('employee_location_history');

      // Ensure it's an array
      const history = Array.isArray(existingHistory) ? existingHistory : [];

      // Create NEW array with new location at beginning (spread operator)
      const updatedHistory = [location, ...history];

      // Keep only last 100 locations
      const trimmedHistory = updatedHistory.slice(0, CONFIG.LOCATION_HISTORY_LIMIT);

      // Save back to storage
      storage.setJSON('employee_location_history', trimmedHistory);
      console.log(`Location history updated (${trimmedHistory.length} entries)`);
    } catch (error) {
      console.error('Error saving location history:', this.getErrorMessage(error));

      // Fallback: Create new history with just this location
      try {
        storage.setJSON('employee_location_history', [location]);
        console.log('Created new location history');
      } catch (fallbackError) {
        console.error('Failed to create new history:', fallbackError);
      }
    }
  }

  private saveLastLocationToStorage(): void {
    const cachedLocation = this.cache.get();
    if (cachedLocation) {
      this.saveLocationToStorage(cachedLocation);
      console.log('Last location saved to storage');
    } else {
      console.log('No cached location to save');
    }
  }

  private updateLocationStats(): void {
    try {
      const stats = {
        lastUpdated: Date.now(),
        lastUpdatedDate: new Date().toISOString(),
        totalLocationsTracked: this.getLocationHistory().length,
        trackingStatus: this.isTracking,
      };

      storage.setJSON('employee_location_stats', stats);
    } catch (error) {
      console.error('Error updating location stats:', error);
    }
  }

  getLastLocationFromStorage(): StoredLocation | null {
    try {
      return storage.getJSON<StoredLocation>('employee_current_location');
    } catch (error) {
      console.error('Error getting location from storage:', this.getErrorMessage(error));
      return null;
    }
  }

  getLocationHistory(): StoredLocation[] {
    try {
      const history = storage.getJSON<StoredLocation[]>('employee_location_history');
      return Array.isArray(history) ? history : [];
    } catch (error) {
      console.error('Error getting location history:', this.getErrorMessage(error));
      return [];
    }
  }

  getLocationStats() {
    try {
      return storage.getJSON('employee_location_stats');
    } catch (error) {
      console.error('Error getting location stats:', error);
      return null;
    }
  }

  clearLocationStorage(): void {
    try {
      storage.remove('employee_current_location');
      storage.remove('employee_location_history');
      storage.remove('employee_location_stats');
      this.cache.clear();
      console.log('All location storage cleared');
    } catch (error) {
      console.error('Error clearing location storage:', this.getErrorMessage(error));
    }
  }

  // ==================== Geocoding with Google Maps ====================
  async fetchLocationData(): Promise<LocationData> {
    try {
      const coordinates = await this.getCurrentLocationWithFallback();

      if (!this.isValidCoordinates(coordinates)) {
        throw new Error('Invalid coordinates for geocoding');
      }

      const { latitude, longitude } = coordinates;
      console.log('Fetching address from Google Maps:', { latitude, longitude });

      const response = await axios.get(
        `https://maps.googleapis.com/maps/lib/geocode/json?latlng=${latitude},${longitude}&key=${CONFIG.GOOGLE_MAPS_API_KEY}`,
        { timeout: 10000 },
      );

      if (!response?.data || response.data.status !== 'OK') {
        throw new Error(`Google API error: ${response.data?.status || 'Unknown'}`);
      }

      if (!response.data.results || response.data.results.length === 0) {
        throw new Error('No location data found');
      }

      const location = response.data.results[0];
      const addressComponents = location.address_components || [];
      const formatted = location.formatted_address || 'Unknown location';

      // Save location with address
      this.saveLocationToStorage(coordinates, formatted);

      return {
        coordinates: { latitude, longitude },
        address: this.parseAddressComponents(addressComponents),
        formatted,
      };
    } catch (error) {
      console.error('Geocoding error:', this.getErrorMessage(error));
      throw error;
    }
  }

  // ==================== Helper Methods ====================
  private isValidPosition(position: unknown): boolean {
    const pos = position as unknown as Record<string, unknown>;
    if (!pos || !pos.coords) return false;

    const coords = pos.coords as unknown as { latitude?: unknown; longitude?: unknown };
    return this.isValidCoordinates({ latitude: coords.latitude, longitude: coords.longitude });
  }

  private isValidCoordinates(coords: unknown): boolean {
    const coordObj = coords as unknown as Record<string, unknown>;
    if (!coordObj) return false;

    const { latitude, longitude } = coordObj;
    return (
      latitude !== null &&
      longitude !== null &&
      typeof latitude === 'number' &&
      typeof longitude === 'number' &&
      !isNaN(latitude as number) &&
      !isNaN(longitude as number)
    );
  }

  private parseAddressComponents(components: unknown[]): Address {
    const getComponent = (types: string[]): string => {
      if (!Array.isArray(types)) return '';

      const component = (components as unknown as Array<Record<string, unknown>>).find((c) => {
        const cObj = c as unknown as Record<string, unknown>;
        const cTypes = cObj.types as unknown as string[];
        return (
          cObj && cTypes && Array.isArray(cTypes) && types.some((type) => cTypes.includes(type))
        );
      });
      const compObj = component as unknown as Record<string, unknown>;
      return (typeof compObj?.long_name === 'string' ? compObj.long_name : '') || '';
    };

    const streetNumber = getComponent(['street_number']);
    const route = getComponent(['premise', 'route']);
    const sublocality = getComponent(['sublocality_level_1']);
    const locality = getComponent(['sublocality_level_2']);
    const city = getComponent(['administrative_area_level_3', 'locality']) || locality;
    const state = getComponent(['administrative_area_level_1']);
    const country = getComponent(['country']);
    const postalCode = getComponent(['postal_code']);
    const landmark = getComponent(['landmark']);

    return {
      address_line1: `${streetNumber} ${route}`.trim() || sublocality || 'Unknown address',
      address_line2: `${sublocality}, ${locality}`.trim(),
      city: city || 'Unknown city',
      state: state || '',
      country: country || '',
      postalCode: postalCode || '',
      landmark: landmark || '',
    };
  }

  private async handleLocationError(error: unknown): Promise<string> {
    let errorMessage = 'Unable to get location';
    const errObj = error as unknown as Record<string, unknown>;

    if (errObj?.code) {
      const code = errObj.code as number;
      switch (code) {
        case 1:
          errorMessage = 'Location permission denied';
          break;
        case 2:
          errorMessage = 'Location unavailable';
          if (Platform.OS === 'android') {
            try {
              const permissionGranted = await PermissionsAndroid.check(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
              );
              if (permissionGranted) {
                this.showGpsTurnOnAlert();
                return errorMessage;
              }
            } catch (e) {
              console.error('Permission check failed:', e);
            }
          }
          break;
        case 3:
          errorMessage = 'Location request timed out';
          break;
        default:
          errorMessage =
            (typeof errObj.message === 'string' ? errObj.message : '') || 'Unknown location error';
      }
    }

    return errorMessage;
  }

  private getErrorMessage(error: unknown): string {
    const errObj = error as unknown as Record<string, unknown>;
    return (typeof errObj?.message === 'string' ? errObj.message : '') || 'Unknown error';
  }

  // ==================== Alert Methods ====================
  private showGpsTurnOnAlert(): void {
    if (Platform.OS !== 'android') return;

    Alert.alert(
      'GPS is Off',
      'Your device GPS is turned off. Please turn it ON for location tracking.',
      [
        {
          text: 'Turn On Location',
          onPress: async () => {
            try {
              await promptForEnableLocationIfNeeded();
            } catch (error) {
              console.error('Unable to open location settings:', this.getErrorMessage(error));
            }
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true },
    );
  }

  showLocationPermissionAlert(): void {
    const title = 'Location Permission Required';
    const message =
      Platform.OS === 'ios'
        ? 'This app needs location access to track your field visits. Please enable location permission in Settings > Privacy & Security > Location Services.'
        : 'This app needs location access to track your field visits. Please enable location permission in settings.';

    Alert.alert(
      title,
      message,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Open Settings',
          onPress: () => this.openLocationSettings(),
        },
      ],
      { cancelable: false },
    );
  }

  openLocationSettings(): void {
    try {
      Linking.openSettings();
    } catch (error) {
      console.error(' Unable to open settings:', this.getErrorMessage(error));

      if (Platform.OS === 'ios') {
        try {
          Linking.openURL('app-settings:');
        } catch (fallbackError) {
          console.error('Fallback settings URL failed:', fallbackError);
        }
      }
    }
  }

  // Cache Methods
  clearCache(): void {
    this.cache.clear();
    console.log('Location cache cleared');
  }

  getCacheStatus() {
    return this.cache.getStatus();
  }
}

// Export singleton instance
export const locationService = new LocationService();

// Export individual methods
export const checkPermissions = () => locationService.checkPermissions();
export const requestLocationPermission = () => locationService.requestLocationPermission();
export const getCurrentLocation = (options?: GeolocationOptions) =>
  locationService.getCurrentLocation(options);
export const getCurrentLocationWithFallback = () =>
  locationService.getCurrentLocationWithFallback();
export const fetchLocationWithGoogle = () => locationService.fetchLocationData();
export const showLocationPermissionAlert = () => locationService.showLocationPermissionAlert();
export const openLocationSettings = () => locationService.openLocationSettings();
export const clearLocationCache = () => locationService.clearCache();
export const getCacheStatus = () => locationService.getCacheStatus();
// Background tracking exports
export const startBackgroundTracking = () => locationService.startBackgroundTracking();
export const stopBackgroundTracking = () => locationService.stopBackgroundTracking();
export const getTrackingStatus = () => locationService.getTrackingStatus();
// Storage exports
export const getLastLocationFromStorage = () => locationService.getLastLocationFromStorage();
export const getLocationHistory = () => locationService.getLocationHistory();
export const getLocationStats = () => locationService.getLocationStats();
export const clearLocationStorage = () => locationService.clearLocationStorage();
