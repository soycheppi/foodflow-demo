# 🍕 FoodFlow Demo — Open-Source Food Ordering & WhatsApp Checkout Starter Kit

[![React 19](https://img.shields.io/badge/React-19.3-61dafb?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript 5.9](https://img.shields.io/badge/TypeScript-5.9_Strict-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.3-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Vite 6](https://img.shields.io/badge/Vite-6.4-646cff?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Lighthouse 99](https://img.shields.io/badge/Lighthouse-99%2F100-00cc66?style=for-the-badge&logo=lighthouse&logoColor=white)](https://pagespeed.web.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

> **Free, open-source version of FoodFlow.**
> A lightweight, commission-free food ordering storefront with direct WhatsApp checkout. Built with React 19, TypeScript 5.9, and Tailwind CSS v4.

---

<div align="center">
  <img src="public/demo-flow.gif" alt="FoodFlow Interactive Mobile Ordering Flow" width="420" style="border-radius: 16px; box-shadow: 0 12px 40px rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.1);" />

  <br /><br />

  ### 🌐 [👉 View Live Interactive Demo (Cloudflare Pages)](https://foodflow-core.pages.dev)

---

### ⚡ Ready for Production? [👉 Upgrade to FoodFlow Pro ($49 Launch Offer)](https://cheppi.gumroad.com/l/foodflow-pro)
Unlock complete Admin Backoffice, Firebase Firestore/Storage cloud plugin, drag-and-drop Banner Sliders, and Gamified Rewards Club.
  *Test the instant checkout on your smartphone: select dishes, add to cart, and generate a formatted WhatsApp order.*

  <br />

  [![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://dash.cloudflare.com/?to=/:account/pages/new)
  [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)
  [![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start)
</div>

---

## ⚡ Features (Demo vs Pro)

| Feature | FoodFlow Demo (Free) | FoodFlow Pro ($149 USD) |
| :--- | :---: | :---: |
| **Artisan Catalog & Category Navigation** | ✅ Included | ✅ Included |
| **Instant Cart & Dynamic Subtotal** | ✅ Included | ✅ Included |
| **WhatsApp Direct Checkout** | ✅ Basic Format | ✅ Full Delivery & Table Engine |
| **Dark Mode / Light Mode** | ✅ Native | ✅ Native |
| **Zero-Config Local Mock Mode** | ✅ Instant | ✅ Instant |
| **Performance (LCP < 0.9s)** | ✅ 99/100 | ✅ 100/100 |
| **Admin Backoffice Panel** | ❌ — | 🔒 Included |
| **Product & Banner CMS Manager** | ❌ — | 🔒 Included |
| **Customer Rewards & Points Club** | ❌ — | 🔒 Included |
| **Firebase Cloud (Auth, Firestore, Storage)**| ❌ — | 🔒 Included (Zero-Trust) |
| **Delivery Zones & Business Hours Logic** | ❌ — | 🔒 Included |
| **Thermal Printer Order Ticket Format** | ❌ — | 🔒 Included |
| **Commercial Client Reselling Rights** | ❌ Non-commercial | 🔒 Unlimited Clients |

👉 **[🚀 Upgrade to FoodFlow Pro for Commercial Projects](https://foodflow.lemonsqueezy.com)** *(Instant access to full codebase)*

---

## 🚀 Quick Start (Free Demo)

Run the demo storefront locally in under 60 seconds:

```bash
# 1. Clone this repository
git clone https://github.com/soycheppi/foodflow-demo.git
cd foodflow-demo

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🎨 100% Config-Driven White-Label

Personalize the entire brand, colors, logo, currency, and WhatsApp receiving number in one single file:

```typescript
// src/config/restaurant.config.ts
export const restaurantConfig = {
  brand: {
    name: 'My Burger Bar',
    tagline: 'Craft Burgers & Artisan Fries',
  },
  business: {
    currencySymbol: '$',
    whatsappNumber: '+1234567890',
  },
};
```

---

## 📄 License

This open-source demo version is released under the **MIT License**. Free for personal evaluation, learning, and portfolio showcases.

For commercial usage, agency client delivery, backoffice panel, and cloud synchronization, see **[FoodFlow Pro](https://foodflow.lemonsqueezy.com)**.


---


### ⚡ Core Web Vitals & Perfect Lighthouse Score

<div align="center">
  <img src="public/lighthouse-score.png" alt="FoodFlow Lighthouse 100/100 Perfect Score" width="700" style="border-radius: 12px; margin-bottom: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);" />
</div>

| Metric | Score | Target |
| :--- | :---: | :---: |
| **Performance** | **100/100** | LCP < 0.8s, CLS 0 |
| **Accessibility** | **100/100** | WCAG 2.1 AA / 2.2 AAA+ |
| **Best Practices** | **100/100** | Modern Web APIs & Security |
| **SEO** | **100/100** | Schema.org JSON-LD Structured Data |

---

## ⚡ Upgrade to FoodFlow Pro

Looking for the complete turnkey business kit with Admin Backoffice and cloud persistence?

| Feature | FoodFlow Demo (Free) | FoodFlow Pro ($49 Early Bird) |
| :--- | :---: | :---: |
| **Storefront & WhatsApp Checkout** | ✅ Included | ✅ Included |
| **PWA & Offline Support** | ✅ Included | ✅ Included |
| **Zero-Backend Autonomous Mode** | ✅ Included | ✅ Included |
| **Admin Backoffice Panel** | ❌ None | ✅ **Full Real-Time Admin UI** |
| **Firebase Cloud Plugin (Firestore + Storage)** | ❌ None | ✅ **Zero-Trust Security Rules Included** |
| **Drag & Drop Banner Slider Engine** | Static Mock | ✅ **Reorderable & Canvas WebP Resizer** |
| **Rewards Club & Loyalty Engine** | ❌ None | ✅ **Automatic Loyalty Points System** |
| **Commercial Client Resale License** | MIT | ✅ **Unlimited Client Deliveries** |

👉 **[Get FoodFlow Pro on Gumroad (Instant ZIP Download)](https://cheppi.gumroad.com/l/foodflow-pro)**


*Created with ❤️ by [@soycheppi](https://github.com/soycheppi).*
