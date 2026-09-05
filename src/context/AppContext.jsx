import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  REWARDS_CATALOG,
  PROCUREMENT_CENTRES,
  COMMODITIES,
} from '../data/mockData';
import * as kisanFlowService from '../services/kisanFlowService';
import { recordEvent } from '../services/notificationService';

// Default clean initial profile
const DEFAULT_FARMER_PROFILE = {
  name: 'Ramesh Kumar',
  phone: '+91 98765 43210',
  aadhaar: 'XXXX-XXXX-8291',
  kccNumber: 'KCC-UP-DAD-4891',
  landHolding: '4.5 Acres (Wheat / Paddy)',
  village: 'Dhoom Manikpur, Dadri',
  district: 'Gautam Buddha Nagar',
  state: 'Uttar Pradesh',
  bankAccount: 'Bank of Baroda (A/C •••• 4921)',
  ifsc: 'BARB0DADRIX',
  preferredLanguage: 'Hindi / English',
  smsAlerts: true,
  points: 0, // Starts at 0, earned through actual activities
};

const loadStorage = (key, fallback) => {
  if (typeof window === 'undefined') return fallback;
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return fallback;
    const parsed = JSON.parse(saved);

    // Filter out obsolete hardcoded demo data
    if (key === 'kf_activeBooking' && (parsed?.bookingId === 'KF-2026-00127' || parsed?.token === 'A027')) {
      return fallback;
    }
    if (key === 'kf_queueList' && Array.isArray(parsed) && parsed.some(q => q.token === 'A019')) {
      return fallback;
    }
    if (key === 'kf_operatorBookings' && Array.isArray(parsed) && parsed.some(b => b.id === 'BK-101')) {
      return fallback;
    }
    if (key === 'kf_rewardsHistory' && Array.isArray(parsed) && parsed.some(r => r.id === 'act-1')) {
      return fallback;
    }
    return parsed;
  } catch {
    return fallback;
  }
};

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(() => loadStorage('kf_userRole', 'farmer'));
  const [activeBooking, setActiveBooking] = useState(() => loadStorage('kf_activeBooking', null));
  const [farmerProfile, setFarmerProfile] = useState(() => loadStorage('kf_session_profile', null));
  const [queueList, setQueueList] = useState(() => loadStorage('kf_queueList', []));
  const [operatorBookings, setOperatorBookings] = useState(() => loadStorage('kf_operatorBookings', []));
  const [rewardsCatalog, setRewardsCatalog] = useState(() => loadStorage('kf_rewardsCatalog', REWARDS_CATALOG));
  const [rewardsHistory, setRewardsHistory] = useState(() => loadStorage('kf_rewardsHistory', []));
  const [alertNotification, setAlertNotification] = useState(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [realtimeStatus, setRealtimeStatus] = useState('connecting');
  const [lastSyncTime, setLastSyncTime] = useState(() => new Date().toLocaleTimeString());

  // Synchronize state changes to localStorage
  useEffect(() => {
    try { localStorage.setItem('kf_userRole', JSON.stringify(userRole)); } catch {}
  }, [userRole]);

  useEffect(() => {
    try { localStorage.setItem('kf_activeBooking', JSON.stringify(activeBooking)); } catch {}
  }, [activeBooking]);

  useEffect(() => {
    try { localStorage.setItem('kf_queueList', JSON.stringify(queueList)); } catch {}
  }, [queueList]);

  useEffect(() => {
    try { localStorage.setItem('kf_operatorBookings', JSON.stringify(operatorBookings)); } catch {}
  }, [operatorBookings]);

  useEffect(() => {
    try {
      if (farmerProfile) {
        localStorage.setItem('kf_session_profile', JSON.stringify(farmerProfile));
      } else {
        localStorage.removeItem('kf_session_profile');
      }
    } catch {}
  }, [farmerProfile]);

  useEffect(() => {
    try { localStorage.setItem('kf_rewardsCatalog', JSON.stringify(rewardsCatalog)); } catch {}
  }, [rewardsCatalog]);

  useEffect(() => {
    try { localStorage.setItem('kf_rewardsHistory', JSON.stringify(rewardsHistory)); } catch {}
  }, [rewardsHistory]);

  // Synchronize active booking strictly for the logged in farmer
  useEffect(() => {
    let isCancelled = false;
    async function syncActiveBooking() {
      const fId = farmerProfile?.farmerId || farmerProfile?.id;
      if (fId || farmerProfile?.phone || farmerProfile?.email) {
        const active = await kisanFlowService.getActiveBookingForFarmer(fId, farmerProfile?.phone, farmerProfile?.email);
        if (!isCancelled) {
          setActiveBooking(active);
        }
      } else {
        if (!isCancelled) setActiveBooking(null);
      }
    }
    syncActiveBooking();
    return () => { isCancelled = true; };
  }, [farmerProfile?.farmerId, farmerProfile?.id, farmerProfile?.phone, farmerProfile?.email]);

  // Authenticate Farmer Session
  const loginFarmer = async (profile) => {
    setUserRole('farmer');
    setFarmerProfile(profile);
    try {
      localStorage.setItem('kf_session_profile', JSON.stringify(profile));
      localStorage.setItem('kf_userRole', JSON.stringify('farmer'));
    } catch {}

    const fId = profile?.farmerId || profile?.id;
    if (fId || profile?.phone || profile?.email) {
      try {
        const active = await kisanFlowService.getActiveBookingForFarmer(fId, profile?.phone, profile?.email);
        setActiveBooking(active);
      } catch {
        setActiveBooking(null);
      }
    } else {
      setActiveBooking(null);
    }
  };

  // Sign out and clear active farmer session
  const logout = async () => {
    setFarmerProfile(null);
    setActiveBooking(null);
    setUserRole('farmer');
    try {
      localStorage.removeItem('kf_session_profile');
      localStorage.removeItem('kf_activeBooking');
      localStorage.removeItem('kf_farmerProfile');
    } catch {}
    if (kisanFlowService.supabase?.auth) {
      try {
        await kisanFlowService.supabase.auth.signOut();
      } catch {}
    }
  };

  // Initial data load from PostgreSQL
  useEffect(() => {
    let isMounted = true;

    async function loadAuthoritativeData() {
      try {
        const bookings = await kisanFlowService.getCentreBookings('dadri');
        if (isMounted && bookings && bookings.length > 0) {
          // Filter out demo booking A027
          const realBookings = bookings.filter(b => b.token !== 'A027' && b.bookingId !== 'KF-2026-00127');
          setOperatorBookings(realBookings);

          // Build queue from active bookings
          const activeQueue = realBookings
            .filter(b => !['completed', 'cancelled', 'no-show'].includes((b.status || '').toLowerCase()))
            .map((b, idx) => ({
              token: b.token,
              farmer: b.farmer,
              commodity: b.commodity,
              qty: `${b.quantityKg} kg`,
              status: idx === 0 && b.status.toLowerCase() === 'called' ? 'Called' : b.status,
              counter: `Position #${idx + 1}`,
              waitTime: `${(idx + 1) * 6}m`,
              isUser: activeBooking?.token === b.token,
            }));
          setQueueList(activeQueue);
        }
      } catch (err) {
        console.warn('[KisanFlow] Authoritative data load error:', err);
      }
      setLastSyncTime(new Date().toLocaleTimeString());
    }

    loadAuthoritativeData();

    // Subscribe to multi-client Supabase Realtime channel
    const unsubscribe = kisanFlowService.subscribeToRealtime({
      onBookingChange: (payload) => {
        setLastSyncTime(new Date().toLocaleTimeString());
        const { eventType, new: newRec, old: oldRec } = payload;

        if (eventType === 'INSERT') {
          const comm = COMMODITIES.find(c => c.id === newRec.commodity_id) || COMMODITIES[0];
          const newOpItem = {
            id: newRec.id,
            bookingId: newRec.booking_id,
            token: newRec.token,
            farmer: 'Registered Farmer',
            phone: '+91 98765 43210',
            commodity: comm.name.split(' ')[0],
            quantityKg: Number(newRec.quantity),
            slot: '11:00 AM - 12:00 PM',
            status: newRec.status.charAt(0).toUpperCase() + newRec.status.slice(1),
            vehicle: 'Tractor Trolley',
          };
          setOperatorBookings(prev => [newOpItem, ...prev.filter(b => b.bookingId !== newRec.booking_id)]);

          // Add to queue
          const queueItem = {
            token: newRec.token,
            farmer: 'Registered Farmer',
            commodity: comm.name.split(' ')[0],
            qty: `${newRec.quantity} kg`,
            status: 'Waiting',
            counter: `Position #${newRec.queue_position || 1}`,
            waitTime: `${newRec.predicted_wait_minutes || 25}m`,
            isUser: activeBooking?.token === newRec.token,
          };
          setQueueList(prev => [...prev.filter(q => q.token !== newRec.token), queueItem]);
        } else if (eventType === 'UPDATE') {
          const updatedStatus = newRec.status.charAt(0).toUpperCase() + newRec.status.slice(1);

          setOperatorBookings(prev =>
            prev.map(b => (b.token === newRec.token || b.bookingId === newRec.booking_id ? { ...b, status: updatedStatus } : b))
          );

          setQueueList(prev =>
            prev.map(q => (q.token === newRec.token ? { ...q, status: updatedStatus } : q))
          );

          // If active user is affected
          setActiveBooking(curr => {
            if (curr && (curr.token === newRec.token || curr.bookingId === newRec.booking_id)) {
              if (newRec.status.toLowerCase() === 'called') {
                playAlertSound();
                setAlertNotification(`🔔 YOUR TOKEN ${curr.token} IS CALLED! Please report to Gate 1 Weighbridge.`);
              } else if (newRec.status.toLowerCase() === 'completed') {
                playAlertSound();
                setAlertNotification(`✓ Token ${curr.token} Procurement Completed. Proceed to Payment.`);
              }
              return {
                ...curr,
                status: updatedStatus,
                paymentStatus: newRec.status.toLowerCase() === 'completed' ? 'Successful' : curr.paymentStatus,
              };
            }
            return curr;
          });
        }
      },
      onStatusChange: (status) => {
        if (isMounted) {
          setRealtimeStatus(status);
        }
      },
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [activeBooking?.token]);

  // Alert Sound chime helper
  const playAlertSound = () => {
    if (!audioEnabled || typeof window === 'undefined') return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch {}
  };

  // Farmer Action: Create Booking
  const createBooking = async (bookingData) => {
    const selectedCentre = PROCUREMENT_CENTRES.find(c => c.id === bookingData.centreId) || PROCUREMENT_CENTRES[0];
    const selectedCommodity = COMMODITIES.find(c => c.id === bookingData.commodityId) || COMMODITIES[0];

    // Compute dynamic token
    const token = await kisanFlowService.generateDynamicToken(selectedCentre.id);

    const payload = {
      ...bookingData,
      token,
      farmerId: farmerProfile?.farmerId || farmerProfile?.id || null,
      farmerName: farmerProfile?.name || 'Registered Farmer',
      farmerPhone: farmerProfile?.phone || null,
      farmerEmail: farmerProfile?.email || null,
      centreName: selectedCentre.name,
      commodityName: selectedCommodity.name,
      queuePosition: queueList.length + 1,
      predictedWaitMin: bookingData.predictedWaitMin || 30,
    };

    const newBooking = await kisanFlowService.createBooking(payload);
    setActiveBooking(newBooking);

    // Add reward bonus if optimal slot selected
    const pointBonus = bookingData.isRecommended ? 50 : 20;
    setFarmerProfile(prev => prev ? ({
      ...prev,
      points: (prev.points || 0) + pointBonus,
    }) : null);

    setRewardsHistory(prev => [
      {
        id: `act-${Date.now()}`,
        action: bookingData.isRecommended ? 'Booked AI Recommended Slot (+50 Bonus)' : 'Booked Standard Procurement Slot',
        points: `+${pointBonus}`,
        date: 'Today',
      },
      ...prev,
    ]);

    // Insert into live queue list
    const newQueueItem = {
      token: newBooking.token,
      farmer: farmerProfile?.name || 'Registered Farmer',
      commodity: selectedCommodity.name.split(' ')[0],
      qty: `${bookingData.quantityKg} kg`,
      status: 'YOU',
      counter: `Position #${newBooking.queuePosition}`,
      waitTime: `${newBooking.predictedWaitMinutes}m`,
      isUser: true,
    };

    setQueueList(prev => {
      const cleaned = prev.map(item => ({
        ...item,
        isUser: false,
        status: item.status === 'YOU' ? 'Waiting' : item.status,
      }));
      return [...cleaned, newQueueItem];
    });

    playAlertSound();
    return newBooking;
  };

  // Operator Action: Call Next Farmer in queue
  const advanceQueue = async () => {
    playAlertSound();

    // Find the next waiting token in queue
    const waitingItem = queueList.find(item => item.status === 'Waiting' || item.status === 'YOU');
    if (!waitingItem) {
      return { success: false, msg: 'No waiting farmers in queue' };
    }

    const targetToken = waitingItem.token;

    // Update state to called
    await kisanFlowService.updateBookingStatus(targetToken, 'Called', 'Waiting');

    setQueueList(prev =>
      prev.map(item => {
        if (item.token === targetToken) {
          return { ...item, status: item.isUser ? 'YOU (Called!)' : 'Called' };
        }
        return item;
      })
    );

    setOperatorBookings(prev =>
      prev.map(b => (b.token === targetToken ? { ...b, status: 'Called' } : b))
    );

    // If active user is called
    if (activeBooking && activeBooking.token === targetToken) {
      setActiveBooking(prev => ({ ...prev, status: 'Called' }));
      setAlertNotification(`🔔 Token Alert: Your token ${targetToken} has been called to Gate 1 Weighbridge!`);
    }

    return { success: true, token: targetToken };
  };

  // Operator Action: Change status for specific token
  const updateOperatorBookingStatus = async (idOrToken, newStatus) => {
    await kisanFlowService.updateBookingStatus(idOrToken, newStatus);

    setOperatorBookings(prev =>
      prev.map(b => (b.id === idOrToken || b.token === idOrToken ? { ...b, status: newStatus } : b))
    );

    setQueueList(prev =>
      prev.map(q => (q.token === idOrToken ? { ...q, status: newStatus } : q))
    );

    if (activeBooking && (activeBooking.token === idOrToken || activeBooking.bookingId === idOrToken)) {
      setActiveBooking(prev => ({
        ...prev,
        status: newStatus,
        paymentStatus: newStatus === 'Completed' ? 'Successful' : prev.paymentStatus,
      }));
    }
  };

  // Farmer Action: Submit Feedback
  const submitFeedback = (feedback) => {
    setFarmerProfile(prev => prev ? ({
      ...prev,
      points: (prev.points || 0) + 25,
    }) : null);
    setRewardsHistory(prev => [
      {
        id: `act-${Date.now()}`,
        action: `Submitted Mandi Experience Feedback (${feedback.rating} ★)`,
        points: '+25',
        date: 'Today',
      },
      ...prev,
    ]);

    kisanFlowService.createFeedback?.(feedback);
    playAlertSound();
  };

  // Farmer Action: Redeem Reward
  const claimReward = (rewardId) => {
    const reward = rewardsCatalog.find(r => r.id === rewardId);
    if (!reward || reward.claimed) return { success: false, msg: 'Already claimed' };
    if ((farmerProfile?.points || 0) < reward.costPoints) {
      return { success: false, msg: 'Insufficient points' };
    }

    setFarmerProfile(prev => prev ? ({
      ...prev,
      points: (prev.points || 0) - reward.costPoints,
    }) : null);

    setRewardsCatalog(prev =>
      prev.map(r => (r.id === rewardId ? { ...r, claimed: true } : r))
    );

    setRewardsHistory(prev => [
      {
        id: `act-${Date.now()}`,
        action: `Redeemed ${reward.title}`,
        points: `-${reward.costPoints}`,
        date: 'Today',
      },
      ...prev,
    ]);

    playAlertSound();
    return { success: true, msg: `Voucher unlocked: ${reward.code}` };
  };

  return (
    <AppContext.Provider
      value={{
        userRole,
        setUserRole,
        activeBooking,
        setActiveBooking,
        farmerProfile,
        setFarmerProfile,
        queueList,
        setQueueList,
        operatorBookings,
        rewardsCatalog,
        rewardsHistory,
        loginFarmer,
        logout,
        createBooking,
        advanceQueue,
        updateOperatorBookingStatus,
        submitFeedback,
        claimReward,
        alertNotification,
        setAlertNotification,
        audioEnabled,
        setAudioEnabled,
        playAlertSound,
        realtimeStatus,
        lastSyncTime,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
