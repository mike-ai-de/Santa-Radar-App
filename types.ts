export interface LatLng {
  lat: number;
  lng: number;
}

export interface City {
  name: string;
  coords: LatLng;
}

export enum FlightPhase {
  CRUISING = "CRUISING",
  APPROACHING = "APPROACHING",
  ORBITING = "ORBITING (NEAR)",
  DEPARTING = "DEPARTING"
}

export interface FlightStatus {
  position: LatLng;
  heading: number;
  speedKmh: number;
  altitudeFt: number;
  phase: FlightPhase;
  nextStop: string;
  distanceToUser: number; // km
}

export interface AppSettings {
  arrivalHour: number;
  arrivalMinute: number;
  arrivalWindowMinutes: number;
  safeDistanceKm: number;
  nearDistanceKm: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
}