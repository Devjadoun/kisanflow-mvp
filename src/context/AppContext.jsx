import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_ACTIVE_BOOKING,
  INITIAL_FARMER_PROFILE,
  INITIAL_QUEUE_LIST,
  OPERATOR_TODAYS_BOOKINGS,
  REWARDS_CATALOG,
  REWARDS_HISTORY,
  PROCUREMENT_CENTRES,
  COMMODITIES,
} from '../data/mockData';
import * as kisanFlowService from '../services/kisanFlowService';

const loadStorage = (key, fallback) => {
  if (typeof window === 'undefined') return fallback;
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
};

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(() => loadStorage('kf_userRole', 'farmer'));
  const [activeBooking, setActiveBooking] = useState(() => loadStorage('kf_activeBooking', INITIAL_ACTIVE_BOOKING));
  const [farmerProfile, setFarmerProfile] = useState(() => loadStorage('kf_farmerProfile', INITIAL_FARMER_PROFILE));
  const [queueList, setQueueList] = useState(() => loadStorage('kf_queueList', INITIAL_QUEUE_LIST));
  const [operatorBookings, setOperatorBookings] = useState(() => loadStorage('kf_operatorBookings', OPERATOR_TODAYS_BOOKINGS));
  const [rewardsCatalog, setRewardsCatalog] = useState(() => loadStorage('kf_rewardsCatalog', REWARDS_CATALOG));
  const [rewardsHistory, setRewardsHistory] = useState(() => loadStorage('kf_rewardsHistory', REWARDS_HISTORY));
  const [alertNotification, setAlertNotification] = useState(null);
  const [audioEnabled, setAudioEnabled] = useState(true);

  useEffect(() => {
    try {
      localStorage.setItem('kf_userRole', JSON.stringify(userRole));
    } catch {}
  }, [userRole]);

  useEffect(() => {
    try {
      localStorage.setItem('kf_activeBooking', JSON.stringify(activeBooking));
    } catch {}
  }, [activeBooking]);

  useEffect(() => {
    try {
      localStorage.setItem('kf_queueList', JSON.stringify(queueList));
    } catch {}
  }, [queueList]);

  useEffect(() => {
    try {
      localStorage.setItem('kf_operatorBookings', JSON.stringify(operatorBookings));
    } catch {}
  }, [operatorBookings]);

  useEffect(() => {
    try {
      localStorage.setItem('kf_farmerProfile', JSON.stringify(farmerProfile));
    } catch {}
  }, [farmerProfile]);

  useEffect(() => {
    try {
      localStorage.setItem('kf_rewardsCatalog', JSON.stringify(rewardsCatalog));
    } catch {}
  }, [rewardsCatalog]);

  useEffect(() => {
    try {
      localStorage.setItem('kf_rewardsHistory', JSON.stringify(rewardsHistory));
    } catch {}
  }, [rewardsHistory]);

  // Helper: Trigger simulated chime / alert sound
  const playAlertSound = () => {
    if (!audioEnabled || typeof window === 'undefined') return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1); // A5
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch {
      // AudioContext might be restricted until user interaction
    }
  };

  // Farmer Action: Book Slot
  const createBooking = (bookingData) => {
    // Generate clean unique token (e.g. A031, A032)
    const existingTokens = queueList.map(q => q.token);
    let tokenNum = 31;
    while (existingTokens.includes(`A0${tokenNum}`) || existingTokens.includes(`A${tokenNum}`)) {
      tokenNum++;
    }
    const token = tokenNum < 100 ? `A0${tokenNum}` : `A${tokenNum}`;
    const bookingId = `KF-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const selectedCentre = PROCUREMENT_CENTRES.find(c => c.id === bookingData.centreId) || PROCUREMENT_CENTRES[0];
    const selectedCommodity = COMMODITIES.find(c => c.id === bookingData.commodityId) || COMMODITIES[0];
    const totalAmount = (bookingData.quantityKg * selectedCommodity.mspPerKg);

    const newBooking = {
      bookingId,
      token,
      centreId: selectedCentre.id,
      centreName: selectedCentre.name,
      commodityId: selectedCommodity.id,
      commodityName: selectedCommodity.name,
      quantityKg: Number(bookingData.quantityKg),
      ratePerKg: selectedCommodity.mspPerKg,
      ratePerQuintal: selectedCommodity.mspPerQuintal,
      totalEstimatedAmount: totalAmount,
      date: bookingData.date || 'Today, 05 Sept 2026',
      rawDate: bookingData.rawDate || '2026-09-05',
      timeSlot: bookingData.timeSlot || '11:00 AM - 12:00 PM',
      queuePosition: bookingData.isRecommended ? 6 : 14,
      predictedWaitMinutes: bookingData.predictedWaitMin || 35,
      status: 'Booked',
      vehicleType: bookingData.vehicleType || 'Tractor Trolley',
      bookingTimestamp: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ', 10:00 AM',
      moisturePercent: 11.2,
      qualityGrade: 'Grade A (MSP Compliant)',
      grossWeightKg: 3200 + Number(bookingData.quantityKg),
      tareWeightKg: 3200,
      netWeightKg: Number(bookingData.quantityKg),
      paymentStatus: 'Pending Weighing',
      transactionId: `KF-PAY-${Math.floor(100000 + Math.random() * 900000)}`,
      paymentDate: 'Pending Verification',
      disbursementMode: 'Simulated DBT Direct Benefit Transfer (Demo Data)',
    };

    setActiveBooking(newBooking);

    // Add +50 reward points if AI recommended slot was chosen
    const pointBonus = bookingData.isRecommended ? 50 : 20;
    setFarmerProfile(prev => ({
      ...prev,
      points: prev.points + pointBonus,
    }));

    setRewardsHistory(prev => [
      {
        id: `act-${Date.now()}`,
        action: bookingData.isRecommended ? 'Booked AI Recommended Slot (+50 Bonus)' : 'Booked Standard Procurement Slot',
        points: `+${pointBonus}`,
        date: 'Today',
      },
      ...prev,
    ]);

    // Insert into live queue list, clearing previous YOU status
    const newQueueItem = {
      token,
      farmer: farmerProfile.name,
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

    // Insert into operator list
    const newOperatorBooking = {
      id: `BK-${Date.now()}`,
      bookingId: newBooking.bookingId,
      token,
      farmer: `${farmerProfile.name} (Demo User)`,
      phone: farmerProfile.phone,
      commodity: selectedCommodity.name.split(' ')[0],
      quantityKg: Number(bookingData.quantityKg),
      slot: newBooking.timeSlot,
      status: 'Booked',
      vehicle: newBooking.vehicleType,
    };
    setOperatorBookings(prev => [newOperatorBooking, ...prev]);

    try {
      localStorage.setItem('kf_activeBooking', JSON.stringify(newBooking));
      const cleaned = queueList.map(item => ({
        ...item,
        isUser: false,
        status: item.status === 'YOU' ? 'Waiting' : item.status,
      }));
      localStorage.setItem('kf_queueList', JSON.stringify([...cleaned, newQueueItem]));
      localStorage.setItem('kf_operatorBookings', JSON.stringify([newOperatorBooking, ...operatorBookings]));
    } catch {}

    // Persist to Supabase backend (with graceful local fallback)
    kisanFlowService.createBooking(newBooking).catch(err => {
      console.warn('[KisanFlow] Backend sync notice:', err);
    });

    playAlertSound();
    return newBooking;
  };

  // Operator Action: Call Next Farmer
  const advanceQueue = () => {
    playAlertSound();
    setQueueList(prev => {
      let currentIndex = prev.findIndex(item => item.status === 'Current');
      if (currentIndex === -1) currentIndex = 3;

      return prev.map((item, idx) => {
        if (idx < currentIndex) {
          return { ...item, status: 'Completed' };
        } else if (idx === currentIndex) {
          return { ...item, status: 'Completed' };
        } else if (idx === currentIndex + 1) {
          return { ...item, status: item.isUser ? 'YOU (Called!)' : 'Current' };
        }
        return item;
      });
    });

    // Also update active booking if user is closer
    setActiveBooking(prev => {
      const newPos = Math.max(1, prev.queuePosition - 1);
      const newWait = Math.max(5, prev.predictedWaitMinutes - 4);
      let newStatus = prev.status;
      if (newPos <= 3 && prev.status === 'Booked') {
        newStatus = 'Arrived';
        setAlertNotification('🔔 Token Alert: You are 3 positions away! Please report to Gate 1 Weighbridge.');
      } else if (newPos === 1) {
        newStatus = 'In Queue';
      }
      return {
        ...prev,
        queuePosition: newPos,
        predictedWaitMinutes: newWait,
        status: newStatus,
      };
    });
  };

  // Operator Action: Change status for specific token
  const updateOperatorBookingStatus = (id, newStatus) => {
    setOperatorBookings(prev =>
      prev.map(b => (b.id === id || b.token === id ? { ...b, status: newStatus } : b))
    );

    const item = operatorBookings.find(b => b.id === id || b.token === id);
    const identifier = (item && (item.bookingId || item.token)) || id;

    // Call Supabase / local data access service
    kisanFlowService.updateBookingStatus(identifier, newStatus).catch(() => {});

    // If updating user's token or active booking
    const matchesUser =
      (item && item.token === activeBooking.token) ||
      id === activeBooking.token ||
      id === activeBooking.bookingId;

    if (matchesUser) {
      setActiveBooking(prev => {
        const updated = {
          ...prev,
          status: newStatus === 'Processing' ? 'Weighing' : newStatus === 'Completed' ? 'Completed' : newStatus,
          paymentStatus: newStatus === 'Completed' ? 'Successful' : prev.paymentStatus,
        };
        try {
          localStorage.setItem('kf_activeBooking', JSON.stringify(updated));
        } catch {}
        return updated;
      });
    }
  };

  // Farmer Action: Submit Feedback
  const submitFeedback = (feedback) => {
    setFarmerProfile(prev => ({
      ...prev,
      points: prev.points + 25,
    }));
    setRewardsHistory(prev => [
      {
        id: `act-${Date.now()}`,
        action: `Submitted Mandi Experience Feedback (${feedback.rating} ★)`,
        points: '+25',
        date: 'Today',
      },
      ...prev,
    ]);

    kisanFlowService.createFeedback(feedback).catch(() => {});
    playAlertSound();
  };

  // Farmer Action: Redeem Reward
  const claimReward = (rewardId) => {
    const reward = rewardsCatalog.find(r => r.id === rewardId);
    if (!reward || reward.claimed) return { success: false, msg: 'Already claimed' };
    if (farmerProfile.points < reward.costPoints) {
      return { success: false, msg: 'Insufficient points' };
    }

    setFarmerProfile(prev => ({
      ...prev,
      points: prev.points - reward.costPoints,
    }));

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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
