import React from 'react';
import { Icon, IconProps } from './Icon';

export const IconShoppingBag: React.FC<IconProps> = (props) => (
  <Icon {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6.331 8h11.339a2 2 0 0 1 1.977 2.304l-1.255 8.152a3 3 0 0 1 -2.966 2.544h-6.852a3 3 0 0 1 -2.965 -2.544l-1.255 -8.152a2 2 0 0 1 1.977 -2.304" />
    <path d="M9 11v-5a3 3 0 0 1 6 0v5" />
  </Icon>
);

export const IconBox: React.FC<IconProps> = (props) => (
  <Icon {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 3v12h-5c-.023 -3.681 .184 -7.406 5 -12m0 12v6h-1v-3m-10 -14v17m-3 -17v3a3 3 0 1 0 6 0v-3" />
  </Icon>
);
