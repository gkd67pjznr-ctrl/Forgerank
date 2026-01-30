import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { NotificationPayload, NotificationPreferences, NOTIFICATION_CHANNELS, REST_TIMER_NOTIFICATION_ID } from './types';
import { getSettings } from '../stores/settingsStore';

/**
 * Notification Service - Core notification functionality
 * Handles both local and push notifications
 */

// Set notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/**
 * Initialize notification service
 * Should be called early in app lifecycle
 */
export const initializeNotificationService = async (): Promise<void> => {
  try {
    // Register for push notifications
    await registerForPushNotificationsAsync();

    // Set up notification channels (Android only)
    if (Platform.OS === 'android') {
      await setupNotificationChannels();
    }

    console.log('Notification service initialized');
  } catch (error) {
    console.error('Failed to initialize notification service:', error);
  }
};

/**
 * Set up notification channels for Android
 */
const setupNotificationChannels = async (): Promise<void> => {
  try {
    await Notifications.setNotificationChannelAsync(NOTIFICATION_CHANNELS.SOCIAL.id, {
      name: NOTIFICATION_CHANNELS.SOCIAL.name,
      description: NOTIFICATION_CHANNELS.SOCIAL.description,
      importance: NOTIFICATION_CHANNELS.SOCIAL.importance,
      sound: 'default',
    });

    await Notifications.setNotificationChannelAsync(NOTIFICATION_CHANNELS.WORKOUT.id, {
      name: NOTIFICATION_CHANNELS.WORKOUT.name,
      description: NOTIFICATION_CHANNELS.WORKOUT.description,
      importance: NOTIFICATION_CHANNELS.WORKOUT.importance,
      sound: 'default',
    });

    await Notifications.setNotificationChannelAsync(NOTIFICATION_CHANNELS.COMPETITION.id, {
      name: NOTIFICATION_CHANNELS.COMPETITION.name,
      description: NOTIFICATION_CHANNELS.COMPETITION.description,
      importance: NOTIFICATION_CHANNELS.COMPETITION.importance,
      sound: 'default',
    });
  } catch (error) {
    console.error('Failed to set up notification channels:', error);
  }
};

/**
 * Request notification permissions
 * Returns true if permissions were granted
 */
export const requestNotificationPermission = async (): Promise<boolean> => {
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Failed to request notification permissions:', error);
    return false;
  }
};

/**
 * Register for push notifications
 */
const registerForPushNotificationsAsync = async (): Promise<void> => {
  try {
    // Check if permissions are already granted
    const { status: existingStatus } = await Notifications.getPermissionsAsync();

    if (existingStatus !== 'granted') {
      // Request permissions
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('Notification permissions not granted');
        return;
      }
    }

    // Get push token
    const token = await Notifications.getExpoPushTokenAsync();
    console.log('Expo push token:', token.data);

    // Set notification handler
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  } catch (error) {
    console.error('Failed to register for push notifications:', error);
  }
};

/**
 * Schedule a local notification
 */
export const scheduleLocalNotification = async (
  payload: NotificationPayload,
  triggerSeconds: number
): Promise<string | null> => {
  try {
    // Check if notifications are enabled for this type
    const settings = getSettings();
    const prefs = settings.notificationPrefs;

    if (!shouldShowNotification(payload.type, prefs)) {
      console.log(`Notification of type ${payload.type} is disabled by user preferences`);
      return null;
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: payload.title,
        body: payload.body,
        data: payload.data || {},
      },
      trigger: {
        seconds: triggerSeconds,
      },
    });

    console.log(`Scheduled notification ${notificationId} for ${triggerSeconds} seconds`);
    return notificationId;
  } catch (error) {
    console.error('Failed to schedule local notification:', error);
    return null;
  }
};

/**
 * Cancel a scheduled notification
 */
export const cancelScheduledNotification = async (notificationId: string): Promise<void> => {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
    console.log(`Cancelled scheduled notification ${notificationId}`);
  } catch (error) {
    console.error('Failed to cancel scheduled notification:', error);
  }
};

/**
 * Cancel all scheduled notifications
 */
export const cancelAllScheduledNotifications = async (): Promise<void> => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('Cancelled all scheduled notifications');
  } catch (error) {
    console.error('Failed to cancel all scheduled notifications:', error);
  }
};

/**
 * Show an immediate notification
 */
export const showImmediateNotification = async (payload: NotificationPayload): Promise<void> => {
  try {
    // Check if notifications are enabled for this type
    const settings = getSettings();
    const prefs = settings.notificationPrefs;

    if (!shouldShowNotification(payload.type, prefs)) {
      console.log(`Notification of type ${payload.type} is disabled by user preferences`);
      return;
    }

    await Notifications.presentNotificationAsync({
      title: payload.title,
      body: payload.body,
      data: payload.data || {},
    });
  } catch (error) {
    console.error('Failed to show immediate notification:', error);
  }
};

/**
 * Check if notification should be shown based on user preferences
 */
const shouldShowNotification = (type: NotificationType, prefs: NotificationPreferences): boolean => {
  switch (type) {
    case 'friend_request':
      return prefs.friendRequests;
    case 'dm_received':
      return prefs.directMessages;
    case 'competition_result':
      return prefs.competitionResults;
    case 'rest_timer':
      return prefs.restTimer;
    case 'reaction':
      return prefs.reactions;
    case 'comment':
      return prefs.comments;
    default:
      return true;
  }
};

/**
 * Set up notification response listener
 */
export const setupNotificationResponseListener = (handler: (response: Notifications.NotificationResponse) => void): void => {
  Notifications.addNotificationResponseReceivedListener(handler);
};

/**
 * Set up notification received listener (foreground)
 */
export const setupNotificationReceivedListener = (handler: (notification: Notifications.Notification) => void): void => {
  Notifications.addNotificationReceivedListener(handler);
};

/**
 * Schedule rest timer notification
 * This is the P0 launch feature - background rest timer notifications
 */
export const scheduleRestTimerNotification = async (seconds: number): Promise<string | null> => {
  try {
    const settings = getSettings();
    const prefs = settings.notificationPrefs;

    if (!prefs.restTimer) {
      console.log('Rest timer notifications are disabled by user preferences');
      return null;
    }

    // Cancel any existing rest timer notification
    await cancelAllScheduledNotifications();

    const notificationId = await scheduleLocalNotification({
      type: 'rest_timer',
      title: 'Time to lift!',
      body: 'Your rest period is complete. Get back to your workout!',
      data: {
        type: 'rest_timer',
        screen: 'live-workout',
      },
    }, seconds);

    return notificationId;
  } catch (error) {
    console.error('Failed to schedule rest timer notification:', error);
    return null;
  }
};

/**
 * Cancel rest timer notification
 */
export const cancelRestTimerNotification = async (): Promise<void> => {
  try {
    await cancelAllScheduledNotifications();
    console.log('Cancelled rest timer notification');
  } catch (error) {
    console.error('Failed to cancel rest timer notification:', error);
  }
};

/**
 * Send push notification via backend
 * This would be called from the backend when social events occur
 */
export const sendPushNotification = async (
  userId: string,
  payload: NotificationPayload
): Promise<void> => {
  try {
    // In a real implementation, this would call the backend API
    // to send a push notification to the user's device
    console.log(`Would send push notification to user ${userId}:`, payload);

    // For now, we'll just log it since we don't have the backend
    // implementation for sending push notifications yet
  } catch (error) {
    console.error('Failed to send push notification:', error);
  }
};