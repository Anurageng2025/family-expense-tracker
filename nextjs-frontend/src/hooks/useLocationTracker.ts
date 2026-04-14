'use client';

import { useEffect, useRef } from 'react';
import api from '@/services/api';

/**
 * Calculates distance between two points in meters using Haversine formula
 */
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3; // Earth radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon1 - lon2) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

export function useLocationTracker() {
  const lastSyncRef = useRef<number>(0);
  const lastPosRef = useRef<{ lat: number; lng: number } | null>(null);
  
  const MIN_DISTANCE = 30; // 30 meters
  const MAX_IDLE_TIME = 5 * 60 * 1000; // 5 minutes

  useEffect(() => {
    // Check if user is logged in
    const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    if (!userStr) return;

    const updateLocation = async (position: GeolocationPosition) => {
      const now = Date.now();
      const { latitude, longitude } = position.coords;

      // Check if we should sync based on movement or time
      let shouldSync = false;

      if (lastSyncRef.current === 0) {
        shouldSync = true;
      } else if (now - lastSyncRef.current > MAX_IDLE_TIME) {
        shouldSync = true;
      } else if (lastPosRef.current) {
        const distance = getDistance(
          latitude, 
          longitude, 
          lastPosRef.current.lat, 
          lastPosRef.current.lng
        );
        if (distance > MIN_DISTANCE) {
          shouldSync = true;
          console.log(`📍 Movement detected: ${Math.round(distance)}m`);
        }
      }

      if (!shouldSync) return;

      try {
        // Update backend
        await api.patch('/family/location', {
          lat: latitude,
          lng: longitude
        });

        // Save last known safely in localStorage as a backup
        localStorage.setItem('lastKnownLocation', JSON.stringify({
          lat: latitude,
          lng: longitude,
          timestamp: now
        }));

        lastSyncRef.current = now;
        lastPosRef.current = { lat: latitude, lng: longitude };
        console.log('📍 Location synced (Streaming Mode)');
      } catch (error) {
        console.error('❌ Failed to sync location:', error);
      }
    };

    const handleError = async (error: GeolocationPositionError) => {
      console.warn('📍 Geolocation error:', error.message);
      
      // Fallback: Notify backend even if GPS fails so it can use IP
      try {
        await api.patch('/family/location', {});
        console.log('📍 IP Location fallback triggered');
      } catch (err) {
        console.error('❌ Failed to trigger IP fallback:', err);
      }
    };

    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      console.log('🛰️ Initializing High-Persistence Tracking...');
      
      const watchId = navigator.geolocation.watchPosition(updateLocation, handleError, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      });

      // Cleanup on unmount
      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    }
  }, []);
}
