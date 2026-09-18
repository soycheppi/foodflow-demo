import React from 'react';
import { restaurantConfig } from '@/config/restaurant.config';
import { t } from '@/config/locales';

const LocationMap: React.FC = () => {
  const { contact } = restaurantConfig;

  return (
    <div className="w-full py-8 text-center">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        {t.about.visitTitle}
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        {contact.address.street}, {contact.address.city}, {contact.address.state} {contact.address.postalCode}
      </p>
      <p className="text-sm text-gray-500 mt-2">
        {t.about.callUs}: {contact.phone} • {t.about.whatsapp}: {contact.whatsappNumber}
      </p>
    </div>
  );
};

export default LocationMap;
