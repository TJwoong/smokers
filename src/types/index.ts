export enum LocationType {
  BOOTH = 'BOOTH',
  OUTDOOR = 'OUTDOOR',
  INDOOR = 'INDOOR',
}

export enum LocationStatus {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  INACTIVE = 'INACTIVE',
}

export interface OperatingHours {
  [day: string]: {
    open: string;
    close: string;
  };
}

export interface SeatingOptions {
  chairs: boolean;
  tables: boolean;
  standingArea: boolean;
  wheelchairAccessible: boolean;
}

export interface WeatherProtection {
  roof: boolean;
  windBreak: boolean;
  heaters: boolean;
  coveredArea: boolean;
}

export interface Review {
  id?: string;
  cleanliness: number;
  comment: string;
  createdAt: any;
  images?: string[];
  locationId: string;
  rating: number;
  safetyLevel: number;
  userId: string;
  userName?: string;
  userPhotoURL?: string;
  imageUrl?: string;
  helpfulCount?: number;
  commentCount?: number;
}

export interface SmokingLocation {
  id?: string;
  address: string;
  createdAt: any;
  createdBy: string;
  description?: string;
  isVerified: boolean;
  latitude: number;
  longitude: number;
  name: string;
  tags: string[];
  type: LocationType; // 배열에서 단일 값으로 변경
  imageUrl?: string;
  rating?: number;
  reviewCount?: number;
  operatingHours?: OperatingHours;
  seating?: SeatingOptions;
  weatherProtection?: WeatherProtection;
  status?: LocationStatus;
}

export interface LocationInput {
  name: string;
  address: string;
  type: LocationType;
  description: string;
  latitude: number;
  longitude: number;
  operatingHours: OperatingHours;
  seating: SeatingOptions;
  weatherProtection: WeatherProtection;
  status: LocationStatus;
  createdBy: string;
  tags: string[];
  imageUrl?: string;
}

