import React from 'react';
import { restaurantConfig } from '@/config/restaurant.config';

const AboutStory: React.FC = () => {
  const about = restaurantConfig.about;
  if (!about || !about.stories.length) return null;

  return (
    <div className="py-12 px-4 max-w-4xl mx-auto">
      <h2 className="text-3xl font-extrabold text-center text-gray-900 dark:text-white mb-8">
        {about.title}
      </h2>

      <div className="space-y-8">
        {about.stories.map((item) => (
          <div
            key={item.id}
            className="p-6 rounded-2xl bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800"
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutStory;
