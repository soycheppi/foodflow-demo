import React from 'react';
import { Icon, IconProps } from './Icon';

export const IconSave: React.FC<IconProps> = (props) => (
  <Icon {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 4h10l4 4v10a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2" />
    <path d="M12 14m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <path d="M14 4l0 4l-6 0l0 -4" />
  </Icon>
);

export const IconTrash: React.FC<IconProps> = (props) => (
  <Icon {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 7l16 0" />
    <path d="M10 11l0 6" />
    <path d="M14 11l0 6" />
    <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
    <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
  </Icon>
);

export const IconPlus: React.FC<IconProps> = (props) => (
  <Icon {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5l0 14" />
    <path d="M5 12l14 0" />
  </Icon>
);

export const IconPen: React.FC<IconProps> = (props) => (
  <Icon {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" />
    <path d="M13.5 6.5l4 4" />
  </Icon>
);

export const IconSearch: React.FC<IconProps> = (props) => (
  <Icon {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
    <path d="M21 21l-6 -6" />
  </Icon>
);

export const IconXMark: React.FC<IconProps> = (props) => (
  <Icon {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6l-12 12" />
    <path d="M6 6l12 12" />
  </Icon>
);

export const IconArrowLeft: React.FC<IconProps> = (props) => (
  <Icon {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12l14 0" />
    <path d="M5 12l6 6" />
    <path d="M5 12l6 -6" />
  </Icon>
);

export const IconArrowRight: React.FC<IconProps> = (props) => (
  <Icon {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12l14 0" />
    <path d="M13 18l6 -6" />
    <path d="M13 6l6 6" />
  </Icon>
);

export const IconDragHandle: React.FC<IconProps> = (props) => (
  <Icon {...props} viewBox="0 0 512 512" fill="none" stroke="currentColor" strokeWidth="44" strokeLinecap="round" strokeLinejoin="round">
    <path d="M118 304h276m-276-96h276" />
  </Icon>
);

export const IconDownload: React.FC<IconProps> = (props) => (
  <Icon {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
    <path d="M7 11l5 5l5 -5" />
    <path d="M12 4l0 12" />
  </Icon>
);
