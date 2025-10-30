import React from 'react';

interface IconProps {
  className?: string;
}

// Lock Icon - for encryption/security
export const LockIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="lockGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3b82f6" />
        <stop offset="50%" stopColor="#6366f1" />
        <stop offset="100%" stopColor="#8b5cf6" />
      </linearGradient>
    </defs>
    <rect x="5" y="11" width="14" height="10" rx="2" stroke="url(#lockGradient)" strokeWidth="2.5" fill="url(#lockGradient)" fillOpacity="0.1"/>
    <path d="M8 11V7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7V11" stroke="url(#lockGradient)" strokeWidth="2.5" strokeLinecap="round"/>
    <circle cx="12" cy="16" r="1.5" fill="url(#lockGradient)"/>
  </svg>
);

// Chart/Analytics Icon - for results
export const ChartIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="chartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6366f1" />
        <stop offset="50%" stopColor="#8b5cf6" />
        <stop offset="100%" stopColor="#c084fc" />
      </linearGradient>
    </defs>
    <path d="M3 3V21H21" stroke="url(#chartGradient)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 14L11 10L15 14L21 8" stroke="url(#chartGradient)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="7" cy="14" r="2.5" fill="url(#chartGradient)"/>
    <circle cx="11" cy="10" r="2.5" fill="url(#chartGradient)"/>
    <circle cx="15" cy="14" r="2.5" fill="url(#chartGradient)"/>
    <circle cx="21" cy="8" r="2.5" fill="url(#chartGradient)"/>
  </svg>
);

// Shield Check Icon - for verified/security
export const ShieldCheckIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#34d399" />
        <stop offset="50%" stopColor="#10b981" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
    </defs>
    <path d="M12 3L4 7V11C4 16 7 20 12 21C17 20 20 16 20 11V7L12 3Z" stroke="url(#shieldGradient)" strokeWidth="2.5" strokeLinejoin="round" fill="url(#shieldGradient)" fillOpacity="0.1"/>
    <path d="M9 12L11 14L15 10" stroke="url(#shieldGradient)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Wallet Icon - for connect wallet
export const WalletIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="walletGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0892aa" />
        <stop offset="50%" stopColor="#1b52ac" />
        <stop offset="100%" stopColor="#3c72cb" />
      </linearGradient>
    </defs>
    <rect x="3" y="6" width="18" height="14" rx="2" stroke="url(#walletGradient)" strokeWidth="2.5" fill="url(#walletGradient)" fillOpacity="0.2"/>
    <path d="M3 10H21" stroke="url(#walletGradient)" strokeWidth="2.5"/>
    <rect x="16" y="13" width="3" height="3" rx="1.5" fill="url(#walletGradient)"/>
  </svg>
);

// Clock Icon - for time/deadline
export const ClockIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="clockGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6366f1" />
        <stop offset="100%" stopColor="#7c3aed" />
      </linearGradient>
    </defs>
    <circle cx="12" cy="12" r="9" stroke="url(#clockGradient)" strokeWidth="2" fill="none"/>
    <path d="M12 7V12L15 15" stroke="url(#clockGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Network Icon - for blockchain/network status
export const NetworkIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="networkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#34d399" />
        <stop offset="50%" stopColor="#10b981" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
    </defs>
    <circle cx="12" cy="12" r="3" stroke="url(#networkGradient)" strokeWidth="2.5" fill="url(#networkGradient)" fillOpacity="0.2"/>
    <circle cx="6" cy="6" r="2.5" fill="url(#networkGradient)"/>
    <circle cx="18" cy="6" r="2.5" fill="url(#networkGradient)"/>
    <circle cx="6" cy="18" r="2.5" fill="url(#networkGradient)"/>
    <circle cx="18" cy="18" r="2.5" fill="url(#networkGradient)"/>
    <path d="M8 7L10 10M16 7L14 10M10 14L8 17M14 14L16 17" stroke="url(#networkGradient)" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

// Checkmark Icon - for success states
export const CheckIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="checkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#34d399" />
        <stop offset="50%" stopColor="#10b981" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
    </defs>
    <circle cx="12" cy="12" r="10" fill="url(#checkGradient)" opacity="0.25"/>
    <path d="M7 12L10 15L17 8" stroke="url(#checkGradient)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Disconnect Icon - for wallet disconnect
export const DisconnectIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="disconnectGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#d77f36" />
        <stop offset="50%" stopColor="#cc5f13" />
        <stop offset="100%" stopColor="#d44b04" />
      </linearGradient>
    </defs>
    <path d="M9 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H9" stroke="url(#disconnectGradient)" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
    <path d="M16 17L21 12L16 7" stroke="url(#disconnectGradient)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="url(#disconnectGradient)" fillOpacity="0.3"/>
    <path d="M21 12H9" stroke="url(#disconnectGradient)" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

// Lightning/Fast Icon - for real-time updates
export const LightningIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="lightningGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fbbf24" />
        <stop offset="50%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#d97706" />
      </linearGradient>
    </defs>
    <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="url(#lightningGradient)" strokeWidth="2.5" strokeLinejoin="round" fill="url(#lightningGradient)" fillOpacity="0.3"/>
  </svg>
);

// Info Icon - for information/help
export const InfoIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="infoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#6366f1" />
      </linearGradient>
    </defs>
    <circle cx="12" cy="12" r="10" stroke="url(#infoGradient)" strokeWidth="2" fill="none"/>
    <path d="M12 16V12" stroke="url(#infoGradient)" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="12" cy="8" r="1" fill="url(#infoGradient)"/>
  </svg>
);

