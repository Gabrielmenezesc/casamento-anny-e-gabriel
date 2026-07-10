export interface RSVP {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  adultsCount: number;
  childrenCount: number;
  notes?: string;
  confirmedAt: string;
}

export interface GodparentConfirmation {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  isConfirmed: boolean;
  message?: string;
  clothingSize: string; // Terno/Vestido
  shoeSize: string;
  dietaryRestrictions?: string;
  companionName?: string;
  confirmedAt: string;
}

export interface GiftItem {
  id: string;
  name: string;
  category: string;
  status: 'available' | 'reserved' | 'delivered';
  reservedBy?: string;
  reservedPhone?: string;
  reservationMessage?: string;
  isAnonymous?: boolean;
  reservedAt?: string;
}

export interface HoneymoonSettings {
  goal: number;
  currentAmount: number;
  pixKey: string;
  qrCodeUrl: string;
  cardPaymentUrl: string;
  description: string;
}

export interface AppSettings {
  coupleName1: string;
  coupleName2: string;
  weddingDate: string; // e.g. "2027-04-25"
  weddingTime: string; // e.g. "15:00"
  locationName: string;
  locationAddress: string;
  locationMapUrl: string;
  locationMapIframeUrl: string;
  couplePhotoUrl?: string;
  godparentsCode?: string;
}
