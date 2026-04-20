import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView, Dimensions, Alert, Animated, Image, Modal } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import io from 'socket.io-client';

const API_URL = 'https://smart-event-handler.onrender.com';

const Stack = createNativeStackNavigator();
const { width, height } = Dimensions.get('window');

let globalSocket = null;

const LoginScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.centerContent, { backgroundColor: '#4F46E5' }]}>
        <View style={styles.logoCircle}>
          <Ionicons name="sparkles" size={50} color="#4F46E5" />
        </View>
        <Text style={[styles.title, { color: '#FFF' }]}>EventSync</Text>
        <Text style={[styles.subtitle, { color: '#E0E7FF' }]}>Next-Gen Venue Experience</Text>
        <TouchableOpacity style={styles.btnWhite} onPress={() => navigation.replace('Home')}>
          <Text style={styles.btnWhiteText}>Get Started</Text>
          <Ionicons name="arrow-forward" size={20} color="#4F46E5" style={{ marginLeft: 8 }} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const HomeScreen = ({ navigation }) => {
  const [alerts, setAlerts] = useState([]);
  const [crowdData, setCrowdData] = useState([]);
  const [queues, setQueues] = useState([]);

  useEffect(() => {
    if (!globalSocket) globalSocket = io(API_URL);
    
    globalSocket.on('alerts', (data) => setAlerts(data));
    globalSocket.on('crowd-update', (data) => setCrowdData(data));
    globalSocket.on('queue-update', (data) => setQueues(data));
    
    return () => {
      globalSocket.off('alerts');
      globalSocket.off('crowd-update');
      globalSocket.off('queue-update');
    };
  }, []);

  const getAISuggestion = () => {
    if (crowdData.length === 0 && queues.length === 0) {
      Alert.alert('AI Suggestion', 'Gathering real-time venue data...');
      return;
    }
    
    let bestQueue = null;
    if (queues.length > 0) {
        bestQueue = queues.reduce((prev, curr) => (prev.waitTimeMins < curr.waitTimeMins ? prev : curr));
    }
    
    let bestZone = null;
    if (crowdData.length > 0) {
        bestZone = crowdData.reduce((prev, curr) => (prev.density < curr.density ? prev : curr));
    }

    let suggestion = "Based on current population traffic:\n\n";
    if (bestZone) {
      suggestion += `🟢 ${bestZone.name} is quiet right now (${bestZone.density}% full). Perfect time to visit!\n\n`;
    }
    if (bestQueue) {
      suggestion += `⚡ ${bestQueue.name} has the lowest wait time (${bestQueue.waitTimeMins} mins).`;
    }
    Alert.alert('✨ AI Smart Recommendation', suggestion);
  };

  const dynamicAlerts = [...alerts];
  
  if (queues.some(q => q.waitTimeMins === 0)) {
     const freeResources = queues.filter(q => q.waitTimeMins === 0).map(q => q.name).join(', ');
     dynamicAlerts.unshift({ id: 'free-res', type: 'success', message: `${freeResources} is currently free with no wait time!` });
  }

  // Navigation working now!

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.homeContent}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, Attendee 👋</Text>
            <Text style={styles.date}>Grand Tech Summit</Text>
          </View>
          <TouchableOpacity style={styles.profileBtn} onPress={() => navigation.navigate('Profile')}>
            <Ionicons name="person-circle" size={48} color="#4F46E5" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.sensorStatusHeader} onPress={() => navigation.navigate('SensorHub')}>
           <Ionicons name="stats-chart" size={16} color="#10B981" />
           <Text style={styles.sensorStatusText}>System Status: Optimal (24/24 Sensors Online)</Text>
           <Ionicons name="chevron-forward" size={16} color="#10B981" />
        </TouchableOpacity>

        <View style={styles.dataHubBanner}>
           <View style={styles.liveDot} />
           <Text style={styles.dataHubText}>Live Data Hub: 24 IoT Sensors & 12 CCTV Feeds</Text>
        </View>

        {dynamicAlerts.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.alertsScroll} contentContainerStyle={{ paddingRight: 20 }}>
             {dynamicAlerts.map((alt, idx) => {
               const isErr = alt.type === 'error';
               const isSuc = alt.type === 'success';
               return (
                <View key={alt.id || idx} style={[styles.alertCard, isErr ? styles.alertError : isSuc ? styles.alertSuccess : {}]}>
                  <Ionicons name={isErr ? "warning" : isSuc ? "checkmark-circle" : "alert-circle"} size={28} color={isErr ? "#DC2626" : isSuc ? "#059669" : "#D97706"} />
                  <View style={styles.alertTextContainer}>
                    <Text style={[styles.alertTitle, isErr ? {color: '#991B1B'} : isSuc ? {color: '#065F46'} : {}]}>
                       {isErr ? 'System Alert' : isSuc ? 'Resource Available' : 'Announcement'}
                    </Text>
                    <Text style={[styles.alertMessage, isErr ? {color: '#B91C1C'} : isSuc ? {color: '#047857'} : {}]}>{alt.message}</Text>
                  </View>
                </View>
             )})}
          </ScrollView>
        )}

        <Text style={styles.sectionTitle}>Explore Venue</Text>
        <View style={styles.grid}>
          <TouchableOpacity style={styles.gridCard} onPress={() => navigation.navigate('Heatmap')}>
            <View style={[styles.iconBox, { backgroundColor: '#EEF2FF' }]}>
              <Ionicons name="map" size={42} color="#4F46E5" />
            </View>
            <Text style={styles.cardTitle}>Live Map</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
              <View style={[styles.miniLiveDot, { backgroundColor: '#10B981' }]} />
              <Text style={styles.cardSubtitle}>Sensors Online</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.gridCard} onPress={() => navigation.navigate('Navigation')}>
            <View style={[styles.iconBox, { backgroundColor: '#ECFDF5' }]}>
              <Ionicons name="navigate-outline" size={42} color="#10B981" />
            </View>
            <Text style={styles.cardTitle}>Indoor Nav</Text>
            <Text style={styles.cardSubtitle}>Find your way</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.gridCard} onPress={() => navigation.navigate('Queues')}>
            <View style={[styles.iconBox, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="time" size={42} color="#D97706" />
            </View>
            <Text style={styles.cardTitle}>Queues</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
              <Ionicons name="videocam" size={12} color="#64748B" />
              <Text style={[styles.cardSubtitle, { marginLeft: 4 }]}>Vision AI Active</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.gridCard, styles.aiCard]} onPress={getAISuggestion}>
            <View style={[styles.iconBox, { backgroundColor: '#FCE7F3' }]}>
              <Ionicons name="flash" size={42} color="#DB2777" />
            </View>
            <Text style={[styles.cardTitle, {color: '#DB2777'}]}>AI Suggestion</Text>
            <Text style={styles.cardSubtitle}>Smart routing</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const HeatmapScreen = () => {
  const [crowdData, setCrowdData] = useState([]);

  useEffect(() => {
    if (!globalSocket) globalSocket = io(API_URL);
    globalSocket.on('crowd-update', (data) => setCrowdData(data));
    return () => globalSocket.off('crowd-update');
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.techHeader}>
           <Ionicons name="hardware-chip" size={20} color="#4F46E5" />
           <Text style={styles.techHeaderText}>IoT Sensor Fusion & Thermal Vision</Text>
        </View>
        <Text style={styles.pageDescription}>Real-time spatial density aggregated from active venue sensors.</Text>
        
        <View style={styles.visionCard}>
           <Image source={require('./assets/thermal_map.png')} style={styles.visionImage} />
           <View style={styles.visionOverlay}>
              <Text style={styles.visionLabel}>LIVE THERMAL FEED</Text>
              <View style={styles.visionPulse} />
           </View>
        </View>

        {crowdData.map((zone) => {
          let color = '#10B981'; // green
          if (zone.density > 60) color = '#F59E0B'; // yellow
          if (zone.density > 85) color = '#EF4444'; // red

          return (
            <View key={zone.id} style={styles.listCard}>
              <View style={{flex: 1}}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8}}>
                   <Text style={styles.zoneName}>{zone.name}</Text>
                   <Text style={styles.zoneDetails}>{zone.density}% Cap</Text>
                </View>
                <View style={styles.sensorBarBg}>
                   <View style={[styles.sensorBarFill, { width: `${zone.density}%`, backgroundColor: color }]} />
                </View>
                <Text style={{fontSize: 10, color: '#94A3B8', marginTop: 6}}>Last updated: Just now via Sensor Node {zone.id}</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

const NavigationScreen = () => {
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(false);

  const zones = [
    { id: '1', name: 'Food Court', top: '10%', left: '5%' },
    { id: '2', name: 'Washrooms', top: '10%', left: '50%' },
    { id: '3', name: 'Midpoint', top: '42%', left: '28%' },
    { id: '4', name: 'Main Gate', top: '75%', left: '5%' },
    { id: '5', name: 'Stage 1', top: '75%', left: '50%' }
  ];

  const handleSelectZone = (zoneName) => {
    if (!start) {
      setStart(zoneName);
    } else if (!end && zoneName !== start) {
      setEnd(zoneName);
      fetchRoute(start, zoneName);
    } else {
      setStart(zoneName);
      setEnd(null);
      setRoute(null);
    }
  };

  const fetchRoute = async (s, e) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/route-suggestion?start=${s}&end=${e}`);
      const data = await response.json();
      setRoute(data);
    } catch (err) {
      Alert.alert('Error', 'Failed to fetch route');
    } finally {
      setLoading(false);
    }
  };

  const resetSelection = () => {
    setStart(null);
    setEnd(null);
    setRoute(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navHeader}>
        <Text style={styles.navHeaderTitle}>Interactive Map</Text>
        <Text style={styles.navHeaderSubtitle}>
          {!start ? "Tap a location to set as START" : !end ? "Tap another location for DESTINATION" : "Route calculated!"}
        </Text>
        {(start || end) && (
          <TouchableOpacity onPress={resetSelection} style={styles.resetBtn}>
            <Text style={styles.resetBtnText}>Reset</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.mapContainer}>
        <View style={styles.mapFloorPlan}>
           {zones.map(z => {
              const isStart = start === z.name;
              const isEnd = end === z.name;
              const inRoute = route && route.route && route.route.includes(z.name);
              
              let bgColor = '#FFF';
              let borderColor = '#CBD5E1';
              if (isStart) { bgColor = '#4F46E5'; borderColor = '#4F46E5'; }
              else if (isEnd) { bgColor = '#EF4444'; borderColor = '#EF4444'; }
              else if (inRoute) { bgColor = '#C7D2FE'; borderColor = '#818CF8'; }

              return (
                <TouchableOpacity 
                  key={z.id} 
                  style={[styles.mapNode, { top: z.top, left: z.left, backgroundColor: bgColor, borderColor }]} 
                  onPress={() => handleSelectZone(z.name)}
                >
                   {isStart && <View style={styles.pinIcon}><Ionicons name="location" size={14} color="#FFF" /></View>}
                   {isEnd && <View style={styles.pinIcon}><Ionicons name="flag" size={14} color="#FFF" /></View>}
                   <Text style={[styles.mapNodeText, (isStart || isEnd) ? {color: '#FFF'} : {}]}>{z.name}</Text>
                </TouchableOpacity>
              )
           })}
        </View>
      </View>

      <ScrollView style={styles.routeResultPanel}>
        {loading && <Text style={{textAlign: 'center', marginTop: 20, color: '#64748B'}}>Calculating optimal route...</Text>}
        {route && (
          <View style={styles.routeCard}>
             <Text style={styles.routeTitle}>Directions</Text>
             <Text style={styles.routeDetails}>Estimated Time: {route.estimatedTimeMins} mins</Text>
             
             <View style={styles.pathContainer}>
                {route.route && route.route.map((step, idx) => (
                   <View key={idx} style={styles.pathStep}>
                      <View style={[styles.pathDot, idx === 0 ? {backgroundColor: '#4F46E5'} : idx === route.route.length - 1 ? {backgroundColor: '#EF4444'} : {}]} />
                      {idx !== route.route.length - 1 && <View style={styles.pathLine} />}
                      <Text style={styles.pathText}>{step}</Text>
                   </View>
                ))}
             </View>
             {route.note && <Text style={styles.routeNote}>{route.note}</Text>}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const QueuesScreen = () => {
  const [queues, setQueues] = useState([]);

  useEffect(() => {
    if (!globalSocket) globalSocket = io(API_URL);
    globalSocket.on('queue-update', (data) => setQueues(data));
    return () => globalSocket.off('queue-update');
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.techHeader}>
           <Ionicons name="videocam" size={20} color="#10B981" />
           <Text style={[styles.techHeaderText, {color: '#10B981'}]}>Computer Vision Queue Analysis</Text>
        </View>
        <Text style={styles.pageDescription}>Predictive wait times calculated continuously via AI video feeds.</Text>

        <View style={styles.visionCard}>
           <Image source={require('./assets/cctv_analysis.png')} style={styles.visionImage} />
           <View style={[styles.visionOverlay, {backgroundColor: 'rgba(16, 185, 129, 0.2)'}]}>
              <Text style={[styles.visionLabel, {color: '#10B981'}]}>CCTV VISION ENABLED</Text>
              <View style={[styles.visionPulse, {backgroundColor: '#10B981'}]} />
           </View>
        </View>

        {queues.map((q) => (
          <View key={q.id} style={styles.listCard}>
            <Text style={styles.zoneName}>{q.name}</Text>
            <View style={[styles.timeBadge, q.waitTimeMins === 0 ? {backgroundColor: '#D1FAE5'} : {}]}>
              <Text style={[styles.timeBadgeText, q.waitTimeMins === 0 ? {color: '#065F46'} : {}]}>{q.waitTimeMins} mins</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const SensorHubScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.pageDescription}>Management console for all venue IoT nodes and data collectors.</Text>
        
        <View style={styles.hubStatsRow}>
           <View style={styles.hubStatItem}>
              <Text style={styles.hubStatVal}>24</Text>
              <Text style={styles.hubStatLab}>IoT Nodes</Text>
           </View>
           <View style={styles.hubStatItem}>
              <Text style={styles.hubStatVal}>12</Text>
              <Text style={styles.hubStatLab}>Cameras</Text>
           </View>
           <View style={styles.hubStatItem}>
              <Text style={[styles.hubStatVal, {color: '#10B981'}]}>99.9%</Text>
              <Text style={styles.hubStatLab}>Uptime</Text>
           </View>
        </View>

        <Text style={styles.sectionTitle}>Active Data Pipelines</Text>
        {[1,2,3,4].map(i => (
           <View key={i} style={styles.sensorItem}>
              <View style={styles.sensorIconBox}>
                 <Ionicons name="radio" size={20} color="#4F46E5" />
              </View>
              <View style={{flex: 1, marginLeft: 12}}>
                 <Text style={styles.sensorName}>Sensor Node #{100+i}</Text>
                 <Text style={styles.sensorMeta}>Transmitting: Crowd Velocity, Thermal Signatures</Text>
              </View>
              <View style={styles.statusPill}>
                 <Text style={styles.statusPillText}>ONLINE</Text>
              </View>
           </View>
        ))}
        
        <View style={styles.infoCard}>
           <Ionicons name="information-circle" size={24} color="#4F46E5" />
           <Text style={styles.infoCardText}>
              All data is anonymized at the edge. No personally identifiable information (PII) is stored or transmitted to the cloud.
           </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const ProfileScreen = () => {
  const [scanning, setScanning] = useState(false);
  const [scanAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (scanning) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scanAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
          Animated.timing(scanAnim, { toValue: 0, duration: 1500, useNativeDriver: true })
        ])
      ).start();
    } else {
      scanAnim.stopAnimation();
    }
  }, [scanning]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.centerContent}>
        {scanning ? (
          <View style={styles.scannerContainer}>
            <View style={styles.scannerMock}>
              <Animated.View style={[styles.scannerLine, { transform: [{ translateY: scanAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 200] }) }] }]} />
            </View>
            <Text style={[styles.title, {marginTop: 20}]}>Scanning QR...</Text>
            <TouchableOpacity style={[styles.primaryButton, {marginTop: 30, backgroundColor: '#EF4444'}]} onPress={() => setScanning(false)}>
              <Text style={styles.primaryButtonText}>Cancel Scan</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.qrMock}>
              <Ionicons name="qr-code" size={150} color="#111" />
            </View>
            <Text style={styles.title}>John Doe</Text>
            <Text style={styles.subtitle}>VIP Pass</Text>
            <TouchableOpacity style={[styles.primaryButton, {marginTop: 20}]} onPress={() => setScanning(true)}>
              <Ionicons name="scan" size={20} color="#FFF" style={{marginRight: 8}} />
              <Text style={styles.primaryButtonText}>Scan Ticket QR</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ 
        headerStyle: { backgroundColor: '#F8FAFC' },
        headerShadowVisible: false,
        headerTintColor: '#1F2937',
        headerTitleStyle: { fontWeight: '700', fontSize: 18 },
        headerBackTitleVisible: false
      }}>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Heatmap" component={HeatmapScreen} options={{ title: 'Live Crowd Map' }} />
        <Stack.Screen name="Navigation" component={NavigationScreen} options={{ title: 'Routing' }} />
        <Stack.Screen name="Queues" component={QueuesScreen} options={{ title: 'Queue Status' }} />
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'My Profile' }} />
        <Stack.Screen name="SensorHub" component={SensorHubScreen} options={{ title: 'System Infrastructure' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  homeContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  scrollContent: {
    padding: 20,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  date: {
    fontSize: 15,
    color: '#64748B',
    marginTop: 4,
    fontWeight: '500',
  },
  logoCircle: {
    width: 100,
    height: 100,
    backgroundColor: '#FFF',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 10,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 8,
    marginBottom: 40,
  },
  btnWhite: {
    backgroundColor: '#FFF',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 999,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  btnWhiteText: {
    color: '#4F46E5',
    fontSize: 18,
    fontWeight: '700',
  },
  primaryButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 999,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  alertsScroll: {
    maxHeight: 110,
    marginBottom: 20,
  },
  alertCard: {
    backgroundColor: '#FEF3C7',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    width: width - 60,
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  alertError: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  alertSuccess: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  alertTextContainer: {
    marginLeft: 14,
    flex: 1,
  },
  alertTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#92400E',
    marginBottom: 4,
  },
  alertMessage: {
    fontSize: 14,
    color: '#B45309',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 16,
  },
  grid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignContent: 'space-between',
  },
  gridCard: {
    backgroundColor: '#FFFFFF',
    width: (width - 56) / 2,
    height: '48%', // Covers the remaining vertical space evenly
    padding: 20,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBox: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  pageDescription: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 20,
    lineHeight: 24,
  },
  listCard: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  zoneName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  zoneDetails: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  densityIndicator: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  timeBadge: {
    backgroundColor: '#EEF2FF',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
  },
  timeBadgeText: {
    color: '#4F46E5',
    fontWeight: '700',
    fontSize: 14,
  },
  qrMock: {
    padding: 24,
    backgroundColor: '#FFF',
    borderRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  scannerContainer: {
    width: '100%',
    alignItems: 'center',
  },
  scannerMock: {
    width: 250,
    height: 250,
    borderWidth: 4,
    borderColor: '#4F46E5',
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#1E293B',
    position: 'relative',
  },
  scannerLine: {
    width: '100%',
    height: 4,
    backgroundColor: '#10B981',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 5,
  },
  navHeader: {
    padding: 20,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    position: 'relative',
    zIndex: 10,
  },
  navHeaderTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  navHeaderSubtitle: {
    fontSize: 15,
    color: '#64748B',
    marginTop: 4,
    fontWeight: '500',
  },
  resetBtn: {
    position: 'absolute',
    right: 20,
    top: 25,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#EEF2FF',
    borderRadius: 8,
  },
  resetBtnText: {
    color: '#4F46E5',
    fontWeight: '700',
  },
  mapContainer: {
    height: 380,
    backgroundColor: '#E2E8F0',
    overflow: 'hidden',
    position: 'relative',
  },
  mapFloorPlan: {
    flex: 1,
    margin: 20,
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    position: 'relative',
  },
  mapNode: {
    position: 'absolute',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapNodeText: {
    fontWeight: '700',
    fontSize: 14,
    color: '#334155',
  },
  pinIcon: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 3,
    zIndex: 5,
  },
  routeResultPanel: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 20,
  },
  routeCard: {
    backgroundColor: '#EEF2FF',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  routeTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#3730A3',
    marginBottom: 4,
  },
  routeDetails: {
    fontSize: 15,
    color: '#4F46E5',
    fontWeight: '600',
    marginBottom: 16,
  },
  pathContainer: {
    marginLeft: 10,
  },
  pathStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  pathDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#10B981',
    zIndex: 2,
  },
  pathLine: {
    position: 'absolute',
    left: 6,
    top: 14,
    width: 2,
    height: 30,
    backgroundColor: '#C7D2FE',
    zIndex: 1,
  },
  pathText: {
    marginLeft: 16,
    fontSize: 16,
    color: '#1E3A8A',
    fontWeight: '600',
  },
  routeNote: {
    marginTop: 16,
    color: '#6366F1',
    fontStyle: 'italic',
  },
  dataHubBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    marginRight: 10,
  },
  dataHubText: {
    fontSize: 12,
    color: '#4F46E5',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  techHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  techHeaderText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#4F46E5',
    marginLeft: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sensorBarBg: {
    width: '100%',
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  sensorBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  miniLiveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  sensorStatusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    padding: 10,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  sensorStatusText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    color: '#059669',
    marginLeft: 8,
  },
  visionCard: {
    width: '100%',
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    position: 'relative',
    backgroundColor: '#000',
  },
  visionImage: {
    width: '100%',
    height: '100%',
    opacity: 0.8,
  },
  visionOverlay: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(79, 70, 229, 0.2)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  visionLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: 1,
  },
  visionPulse: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFF',
    marginLeft: 6,
  },
  hubStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  hubStatItem: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    width: (width - 60) / 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  hubStatVal: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  hubStatLab: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 4,
    fontWeight: '600',
  },
  sensorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  sensorIconBox: {
    width: 40,
    height: 40,
    backgroundColor: '#EEF2FF',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sensorName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  sensorMeta: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  statusPill: {
    backgroundColor: '#D1FAE5',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#065F46',
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    padding: 16,
    borderRadius: 16,
    marginTop: 12,
    alignItems: 'center',
  },
  infoCardText: {
    flex: 1,
    fontSize: 12,
    color: '#475569',
    marginLeft: 12,
    lineHeight: 18,
  }
});
