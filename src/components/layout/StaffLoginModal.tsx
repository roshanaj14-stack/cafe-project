import React, { useState, useEffect } from 'react';
import { useCafe } from '../../context/CafeContext';
import { Lock, ShieldCheck, Coffee, X, AlertCircle, KeyRound, Sparkles, Check } from 'lucide-react';

export const StaffLoginModal: React.FC = () => {
  const {
    isStaffLoginModalOpen,
    closeStaffLoginModal,
    loginStaff,
    pendingLoginRole,
  } = useCafe();

  const [selectedRole, setSelectedRole] = useState<'barista' | 'manager'>('barista');
  const [passcode, setPasscode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isStaffLoginModalOpen) {
      setSelectedRole(pendingLoginRole || 'barista');
      setPasscode('');
      setErrorMessage('');
    }
  }, [isStaffLoginModalOpen, pendingLoginRole]);

  if (!isStaffLoginModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!passcode.trim()) {
      setErrorMessage('Please enter your staff PIN or password.');
      return;
    }

    const result = loginStaff(passcode, selectedRole);
    if (!result.success) {
      setErrorMessage(result.message || 'Authentication failed. Please verify credentials.');
    }
  };

  const handleQuickFill = (role: 'barista' | 'manager', pin: string) => {
    setSelectedRole(role);
    setPasscode(pin);
    setErrorMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs">
      <div className="bg-[#FAF8F5] border border-[#DDD5C7] rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in duration-200">
        {/* Top Header */}
        <div className="bg-[#2B231B] text-white p-6 relative">
          <button
            onClick={closeStaffLoginModal}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-[#E8E2D9] transition-colors cursor-pointer"
            title="Cancel"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#E2B778]">
            <Lock className="w-3.5 h-3.5" />
            <span>Restricted Staff Portal</span>
          </div>

          <h2 className="text-2xl font-serif font-bold text-white mt-1">
            Staff Authentication
          </h2>
          <p className="text-xs text-[#C7B7A5] mt-1">
            Access restricted to verified Les Amis baristas and floor managers.
          </p>
        </div>

        {/* Modal Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Role Segmented Buttons */}
          <div>
            <label className="block text-xs font-semibold text-[#2B231B] uppercase tracking-wider mb-2">
              Select Station / Role
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('barista');
                  setPasscode('');
                  setErrorMessage('');
                }}
                className={`p-3 rounded-xl border text-left transition-colors cursor-pointer flex items-start gap-2.5 ${
                  selectedRole === 'barista'
                    ? 'border-[#8C6D46] bg-[#F4EDE2] text-[#2B231B] shadow-2xs'
                    : 'border-[#E2D8CC] bg-white text-[#5C5248] hover:border-[#8C6D46]'
                }`}
              >
                <div className="p-1 rounded-md bg-[#FAF8F5] border border-[#E2D8CC] text-[#8C6D46] mt-0.5">
                  <Coffee className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-semibold text-xs block">Barista Station</span>
                  <span className="text-[10px] text-[#8C7A6B]">KDS & Order Prep</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedRole('manager');
                  setPasscode('');
                  setErrorMessage('');
                }}
                className={`p-3 rounded-xl border text-left transition-colors cursor-pointer flex items-start gap-2.5 ${
                  selectedRole === 'manager'
                    ? 'border-[#8C6D46] bg-[#F4EDE2] text-[#2B231B] shadow-2xs'
                    : 'border-[#E2D8CC] bg-white text-[#5C5248] hover:border-[#8C6D46]'
                }`}
              >
                <div className="p-1 rounded-md bg-[#FAF8F5] border border-[#E2D8CC] text-[#8C6D46] mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-semibold text-xs block">Manager & Admin</span>
                  <span className="text-[10px] text-[#8C7A6B]">Inventory & Reports</span>
                </div>
              </button>
            </div>
          </div>

          {/* Passcode / PIN Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-[#2B231B] uppercase tracking-wider">
                {selectedRole === 'barista' ? 'Barista Station PIN' : 'Manager Master PIN'}
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] text-[#8C6D46] hover:underline cursor-pointer"
              >
                {showPassword ? 'Hide PIN' : 'Show PIN'}
              </button>
            </div>

            <div className="relative">
              <KeyRound className="w-4 h-4 text-[#8C7A6B] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoFocus
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  setErrorMessage('');
                }}
                placeholder={selectedRole === 'barista' ? 'Enter 4-digit PIN (1234)' : 'Enter Manager PIN (7799)'}
                className="w-full text-sm pl-9 pr-4 py-2.5 rounded-xl border border-[#DDD5C7] bg-white text-[#2B231B] font-mono tracking-wider focus:outline-none focus:border-[#8C6D46]"
              />
            </div>

            {errorMessage && (
              <div className="mt-2 flex items-center gap-1.5 text-xs text-red-600">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>

          {/* Quick Demo Credentials Assistant */}
          <div className="p-3.5 rounded-xl bg-[#F0EAE1] border border-[#E2D8CC] text-xs space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#8C6D46]">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>Demo Access Codes</span>
              </span>
              <span className="text-[#8C7A6B]">Click to quick-fill</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickFill('barista', '1234')}
                className={`p-2 rounded-lg border text-left transition-colors cursor-pointer ${
                  selectedRole === 'barista' && passcode === '1234'
                    ? 'border-[#8C6D46] bg-white text-[#2B231B] font-bold'
                    : 'border-[#DDD5C7] bg-[#FAF8F5] text-[#5C5248] hover:bg-white'
                }`}
              >
                <span className="block text-[11px] text-[#8C7A6B]">Barista PIN:</span>
                <span className="font-mono font-bold text-[#8C6D46]">1234</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('manager', '7799')}
                className={`p-2 rounded-lg border text-left transition-colors cursor-pointer ${
                  selectedRole === 'manager' && passcode === '7799'
                    ? 'border-[#8C6D46] bg-white text-[#2B231B] font-bold'
                    : 'border-[#DDD5C7] bg-[#FAF8F5] text-[#5C5248] hover:bg-white'
                }`}
              >
                <span className="block text-[11px] text-[#8C7A6B]">Admin PIN:</span>
                <span className="font-mono font-bold text-[#8C6D46]">7799</span>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 space-y-2">
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm text-white bg-[#2B231B] hover:bg-[#43372B] transition-colors cursor-pointer shadow-md flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4 text-[#E2B778]" />
              <span>Authenticate & Enter Portal</span>
            </button>

            <button
              type="button"
              onClick={closeStaffLoginModal}
              className="w-full py-2 text-xs text-[#8C7A6B] hover:text-[#2B231B] transition-colors cursor-pointer text-center"
            >
              Return to Customer Storefront
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
