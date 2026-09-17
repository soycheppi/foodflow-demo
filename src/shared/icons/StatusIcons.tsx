import React from 'react';
import { Icon, IconProps } from './Icon';

export const IconCheck: React.FC<IconProps> = (props) => (
  <Icon {...props} fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20 6 9 17 4 12" />
  </Icon>
);

export const IconCircleCheck: React.FC<IconProps> = (props) => (
  <Icon {...props} fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <polyline points="16 12 12 8 8 12" />
    <line x1="12" y1="16" x2="12" y2="8" />
  </Icon>
);

export const IconStatusSuccess: React.FC<IconProps> = (props) => (
  <Icon {...props} fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </Icon>
);

export const IconAlertCircle: React.FC<IconProps> = (props) => (
  <Icon {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 5a2 2 0 0 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6" />
    <path d="M9 17v1a3 3 0 0 0 6 0v-1" />
  </Icon>
);
