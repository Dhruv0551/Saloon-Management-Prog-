import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SalonState, CustomerQueueEntry, BarberId, ServiceItem, QueueStatus } from '../types/queue';
import {
  INITIAL_SALON_STATE,
  calculateEstimatedWait,
  generateNextToken,
  isPhoneActiveInQueue,
  validatePhoneNumber
} from './queueEngine';

interface QueueContextType {
  state: SalonState;
  addCustomer: (data: {
    name: string;
    phone: string;
    services: ServiceItem[];
    preferredBarber: BarberId;
    isWalkIn?: boolean;
  }) => { success: boolean; entry?: CustomerQueueEntry; error?: string };
  callNextCustomer: (barberId: BarberId) => void;
  startService: (barberId: BarberId) => void;
  completeService: (barberId: BarberId) => void;
  cancelQueueEntry: (customerId: string, reason?: string) => void;
  markNoShow: (customerId: string) => void;
  toggleBarberBreak: (barberId: BarberId) => void;
  toggleQueueOpen: () => void;
  getEstimatedWait: (preferredBarber: BarberId, customerId?: string) => number;
}

const STORAGE_KEY = 'luxe_salon_state_v2';
const BROADCAST_CHANNEL_NAME = 'luxe_salon_sync_channel';

const QueueContext = createContext<QueueContextType | undefined>(undefined);

export const QueueProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<SalonState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load initial salon state from storage', e);
    }
    return INITIAL_SALON_STATE;
  });

  // Cross-tab synchronization using BroadcastChannel
  useEffect(() => {
    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      channel.onmessage = (event) => {
        if (event.data && event.data.type === 'SALON_STATE_UPDATE') {
          setState(event.data.payload);
        }
      };
    } catch (e) {
      console.warn('BroadcastChannel not supported in this environment', e);
    }

    return () => {
      channel?.close();
    };
  }, []);

  // Save to localStorage and broadcast whenever state changes
  const updateStateAndBroadcast = (newState: SalonState) => {
    setState(newState);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      const channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      channel.postMessage({ type: 'SALON_STATE_UPDATE', payload: newState });
      channel.close();
    } catch (e) {
      console.error('Failed to persist or broadcast salon state update', e);
    }
  };

  const getEstimatedWait = (preferredBarber: BarberId, customerId?: string): number => {
    return calculateEstimatedWait(state, preferredBarber, customerId);
  };

  const addCustomer = ({
    name,
    phone,
    services,
    preferredBarber,
    isWalkIn = false
  }: {
    name: string;
    phone: string;
    services: ServiceItem[];
    preferredBarber: BarberId;
    isWalkIn?: boolean;
  }) => {
    if (!name.trim() || name.trim().length < 2) {
      return { success: false, error: 'Please enter a valid customer name' };
    }

    const phoneValidation = validatePhoneNumber(phone);
    if (!phoneValidation.isValid) {
      return { success: false, error: phoneValidation.message };
    }

    if (services.length === 0) {
      return { success: false, error: 'Please select at least 1 service' };
    }

    if (services.length > 3) {
      return { success: false, error: 'You can select a maximum of 3 services' };
    }

    const existingActive = isPhoneActiveInQueue(state, phone);
    if (existingActive) {
      return {
        success: false,
        error: `An active queue token (${existingActive.token}) already exists for this phone number.`
      };
    }

    const token = generateNextToken(state.queue);
    const totalDuration = services.reduce((acc, s) => acc + s.durationMinutes, 0);
    const totalPrice = services.reduce((acc, s) => acc + s.priceINR, 0);
    const estimatedWait = calculateEstimatedWait(state, preferredBarber);

    const newEntry: CustomerQueueEntry = {
      id: `cust-${Date.now()}`,
      token,
      name: name.trim(),
      phone: phone.replace(/\D/g, ''),
      services,
      preferredBarber,
      status: 'Waiting',
      isWalkIn,
      createdAt: new Date().toISOString(),
      estimatedWaitMinutes: estimatedWait,
      totalDurationMinutes: totalDuration,
      totalPriceINR: totalPrice
    };

    const updatedQueue = [...state.queue, newEntry];
    const newState: SalonState = {
      ...state,
      queue: updatedQueue
    };

    updateStateAndBroadcast(newState);
    return { success: true, entry: newEntry };
  };

  const callNextCustomer = (barberId: BarberId) => {
    const barber = state.barbers.find(b => b.id === barberId);
    if (!barber || barber.status === 'break') return;

    // Find the oldest Waiting customer matching this barber or 'any'
    const eligibleCustomer = state.queue.find(
      q => q.status === 'Waiting' && (q.preferredBarber === barberId || q.preferredBarber === 'any')
    );

    if (!eligibleCustomer) return;

    const updatedQueue = state.queue.map(q => {
      if (q.id === eligibleCustomer.id) {
        return {
          ...q,
          status: 'Called' as QueueStatus,
          assignedBarber: barber.name,
          calledAt: new Date().toISOString()
        };
      }
      return q;
    });

    const updatedBarbers = state.barbers.map(b => {
      if (b.id === barberId) {
        return {
          ...b,
          status: 'busy' as const,
          currentToken: eligibleCustomer.token,
          currentCustomerName: eligibleCustomer.name,
          currentCustomerId: eligibleCustomer.id,
          serviceStartTime: new Date().toISOString()
        };
      }
      return b;
    });

    updateStateAndBroadcast({
      ...state,
      queue: updatedQueue,
      barbers: updatedBarbers
    });
  };

  const startService = (barberId: BarberId) => {
    const barber = state.barbers.find(b => b.id === barberId);
    if (!barber || !barber.currentCustomerId) return;

    const updatedQueue = state.queue.map(q => {
      if (q.id === barber.currentCustomerId) {
        return {
          ...q,
          status: 'In Chair' as QueueStatus,
          inChairAt: new Date().toISOString()
        };
      }
      return q;
    });

    updateStateAndBroadcast({
      ...state,
      queue: updatedQueue
    });
  };

  const completeService = (barberId: BarberId) => {
    const barber = state.barbers.find(b => b.id === barberId);
    if (!barber || !barber.currentCustomerId) return;

    const updatedQueue = state.queue.map(q => {
      if (q.id === barber.currentCustomerId) {
        return {
          ...q,
          status: 'Done' as QueueStatus,
          completedAt: new Date().toISOString()
        };
      }
      return q;
    });

    const updatedBarbers = state.barbers.map(b => {
      if (b.id === barberId) {
        return {
          ...b,
          status: 'free' as const,
          currentToken: undefined,
          currentCustomerName: undefined,
          currentCustomerId: undefined,
          serviceStartTime: undefined
        };
      }
      return b;
    });

    const newDailyStats = {
      ...state.dailyStats,
      totalServed: state.dailyStats.totalServed + 1
    };

    updateStateAndBroadcast({
      ...state,
      queue: updatedQueue,
      barbers: updatedBarbers,
      dailyStats: newDailyStats
    });
  };

  const cancelQueueEntry = (customerId: string) => {
    const entry = state.queue.find(q => q.id === customerId);
    if (!entry) return;

    const updatedQueue = state.queue.map(q => {
      if (q.id === customerId) {
        return {
          ...q,
          status: 'Cancelled' as QueueStatus
        };
      }
      return q;
    });

    // If customer was currently assigned to a barber, free up that barber
    const updatedBarbers = state.barbers.map(b => {
      if (b.currentCustomerId === customerId) {
        return {
          ...b,
          status: 'free' as const,
          currentToken: undefined,
          currentCustomerName: undefined,
          currentCustomerId: undefined,
          serviceStartTime: undefined
        };
      }
      return b;
    });

    updateStateAndBroadcast({
      ...state,
      queue: updatedQueue,
      barbers: updatedBarbers,
      dailyStats: {
        ...state.dailyStats,
        cancelCount: state.dailyStats.cancelCount + 1
      }
    });
  };

  const markNoShow = (customerId: string) => {
    const updatedQueue = state.queue.map(q => {
      if (q.id === customerId) {
        return {
          ...q,
          status: 'No-show' as QueueStatus
        };
      }
      return q;
    });

    const updatedBarbers = state.barbers.map(b => {
      if (b.currentCustomerId === customerId) {
        return {
          ...b,
          status: 'free' as const,
          currentToken: undefined,
          currentCustomerName: undefined,
          currentCustomerId: undefined,
          serviceStartTime: undefined
        };
      }
      return b;
    });

    updateStateAndBroadcast({
      ...state,
      queue: updatedQueue,
      barbers: updatedBarbers,
      dailyStats: {
        ...state.dailyStats,
        noShowCount: state.dailyStats.noShowCount + 1
      }
    });
  };

  const toggleBarberBreak = (barberId: BarberId) => {
    const updatedBarbers = state.barbers.map(b => {
      if (b.id === barberId) {
        const nextStatus = b.status === 'break' ? 'free' : 'break';
        return { ...b, status: nextStatus as any };
      }
      return b;
    });

    updateStateAndBroadcast({
      ...state,
      barbers: updatedBarbers
    });
  };

  const toggleQueueOpen = () => {
    updateStateAndBroadcast({
      ...state,
      isOpen: !state.isOpen
    });
  };

  return (
    <QueueContext.Provider
      value={{
        state,
        addCustomer,
        callNextCustomer,
        startService,
        completeService,
        cancelQueueEntry,
        markNoShow,
        toggleBarberBreak,
        toggleQueueOpen,
        getEstimatedWait
      }}
    >
      {children}
    </QueueContext.Provider>
  );
};

export const useQueue = (): QueueContextType => {
  const context = useContext(QueueContext);
  if (!context) {
    throw new Error('useQueue must be used within a QueueProvider');
  }
  return context;
};
