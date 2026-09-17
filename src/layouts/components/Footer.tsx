import React from 'react';
import { NavLink } from 'react-router-dom';
import { IconInstagram, IconFacebook, IconWhatsapp } from '@/shared/icons/SocialIcons';
import { restaurantConfig } from '@/config/restaurant.config';

const Footer: React.FC = () => {
  const { brand, contact } = restaurantConfig;

  return (
    <footer className="py-10 z-10 relative transition-colors duration-300 bg-transparent text-gray-600 dark:text-gray-400">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Main Navigation Links */}
          <div className="flex items-center gap-8">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-sm tracking-wider transition-colors no-underline ${
                  isActive
                    ? 'text-gray-900 dark:text-white font-bold'
                    : 'hover:text-gray-900 dark:hover:text-white'
                }`
              }
            >
              HOME
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `text-sm tracking-wider transition-colors no-underline ${
                  isActive
                    ? 'text-gray-900 dark:text-white font-bold'
                    : 'hover:text-gray-900 dark:hover:text-white'
                }`
              }
            >
              ABOUT US
            </NavLink>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-6">
            {contact.social.instagram && (
              <a
                className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-transform hover:scale-110 duration-200"
                href={contact.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <IconInstagram size={20} />
              </a>
            )}
            {contact.social.facebook && (
              <a
                className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-transform hover:scale-110 duration-200"
                href={contact.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <IconFacebook size={20} />
              </a>
            )}
            <a
              className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-transform hover:scale-110 duration-200"
              href={`https://wa.me/${contact.whatsappNumber.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
            >
              <IconWhatsapp size={20} />
            </a>
          </div>
        </div>

        <div className="h-16" />

        <div className="flex flex-col md:flex-row justify-between items-center text-xs gap-4 text-gray-600 dark:text-gray-300">
          <div className="text-center md:text-left uppercase tracking-widest">
            &copy; {new Date().getFullYear()} {brand.name}. All rights reserved.
          </div>

          <div className="text-center md:text-right">
            {contact.address.street}, {contact.address.city} • {contact.phone}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
