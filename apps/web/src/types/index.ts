export type Role = 'TOURIST' | 'VENDOR' | 'ADMIN';
export type VendorStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
export type OrderPaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED' | 'REJECTED';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  phone?: string;
  isPremium?: boolean;
  vendor?: {
    id: string;
    businessName: string;
    status: VendorStatus;
  } | null;
}

export interface Vendor {
  id: string;
  userId: string;
  businessName: string;
  description: string;
  businessType: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  district: string;
  latitude?: number;
  longitude?: number;
  logo?: string;
  coverImage?: string;
  status: VendorStatus;
  user?: Partial<User>;
  offerings?: Offering[];
  orders?: Order[];
  createdAt: string;
}

export interface Offering {
  id: string;
  vendorId: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  price: number;
  duration: string;
  maxGuests: number;
  location: string;
  latitude?: number;
  longitude?: number;
  coverImage: string;
  gallery: string[];
  isActive: boolean;
  vendor?: Partial<Vendor>;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  vendorId: string;
  offeringId: string;
  quantity: number;
  bookingDate: string;
  amount: number;
  commissionAmount?: number;
  vendorEarnings?: number;
  currency: string;
  paymentStatus: OrderPaymentStatus;
  orderStatus: OrderStatus;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  notes?: string;
  offering?: Offering;
  vendor?: Partial<Vendor>;
  user?: Partial<User>;
  createdAt: string;
}

export interface Circuit {
  id: string;
  name: string;
  slug: string;
  description: string;
  heroImage: string;
  overview: string;
  locations: string[];
  destinations?: Destination[];
}

export interface Destination {
  id: string;
  name: string;
  slug: string;
  description: string;
  districtId: string;
  district?: District;
  circuitId?: string;
  circuit?: Circuit;
  category: string;
  heroImage: string;
  gallery: string[];
  latitude: number;
  longitude: number;
  overview: string;
  travelInformation: {
    bestTime?: string;
    howToReach?: string;
    suggestedDuration?: string;
    entryFee?: string;
  };
  stays: Array<{ name: string; rating: number; price: string }>;
  recommendations: string[];
}

export interface District {
  id: string;
  name: string;
  slug: string;
  region: string;
  description: string;
  heroImage: string;
  latitude: number;
  longitude: number;
  destinations?: Destination[];
}

export interface TourismEvent {
  id: string;
  title: string;
  slug: string;
  category: 'Festival' | 'Fair' | 'Cultural' | 'Seasonal' | 'Religious' | 'Arts';
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  district: string;
  latitude: number;
  longitude: number;
  heroImage: string;
  gallery: string[];
  nearbyVendors?: Vendor[];
  nearbyAttractions?: Destination[];
}

export interface Favorite {
  id: string;
  userId: string;
  destinationId: string;
  destination?: Destination;
  createdAt?: string;
}

export interface AiItineraryResponse {
  title: string;
  summary: string;
  suggestedDuration: string;
  recommendedCircuits: string[];
  highlightDestinations: string[];
  dayByDayItinerary: Array<{
    day: number;
    title: string;
    activities: string[];
    recommendedFood: string;
  }>;
  insiderTips: string[];
}
