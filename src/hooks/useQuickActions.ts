import { useEffect } from 'react';
import { DeviceEventEmitter, NativeModules, Platform } from 'react-native';
import QuickActions from 'react-native-quick-actions';
import { router } from 'expo-router';

type QuickActionType = 'AddLead' | 'OpenChats';

interface QuickActionData {
  type: QuickActionType;
  userInfo?: {
    url?: string;
  };
}

const QUICK_ACTIONS = [
  {
    type: 'AddLead',
    title: 'Add Lead',
    subtitle: 'Add a new lead',
    icon: Platform.OS === 'ios' ? 'Compose' : 'ic_add_lead',
    userInfo: { url: 'add_lead' },
  },
  {
    type: 'OpenChats',
    title: 'Chats',
    subtitle: 'Open conversations',
    icon: Platform.OS === 'ios' ? 'Message' : 'ic_chats',
    userInfo: { url: 'open_chats' },
  },
];

const isQuickActionsAvailable = (): boolean =>
  Platform.OS === 'ios' ? !!NativeModules.RNQuickActionManager : !!NativeModules.ReactAppShortcuts;

export const useQuickActions = (isAuthenticated: boolean): void => {
  useEffect(() => {
    if (!isQuickActionsAvailable()) {
      console.warn('QuickActions: Native module not found.');
      return;
    }

    try {
      QuickActions.setShortcutItems(QUICK_ACTIONS);
    } catch (error) {
      console.warn('QuickActions: Failed to set shortcuts', error);
    }
  }, []);

  useEffect(() => {
    if (!isQuickActionsAvailable()) return;

    const isQuickActionValid = (action: unknown): action is QuickActionData =>
      typeof action === 'object' &&
      action !== null &&
      'type' in action &&
      ['AddLead', 'OpenChats'].includes((action as QuickActionData).type);

    const handleAction = (data: QuickActionData | null): void => {
      if (!data || !isAuthenticated) return;

      switch (data.type) {
        case 'AddLead':
          router.push('/(tabs)/leads');
          break;
        case 'OpenChats':
          router.push('/(tabs)/conversations');
          break;
      }
    };

    QuickActions.popInitialAction()
      .then((action) => {
        if (action && isQuickActionValid(action)) {
          handleAction(action);
        }
      })
      .catch(() => {});

    const listener = DeviceEventEmitter.addListener('quickActionShortcut', (action: unknown) => {
      if (isQuickActionValid(action)) {
        handleAction(action);
      }
    });

    return () => {
      listener.remove();
    };
  }, [isAuthenticated]);
};
