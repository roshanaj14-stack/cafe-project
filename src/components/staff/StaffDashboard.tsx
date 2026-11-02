import React, { useState, useEffect } from 'react';
import { useCafe } from '../../context/CafeContext';
import { LiveKDSQueue } from './LiveKDSQueue';
import { InventoryManagement } from './InventoryManagement';
import { ReservationManagement } from './ReservationManagement';
import { CustomerFeedbackManagement } from './CustomerFeedbackManagement';
import { AnalyticsAndReporting } from './AnalyticsAndReporting';
import {
  Coffee,
  Package,
  Calendar,
  MessageSquare,
  BarChart3,
  Volume2,
  VolumeX,
  ShieldCheck,
  User,
  Clock,
  LogOut,
  Lock,
} from 'lucide-react';

export const StaffDashboard: React.FC = () => {
  const {
    userRole,
    staffSession,
    logoutStaff,
    openStaffLoginModal,
    staffTab,
    setStaffTab,
    soundEnabled,
    setSoundEnabled,
    orders,
    inventory,
    reservations,
    feedbackList,
  } = useCafe();

  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const activeOrdersCount = orders.filter(
    (o) => o.status === 'pending' || o.status === 'brewing'
  ).length;

  const lowStockCount = inventory.filter(
    (i) => i.currentStock <= i.minThreshold
  ).length;

  const tabs: Array<{
    id: 'kds' | 'inventory' | 'reservations' | 'feedback' | 'analytics';
    label: string;
    icon: React.ReactNode;
    badge?: number;
    badgeColor?: string;
    managerOnly?: boolean;
  }> = [
    {
      id: 'kds',
      label: 'KDS Order Queue',
      icon: <Coffee className="w-4 h-4" />,
      badge: activeOrdersCount,
      badgeColor: 'bg-[#8C6D46] text-white',
    },
    {
      id: 'inventory',
      label: 'Inventory & 86 Items',
      icon: <Package className="w-4 h-4" />,
      badge: lowStockCount > 0 ? lowStockCount : undefined,
      badgeColor: 'bg-amber-600 text-white',
    },
    {
      id: 'reservations',
      label: 'Table Bookings',
      icon: <Calendar className="w-4 h-4" />,
      badge: reservations.filter((r) => r.status === 'confirmed').length,
      badgeColor: 'bg-blue-600 text-white',
    },
    {
      id: 'feedback',
      label: 'Guest Feedback',
      icon: <MessageSquare className="w-4 h-4" />,
      badge: feedbackList.filter((f) => !f.reply).length,
      badgeColor: 'bg-[#8C6D46] text-white',
    },
    {
      id: 'analytics',
      label: 'Analytics & Reports',
      icon: <BarChart3 className="w-4 h-4" />,
      managerOnly: true,
    },
  ];

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Staff Header */}
      <div className="p-6 rounded-3xl bg-[#2B231B] text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6 border border-[#43372B]">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-widest text-[#E2B778] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Back-Office Operations · Les Amis</span>
            </span>
            <span className="text-[#C4B5A2] text-xs">·</span>
            <span className="text-xs text-[#DDD5C7]">
              Active: <strong className="text-white font-medium">{staffSession?.staffName || (userRole === 'manager' ? 'Floor Manager' : 'Barista')}</strong>
              {staffSession?.badgeId && (
                <span className="ml-1.5 px-1.5 py-0.5 rounded bg-black/40 text-[10px] font-mono text-[#E2B778]">
                  Badge #{staffSession.badgeId}
                </span>
              )}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-[#8C6D46]/40 text-[#E2B778] border border-[#8C6D46]/50 uppercase text-[10px]">
              {userRole === 'manager' ? 'Manager & Owner Admin' : 'Barista Station'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
            Operations Dashboard
          </h1>
          <p className="text-xs text-[#C7B7A5] mt-1">
            Live order queue management, ingredient restock alerts, floor guest seating, and contactless pickup verifications.
          </p>
        </div>

        {/* Live Clock, Sound Toggle & Sign Out */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-white transition-colors cursor-pointer border border-white/15"
            title={soundEnabled ? 'Disable audio chimes' : 'Enable audio chimes'}
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-4 h-4 text-[#E2B778]" />
                <span className="text-[11px]">Audio Chime On</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-neutral-400" />
                <span className="text-[11px]">Audio Chime Muted</span>
              </>
            )}
          </button>

          {/* Clock */}
          <div className="px-3.5 py-2 rounded-xl bg-black/30 border border-white/10 font-mono text-xs flex items-center gap-2 text-[#E2B778]">
            <Clock className="w-3.5 h-3.5" />
            <span className="tabular-nums">{currentTime}</span>
          </div>

          {/* Sign Out and Lock terminal */}
          <button
            onClick={logoutStaff}
            className="px-3.5 py-2 rounded-xl bg-red-950/50 hover:bg-red-900/60 text-red-200 border border-red-800/40 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
            title="Lock terminal and return to customer storefront"
          >
            <LogOut className="w-3.5 h-3.5 text-red-400" />
            <span>Sign Out & Lock</span>
          </button>
        </div>
      </div>

      {/* Staff Navigation Tabs */}
      <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#E8E2D9]">
        {tabs.map((tab) => {
          const isSelected = staffTab === tab.id;
          const isRestricted = tab.managerOnly && userRole !== 'manager';

          return (
            <button
              key={tab.id}
              onClick={() => {
                if (isRestricted) {
                  openStaffLoginModal('manager');
                  return;
                }
                setStaffTab(tab.id);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                isSelected
                  ? 'bg-[#2B231B] text-white shadow-xs'
                  : 'bg-white border border-[#E2D8CC] text-[#5C5248] hover:border-[#8C6D46] hover:text-[#2B231B]'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>

              {tab.badge !== undefined && tab.badge > 0 && (
                <span
                  className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full tabular-nums ${tab.badgeColor}`}
                >
                  {tab.badge}
                </span>
              )}

              {isRestricted && (
                <span className="text-[10px] font-mono text-[#8C6D46] bg-[#F4EDE2] px-1.5 py-0.5 rounded flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" />
                  Manager PIN
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Tab View */}
      <div className="mt-8">
        {staffTab === 'kds' && <LiveKDSQueue />}
        {staffTab === 'inventory' && <InventoryManagement />}
        {staffTab === 'reservations' && <ReservationManagement />}
        {staffTab === 'feedback' && <CustomerFeedbackManagement />}
        {staffTab === 'analytics' && <AnalyticsAndReporting />}
      </div>
    </div>
  );
};
