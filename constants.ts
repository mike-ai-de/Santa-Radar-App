import { City, AppSettings } from './types';

export const DEFAULT_SETTINGS: AppSettings = {
  arrivalHour: 18,
  arrivalMinute: 0,
  arrivalWindowMinutes: 20,
  safeDistanceKm: 250,
  nearDistanceKm: 10,
};

// Fallback location if geolocation is denied (Hamburg)
export const DEFAULT_USER_LOCATION: City = {
  name: "Hamburg",
  coords: { lat: 53.5511, lng: 9.9937 }
};

export const CITIES: City[] = [
  { name: "Berlin", coords: { lat: 52.5200, lng: 13.4050 } },
  { name: "Hamburg", coords: { lat: 53.5511, lng: 9.9937 } },
  { name: "Munich", coords: { lat: 48.1351, lng: 11.5820 } },
  { name: "Cologne", coords: { lat: 50.9375, lng: 6.9603 } },
  { name: "Frankfurt", coords: { lat: 50.1109, lng: 8.6821 } },
  { name: "Stuttgart", coords: { lat: 48.7758, lng: 9.1829 } },
  { name: "Düsseldorf", coords: { lat: 51.2277, lng: 6.7735 } },
  { name: "Leipzig", coords: { lat: 51.3397, lng: 12.3731 } },
  { name: "Dortmund", coords: { lat: 51.5136, lng: 7.4653 } },
  { name: "Bremen", coords: { lat: 53.0793, lng: 8.8017 } },
  { name: "Dresden", coords: { lat: 51.0504, lng: 13.7372 } },
  { name: "Hannover", coords: { lat: 52.3759, lng: 9.7320 } },
  { name: "Nuremberg", coords: { lat: 49.4521, lng: 11.0767 } },
  { name: "Paris", coords: { lat: 48.8566, lng: 2.3522 } },
  { name: "London", coords: { lat: 51.5074, lng: -0.1278 } },
  { name: "Prague", coords: { lat: 50.0755, lng: 14.4378 } },
  { name: "Warsaw", coords: { lat: 52.2297, lng: 21.0122 } },
  { name: "Vienna", coords: { lat: 48.2082, lng: 16.3738 } },
  { name: "Copenhagen", coords: { lat: 55.6761, lng: 12.5683 } },
  { name: "Rovaniemi", coords: { lat: 66.5039, lng: 25.7294 } }, // Home base
];