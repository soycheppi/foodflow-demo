import React, { memo } from 'react';
import { toCDNUrl } from '@/adapters/image';
import placeholderImg from '@/assets/placeholder.webp';

import { restaurantConfig } from '@/config/restaurant.config';

interface AppImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  aspect?: 'square' | '3/2' | 'video' | 'auto' | '21/9' | '3/1';
  containerClassName?: string;
  placeholderText?: string;
  children?: React.ReactNode;
}

const PLACEHOLDER_URL = placeholderImg;

const AppImage: React.FC<AppImageProps> = memo(({
  src,
  aspect = '3/2',
  containerClassName = '',
  className = '',
  placeholderText = restaurantConfig.brand.name,
  alt,
  children,
  ...props
}) => {
  const [error, setError] = React.useState(false);

  const finalSrc = !src || error ? PLACEHOLDER_URL : toCDNUrl(src);

  const aspectClasses = {
    square: 'aspect-square',
    '3/2': 'aspect-[3/2]',
    video: 'aspect-video',
    auto: 'aspect-auto',
    '21/9': 'aspect-[21/9]',
    '3/1': 'aspect-[3/1]',
  };

  return (
    <div
      className={`relative overflow-hidden bg-gray-50 dark:bg-[#2d3038] ${aspectClasses[aspect]} ${containerClassName}`}
    >
      <img
        src={finalSrc}
        alt={alt || `Imagen de ${restaurantConfig.brand.name}`}
        className={`w-full h-full object-cover transition-opacity duration-500 ${error || !src ? 'opacity-0' : 'opacity-100'} ${className}`}
        onError={() => setError(true)}
        width={props.width || 480}
        height={props.height || 320}
        loading="lazy"
        decoding="async"
        {...props}
      />
      {children}
      {(!src || error) && placeholderText && (
        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
          <span className="font-black text-xs uppercase tracking-[0.2em]">{placeholderText}</span>
        </div>
      )}
    </div>
  );
});

AppImage.displayName = 'AppImage';

export default AppImage;
