import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { GeodesicLine } from 'leaflet.geodesic';

const GeodesicLineLayer = ({ from, to }) => {
  const map = useMap();

  React.useEffect(() => {
    const line = new GeodesicLine([from, to], {
      weight: 3,
      color: '#FF5555',
      steps: 50,
      wrap: false
    }).addTo(map);

    return () => {
      map.removeLayer(line);
    };
  }, [map, from, to]);

  return null;
};

/**
 * GeodesicPath component renders a map displaying a geodesic line between two points.
 *
 * @param {Object} props - The properties object.
 * @param {Array<number>} props.from - The starting point coordinates [latitude, longitude].
 * @param {Array<number>} props.to - The ending point coordinates [latitude, longitude].
 *
 * The component calculates the midpoint and appropriate zoom level for the map based on the distance between the two points.
 * It displays markers at the start and end points, with a popup indicating "Departure" and "Arrival" respectively.
 * A geodesic line is drawn between the points using the GeodesicLineLayer.
 *
 * Dependencies: react-leaflet, leaflet.geodesic
 */
const GeodesicPath = ({ from, to }) => {
  const fromPoint = [from[0], from[1]];
  const toPoint = [to[0], to[1]];

  const center = [
    (from[0] + to[0]) / 2,
    (from[1] + to[1]) / 2
  ];

  /**
   * Calculate the zoom level for the map given the distance between the two points.
   * The zoom level is determined as follows:
   * - If the distance is greater than 5000 km, the zoom level is 2.
   * - If the distance is greater than 2000 km, the zoom level is 3.
   * - If the distance is greater than 1000 km, the zoom level is 4.
   * - If the distance is greater than 500 km, the zoom level is 5.
   * - If the distance is greater than 250 km, the zoom level is 6.
   * - If the distance is greater than 100 km, the zoom level is 7.
   * - If the distance is greater than 50 km, the zoom level is 8.
   * - Otherwise, the zoom level is 9.
   * @return {number} The calculated zoom level.
   */
  const calculateZoom = () => {
    const R = 6371;
    const lat1 = from[0] * Math.PI / 180;
    const lat2 = to[0] * Math.PI / 180;
    const dLat = (to[0] - from[0]) * Math.PI / 180;
    const dLon = (to[1] - from[1]) * Math.PI / 180;

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    if (distance > 5000) return 2;
    if (distance > 2000) return 3;
    if (distance > 1000) return 4;
    if (distance > 500) return 5;
    if (distance > 250) return 6;
    if (distance > 100) return 7;
    if (distance > 50) return 8;
    if (distance > 25) return 9;
    if (distance > 10) return 10;
    if (distance > 5) return 11;
    if (distance > 2) return 12;
    if (distance > 1) return 13;
    return 14;
  };

  return (

    <MapContainer
      style={{ height: '200px', width: '100%' }}
      center={[center[0], center[1]]}
      zoom={calculateZoom()}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[from[0], from[1]]}>
        <Popup>Departure</Popup>
      </Marker>
      <Marker position={[to[0], to[1]]}>
        <Popup>Arrival</Popup>
      </Marker>
      <GeodesicLineLayer from={fromPoint} to={toPoint} />
    </MapContainer>

  );
};

export default GeodesicPath;