export type QueueStatus = 'Waiting' | 'Called' | 'In Chair' | 'Done' | 'Cancelled' | 'No-show';

export type BarberId = 'ravi' | 'amit' | 'imran' | 'any';

export type BarberStatus = 'free' | 'busy' | 'break';

export interface ServiceItem {
  id: string;
  nameEn: string;
  nameGu: string;
  durationMinutes: number;
  priceINR: number;
  active: boolean;
  category?: string;
}

export interface Barber {
  id: string;
  name: string;
  status: BarberStatus;
  currentCustomerId?: string;
  currentCustomerName?: string;
  currentToken?: string;
  serviceStartTime?: string;
  activeToday: boolean;
  photoUrl?: string;
}

export interface CustomerQueueEntry {
  id: string;
  token: string;
  name: string;
  phone: string;
  services: ServiceItem[];
  preferredBarber: BarberId;
  assignedBarber?: string;
  status: QueueStatus;
  isWalkIn: boolean;
  createdAt: string;
  calledAt?: string;
  inChairAt?: string;
  completedAt?: string;
  estimatedWaitMinutes: number;
  totalDurationMinutes: number;
  totalPriceINR: number;
}

export interface SalonState {
  isOpen: boolean;
  openTime: string;
  closeTime: string;
  barbers: Barber[];
  services: ServiceItem[];
  queue: CustomerQueueEntry[];
  dailyStats: {
    totalServed: number;
    avgWaitMinutes: number;
    noShowCount: number;
    cancelCount: number;
  };
}
