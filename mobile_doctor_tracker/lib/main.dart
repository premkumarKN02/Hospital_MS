import 'dart:async';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';
import 'package:battery_plus/battery_plus.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const DoctorTrackerApp());
}

class DoctorTrackerApp extends StatelessWidget {
  const DoctorTrackerApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Doctor Emergency Tracker',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF10B981),
          brightness: Brightness.dark,
        ),
        scaffoldBackgroundColor: const Color(0xFF0F172A),
        useMaterial3: true,
      ),
      home: const TrackerHomeScreen(),
    );
  }
}

class TrackerHomeScreen extends StatefulWidget {
  const TrackerHomeScreen({super.key});

  @override
  State<TrackerHomeScreen> createState() => _TrackerHomeScreenState();
}

class _TrackerHomeScreenState extends State<TrackerHomeScreen> {
  // Configuration
  final TextEditingController _emailController =
      TextEditingController(text: 'knpremkumar1@gmail.com');
  final TextEditingController _serverController =
      TextEditingController(text: 'http://10.0.2.2:8080'); // Android emulator host or LAN IP

  final Battery _battery = Battery();
  StreamSubscription<Position>? _positionStream;
  Timer? _heartbeatTimer;

  bool _isTracking = false;
  Position? _currentPosition;
  int _batteryLevel = 100;
  int _pingCount = 0;
  String _lastPingTime = '--';
  String _statusMessage = 'Standby — Permission not yet granted';

  @override
  void initState() {
    super.initState();
    _loadPreferences();
    _initBattery();
  }

  Future<void> _loadPreferences() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      _emailController.text = prefs.getString('doctor_email') ?? 'knpremkumar1@gmail.com';
      _serverController.text = prefs.getString('server_url') ?? 'http://10.0.2.2:8080';
    });
  }

  Future<void> _savePreferences() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('doctor_email', _emailController.text.trim());
    await prefs.setString('server_url', _serverController.text.trim());
  }

  Future<void> _initBattery() async {
    try {
      final level = await _battery.batteryLevel;
      setState(() => _batteryLevel = level);
    } catch (_) {}
  }

  /// 1. Request GPS Permissions & Start Tracking
  Future<void> _startTracking() async {
    await _savePreferences();

    // Check Location Service
    bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      _showSnackbar('Location services are disabled on your phone.');
      return;
    }

    // Check & Request Permissions
    LocationPermission permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        _showSnackbar('Location permission denied.');
        return;
      }
    }

    if (permission == LocationPermission.deniedForever) {
      _showSnackbar('Location permission permanently denied. Enable in Phone Settings.');
      return;
    }

    setState(() {
      _isTracking = true;
      _statusMessage = 'Active — Streaming live coordinates';
    });

    // Initial position
    try {
      final pos = await Geolocator.getCurrentPosition(
        locationSettings: const LocationSettings(
          accuracy: LocationAccuracy.high,
          timeLimit: Duration(seconds: 10),
        ),
      );
      _onNewPosition(pos);
    } catch (e) {
      debugPrint('Initial position error: $e');
    }

    // Listen to GPS stream
    const locationSettings = LocationSettings(
      accuracy: LocationAccuracy.high,
      distanceFilter: 10, // send when moved 10 meters
    );

    _positionStream = Geolocator.getPositionStream(locationSettings: locationSettings).listen(
      _onNewPosition,
      onError: (err) {
        debugPrint('Location stream error: $err');
      },
    );

    // Periodic heartbeat every 30 seconds
    _heartbeatTimer = Timer.periodic(const Duration(seconds: 30), (_) async {
      if (_currentPosition != null) {
        await _sendPingToBackend(_currentPosition!);
      }
    });
  }

  void _onNewPosition(Position position) {
    setState(() => _currentPosition = position);
    _sendPingToBackend(position);
  }

  /// 2. Stream Coordinates to Spring Boot / Firebase Backend
  Future<void> _sendPingToBackend(Position pos) async {
    try {
      final battery = await _battery.batteryLevel;
      setState(() => _batteryLevel = battery);

      final url = Uri.parse('${_serverController.text.trim()}/api/doctors/tracking/ping');
      final payload = {
        'doctorEmail': _emailController.text.trim(),
        'latitude': pos.latitude,
        'longitude': pos.longitude,
        'accuracyMeters': pos.accuracy,
        'speedKmh': pos.speed * 3.6,
        'batteryLevel': battery,
      };

      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(payload),
      ).timeout(const Duration(seconds: 8));

      if (response.statusCode == 200) {
        final now = DateTime.now();
        setState(() {
          _pingCount++;
          _lastPingTime = '${now.hour.toString().padLeft(2, '0')}:${now.minute.toString().padLeft(2, '0')}:${now.second.toString().padLeft(2, '0')}';
        });
      }
    } catch (e) {
      debugPrint('Network ping failure: $e');
    }
  }

  /// 3. Stop Tracking
  void _stopTracking() {
    _positionStream?.cancel();
    _positionStream = null;
    _heartbeatTimer?.cancel();
    _heartbeatTimer = null;

    setState(() {
      _isTracking = false;
      _statusMessage = 'Stopped — Off Duty';
    });
  }

  void _showSnackbar(String msg) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(msg)));
  }

  @override
  void dispose() {
    _positionStream?.cancel();
    _heartbeatTimer?.cancel();
    _emailController.dispose();
    _serverController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Doctor GPS Radar', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
        backgroundColor: const Color(0xFF1E293B),
        actions: [
          Container(
            margin: const EdgeInsets.only(right: 16),
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: _isTracking ? Colors.green.withOpacity(0.2) : Colors.amber.withOpacity(0.2),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: _isTracking ? Colors.green : Colors.amber),
            ),
            child: Row(
              children: [
                Icon(Icons.circle, size: 8, color: _isTracking ? Colors.greenAccent : Colors.amber),
                const SizedBox(width: 6),
                Text(
                  _isTracking ? 'STREAMING' : 'OFFLINE',
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.bold,
                    color: _isTracking ? Colors.greenAccent : Colors.amber,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Consent & Privacy Card
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFF1E293B),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: const Color(0xFF334155)),
              ),
              child: const Row(
                children: [
                  Icon(Icons.shield_outlined, color: Color(0xFF38BDF8), size: 32),
                  SizedBox(width: 14),
                  Expanded(
                    child: Text(
                      'Emergency On-Call Consent: GPS location is streamed only during on-call transit to compute trauma arrival ETA.',
                      style: TextStyle(fontSize: 12, color: Color(0xFFCBD5E1), height: 1.4),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Doctor Settings
            Container(
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                color: const Color(0xFF1E293B),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: const Color(0xFF334155)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('DOCTOR CREDENTIALS', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.grey)),
                  const SizedBox(height: 10),
                  TextField(
                    controller: _emailController,
                    enabled: !_isTracking,
                    decoration: const InputDecoration(
                      labelText: 'Doctor Email',
                      prefixIcon: Icon(Icons.email_outlined, size: 20),
                      border: OutlineInputBorder(),
                      contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                    ),
                  ),
                  const SizedBox(height: 12),
                  TextField(
                    controller: _serverController,
                    enabled: !_isTracking,
                    decoration: const InputDecoration(
                      labelText: 'Backend Server URL',
                      prefixIcon: Icon(Icons.dns_outlined, size: 20),
                      border: OutlineInputBorder(),
                      contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Live Telemetry Cards
            Row(
              children: [
                Expanded(
                  child: _buildMetricCard(
                    title: 'LATITUDE',
                    value: _currentPosition != null ? _currentPosition!.latitude.toStringAsFixed(4) : '--',
                    icon: Icons.navigation_outlined,
                    color: Colors.cyanAccent,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildMetricCard(
                    title: 'LONGITUDE',
                    value: _currentPosition != null ? _currentPosition!.longitude.toStringAsFixed(4) : '--',
                    icon: Icons.map_outlined,
                    color: Colors.blueAccent,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: _buildMetricCard(
                    title: 'SPEED',
                    value: _currentPosition != null ? '${(_currentPosition!.speed * 3.6).toStringAsFixed(0)} km/h' : '0 km/h',
                    icon: Icons.speed,
                    color: Colors.amberAccent,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildMetricCard(
                    title: 'BATTERY',
                    value: '$_batteryLevel%',
                    icon: Icons.battery_charging_full,
                    color: Colors.greenAccent,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),

            // Telemetry Log Card
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: const Color(0xFF1E293B),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Pings Sent: #$_pingCount', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                  Text('Last Ping: $_lastPingTime', style: const TextStyle(fontSize: 12, color: Colors.greenAccent, fontFamily: 'monospace')),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Start / Stop Button
            ElevatedButton(
              onPressed: _isTracking ? _stopTracking : _startTracking,
              style: ElevatedButton.styleFrom(
                backgroundColor: _isTracking ? const Color(0xFFE11D48) : const Color(0xFF10B981),
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 18),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
                elevation: 4,
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(_isTracking ? Icons.stop_rounded : Icons.play_arrow_rounded, size: 24),
                  const SizedBox(width: 8),
                  Text(
                    _isTracking ? 'STOP TRACKING / OFF-DUTY' : 'ACCEPT CONSENT & START RADAR',
                    style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, letterSpacing: 0.5),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMetricCard({required String title, required String value, required IconData icon, required Color color}) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFF334155)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, size: 16, color: color),
              const SizedBox(width: 6),
              Text(title, style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.grey)),
            ],
          ),
          const SizedBox(height: 8),
          Text(value, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white)),
        ],
      ),
    );
  }
}
