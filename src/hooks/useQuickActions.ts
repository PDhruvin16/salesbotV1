import { useEffect } from 'react';
import { DeviceEventEmitter, NativeModules, Platform } from 'react-native';
import QuickActions from 'react-native-quick-actions';
import { navigate, navigationRef } from '../navigation/navigationRef';
import { AppStackParamList } from '../navigation/AppNavigator';

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

// Module-level helper — stable reference, no closure issues
const isQuickActionsAvailable = (): boolean =>
  Platform.OS === 'ios' ? !!NativeModules.RNQuickActionManager : !!NativeModules.ReactAppShortcuts;

export const useQuickActions = (isAuthenticated: boolean): void => {
  // Register shortcuts once on mount — no deps needed
  useEffect(() => {
    if (!isQuickActionsAvailable()) {
      console.warn(
        'QuickActions: Native module not found. Rebuild the app and ensure native modules are linked.',
      );
      return;
    }

    try {
      QuickActions.setShortcutItems(QUICK_ACTIONS);
    } catch (error) {
      console.warn('QuickActions: Failed to set shortcuts', error);
    }
  }, []);

  // Handle quick action events — re-runs when auth state changes
  useEffect(() => {
    if (!isQuickActionsAvailable()) return;

    // All helpers defined INSIDE the effect so dep array [isAuthenticated] is exhaustive
    const navigateWhenReady = (screen: keyof AppStackParamList): void => {
      if (navigationRef.isReady()) {
        navigate(screen as Parameters<typeof navigate>[0]);
        return;
      }
      setTimeout(() => {
        if (navigationRef.isReady()) {
          navigate(screen as Parameters<typeof navigate>[0]);
        }
      }, 300);
    };

    const isQuickActionValid = (action: unknown): action is QuickActionData =>
      typeof action === 'object' &&
      action !== null &&
      'type' in action &&
      ['AddLead', 'OpenChats'].includes((action as QuickActionData).type);

    const handleAction = (data: QuickActionData | null): void => {
      if (!data || !isAuthenticated) return;

      switch (data.type) {
        case 'AddLead':
          navigateWhenReady('Leads');
          break;
        case 'OpenChats':
          navigateWhenReady('Conversations');
          break;
      }
    };

    // Cold start (app opened via quick action)
    QuickActions.popInitialAction()
      .then((action) => {
        if (action && isQuickActionValid(action)) {
          handleAction(action);
        }
      })
      .catch(() => {});

    // Background / foreground (app already running)
    const listener = DeviceEventEmitter.addListener('quickActionShortcut', (action: unknown) => {
      if (isQuickActionValid(action)) {
        handleAction(action);
      }
    });

    return () => {
      listener.remove();
    };
  }, [isAuthenticated]); // ✅ exhaustive — handleAction defined inside, captures isAuthenticated directly
};
