import React from 'react';
import { useCafe } from '../../context/CafeContext';
import { UserRole } from '../../types/cafe';
import { User, Coffee, ShieldCheck, Check, Lock, X } from 'lucide-react';

interface RoleSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RoleSwitcherModal: React.FC<RoleSwitcherModalProps> = ({ isOpen, onClose }) => {
  const { userRole, setUserRole, setCustomerTab } = useCafe();

  if (!isOpen) return null;

  const rolesConfig: Array<{
    role: UserRole;
    title: string;
    badge: string;
    description: string;
    icon: React.ReactNode;
    permissions: string[];
  }> = [
    {
      role: 'customer',
      title: 'Customer / Guest',
      badge: 'Public Access',
      description: 'Experience Les Amis as a dining guest: browse seasonal menu, customize drinks, choose contactless pickup, book terrace tables, and earn loyalty stamps.',
      icon: <User className="w-5 h-5 text-[#8C6D46]" />,
      permissions: [
        'Browse artisanal menu & customize beverages',
        'Online ordering & contactless pickup at counter',
        'Real-time order progress tracking',
        'Reserve tables & view confirmations',
        'Les Amis digital stamp card & rewards',
      ],
    },
    {
      role: 'barista',
      title: 'Barista & Counter Staff',
      badge: 'Staff Station',
      description: 'Kitchen Display System (KDS): receive real-time incoming orders, trigger live brew/bake progress, monitor contactless pickup arrivals, and alert guests.',
      icon: <Coffee className="w-5 h-5 text-[#8C6D46]" />,
      permissions: [
        'Real-time KDS live order queue with sound chimes',
        'Advance status: Brewing → Ready for Pickup → Completed',
        'Check contactless tap-at-pickup verifications',
        'Inspect recipe customizations & dietary alerts',
      ],
    },
    {
      role: 'manager',
      title: 'Floor Manager & Owner',
      badge: 'Full Oversight (RBAC)',
      description: 'Complete operational dashboard: manage live inventory & 86’d items, allocate seating reservations, review customer feedback with manager replies, and inspect daily sales analytics.',
      icon: <ShieldCheck className="w-5 h-5 text-[#8C6D46]" />,
      permissions: [
        'All Barista KDS permissions included',
        'Live inventory stock control & 86’ing items',
        'Table reservations allocation & seating statuses',
        'Customer feedback review & official replies',
        'Daily revenue metrics, rush-hour analytics & shift export',
      ],
    },
  ];

  const handleSelectRole = (role: UserRole) => {
    setUserRole(role);
    if (role === 'customer') {
      setCustomerTab('menu');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-[#FAF8F5] border border-[#DDD5C7] rounded-2xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 animate-in fade-in duration-200">
        <div className="flex items-start justify-between pb-4 border-b border-[#E8E2D9]">
          <div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#8C6D46]" />
              <span className="text-xs font-mono uppercase tracking-wider text-[#8C7A6B]">
                Security & Access Control
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#2B231B] mt-1">
              Role-Based Access Control (RBAC)
            </h2>
            <p className="text-xs sm:text-sm text-[#6B5E52] mt-1">
              Switch roles seamlessly to evaluate the guest ordering journey or the back-of-house staff operations.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#8C7A6B] hover:text-[#2B231B] p-1.5 rounded-lg hover:bg-[#EFE9DF] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-6 space-y-4">
          {rolesConfig.map((item) => {
            const isSelected = userRole === item.role;
            return (
              <div
                key={item.role}
                onClick={() => handleSelectRole(item.role)}
                className={`relative p-5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#8C6D46] bg-[#F4EDE2] shadow-xs'
                    : 'border-[#E5DDD0] bg-white hover:border-[#C4B5A2] hover:bg-[#FAF8F5]'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-[#FAF8F5] border border-[#E5DDD0]">
                      {item.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-[#2B231B] text-base">
                          {item.title}
                        </h3>
                        <span className="text-[11px] font-mono uppercase text-[#8C6D46] bg-[#ECE5DC] px-2 py-0.5 rounded">
                          {item.badge}
                        </span>
                      </div>
                      <p className="text-xs text-[#665A4F] mt-1">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 pt-1">
                    {isSelected ? (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#8C6D46] text-white">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-[#DDD5C7] text-transparent hover:border-[#8C6D46]">
                        ·
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-[#E8E2D9]/70 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-[#7A6D60]">
                  {item.permissions.map((perm, idx) => (
                    <span key={idx} className="flex items-center gap-1">
                      <span className="text-[#8C6D46]">✓</span>
                      <span>{perm}</span>
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-[#E8E2D9] flex items-center justify-between text-xs text-[#8C7A6B]">
          <span>Role changes take effect immediately across all views.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[#2B231B] bg-[#EBE4D8] hover:bg-[#E0D7C9] rounded-lg transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
