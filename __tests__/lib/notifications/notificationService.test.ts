// __tests__/lib/notifications/notificationService.test.ts
import { Platform } from 'react-native';
import {
  scheduleLocalNotification,
  cancelScheduledNotification,
  cancelAllScheduledNotifications,
  showImmediateNotification,
  scheduleRestTimerNotification,
  cancelRestTimerNotification,
  requestNotificationPermission,
} from '@/src/lib/notifications/notificationService';
import { updateSettings } from '@/src/lib/stores/settingsStore';

// Mock expo-notifications at the module level
jest.mock('expo-notifications', () => ({
  requestPermissionsAsync: jest.fn(),
  scheduleNotificationAsync: jest.fn(),
  cancelScheduledNotificationAsync: jest.fn(),
  cancelAllScheduledNotificationsAsync: jest.fn(),
  presentNotificationAsync: jest.fn(),
  setNotificationHandler: jest.fn(),
  setNotificationChannelAsync: jest.fn(),
  getPermissionsAsync: jest.fn(),
  getExpoPushTokenAsync: jest.fn(),
  addNotificationResponseReceivedListener: jest.fn(() => ({ remove: jest.fn() })),
  addNotificationReceivedListener: jest.fn(() => ({ remove: jest.fn() })),
}));

// Mock React Native Platform
jest.mock('react-native', () => ({
  Platform: {
    OS: 'ios',
    select: jest.fn((obj) => obj.ios),
  },
}));

// Mock the settings store
jest.mock('@/src/lib/stores/settingsStore', () => ({
  getSettings: jest.fn(),
  updateSettings: jest.fn(),
}));

describe('Notification Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Set up default mock implementations
    require('expo-notifications').requestPermissionsAsync.mockResolvedValue({ status: 'granted' });
    require('expo-notifications').scheduleNotificationAsync.mockResolvedValue('mock-notification-id');
    require('expo-notifications').cancelScheduledNotificationAsync.mockResolvedValue(undefined);
    require('expo-notifications').cancelAllScheduledNotificationsAsync.mockResolvedValue(undefined);
    require('expo-notifications').presentNotificationAsync.mockResolvedValue(undefined);

    // Mock the settings store to return proper notification preferences
    const mockSettings = {
      notificationPrefs: {
        friendRequests: true,
        directMessages: true,
        competitionResults: true,
        restTimer: true,
        reactions: true,
        comments: true,
      },
    };
    require('@/src/lib/stores/settingsStore').getSettings.mockReturnValue(mockSettings);

    // Mock updateSettings to update the mock
    require('@/src/lib/stores/settingsStore').updateSettings.mockImplementation((updates) => {
      Object.assign(mockSettings, updates);
      if (updates.notificationPrefs) {
        Object.assign(mockSettings.notificationPrefs, updates.notificationPrefs);
      }
    });
  });

  describe('requestNotificationPermission', () => {
    it('should return true when permissions are granted', async () => {
      require('expo-notifications').requestPermissionsAsync.mockResolvedValue({ status: 'granted' });
      const result = await requestNotificationPermission();
      expect(result).toBe(true);
    });

    it('should return false when permissions are denied', async () => {
      require('expo-notifications').requestPermissionsAsync.mockResolvedValue({ status: 'denied' });
      const result = await requestNotificationPermission();
      expect(result).toBe(false);
    });

    it('should handle errors gracefully', async () => {
      require('expo-notifications').requestPermissionsAsync.mockRejectedValue(new Error('Permission error'));
      const result = await requestNotificationPermission();
      expect(result).toBe(false);
    });
  });

  describe('scheduleLocalNotification', () => {
    it('should schedule a notification when preferences allow it', async () => {
      const notificationId = await scheduleLocalNotification({
        type: 'rest_timer',
        title: 'Test Notification',
        body: 'This is a test',
      }, 60);

      expect(notificationId).toBe('mock-notification-id');
      expect(require('expo-notifications').scheduleNotificationAsync).toHaveBeenCalledWith({
        content: {
          title: 'Test Notification',
          body: 'This is a test',
          data: {},
        },
        trigger: {
          seconds: 60,
        },
      });
    });

    it('should return null when notification type is disabled', async () => {
      // Disable rest timer notifications
      updateSettings({
        notificationPrefs: {
          restTimer: false,
        },
      });

      const notificationId = await scheduleLocalNotification({
        type: 'rest_timer',
        title: 'Test Notification',
        body: 'This is a test',
      }, 60);

      expect(notificationId).toBeNull();
      expect(require('expo-notifications').scheduleNotificationAsync).not.toHaveBeenCalled();
    });

    it('should handle scheduling errors gracefully', async () => {
      require('expo-notifications').scheduleNotificationAsync.mockRejectedValue(new Error('Scheduling error'));
      const notificationId = await scheduleLocalNotification({
        type: 'rest_timer',
        title: 'Test Notification',
        body: 'This is a test',
      }, 60);

      expect(notificationId).toBeNull();
    });
  });

  describe('cancelScheduledNotification', () => {
    it('should cancel a scheduled notification', async () => {
      await cancelScheduledNotification('test-id');
      expect(require('expo-notifications').cancelScheduledNotificationAsync).toHaveBeenCalledWith('test-id');
    });

    it('should handle cancellation errors gracefully', async () => {
      require('expo-notifications').cancelScheduledNotificationAsync.mockRejectedValue(new Error('Cancellation error'));
      await expect(cancelScheduledNotification('test-id')).resolves.not.toThrow();
    });
  });

  describe('cancelAllScheduledNotifications', () => {
    it('should cancel all scheduled notifications', async () => {
      await cancelAllScheduledNotifications();
      expect(require('expo-notifications').cancelAllScheduledNotificationsAsync).toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      require('expo-notifications').cancelAllScheduledNotificationsAsync.mockRejectedValue(new Error('Cancellation error'));
      await expect(cancelAllScheduledNotifications()).resolves.not.toThrow();
    });
  });

  describe('showImmediateNotification', () => {
    it('should show an immediate notification when preferences allow it', async () => {
      await showImmediateNotification({
        type: 'friend_request',
        title: 'New Friend Request',
        body: 'Someone wants to be your friend',
      });

      expect(require('expo-notifications').presentNotificationAsync).toHaveBeenCalledWith({
        title: 'New Friend Request',
        body: 'Someone wants to be your friend',
        data: {},
      });
    });

    it('should not show notification when type is disabled', async () => {
      updateSettings({
        notificationPrefs: {
          friendRequests: false,
        },
      });

      await showImmediateNotification({
        type: 'friend_request',
        title: 'New Friend Request',
        body: 'Someone wants to be your friend',
      });

      expect(require('expo-notifications').presentNotificationAsync).not.toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      require('expo-notifications').presentNotificationAsync.mockRejectedValue(new Error('Presentation error'));
      await expect(showImmediateNotification({
        type: 'friend_request',
        title: 'New Friend Request',
        body: 'Someone wants to be your friend',
      })).resolves.not.toThrow();
    });
  });

  describe('scheduleRestTimerNotification', () => {
    it('should schedule a rest timer notification', async () => {
      const notificationId = await scheduleRestTimerNotification(90);
      expect(notificationId).toBe('mock-notification-id');
      expect(require('expo-notifications').scheduleNotificationAsync).toHaveBeenCalled();
    });

    it('should cancel existing notifications before scheduling new one', async () => {
      await scheduleRestTimerNotification(90);
      expect(require('expo-notifications').cancelAllScheduledNotificationsAsync).toHaveBeenCalled();
    });

    it('should return null when rest timer notifications are disabled', async () => {
      updateSettings({
        notificationPrefs: {
          restTimer: false,
        },
      });

      const notificationId = await scheduleRestTimerNotification(90);
      expect(notificationId).toBeNull();
      expect(require('expo-notifications').scheduleNotificationAsync).not.toHaveBeenCalled();
    });
  });

  describe('cancelRestTimerNotification', () => {
    it('should cancel all scheduled notifications', async () => {
      await cancelRestTimerNotification();
      expect(require('expo-notifications').cancelAllScheduledNotificationsAsync).toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      require('expo-notifications').cancelAllScheduledNotificationsAsync.mockRejectedValue(new Error('Cancellation error'));
      await expect(cancelRestTimerNotification()).resolves.not.toThrow();
    });
  });
});