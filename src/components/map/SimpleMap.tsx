
import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

interface SimpleMapProps {
  center: [number, number];  // [latitude, longitude]
  zoom: number;
  markers?: Array<{
    position: [number, number];
    popupContent?: string;
    icon?: string;
    highlighted?: boolean;
  }>;
  routes?: Array<{
    points: Array<[number, number]>;
    color?: string;
    weight?: number;
    popup?: string;
    highlighted?: boolean;
  }>;
  className?: string;
  style?: React.CSSProperties;
}

// Define a default center for India if none provided
const INDIA_DEFAULT_CENTER: [number, number] = [20.5937, 78.9629]; // Center of India

// Define marker icons
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const highlightedIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const SimpleMap = ({
  center = INDIA_DEFAULT_CENTER,
  zoom = 5,
  markers = [],
  routes = [],
  className = '',
  style = { height: '400px' }
}: SimpleMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const routesRef = useRef<L.Polyline[]>([]);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map if it doesn't exist
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView(center, zoom);

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(mapInstanceRef.current);
    } else {
      // Update view if map already exists
      mapInstanceRef.current.setView(center, zoom);
    }

    const map = mapInstanceRef.current;

    // Clear existing markers and routes
    markersRef.current.forEach(marker => {
      map.removeLayer(marker);
    });
    markersRef.current = [];

    routesRef.current.forEach(route => {
      map.removeLayer(route);
    });
    routesRef.current = [];

    // Add markers
    markers.forEach(marker => {
      const markerIcon = marker.highlighted ? highlightedIcon : defaultIcon;
      const markerInstance = L.marker(marker.position, { icon: markerIcon }).addTo(map);
      
      if (marker.popupContent) {
        markerInstance.bindPopup(marker.popupContent);
      }
      
      if (marker.highlighted) {
        markerInstance.openPopup();
      }
      
      markersRef.current.push(markerInstance);
    });

    // Add routes
    routes.forEach(route => {
      const polyline = L.polyline(route.points, {
        color: route.color || '#3388ff',
        weight: route.weight || 4,
        opacity: route.highlighted ? 1 : 0.7,
        dashArray: route.highlighted ? undefined : '5, 5'
      }).addTo(map);
      
      if (route.popup) {
        polyline.bindPopup(route.popup);
      }
      
      if (route.highlighted) {
        polyline.bringToFront();
      }
      
      routesRef.current.push(polyline);
    });

    // If there are markers or routes, fit the map bounds to show all of them
    if (markers.length > 0 || routes.length > 0) {
      const allPoints: L.LatLngExpression[] = [];
      
      // Add marker positions to points
      markers.forEach(marker => {
        allPoints.push(marker.position);
      });
      
      // Add route points to points
      routes.forEach(route => {
        route.points.forEach(point => {
          allPoints.push(point);
        });
      });
      
      if (allPoints.length > 0) {
        map.fitBounds(L.latLngBounds(allPoints), { padding: [50, 50] });
      }
    }

    // Cleanup function
    return () => {
      // We don't destroy the map on unmount to prevent re-initialization issues
      // Only clean it up when the component is truly unmounted
    };
  }, [center, zoom, markers, routes]);

  return <div ref={mapRef} className={className} style={style} />;
};

export default SimpleMap;
