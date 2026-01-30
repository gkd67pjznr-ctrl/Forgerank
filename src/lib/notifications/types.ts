import { Notification } from 'expo-notifications';

/**
 * Notification types supported by the app
 */
export type NotificationType =
  | 'friend_request'
  | 'dm_received'
  | 'competition_result'
  | 'rest_timer'
  | 'reaction'
  | 'comment';

/**
 * Notification data payload structure
 */
export interface NotificationPayload {
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, any>;
  channelId?: string;
}

/**
 * Notification preferences that can be toggled by user
 */
export interface NotificationPreferences {
  friendRequests: boolean;
  directMessages: boolean;
  competitionResults: boolean;
  restTimer: boolean;
  reactions: boolean;
  comments: boolean;
}

/**
 * Notification channel definitions for Android
 */
export const NOTIFICATION_CHANNELS = {
  SOCIAL: {
    id: 'social',
    name: 'Social Notifications',
    description: 'Notifications for friend requests, messages, and social activity',
    importance: 4, // HIGH
  },
  WORKOUT: {
    id: 'workout',
    name: 'Workout Notifications',
    description: 'Notifications for workout-related events like rest timer completion',
    importance: 4, // HIGH
  },
  COMPETITION: {
    id: 'competition',
    name: 'Competition Notifications',
    description: 'Notifications for competition results and updates',
    importance: 3, // DEFAULT
  },
};

/**
 * Notification identifiers for rest timer
 */
export const REST_TIMER_NOTIFICATION_ID = 'rest-timer-notification';

/**
 * Notification response handler
 */
export interface NotificationResponseHandler {
  (response: Notification): void;
}