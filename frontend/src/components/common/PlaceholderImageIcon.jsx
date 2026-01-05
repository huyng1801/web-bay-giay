import React from 'react';

const PlaceholderImageIcon = ({ size = 48, color = '#ccc' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" rx="8" fill={color} />
    <circle cx="16" cy="18" r="4" fill="#fff" />
    <rect x="12" y="28" width="24" height="8" rx="2" fill="#fff" />
    <path d="M12 36L22 26L28 32L36 24" stroke="#bbb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default PlaceholderImageIcon;
