import { Barber, CustomerQueueEntry, SalonState, ServiceItem, QueueStatus, BarberId } from '../types/queue';

export const INITIAL_SERVICES: ServiceItem[] = [
  {
    id: 'haircut',
    name: 'Precision Haircut',
    durationMinutes: 30,
    priceINR: 350,
    active: true,
    category: 'Hair',
    description: 'Custom consult, wash, precision scissor & clipper cut, and styling.',
    icon: 'Scissors'
  },
  {
    id: 'beard-trim',
    name: 'Beard Sculpt & Trim',
    durationMinutes: 20,
    priceINR: 200,
    active: true,
    category: 'Beard',
    description: 'Line-up, beard shaping, hot towel treatment, and beard oil.',
    icon: 'Sparkles'
  },
  {
    id: 'hair-spa',
    name: 'Luxury Hair Spa',
    durationMinutes: 45,
    priceINR: 750,
    active: true,
    category: 'Spa & Treatments',
    description: 'Deep hair nourishment, scalp revitalizing steam, and massage.',
    icon: 'Droplet'
  },
  {
    id: 'facial',
    name: 'Charcoal Glow Facial',
    durationMinutes: 40,
    priceINR: 600,
    active: true,
    category: 'Spa & Treatments',
    description: 'Skin exfoliation, blackhead extraction, deep pore cleansing mask.',
    icon: 'Smile'
  },
  {
    id: 'hair-wash',
    name: 'Scalp Detox & Wash',
    durationMinutes: 15,
    priceINR: 150,
    active: true,
    category: 'Hair',
    description: 'Cooling menthol wash, conditioning rinse, and blow dry.',
    icon: 'Waves'
  },
  {
    id: 'royal-shave',
    name: 'Royal Hot Towel Shave',
    durationMinutes: 25,
    priceINR: 250,
    active: true,
    category: 'Beard',
    description: 'Traditional straight razor shave with essential oil prep.',
    icon: 'Shield'
  }
];

export const INITIAL_BARBERS: Barber[] = [
  {
    id: 'ravi',
    name: 'Ravi',
    specialty: 'Master Stylist & Fades',
    status: 'free',
    activeToday: true,
    avatar: 'R'
  },
  {
    id: 'amit',
    name: 'Amit',
    specialty: 'Beard Sculptor & Texture',
    status: 'busy',
    currentToken: 'S-12',
    currentCustomerName: 'Rajesh Patel',
    serviceStartTime: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    activeToday: true,
    avatar: 'A'
  },
  {
    id: 'imran',
    name: 'Imran',
    specialty: 'Spa Treatments & Classic Cut',
    status: 'free',
    activeToday: true,
    avatar: 'I'
  }
];

export const INITIAL_QUEUE: CustomerQueueEntry[] = [
  {
    id: 'cust-12',
    token: 'S-12',
    name: 'Rajesh Patel',
    phone: '9825012345',
    services: [INITIAL_SERVICES[0], INITIAL_SERVICES[1]],
    preferredBarber: 'amit',
    assignedBarber: 'Amit',
    status: 'In Chair',
    isWalkIn: false,
    createdAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    calledAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    inChairAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    estimatedWaitMinutes: 0,
    totalDurationMinutes: 50,
    totalPriceINR: 550
  },
  {
    id: 'cust-13',
    token: 'S-13',
    name: 'Anil Mehta',
    phone: '9898023456',
    services: [INITIAL_SERVICES[0]],
    preferredBarber: 'any',
    status: 'Waiting',
    isWalkIn: true,
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    estimatedWaitMinutes: 10,
    totalDurationMinutes: 30,
    totalPriceINR: 350
  },
  {
    id: 'cust-14',
    token: 'S-14',
    name: 'Kavita Sharma',
    phone: '9876543210',
    services: [INITIAL_SERVICES[0], INITIAL_SERVICES[3]],
    preferredBarber: 'ravi',
    status: 'Waiting',
    isWalkIn: false,
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    estimatedWaitMinutes: 20,
    totalDurationMinutes: 70,
    totalPriceINR: 950
  }
];

export const INITIAL_SALON_STATE: SalonState = {
  isOpen: true,
  openTime: '09:00',
  closeTime: '20:00',
  barbers: INITIAL_BARBERS,
  services: INITIAL_SERVICES,
  queue: INITIAL_QUEUE,
  dailyStats: {
    totalServed: 18,
    avgWaitMinutes: 18,
    noShowCount: 1,
    cancelCount: 2
  }
};

/**
 * Calculates estimated wait time for a new or existing customer entry.
 */
export function calculateEstimatedWait(
  state: SalonState,
  preferredBarber: BarberId,
  targetCustomerId?: string
): number {
  const activeBarbers = state.barbers.filter(b => b.activeToday && b.status !== 'break');
  if (activeBarbers.length === 0) return 60;

  // Filter waiting customers ahead
  const waitingQueue = state.queue.filter(q => q.status === 'Waiting');
  let customersAhead: CustomerQueueEntry[] = [];

  if (targetCustomerId) {
    const targetIndex = waitingQueue.findIndex(q => q.id === targetCustomerId);
    customersAhead = targetIndex >= 0 ? waitingQueue.slice(0, targetIndex) : waitingQueue;
  } else {
    customersAhead = waitingQueue;
  }

  // If specific barber chosen, only count customers eligible for that barber
  if (preferredBarber !== 'any') {
    const specificBarber = state.barbers.find(b => b.id === preferredBarber);
    if (!specificBarber || specificBarber.status === 'break') return 45;

    let totalDuration = customersAhead
      .filter(q => q.preferredBarber === preferredBarber || q.preferredBarber === 'any')
      .reduce((sum, q) => sum + q.totalDurationMinutes, 0);

    // If barber is busy, add remaining active service time
    if (specificBarber.status === 'busy' && specificBarber.serviceStartTime) {
      const elapsedMins = (Date.now() - new Date(specificBarber.serviceStartTime).getTime()) / 60000;
      totalDuration += Math.max(0, 30 - elapsedMins);
    }
    return Math.max(0, Math.round(totalDuration));
  } else {
    // For Any Barber: sum of all durations divided by active barbers
    const totalDuration = customersAhead.reduce((sum, q) => sum + q.totalDurationMinutes, 0);
    const inChairRemaining = activeBarbers.reduce((sum, b) => {
      if (b.status === 'busy') return sum + 15;
      return sum;
    }, 0);

    const estimated = (totalDuration + inChairRemaining) / activeBarbers.length;
    return Math.max(0, Math.round(estimated));
  }
}

/**
 * Validates a 10-digit Indian phone number
 */
export function validatePhoneNumber(phone: string): { isValid: boolean; message: string } {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length !== 10) {
    return { isValid: false, message: 'Please enter a valid 10-digit mobile number' };
  }
  if (!/^[6-9]/.test(cleaned)) {
    return { isValid: false, message: 'Mobile number should begin with 6, 7, 8, or 9' };
  }
  return { isValid: true, message: '' };
}

/**
 * Checks if a phone number already has an active spot in queue
 */
export function isPhoneActiveInQueue(state: SalonState, phone: string): CustomerQueueEntry | undefined {
  const cleaned = phone.replace(/\D/g, '');
  return state.queue.find(q => {
    const qCleaned = q.phone.replace(/\D/g, '');
    const isActiveStatus = q.status === 'Waiting' || q.status === 'Called' || q.status === 'In Chair';
    return qCleaned === cleaned && isActiveStatus;
  });
}

/**
 * Generates the next sequential token (e.g. S-15)
 */
export function generateNextToken(queue: CustomerQueueEntry[]): string {
  const maxNumber = queue.reduce((max, entry) => {
    const match = entry.token.match(/S-(\d+)/);
    if (match) {
      const num = parseInt(match[1], 10);
      return num > max ? num : max;
    }
    return max;
  }, 10);

  return `S-${maxNumber + 1}`;
}
