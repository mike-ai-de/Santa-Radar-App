import { LatLng } from '../types';

export const toRad = (value: number) => (value * Math.PI) / 180;
export const toDeg = (value: number) => (value * 180) / Math.PI;

export const getDistanceKm = (pos1: LatLng, pos2: LatLng): number => {
  const R = 6371; // Radius of the earth in km
  const dLat = toRad(pos2.lat - pos1.lat);
  const dLon = toRad(pos2.lng - pos1.lng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(pos1.lat)) *
      Math.cos(toRad(pos2.lat)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const getBearing = (start: LatLng, dest: LatLng): number => {
  const startLat = toRad(start.lat);
  const startLng = toRad(start.lng);
  const destLat = toRad(dest.lat);
  const destLng = toRad(dest.lng);

  const y = Math.sin(destLng - startLng) * Math.cos(destLat);
  const x =
    Math.cos(startLat) * Math.sin(destLat) -
    Math.sin(startLat) * Math.cos(destLat) * Math.cos(destLng - startLng);
  let brng = Math.atan2(y, x);
  brng = toDeg(brng);
  return (brng + 360) % 360;
};

export const interpolatePosition = (start: LatLng, end: LatLng, fraction: number): LatLng => {
  return {
    lat: start.lat + (end.lat - start.lat) * fraction,
    lng: start.lng + (end.lng - start.lng) * fraction,
  };
};

// Generates a point on a circle around a center
export const getOrbitPosition = (center: LatLng, radiusKm: number, angleDeg: number): LatLng => {
  const R = 6371;
  const lat1 = toRad(center.lat);
  const lon1 = toRad(center.lng);
  const brng = toRad(angleDeg);
  const d = radiusKm;

  const lat2 = Math.asin(Math.sin(lat1) * Math.cos(d / R) + Math.cos(lat1) * Math.sin(d / R) * Math.cos(brng));
  const lon2 = lon1 + Math.atan2(Math.sin(brng) * Math.sin(d / R) * Math.cos(lat1), Math.cos(d / R) - Math.sin(lat1) * Math.sin(lat2));

  return {
    lat: toDeg(lat2),
    lng: toDeg(lon2)
  };
};