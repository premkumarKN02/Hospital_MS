import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  MapPin,
  Navigation,
  Radio,
  Send,
  RefreshCw,
  Clock,
  Battery,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  AlertCircle,
  PhoneCall,
  User,
  Zap,
  Hospital,
  Crosshair,
  Copy,
  Check,
  Search,
  Filter,
  Layers,
  QrCode,
  Compass,
  Map as MapIcon,
  MessageSquare,
  Trash2
} from 'lucide-react';
import { doctorTrackingApi, whatsappApi, DoctorLocation, ActivationResponse } from '../../api/doctorTrackingApi';
import { sendUniversalWhatsApp, getWhatsAppShareUrl, formatWhatsAppNumber } from '../../utils/whatsappUtils';

// Default Regional Hub Coordinates (Bhavani, Erode District, Tamil Nadu)
const DEFAULT_HOSPITAL_LAT = 11.4428;
const DEFAULT_HOSPITAL_LNG = 77.7011;
const NETWORK_HOST = '10.222.64.56:5175';

// Real-world Map Tile Providers (100% Free, No API Keys Required)
const MAP_LAYERS = {
  streets: {
    name: 'Street Map',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  },
  satellite: {
    name: 'Satellite View',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  },
  terrain: {
    name: 'Topography / Terrain',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: 'Map data: &copy; OpenStreetMap contributors, SRTM | Map style: &copy; OpenTopoMap (CC-BY-SA)'
  }
};

export const DoctorLiveTrackingMap: React.FC = () => {
  const [doctors, setDoctors] = useState<DoctorLocation[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // Map Tile Layer Selection
  const [activeTileType, setActiveTileType] = useState<'streets' | 'satellite' | 'terrain'>('streets');

  // Hospital Coordinates (Default: Bhavani HQ)
  const [hospitalCoords, setHospitalCoords] = useState<{ lat: number; lng: number }>(() => {
    const saved = localStorage.getItem('hospital_base_coords');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.lat && Math.abs(parsed.lat - DEFAULT_HOSPITAL_LAT) < 0.3) {
          return parsed;
        }
      } catch {}
    }
    return { lat: DEFAULT_HOSPITAL_LAT, lng: DEFAULT_HOSPITAL_LNG };
  });

  const [hospitalName, setHospitalName] = useState(() => {
    const savedName = localStorage.getItem('hospital_base_name');
    if (savedName && (savedName.includes('Bhavani') || savedName.includes('Sindhu'))) {
      return savedName;
    }
    return 'Sindhu Bhavani Operations HQ';
  });

  // User Current Device Location & Source
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; accuracy?: number } | null>(null);
  const [locationSource, setLocationSource] = useState<string>('Bhavani Operations Base (11.4428, 77.7011)');
  const [gpsPermissionDenied, setGpsPermissionDenied] = useState<boolean>(false);
  const [isLocatingUser, setIsLocatingUser] = useState(false);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

  // Address Search / Geocoding
  const [addressSearchQuery, setAddressSearchQuery] = useState('');
  const [isSearchingAddress, setIsSearchingAddress] = useState(false);
  const [addressSearchResults, setAddressSearchResults] = useState<any[]>([]);

  // Mobile Phone & Email Activation State
  const [invitePhone, setInvitePhone] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('Prem Kumar');
  const [inviteSpec, setInviteSpec] = useState('Operations & Field Staff');
  const [sendingInvite, setSendingInvite] = useState(false);
  const [inviteResult, setInviteResult] = useState<ActivationResponse | null>(null);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  // Green-API WhatsApp Gateway State
  const [whatsAppStatus, setWhatsAppStatus] = useState<{
    enabled: boolean;
    stateInstance: string;
    phone?: string;
    idInstance?: string;
    apiUrl?: string;
  } | null>(null);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [testWhatsAppPhone, setTestWhatsAppPhone] = useState('917871558651');
  const [testWhatsAppMessage, setTestWhatsAppMessage] = useState('Hello from Sindhu Hospital Ops! Green-API WhatsApp integration is online and active.');
  const [isSendingWhatsAppTest, setIsSendingWhatsAppTest] = useState(false);
  const [whatsAppTestResult, setWhatsAppTestResult] = useState<{ success: boolean; idMessage?: string; error?: string } | null>(null);
  const [isRefreshingWhatsApp, setIsRefreshingWhatsApp] = useState(false);

  // Admin Laptop Continuous Live Location Broadcast State
  const [isAdminBroadcasting, setIsAdminBroadcasting] = useState(false);
  const [adminCoords, setAdminCoords] = useState<{ lat: number; lng: number; accuracy?: number; speed?: number } | null>(null);
  const [adminPingCount, setAdminPingCount] = useState(0);
  const [adminLastPingTime, setAdminLastPingTime] = useState<string | null>(null);
  const adminWatchIdRef = useRef<number | null>(null);
  const adminPingIntervalRef = useRef<number | null>(null);
  const adminMarkerRef = useRef<L.Marker | null>(null);

  // Leaflet Map Refs
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const currentTileLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const hospitalMarkerRef = useRef<L.Marker | null>(null);
  const geofenceCircleRef = useRef<L.Circle | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const routePolylineRef = useRef<L.Polyline | null>(null);

  // 1. Fetch live doctors from Spring Boot API
  const fetchDoctors = async (silent = false) => {
    if (!silent) setIsRefreshing(true);
    try {
      const list = await doctorTrackingApi.getLiveDoctors();
      setDoctors(list);
      if (!selectedDoctor && list.length > 0) {
        setSelectedDoctor(list[0]);
      } else if (selectedDoctor) {
        const updated = list.find((d) => d.id === selectedDoctor.id || d.doctorEmail === selectedDoctor.doctorEmail);
        if (updated) setSelectedDoctor(updated);
      }
    } catch (e) {
      console.warn('Error fetching live doctors:', e);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
    const interval = setInterval(() => fetchDoctors(true), 4000); // 4s live polling
    return () => clearInterval(interval);
  }, []);

  // Check Green-API WhatsApp Status
  const checkWhatsAppStatus = async (silent = false) => {
    if (!silent) setIsRefreshingWhatsApp(true);
    try {
      const res = await whatsappApi.getStatus();
      setWhatsAppStatus(res);
    } catch (e) {
      console.warn('Failed to fetch WhatsApp gateway status:', e);
    } finally {
      setIsRefreshingWhatsApp(false);
    }
  };

  useEffect(() => {
    checkWhatsAppStatus(true);
    const waInterval = setInterval(() => checkWhatsAppStatus(true), 15000);
    return () => clearInterval(waInterval);
  }, []);

  const handleSendWhatsAppTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testWhatsAppPhone.trim()) return;
    setIsSendingWhatsAppTest(true);
    setWhatsAppTestResult(null);

    try {
      const res = await sendUniversalWhatsApp({
        phone: testWhatsAppPhone.trim(),
        message: testWhatsAppMessage.trim()
      });
      setWhatsAppTestResult({ success: true, idMessage: res.idMessage });
    } catch (err: any) {
      setWhatsAppTestResult({
        success: false,
        error: err?.response?.data?.error || err.message || 'Failed to dispatch WhatsApp message'
      });
    } finally {
      setIsSendingWhatsAppTest(false);
    }
  };

  // 2. Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Create Leaflet Map instance
    const map = L.map(mapContainerRef.current, {
      center: [hospitalCoords.lat, hospitalCoords.lng],
      zoom: 13,
      zoomControl: false
    });

    // Add initial tile layer
    const tileLayer = L.tileLayer(MAP_LAYERS[activeTileType].url, {
      maxZoom: 19,
      attribution: MAP_LAYERS[activeTileType].attribution
    }).addTo(map);
    currentTileLayerRef.current = tileLayer;

    // Zoom controls on top-right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Hospital Base Marker
    const hospitalIcon = L.divIcon({
      className: 'custom-hospital-marker',
      html: `
        <div style="
          background: #2563eb;
          color: white;
          width: 42px;
          height: 42px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 20px rgba(37,99,235,0.8);
          border: 3px solid white;
          font-size: 20px;
        ">
          🏥
        </div>
      `,
      iconSize: [42, 42],
      iconAnchor: [21, 21],
      popupAnchor: [0, -22]
    });

    const hospitalMarker = L.marker([hospitalCoords.lat, hospitalCoords.lng], {
      icon: hospitalIcon,
      draggable: true
    }).addTo(map);

    hospitalMarker.bindPopup(`
      <div style="font-family: sans-serif; font-size: 13px; line-height: 1.4;">
        <strong style="color: #1e3a8a; font-size: 14px;">🏥 ${hospitalName}</strong><br/>
        <span>Emergency Resuscitation &amp; Trauma HQ</span><br/>
        <small style="color: #64748b;">(Drag marker or search below to change hospital base)</small>
      </div>
    `);

    hospitalMarker.on('dragend', (e: any) => {
      const pos = e.target.getLatLng();
      updateHospitalLocation(pos.lat, pos.lng, hospitalName);
    });

    hospitalMarkerRef.current = hospitalMarker;

    // Geofence perimeter circle around Hospital
    const circle = L.circle([hospitalCoords.lat, hospitalCoords.lng], {
      color: '#3b82f6',
      fillColor: '#93c5fd',
      fillOpacity: 0.15,
      radius: 1500 // 1.5 km
    }).addTo(map);
    geofenceCircleRef.current = circle;

    // Layer group for dynamic doctor markers
    const markersLayer = L.layerGroup().addTo(map);
    markersLayerRef.current = markersLayer;
    mapInstanceRef.current = map;

    // Invalidate size after mount to prevent gray tiles
    setTimeout(() => {
      map.invalidateSize();
    }, 250);

    // Map centers solidly on Bhavani HQ (11.4428, 77.7011) by default.
    // Hardware GPS is triggered when user clicks "Locate My Real GPS".

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Multi-tier Real Location Detection: Only runs on user request or hardware GPS
  const detectLiveLocation = async (mapObj?: L.Map | null) => {
    setIsLocatingUser(true);
    const activeMap = mapObj || mapInstanceRef.current;

    // High-Accuracy Hardware GPS
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude, accuracy } = pos.coords;
          console.log('Real Hardware GPS Detected:', latitude, longitude, '±' + accuracy + 'm');
          setGpsPermissionDenied(false);

          // Update user's live position pin
          setUserLocation({ lat: latitude, lng: longitude, accuracy: Math.round(accuracy) });
          setLocationSource(`Hardware GPS (±${Math.round(accuracy)}m)`);
          setIsLocatingUser(false);

          if (activeMap) {
            // Update or create user marker
            if (userMarkerRef.current) {
              userMarkerRef.current.setLatLng([latitude, longitude]);
            } else {
              const userIcon = L.divIcon({
                className: 'custom-user-marker',
                html: `
                  <div style="position: relative; display: flex; align-items: center; justify-content: center;">
                    <span style="position: absolute; width: 36px; height: 36px; border-radius: 50%; background: rgba(14, 165, 233, 0.4); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
                    <span style="position: relative; width: 18px; height: 18px; border-radius: 50%; background: #0284c7; border: 3px solid white; box-shadow: 0 0 10px rgba(2, 132, 199, 0.8);"></span>
                    <div style="position: absolute; top: -24px; background: #0f172a; color: #38bdf8; padding: 2px 6px; border-radius: 6px; font-size: 10px; font-weight: 800; white-space: nowrap; box-shadow: 0 2px 6px rgba(0,0,0,0.4);">YOU ARE HERE</div>
                  </div>
                `,
                iconSize: [24, 24],
                iconAnchor: [12, 12]
              });
              userMarkerRef.current = L.marker([latitude, longitude], { icon: userIcon })
                .addTo(activeMap)
                .bindPopup(`
                  <div style="font-family: sans-serif; font-size: 12px; line-height: 1.4;">
                    <strong style="color: #0284c7;">📍 Your Live Device Position</strong><br/>
                    <span>Coordinates: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}</span><br/>
                    <small style="color: #64748b;">Accuracy: ±${Math.round(accuracy)}m</small>
                  </div>
                `);
            }
            activeMap.flyTo([latitude, longitude], 15, { duration: 1.2 });
          }
        },
        (err) => {
          console.warn('Hardware GPS notice:', err.message);
          setIsLocatingUser(false);
          if (err.code === 1) {
            setGpsPermissionDenied(true);
          }
        },
        { enableHighAccuracy: true, timeout: 9000, maximumAge: 0 }
      );
    } else {
      setIsLocatingUser(false);
    }
  };

  // Apply Real Location: updates hospital, snaps user pin, flies map, and relocates backend doctors
  const applyRealLocation = async (
    lat: number,
    lng: number,
    name?: string,
    flyTo = true,
    source = 'Live GPS',
    mapOverride?: L.Map | null
  ) => {
    const activeMap = mapOverride || mapInstanceRef.current;
    const finalName = name || hospitalName;

    setUserLocation({ lat, lng, accuracy: source.includes('GPS') ? 10 : 1200 });
    setLocationSource(source);
    setHospitalCoords({ lat, lng });
    setHospitalName(finalName);
    setIsLocatingUser(false);

    localStorage.setItem('hospital_base_coords', JSON.stringify({ lat, lng }));
    localStorage.setItem('hospital_base_name', finalName);

    // Update Hospital Base Marker
    if (hospitalMarkerRef.current) {
      hospitalMarkerRef.current.setLatLng([lat, lng]);
      hospitalMarkerRef.current.setPopupContent(`
        <div style="font-family: sans-serif; font-size: 13px; line-height: 1.4;">
          <strong style="color: #1e3a8a; font-size: 14px;">🏥 ${finalName}</strong><br/>
          <span>Emergency Resuscitation &amp; Trauma HQ</span><br/>
          <small style="color: #64748b;">Live Coordinates: ${lat.toFixed(4)}, ${lng.toFixed(4)}</small>
        </div>
      `);
    }

    // Update Geofence Circle
    if (geofenceCircleRef.current) {
      geofenceCircleRef.current.setLatLng([lat, lng]);
    }

    // Update / Create "You Are Here" Marker with Pulsing Radar
    if (activeMap) {
      if (userMarkerRef.current) {
        userMarkerRef.current.setLatLng([lat, lng]);
      } else {
        const userIcon = L.divIcon({
          className: 'custom-user-marker',
          html: `
            <div style="position: relative; display: flex; align-items: center; justify-content: center;">
              <div style="
                width: 22px;
                height: 22px;
                border-radius: 50%;
                background: #0284c7;
                border: 3px solid white;
                box-shadow: 0 0 15px rgba(2,132,199,0.9);
                animation: pulse 1.5s infinite;
              "></div>
              <div style="
                position: absolute;
                top: -24px;
                background: #0f172a;
                color: #38bdf8;
                padding: 2px 6px;
                border-radius: 6px;
                font-size: 10px;
                font-weight: 800;
                white-space: nowrap;
                box-shadow: 0 2px 6px rgba(0,0,0,0.4);
              ">YOU ARE HERE</div>
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        userMarkerRef.current = L.marker([lat, lng], { icon: userIcon })
          .addTo(activeMap)
          .bindPopup(`
            <div style="font-family: sans-serif; font-size: 12px; line-height: 1.4;">
              <strong style="color: #0284c7;">📍 Your Live Device Position</strong><br/>
              <span>Coordinates: ${lat.toFixed(5)}, ${lng.toFixed(5)}</span><br/>
              <small style="color: #64748b;">Source: ${source}</small>
            </div>
          `);
      }

      if (flyTo) {
        activeMap.flyTo([lat, lng], 15, { duration: 1.2 });
      }
    }

    // Call Backend: Update hospital base hub coordinates (without altering device locations)
    try {
      const updatedList = await doctorTrackingApi.relocateHub(lat, lng, finalName);
      setDoctors(updatedList);
      if (updatedList.length > 0) {
        setSelectedDoctor(updatedList[0]);
      }

      setSyncNotice(`Hospital Base HQ updated to (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
      setTimeout(() => setSyncNotice(null), 4000);
    } catch (err) {
      console.warn('Backend relocateHub notice:', err);
    }
  };

  // Switch Tile Layer (Street vs Satellite vs Terrain)
  const handleSwitchLayer = (type: 'streets' | 'satellite' | 'terrain') => {
    setActiveTileType(type);
    if (!mapInstanceRef.current) return;

    if (currentTileLayerRef.current) {
      mapInstanceRef.current.removeLayer(currentTileLayerRef.current);
    }

    const newLayer = L.tileLayer(MAP_LAYERS[type].url, {
      maxZoom: 19,
      attribution: MAP_LAYERS[type].attribution
    }).addTo(mapInstanceRef.current);

    currentTileLayerRef.current = newLayer;
  };

  // Update Hospital Base Coordinates & Persist
  const updateHospitalLocation = (lat: number, lng: number, name?: string) => {
    applyRealLocation(lat, lng, name, true, 'User Base Selection');
  };

  // 3. User Clicks "Locate My Real GPS" Button
  const handleLocateMe = () => {
    detectLiveLocation();
  };

  // Remove a specific tracked phone or email
  const handleDeleteTracker = async (email: string) => {
    if (!window.confirm(`Are you sure you want to remove tracker for "${email}"?`)) return;
    try {
      await doctorTrackingApi.deleteTracker(email);
      setDoctors((prev) => prev.filter((d) => d.doctorEmail !== email));
      if (selectedDoctor?.doctorEmail === email) {
        setSelectedDoctor(null);
      }
      setSyncNotice(`Removed tracker: ${email}`);
      setTimeout(() => setSyncNotice(null), 3500);
    } catch (e) {
      console.warn('Failed to delete tracker:', e);
    }
  };

  // Purge any demo or unverified locations
  const handleClearDemoTrackers = async () => {
    try {
      setIsRefreshing(true);
      await doctorTrackingApi.clearDemoTrackers();
      const list = await doctorTrackingApi.getLiveDoctors();
      setDoctors(list);
      setSyncNotice('Demo locations purged. Showing only original verified devices.');
      setTimeout(() => setSyncNotice(null), 4000);
    } catch (e) {
      console.warn('Failed to clear demo trackers:', e);
    } finally {
      setIsRefreshing(false);
    }
  };

  // 4b. Toggle Continuous Live GPS Tracking of This Admin Laptop
  const handleToggleAdminBroadcasting = () => {
    if (isAdminBroadcasting) {
      // Stop broadcasting
      if (adminWatchIdRef.current !== null) {
        navigator.geolocation.clearWatch(adminWatchIdRef.current);
        adminWatchIdRef.current = null;
      }
      if (adminPingIntervalRef.current !== null) {
        clearInterval(adminPingIntervalRef.current);
        adminPingIntervalRef.current = null;
      }
      if (adminMarkerRef.current && mapInstanceRef.current) {
        mapInstanceRef.current.removeLayer(adminMarkerRef.current);
        adminMarkerRef.current = null;
      }
      setIsAdminBroadcasting(false);
      setSyncNotice('Admin Laptop Live Location Broadcast Stopped.');
      setTimeout(() => setSyncNotice(null), 3500);
    } else {
      // Start broadcasting
      if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser.');
        return;
      }

      setIsAdminBroadcasting(true);
      setSyncNotice('📡 Starting Admin Laptop GPS Location Broadcast...');

      const sendAdminPing = async (lat: number, lng: number, acc: number, spd: number) => {
        try {
          await doctorTrackingApi.sendPing({
            doctorEmail: 'admin.laptop@bhavani.radar',
            latitude: lat,
            longitude: lng,
            accuracyMeters: acc,
            speedKmh: spd,
            batteryLevel: 98
          });
          setAdminPingCount((c) => c + 1);
          setAdminLastPingTime(new Date().toLocaleTimeString());
          fetchDoctors(true);
        } catch (e) {
          console.warn('Admin ping failed:', e);
        }
      };

      const updateAdminMarkerOnMap = (lat: number, lng: number, acc: number) => {
        if (!mapInstanceRef.current) return;
        const map = mapInstanceRef.current;

        if (adminMarkerRef.current) {
          adminMarkerRef.current.setLatLng([lat, lng]);
        } else {
          const adminIcon = L.divIcon({
            className: 'admin-laptop-marker',
            html: `
              <div style="position: relative; display: flex; align-items: center; justify-content: center;">
                <span style="position: absolute; width: 44px; height: 44px; border-radius: 50%; background: rgba(168, 85, 247, 0.4); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
                <span style="position: relative; width: 24px; height: 24px; border-radius: 50%; background: #9333ea; border: 3px solid white; box-shadow: 0 0 15px rgba(147, 51, 234, 0.9); display: flex; align-items: center; justify-content: center; color: white; font-size: 12px; font-weight: bold;">💻</span>
                <div style="position: absolute; top: -26px; background: #581c87; color: #f3e8ff; padding: 2px 8px; border-radius: 6px; font-size: 10px; font-weight: 800; white-space: nowrap; box-shadow: 0 2px 8px rgba(0,0,0,0.5); border: 1px solid #c084fc;">ADMIN LAPTOP (YOU)</div>
              </div>
            `,
            iconSize: [28, 28],
            iconAnchor: [14, 14]
          });

          const m = L.marker([lat, lng], { icon: adminIcon }).addTo(map);
          m.bindPopup(`
            <div style="font-family: sans-serif; font-size: 12px; line-height: 1.4;">
              <strong style="color: #9333ea;">💻 Admin Laptop / Local Device</strong><br/>
              <span>Live Coordinates: ${lat.toFixed(5)}, ${lng.toFixed(5)}</span><br/>
              <small style="color: #64748b;">Accuracy: ±${Math.round(acc)}m</small><br/>
              <span style="color: #10b981; font-weight: bold;">● Active Broadcasting</span>
            </div>
          `);
          adminMarkerRef.current = m;
        }
      };

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude, accuracy, speed } = pos.coords;
          setAdminCoords({ lat: latitude, lng: longitude, accuracy: Math.round(accuracy), speed: speed ? Math.round(speed * 3.6) : 0 });
          updateAdminMarkerOnMap(latitude, longitude, accuracy);
          sendAdminPing(latitude, longitude, accuracy, speed ? speed * 3.6 : 0);
          if (mapInstanceRef.current) {
            mapInstanceRef.current.flyTo([latitude, longitude], 15, { duration: 1.2 });
          }
          setSyncNotice(`Admin Laptop GPS Live: (${latitude.toFixed(4)}, ${longitude.toFixed(4)}) ±${Math.round(accuracy)}m`);
        },
        (err) => {
          console.warn('Admin GPS error:', err.message);
          setSyncNotice(`GPS Access Warning: ${err.message}. Please check browser location permissions.`);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );

      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const { latitude, longitude, accuracy, speed } = pos.coords;
          setAdminCoords({ lat: latitude, lng: longitude, accuracy: Math.round(accuracy), speed: speed ? Math.round(speed * 3.6) : 0 });
          updateAdminMarkerOnMap(latitude, longitude, accuracy);
          sendAdminPing(latitude, longitude, accuracy, speed ? speed * 3.6 : 0);
        },
        (err) => console.warn('Admin watchPosition error:', err.message),
        { enableHighAccuracy: true, timeout: 12000, maximumAge: 3000 }
      );
      adminWatchIdRef.current = watchId;

      // Periodic ping backup every 10 seconds
      adminPingIntervalRef.current = window.setInterval(() => {
        if (adminCoords) {
          sendAdminPing(adminCoords.lat, adminCoords.lng, adminCoords.accuracy || 8, adminCoords.speed || 0);
        }
      }, 10000);
    }
  };

  // 4. Real Address Geocoding Search (Powered by OpenStreetMap Nominatim)
  const handleSearchAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressSearchQuery.trim()) return;

    setIsSearchingAddress(true);
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        addressSearchQuery
      )}&limit=5`;
      const res = await fetch(url);
      const data = await res.json();
      setAddressSearchResults(data);
    } catch (err) {
      console.warn('Geocoding search error:', err);
    } finally {
      setIsSearchingAddress(false);
    }
  };

  const handleSelectSearchResult = (result: any) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    const placeName = result.display_name.split(',').slice(0, 2).join(',');
    localStorage.setItem('user_manual_selection', 'true');
    applyRealLocation(lat, lng, placeName, true, 'Address Search');
    setAddressSearchResults([]);
    setAddressSearchQuery('');
  };

  // 5. Update Doctor Markers on Map when doctor data changes
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    const layer = markersLayerRef.current;
    layer.clearLayers();

    doctors.forEach((doc) => {
      if (!doc.latitude || !doc.longitude) return;

      const isSelected = selectedDoctor?.id === doc.id || selectedDoctor?.doctorEmail === doc.doctorEmail;
      const isAdmin = doc.doctorEmail.toLowerCase().includes('admin');
      const isPrem = doc.doctorEmail.toLowerCase().includes('knpremkumar1');
      const isInTransit = doc.status === 'IN_TRANSIT_TO_HOSPITAL' || (doc.status as string) === 'IN_TRANSIT';
      const isArrived = doc.status === 'AT_CAMPUS' || (doc.status as string) === 'ARRIVED_AT_HOSPITAL';

      let statusColor = '#f59e0b'; // amber
      let pulseEffect = '';
      if (isAdmin) {
        statusColor = '#a855f7'; // purple
        pulseEffect = 'animation: pulse 1.5s infinite;';
      } else if (isInTransit) {
        statusColor = '#10b981'; // emerald
        pulseEffect = 'animation: pulse 1.5s infinite;';
      } else if (isArrived) {
        statusColor = '#3b82f6'; // blue
      } else {
        statusColor = '#f59e0b'; // amber
      }

      const initials = isAdmin
        ? '💻'
        : doc.doctorName
        ? doc.doctorName.replace(/Dr\.\s*/i, '').split(' ').map((n) => n[0]).slice(0, 2).join('')
        : 'DR';

      const doctorIcon = L.divIcon({
        className: 'custom-doctor-marker',
        html: `
          <div style="position: relative; cursor: pointer; text-align: center;">
            <div style="
              width: ${isSelected ? '46px' : '38px'};
              height: ${isSelected ? '46px' : '38px'};
              background: ${isAdmin ? '#9333ea' : (isPrem ? '#dc2626' : '#1e293b')};
              border: 3px solid ${statusColor};
              border-radius: 50%;
              color: white;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: ${isSelected ? '14px' : '11px'};
              font-weight: 800;
              box-shadow: 0 4px 14px rgba(0,0,0,0.5);
              ${isInTransit ? pulseEffect : ''}
              transition: all 0.3s;
            ">
              ${initials}
            </div>
            <div style="
              position: absolute;
              bottom: -3px;
              right: -3px;
              width: 14px;
              height: 14px;
              border-radius: 50%;
              background: ${statusColor};
              border: 2px solid white;
            "></div>
          </div>
        `,
        iconSize: [isSelected ? 46 : 38, isSelected ? 46 : 38],
        iconAnchor: [isSelected ? 23 : 19, isSelected ? 23 : 19],
        popupAnchor: [0, -22]
      });

      const marker = L.marker([doc.latitude, doc.longitude], { icon: doctorIcon });

      marker.on('click', () => {
        setSelectedDoctor(doc);
      });

      marker.bindPopup(`
        <div style="font-family: sans-serif; min-width: 210px; padding: 4px;">
          <div style="font-weight: bold; font-size: 14px; color: #0f172a;">${doc.doctorName}</div>
          <div style="font-size: 11px; color: #64748b; margin-bottom: 6px;">${doc.specialization || 'Consultant Specialist'}</div>
          <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px;">
            <span>Distance:</span><strong>${doc.distanceToHospitalKm ? doc.distanceToHospitalKm.toFixed(1) : '--'} km</strong>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px;">
            <span>ETA:</span><strong style="color: #10b981;">${doc.etaMinutes || '--'} mins</strong>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px;">
            <span>Speed:</span><strong>${doc.speedKmh ? Math.round(doc.speedKmh) : 0} km/h</strong>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 6px;">
            <span>Battery:</span><strong>${doc.batteryLevel || 85}%</strong>
          </div>
          <div style="font-size: 10px; color: #94a3b8; text-align: right;">Status: ${doc.status}</div>
        </div>
      `);

      layer.addLayer(marker);
    });

    // Draw route polyline for selected doctor to current hospital base
    if (selectedDoctor && selectedDoctor.latitude && selectedDoctor.longitude) {
      if (routePolylineRef.current) {
        routePolylineRef.current.remove();
      }
      routePolylineRef.current = L.polyline(
        [
          [selectedDoctor.latitude, selectedDoctor.longitude],
          [hospitalCoords.lat, hospitalCoords.lng]
        ],
        {
          color: selectedDoctor.doctorEmail.toLowerCase().includes('knpremkumar1') ? '#dc2626' : '#2563eb',
          weight: 4,
          dashArray: '6, 8',
          opacity: 0.85
        }
      ).addTo(mapInstanceRef.current);
    }
  }, [doctors, selectedDoctor, hospitalCoords]);

  // Center on Selected Doctor
  const handleCenterOnDoctor = (doc: DoctorLocation) => {
    setSelectedDoctor(doc);
    if (mapInstanceRef.current && doc.latitude && doc.longitude) {
      mapInstanceRef.current.flyTo([doc.latitude, doc.longitude], 15, { duration: 1.2 });
    }
  };

  const handleCenterHospital = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([hospitalCoords.lat, hospitalCoords.lng], 14, { duration: 1.0 });
    }
  };

  // Generate QR Code for Mobile Scanning
  const handleOpenQrForDoctor = (emailOrPhone: string) => {
    const isEmail = emailOrPhone.includes('@');
    const param = isEmail ? `email=${encodeURIComponent(emailOrPhone)}` : `phone=${encodeURIComponent(emailOrPhone)}`;
    const mobileUrl = `http://${NETWORK_HOST}/doctor/mobile-tracker?token=live-${Date.now()}&${param}`;
    setQrCodeUrl(mobileUrl);
    setIsQrModalOpen(true);
  };

  // Send Live Activation / Mobile Invitation
  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invitePhone.trim() && !inviteEmail.trim()) {
      setInviteError('Please provide either a Mobile Phone Number or an Email Address.');
      return;
    }

    setSendingInvite(true);
    setInviteError(null);
    setInviteResult(null);

    const emailToSend = inviteEmail.trim() || `mobile_${invitePhone.replace(/[^0-9]/g, '')}@bhavani.radar`;
    const origin = window.location.origin.includes('localhost')
      ? `http://${NETWORK_HOST}`
      : window.location.origin;

    try {
      const res = await doctorTrackingApi.requestActivation({
        doctorEmail: emailToSend,
        doctorName: inviteName,
        phone: invitePhone.trim(),
        specialization: inviteSpec,
        originUrl: origin
      });
      setInviteResult(res);
      fetchDoctors();
    } catch (err: any) {
      setInviteError(err?.response?.data?.message || 'Could not generate mobile tracking invitation.');
    } finally {
      setSendingInvite(false);
    }
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const [isSendingWhatsAppInvite, setIsSendingWhatsAppInvite] = useState(false);
  const [whatsAppInviteSuccess, setWhatsAppInviteSuccess] = useState<string | null>(null);

  const handleSendDirectWhatsAppInvite = async (targetPhone: string, link: string) => {
    if (!targetPhone) return;
    setIsSendingWhatsAppInvite(true);
    setWhatsAppInviteSuccess(null);
    try {
      const msg = `🏥 *SINDHU OPERATIONS HQ - LIVE GPS MONITORING REQUEST*\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n`
        + `Please tap the secure link below on your smartphone to activate real-time location streaming:\n\n`
        + `🔗 ${link}\n\n`
        + `Tap *Grant Location Permission* when prompted.\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n`
        + `_Sindhu Healthcare Fleet & Operations Platform_`;

      const res = await sendUniversalWhatsApp({
        phone: targetPhone,
        message: msg
      });
      if (res.success) {
        setWhatsAppInviteSuccess(`Dispatched to +${res.cleanPhone}! (Msg ID: ${res.idMessage})`);
        setTimeout(() => setWhatsAppInviteSuccess(null), 5000);
      } else {
        alert(`WhatsApp dispatch failed: ${res.error || 'Gateway error'}`);
      }
    } catch (err: any) {
      alert(`WhatsApp Gateway error: ${err.message}`);
    } finally {
      setIsSendingWhatsAppInvite(false);
    }
  };

  // Filtered doctors list
  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch =
      doc.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.specialization ? doc.specialization.toLowerCase().includes(searchQuery.toLowerCase()) : false) ||
      doc.doctorEmail.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (filterStatus === 'ALL') return true;
    if (filterStatus === 'IN_TRANSIT') return doc.status === 'IN_TRANSIT_TO_HOSPITAL' || (doc.status as string) === 'IN_TRANSIT';
    if (filterStatus === 'ARRIVED') return doc.status === 'AT_CAMPUS' || (doc.status as string) === 'ARRIVED_AT_HOSPITAL';
    if (filterStatus === 'STANDBY') return doc.status === 'ON_CALL_STANDBY';
    return true;
  });

  const transitCount = doctors.filter((d) => d.status === 'IN_TRANSIT_TO_HOSPITAL' || (d.status as string) === 'IN_TRANSIT').length;
  const arrivedCount = doctors.filter((d) => d.status === 'AT_CAMPUS' || (d.status as string) === 'ARRIVED_AT_HOSPITAL').length;
  const standbyCount = doctors.filter((d) => d.status === 'ON_CALL_STANDBY').length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header Card */}
      <div className="card-radial-surface p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                <Radio className="w-6 h-6 animate-pulse" />
              </span>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:white font-jakarta tracking-tight">
                  Real-World Emergency Doctor GPS Radar
                </h1>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                    {hospitalName} ({hospitalCoords.lat.toFixed(4)}, {hospitalCoords.lng.toFixed(4)})
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    • Source: <strong className="text-cyan-600 dark:text-cyan-400">{locationSource}</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Metrics & Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleClearDemoTrackers}
              disabled={isRefreshing}
              className="px-3 py-2 bg-slate-100 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-950/40 text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
              title="Purge any unverified demo locations"
            >
              <Trash2 className="w-3.5 h-3.5" /> Purge Demo Data
            </button>

            <button
              onClick={handleLocateMe}
              disabled={isLocatingUser}
              className="px-3 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
            >
              <Compass className={`w-3.5 h-3.5 ${isLocatingUser ? 'animate-spin' : ''}`} />
              {isLocatingUser ? 'Locating...' : 'Locate My Real GPS'}
            </button>

            <button
              onClick={() => handleOpenQrForDoctor('knpremkumar1@gmail.com')}
              className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
            >
              <QrCode className="w-3.5 h-3.5" /> Scan QR from Phone
            </button>

            <button
              onClick={handleToggleAdminBroadcasting}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5 ${
                isAdminBroadcasting
                  ? 'bg-purple-600 hover:bg-purple-700 text-white animate-pulse'
                  : 'bg-purple-100 hover:bg-purple-200 dark:bg-purple-950/60 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800'
              }`}
              title="Broadcast this laptop's real-time live location to the radar map"
            >
              <span className={`w-2 h-2 rounded-full ${isAdminBroadcasting ? 'bg-emerald-400 animate-ping' : 'bg-purple-600'}`}></span>
              {isAdminBroadcasting ? 'Broadcasting Laptop Live GPS' : '💻 Track My Laptop Location'}
            </button>

            <button
              onClick={() => setIsInviteModalOpen(true)}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" /> 📲 Track Mobile (Phone/WhatsApp)
            </button>

            <button
              onClick={() => setIsWhatsAppModalOpen(true)}
              className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
              title="Green-API WhatsApp Gateway Status & Test"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>
                {whatsAppStatus?.stateInstance === 'authorized' ? (
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    WhatsApp Active ({whatsAppStatus.phone || '917871558651'})
                  </span>
                ) : (
                  'WhatsApp Gateway'
                )}
              </span>
            </button>

            <button
              onClick={() => fetchDoctors(false)}
              disabled={isRefreshing}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              title="Refresh radar"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-emerald-600' : ''}`} />
            </button>
          </div>
        </div>

        {/* Admin Laptop Live Telemetry HUD Bar */}
        {isAdminBroadcasting && adminCoords && (
          <div className="p-3 bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs text-purple-900 dark:text-purple-200 animate-fade-in">
            <div className="flex items-center flex-wrap gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              <strong className="text-purple-900 dark:text-purple-100 flex items-center gap-1">
                💻 Admin Laptop Live GPS Streaming Active:
              </strong>
              <span className="font-mono text-purple-700 dark:text-purple-300 bg-white dark:bg-purple-900/40 px-2 py-0.5 rounded-md border border-purple-200 dark:border-purple-800">
                {adminCoords.lat.toFixed(5)}, {adminCoords.lng.toFixed(5)} (±{adminCoords.accuracy}m)
              </span>
              <span className="px-2 py-0.5 rounded-md bg-purple-200 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-[10px] font-bold">
                {adminPingCount} live pings sent • Last: {adminLastPingTime || 'Just now'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (mapInstanceRef.current && adminCoords) {
                    mapInstanceRef.current.flyTo([adminCoords.lat, adminCoords.lng], 16, { duration: 1.0 });
                  }
                }}
                className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-[11px] font-bold shadow-sm"
              >
                Focus Laptop Pin
              </button>
              <button
                onClick={handleToggleAdminBroadcasting}
                className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-[11px] font-bold"
              >
                Stop Broadcasting
              </button>
            </div>
          </div>
        )}

        {/* Sync Success Notification Toast */}
        {syncNotice && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-300 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{syncNotice}</span>
          </div>
        )}

        {/* Browser Location Blocked Helper Banner */}
        {gpsPermissionDenied && (
          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-300">
            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div>
                <strong>Browser GPS Permission Notice:</strong> Your browser currently blocked exact GPS access. We automatically positioned your radar using your real network location ({hospitalName}).
              </div>
              <div className="text-[11px] text-amber-700 dark:text-amber-400">
                👉 To unlock 10-meter exact GPS: Click the lock icon 🔒 beside <code>localhost:5175</code> in your address bar, set <strong>Location</strong> to <strong>Allow</strong>, and tap <strong>Locate My Real GPS</strong>.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Grid: Interactive Map + Doctor Roster Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Leaflet Interactive Map (2 Columns on large) */}
        <div className="lg:col-span-2 space-y-3">
          {/* Quick Region Selector Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-500" /> One-Click Live Region:
            </span>
            {[
              { name: 'Bhavani HQ (Company Base)', lat: 11.4428, lng: 77.7011 },
              { name: 'Erode Junction', lat: 11.3410, lng: 77.7172 },
              { name: 'Perundurai Hub', lat: 11.2778, lng: 77.5831 },
              { name: 'Salem Medical Hub', lat: 11.6643, lng: 78.1460 },
              { name: 'Coimbatore Hub', lat: 11.0168, lng: 76.9558 },
              { name: 'Chennai HQ', lat: 13.0827, lng: 80.2707 }
            ].map((preset) => (
              <button
                key={preset.name}
                onClick={() => {
                  localStorage.setItem('user_manual_selection', 'true');
                  applyRealLocation(preset.lat, preset.lng, preset.name + ' Emergency Hub', true, 'Preset Selection');
                }}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-all shrink-0 ${
                  Math.abs(hospitalCoords.lat - preset.lat) < 0.05
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-emerald-400'
                }`}
              >
                📍 {preset.name}
              </button>
            ))}
          </div>

          <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm bg-slate-100 dark:bg-slate-900">
            {/* Map Container */}
            <div ref={mapContainerRef} style={{ height: '640px', width: '100%', zIndex: 10 }} />

            {/* Map Top Floating Controls Bar */}
            <div className="absolute top-4 left-4 right-4 z-20 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pointer-events-none">
              {/* Geocoding Address Search Box */}
              <form
                onSubmit={handleSearchAddress}
                className="pointer-events-auto relative flex-1 max-w-sm"
              >
                <div className="relative flex items-center">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3" />
                  <input
                    type="text"
                    value={addressSearchQuery}
                    onChange={(e) => setAddressSearchQuery(e.target.value)}
                    placeholder="Search any real city, street, or hospital..."
                    className="w-full pl-9 pr-20 py-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl text-xs border border-slate-200 dark:border-slate-700 shadow-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="submit"
                    disabled={isSearchingAddress}
                    className="absolute right-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[11px] font-bold transition-all"
                  >
                    {isSearchingAddress ? '...' : 'Go'}
                  </button>
                </div>

                {/* Search Results Dropdown */}
                {addressSearchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden max-h-48 overflow-y-auto z-30">
                    {addressSearchResults.map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleSelectSearchResult(item)}
                        className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-xs border-b border-slate-100 dark:border-slate-800 last:border-none text-slate-800 dark:text-slate-200"
                      >
                        <div className="font-bold">{item.display_name.split(',')[0]}</div>
                        <div className="text-[10px] text-slate-400 truncate">{item.display_name}</div>
                      </div>
                    ))}
                  </div>
                )}
              </form>

              {/* Map Layer & GPS Buttons */}
              <div className="pointer-events-auto flex items-center gap-2">
                {/* Street / Satellite / Terrain Switcher */}
                <div className="flex items-center bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-1 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg text-xs font-bold">
                  <button
                    onClick={() => handleSwitchLayer('streets')}
                    className={`px-2.5 py-1 rounded-xl transition-all ${
                      activeTileType === 'streets'
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    Street
                  </button>
                  <button
                    onClick={() => handleSwitchLayer('satellite')}
                    className={`px-2.5 py-1 rounded-xl transition-all ${
                      activeTileType === 'satellite'
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    Satellite
                  </button>
                  <button
                    onClick={() => handleSwitchLayer('terrain')}
                    className={`px-2.5 py-1 rounded-xl transition-all ${
                      activeTileType === 'terrain'
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    Terrain
                  </button>
                </div>

                {/* Locate Device GPS Button */}
                <button
                  onClick={handleLocateMe}
                  disabled={isLocatingUser}
                  className="px-3 py-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl text-xs font-bold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center gap-1.5"
                  title="Detect my real device GPS location"
                >
                  <Compass className={`w-4 h-4 text-cyan-600 ${isLocatingUser ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">My Location</span>
                </button>
              </div>
            </div>

            {/* Bottom Status Ribbon Overlay */}
            <div className="absolute bottom-4 left-4 right-4 z-20 pointer-events-none">
              <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl pointer-events-auto flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    Base: <strong>{hospitalName}</strong>
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    ({hospitalCoords.lat.toFixed(4)}, {hospitalCoords.lng.toFixed(4)})
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {userLocation && (
                    <button
                      onClick={() => applyRealLocation(userLocation.lat, userLocation.lng, hospitalName, true, 'User Base Snap')}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[11px] font-bold shadow-sm transition-all flex items-center gap-1"
                      title="Relocate hospital base and doctor radius to your current GPS coordinates"
                    >
                      <Crosshair className="w-3 h-3" /> Relocate Doctors to My GPS
                    </button>
                  )}
                  <button
                    onClick={handleCenterHospital}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-[11px] font-bold transition-all"
                  >
                    Center Hospital
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Doctor Roster & Live Tracking Cards (1 Column) */}
        <div className="space-y-4">
          {/* Filter & Search Bar */}
          <div className="card-radial-surface p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search doctor or specialty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800/80 rounded-xl text-xs border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {['ALL', 'IN_TRANSIT', 'ARRIVED', 'STANDBY'].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                    filterStatus === st
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  {st.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Doctor Cards List */}
          <div className="space-y-3 max-h-[530px] overflow-y-auto pr-1">
            {filteredDoctors.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500 dark:text-slate-400 card-radial-surface p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
                No doctors matching filter.
              </div>
            ) : (
              filteredDoctors.map((doc) => {
                const isSelected = selectedDoctor?.id === doc.id || selectedDoctor?.doctorEmail === doc.doctorEmail;
                const isAdmin = doc.doctorEmail.toLowerCase().includes('admin');
                const isPrem = doc.doctorEmail.toLowerCase().includes('knpremkumar1');
                const isInTransit = doc.status === 'IN_TRANSIT_TO_HOSPITAL' || (doc.status as string) === 'IN_TRANSIT';
                const isArrived = doc.status === 'AT_CAMPUS' || (doc.status as string) === 'ARRIVED_AT_HOSPITAL';

                return (
                  <div
                    key={doc.id || doc.doctorEmail}
                    onClick={() => handleCenterOnDoctor(doc)}
                    className={`card-radial-surface p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-emerald-500 dark:border-emerald-500 ring-2 ring-emerald-500/20 shadow-md bg-emerald-50/20 dark:bg-emerald-950/10'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs text-white ${
                            isAdmin ? 'bg-purple-600' : (isPrem ? 'bg-rose-600' : 'bg-slate-800')
                          }`}
                        >
                          {isAdmin ? '💻' : doc.doctorName.replace(/Dr\.\s*/i, '').charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                            {doc.doctorName}
                            {isAdmin && (
                              <span className="px-1.5 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-[10px] font-bold">
                                This Device (Admin)
                              </span>
                            )}
                            {isPrem && !isAdmin && (
                              <span className="px-1.5 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 text-[10px] font-bold">
                                Priority Lead
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">
                            {doc.specialization || 'Consultant Specialist'}
                          </div>
                        </div>
                      </div>

                      {/* Status Tag */}
                      <span
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                          doc.latitude && doc.longitude
                            ? isInTransit
                              ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 animate-pulse'
                              : isArrived
                              ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400'
                              : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-300'
                            : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400'
                        }`}
                      >
                        {doc.latitude && doc.longitude ? doc.status.replace(/_/g, ' ') : 'AWAITING GPS'}
                      </span>
                    </div>

                    {/* Real GPS Telemetry or Awaiting Status */}
                    {doc.latitude && doc.longitude ? (
                      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-3 gap-2 text-[11px]">
                        <div>
                          <span className="text-slate-400 block text-[10px]">DISTANCE</span>
                          <strong className="text-slate-700 dark:text-slate-200">
                            {doc.distanceToHospitalKm ? `${doc.distanceToHospitalKm.toFixed(1)} km` : '--'}
                          </strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">ETA</span>
                          <strong className="text-emerald-600 dark:text-emerald-400">
                            {doc.etaMinutes ? `${doc.etaMinutes} mins` : '--'}
                          </strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">BATTERY</span>
                          <strong className="text-slate-700 dark:text-slate-200 flex items-center gap-1">
                            <Battery className="w-3 h-3 text-slate-400" />
                            {doc.batteryLevel || 85}%
                          </strong>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-2.5 p-2.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/50 text-xs text-amber-900 dark:text-amber-200 space-y-1 text-left">
                        <div className="font-bold flex items-center gap-1.5 text-[11px]">
                          <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                          <span>Awaiting GPS Permission from Device</span>
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">
                          Invite sent to {doc.phone || doc.doctorEmail}. Marker will appear at exact coordinates once opened on phone.
                        </div>
                      </div>
                    )}

                    {/* Actions Bar */}
                    <div className="mt-3 flex items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/60">
                      <div className="flex items-center gap-2">
                        {doc.latitude && doc.longitude && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCenterOnDoctor(doc);
                            }}
                            className="text-[11px] font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1"
                          >
                            <Crosshair className="w-3 h-3" /> Focus GPS
                          </button>
                        )}

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenQrForDoctor(doc.doctorEmail);
                          }}
                          className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 flex items-center gap-1"
                        >
                          <QrCode className="w-3 h-3" /> Phone QR
                        </button>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTracker(doc.doctorEmail);
                        }}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title={`Delete tracker for ${doc.doctorEmail}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* QR Code Phone Scanner Modal */}
      {isQrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
          <div className="card-radial-surface p-6 rounded-3xl max-w-sm w-full border border-slate-200 dark:border-slate-800 shadow-2xl text-center space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <QrCode className="w-4 h-4 text-emerald-600" /> Real Phone GPS Check-In
              </h3>
              <button
                onClick={() => setIsQrModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-base"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Point your smartphone camera at this QR code to launch the real mobile GPS tracker on your phone:
            </p>

            <div className="p-3 bg-white rounded-2xl border border-slate-200 inline-block shadow-md">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                  qrCodeUrl
                )}`}
                alt="Scan on Mobile Phone"
                className="w-48 h-48 mx-auto"
              />
            </div>

            <div className="text-[11px] text-slate-600 dark:text-slate-300 break-all bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-mono">
              {qrCodeUrl}
            </div>

            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => handleCopyLink(qrCodeUrl)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedLink ? 'Copied Link!' : 'Copy Link to WhatsApp/SMS'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Track Mobile Device / Person Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="card-radial-surface p-6 sm:p-8 rounded-3xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                  <PhoneCall className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    Track Live Mobile Device / Person
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Dispatches live GPS tracking to any phone via WhatsApp, QR code, or Email.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendInvite} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Person / Staff Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Prem Kumar"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                  <span>Mobile Phone Number (WhatsApp / SMS)</span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">1-Click WhatsApp Invite</span>
                </label>
                <input
                  type="tel"
                  placeholder="e.g. +91 98401 23456 or 9840123456"
                  value={invitePhone}
                  onChange={(e) => setInvitePhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                  <span>Email Address</span>
                  <span className="text-[10px] text-slate-400">(Optional if phone is provided)</span>
                </label>
                <input
                  type="email"
                  placeholder="e.g. knpremkumar1@gmail.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Department / Monitored Role
                </label>
                <input
                  type="text"
                  placeholder="e.g. Operations & Field Staff"
                  value={inviteSpec}
                  onChange={(e) => setInviteSpec(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                />
              </div>

              {inviteError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{inviteError}</span>
                </div>
              )}

              {inviteResult && (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 space-y-3 animate-fade-in text-center">
                  <div className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Live Tracking Channel Active!</span>
                  </div>

                  {/* Green-API Automatic WhatsApp Dispatch Confirmation */}
                  {inviteResult.whatsappDispatched && (
                    <div className="p-3 bg-emerald-100/80 dark:bg-emerald-900/40 border border-emerald-300 dark:border-emerald-700 rounded-xl text-emerald-950 dark:text-emerald-100 text-xs flex items-center justify-between text-left shadow-sm">
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg">📲</span>
                        <div>
                          <strong className="block font-bold">Auto-Dispatched via Green-API WhatsApp</strong>
                          <span className="text-[11px] opacity-80 font-mono">
                            Sent to +{inviteResult.phone || invitePhone} (Msg ID: {inviteResult.whatsappMessageId})
                          </span>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg text-[10px] font-black uppercase tracking-wider shadow-sm">
                        Sent
                      </span>
                    </div>
                  )}

                  {/* Direct WhatsApp Dispatch Button via Green-API */}
                  {invitePhone && (
                    <div className="space-y-1">
                      <button
                        type="button"
                        onClick={() => handleSendDirectWhatsAppInvite(invitePhone, inviteResult.activationLink)}
                        disabled={isSendingWhatsAppInvite}
                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>{isSendingWhatsAppInvite ? 'Dispatching via Official WhatsApp...' : `Direct WhatsApp to +${invitePhone}`}</span>
                      </button>
                      {whatsAppInviteSuccess && (
                        <div className="p-2 bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 rounded-xl text-emerald-900 dark:text-emerald-200 text-[11px] font-bold">
                          ✅ {whatsAppInviteSuccess}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Instant QR Code */}
                  <div className="p-2.5 bg-white rounded-2xl border border-slate-200 inline-block shadow-sm">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
                        inviteResult.activationLink
                      )}`}
                      alt="Scan to Track"
                      className="w-36 h-36 mx-auto"
                    />
                    <div className="text-[10px] text-slate-500 mt-1 font-bold">
                      Scan with mobile camera to start live GPS
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-600 dark:text-slate-300 break-all bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-emerald-100 dark:border-emerald-900 font-mono text-left">
                    {inviteResult.activationLink}
                  </div>

                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopyLink(inviteResult.activationLink)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
                    >
                      {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedLink ? 'Copied Link!' : 'Copy Link for SMS'}
                    </button>
                    <a
                      href={inviteResult.activationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Open Mobile Tracker
                    </a>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={sendingInvite}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {sendingInvite ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  {sendingInvite ? 'Generating Live Link...' : 'Create Live Tracker'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Green-API WhatsApp Management & Test Modal */}
      {isWhatsAppModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="card-radial-surface p-6 sm:p-8 rounded-3xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                  <MessageSquare className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    Green-API WhatsApp Integration
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Hospital Live GPS &amp; Telemetry Messaging Hub
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsWhatsAppModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            {/* Instance Status Card */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2.5 text-xs">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700/60 pb-2">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Gateway Status:</span>
                <span className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  {whatsAppStatus?.stateInstance?.toUpperCase() || 'AUTHORIZED'}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700/60 pb-2">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Connected Phone:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                  +{whatsAppStatus?.phone || '917871558651'}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700/60 pb-2">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Instance ID:</span>
                <span className="font-mono text-slate-700 dark:text-slate-300">
                  {whatsAppStatus?.idInstance || '710722771097'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Host Endpoint:</span>
                <span className="font-mono text-[11px] text-slate-600 dark:text-slate-400">
                  {whatsAppStatus?.apiUrl || 'https://7107.api.greenapi.com'}
                </span>
              </div>
            </div>

            {/* Live Message Dispatch Test */}
            <form onSubmit={handleSendWhatsAppTest} className="space-y-3.5 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Send Test WhatsApp Message
                </h4>
                <button
                  type="button"
                  onClick={() => checkWhatsAppStatus(false)}
                  disabled={isRefreshingWhatsApp}
                  className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <RefreshCw className={`w-3 h-3 ${isRefreshingWhatsApp ? 'animate-spin' : ''}`} /> Refresh Status
                </button>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Recipient Phone (with country code):
                </label>
                <input
                  type="text"
                  required
                  value={testWhatsAppPhone}
                  onChange={(e) => setTestWhatsAppPhone(e.target.value)}
                  placeholder="e.g. 917871558651"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Message Content:
                </label>
                <textarea
                  rows={3}
                  required
                  value={testWhatsAppMessage}
                  onChange={(e) => setTestWhatsAppMessage(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                />
              </div>

              {whatsAppTestResult && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                    whatsAppTestResult.success
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400'
                      : 'bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400'
                  }`}
                >
                  {whatsAppTestResult.success ? (
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  )}
                  <span>
                    {whatsAppTestResult.success
                      ? `Message sent successfully! Message ID: ${whatsAppTestResult.idMessage}`
                      : `Dispatch Failed: ${whatsAppTestResult.error}`}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsWhatsAppModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={isSendingWhatsAppTest}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isSendingWhatsAppTest ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  {isSendingWhatsAppTest ? 'Dispatching...' : 'Send WhatsApp Test'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
