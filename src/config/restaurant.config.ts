export interface RestaurantConfig {
  readonly brand: {
    readonly name: string;
    readonly tagline: string;
    readonly description: string;
    readonly logoUrl: string;
    readonly faviconUrl: string;
    readonly ogImageUrl: string;
    readonly primaryColor: string;
  };
  readonly contact: {
    readonly whatsappNumber: string;
    readonly phone: string;
    readonly email: string;
    readonly address: {
      readonly street: string;
      readonly city: string;
      readonly state: string;
      readonly country: string;
      readonly postalCode: string;
    };
    readonly social: {
      readonly instagram?: string;
      readonly facebook?: string;
      readonly twitter?: string;
    };
  };
  readonly business: {
    readonly currencySymbol: string;
    readonly currencyCode: string;
    readonly locale: string;
    readonly deliveryFee: number;
    readonly minOrderAmount: number;
    readonly allowPickup: boolean;
    readonly allowDelivery: boolean;
    readonly openingHours: {
      readonly open: string;
      readonly close: string;
      readonly days: readonly string[];
    };
  };
  readonly orderMessage: {
    readonly intro: string;
    readonly includeNotes: boolean;
  };
  readonly about?: {
    readonly title: string;
    readonly stories: readonly {
      readonly id: string;
      readonly title: string;
      readonly text: string;
      readonly image?: string;
      readonly alt?: string;
    }[];
  };
}

export const restaurantConfig: RestaurantConfig = {
  brand: {
    name: "FoodFlow Gourmet",
    tagline: "Artisan Burgers & Craft Kitchen",
    description: "Order fresh artisan burgers and craft sides delivered hot to your doorstep.",
    logoUrl: "/images/brand/logo.svg",
    faviconUrl: "/favicon.png",
    ogImageUrl: "/og-image.jpg",
    primaryColor: "#dc2626",
  },
  contact: {
    whatsappNumber: "+15551234567",
    phone: "+1 (555) 123-4567",
    email: "orders@foodflow.dev",
    address: {
      street: "742 Evergreen Terrace",
      city: "Springfield",
      state: "OR",
      country: "United States",
      postalCode: "97477",
    },
    social: {
      instagram: "https://instagram.com/foodflow",
    },
  },
  business: {
    currencySymbol: "$",
    currencyCode: "USD",
    locale: "en-US",
    deliveryFee: 4.99,
    minOrderAmount: 15.00,
    allowPickup: true,
    allowDelivery: true,
    openingHours: {
      open: "11:00",
      close: "23:00",
      days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
  },
  orderMessage: {
    intro: "Hello! I would like to place an order from FoodFlow:",
    includeNotes: true,
  },
  about: {
    title: "About Us",
    stories: [
      {
        id: "story-1",
        title: "Culinary Craft & Passion",
        text: "We started FoodFlow with a simple philosophy: hand-crafted meals prepared with seasonal, locally sourced ingredients and relentless dedication to taste.",
        image: "/images/about/craft-kitchen.webp",
        alt: "Artisan kitchen preparation",
      },
      {
        id: "story-2",
        title: "Fast, Direct & Honest",
        text: "No high marketplace markups or endless middleman delays. Our direct ordering ensures your meal arrives fresh, hot, and exactly the way our chefs intended.",
        image: "/images/about/fresh-ingredients.webp",
        alt: "Fresh gourmet food and sides",
      },
    ],
  },
};
