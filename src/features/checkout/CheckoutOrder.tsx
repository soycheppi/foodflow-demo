import { useState, useEffect, useReducer } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppSettings } from '@/features/settings/settingsHooks';
import { useUserProfile } from '@/entities/user/userHooks';
import { useAuth } from '@/features/auth/useAuth';

import { IconStatusSuccess } from '@/shared/icons/StatusIcons';
import { IconWhatsapp } from '@/shared/icons/SocialIcons';

import { useCart } from '@/features/cart/useCartStore';
import { t } from '@/config/locales';
import { restaurantConfig } from '@/config/restaurant.config';
import { calculateOrderSummary } from '@/core/logic/pricing';
import { buildWhatsAppOrderMessage, createWhatsAppUrl } from '@/core/logic/whatsapp';
import { validateMinOrderAmount, evaluateStoreOpenStatus } from '@/core/logic/businessRules';
import { checkoutStateReducer } from '@/core/logic/checkoutStateMachine';
import { CheckoutFormSchema, type CheckoutFormData } from './checkoutSchema';
import CheckoutLoyaltyBanner from './CheckoutLoyaltyBanner';
import CheckoutDeliveryFields from './CheckoutDeliveryFields';
import CheckoutSummaryCard from './CheckoutSummaryCard';

const CheckoutOrder: React.FC = () => {
  const { articulos, vaciarCarrito } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const { data: settings } = useAppSettings();
  const welcomeDiscount = Number(settings?.montoDescuentoBienvenida || 0);
  const { data: userProfile } = useUserProfile(currentUser?.uid || '');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(CheckoutFormSchema),
    mode: 'onChange',
    defaultValues: {
      customerName: '',
      deliveryType: 'delivery',
      paymentMethod: 'cash',
      deliveryAddress: '',
      postalCode: '',
    },
  });

  const deliveryType = watch('deliveryType');
  const paymentMethod = watch('paymentMethod');

  const [checkoutState, dispatchCheckout] = useReducer(checkoutStateReducer, 'IDLE');
  const [whatsappUrl, setWhatsappUrl] = useState('');

  const isSaving = checkoutState === 'DISPATCHING';
  const isConfirmed = checkoutState === 'ORDER_COMPLETED';

  useEffect(() => {
    if (userProfile) {
      if (userProfile.displayName) setValue('customerName', userProfile.displayName, { shouldValidate: true });
      if (userProfile.address) setValue('deliveryAddress', userProfile.address, { shouldValidate: true });
      if (userProfile.postalCode) setValue('postalCode', userProfile.postalCode, { shouldValidate: true });
    } else if (currentUser?.displayName) {
      setValue('customerName', currentUser.displayName, { shouldValidate: true });
    }
  }, [userProfile, currentUser, setValue]);

  const { subtotal, discountAmount, deliveryFee, finalTotal } = calculateOrderSummary({
    items: articulos,
    deliveryType,
    settings,
    rewardCycle: userProfile?.rewardCycle,
    isRegisteredCustomer: Boolean(currentUser),
  });

  const appliesDiscount = discountAmount > 0;
  const minOrderResult = validateMinOrderAmount(subtotal, restaurantConfig.business.minOrderAmount);
  const storeStatus = evaluateStoreOpenStatus(restaurantConfig.business);

  const canConfirm = articulos.length > 0 && isValid && minOrderResult.isValid;

  const onSubmit = async (data: CheckoutFormData) => {
    if (articulos.length === 0 || !minOrderResult.isValid || isSaving) return;
    dispatchCheckout({ type: 'DISPATCH_REQUESTED' });

    try {
      const orderItems = articulos.map((item) => ({
        id: item.id,
        name: item.nombre,
        price: item.precio,
        quantity: item.cantidad,
      }));

      const whatsappMessage = buildWhatsAppOrderMessage({
        customerInfo: {
          customerName: data.customerName,
          deliveryAddress: data.deliveryAddress,
          postalCode: data.postalCode,
          paymentMethod: data.paymentMethod,
          deliveryType: data.deliveryType,
        },
        items: orderItems,
        finalTotal,
        originUrl: window.location.origin,
        currentUid: currentUser?.uid,
      });

      const url = createWhatsAppUrl(restaurantConfig.contact.whatsappNumber, whatsappMessage);

      setWhatsappUrl(url);
      dispatchCheckout({ type: 'DISPATCH_CONFIRMED' });
      vaciarCarrito();
      window.scrollTo(0, 0);

      window.open(url, '_blank');
    } catch (error) {
      console.error('Error preparing order:', error);
      dispatchCheckout({ type: 'VALIDATION_FAILED' });
      alert(t.common.error);
    }
  };

  if (isConfirmed) {
    return (
      <div className="container mx-auto px-4 max-w-2xl py-12 animate-fade-in">
        <div className="bg-white dark:bg-[#111317] rounded-3xl shadow-2xl border border-gray-100 dark:border-white/5 overflow-hidden">
          <div className="bg-green-500 p-8 text-center text-white">
            <IconStatusSuccess size={80} className="mx-auto mb-4 animate-bounce-subtle" />
            <h2 className="text-3xl font-black uppercase tracking-tight">{t.cart.orderSuccessTitle}</h2>
            <p className="text-green-100 font-medium mt-1">
              {t.cart.orderSuccessSubtitle}
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-3 bg-white text-green-600 px-8 py-3 rounded-2xl font-black uppercase tracking-tight shadow-xl hover:scale-105 active:scale-95 transition-all text-sm"
            >
              <IconWhatsapp size={20} /> {t.cart.openWhatsAppButton}
            </a>
          </div>
          <div className="p-8 bg-white dark:bg-[#111317] text-center">
            <button
              onClick={() => navigate('/')}
              className="bg-brand-red text-white font-bold py-3 px-6 rounded-xl text-lg hover:bg-brand-red/90 transition-colors shadow-lg active:scale-95"
            >
              {t.nav.home}
            </button>
            <button
              onClick={() => navigate('/menu')}
              className="ml-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white font-bold py-3 px-6 rounded-xl text-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors active:scale-95"
            >
              {t.cart.backToMenu}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="container mx-auto px-4 max-w-6xl py-10 animate-fade-in-up">
      <div className="mb-12 text-center">
        <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-2 uppercase tracking-tight font-questrial italic">
          {t.cart.checkoutTitle}
        </h2>
        <div className="w-20 h-1.5 bg-brand-red mx-auto rounded-full"></div>
      </div>

      <div className="w-full mb-12">
        <CheckoutLoyaltyBanner
          isRegistered={Boolean(currentUser)}
          userProfile={userProfile}
          appliesDiscount={appliesDiscount}
          welcomeDiscount={welcomeDiscount}
          onJoinClick={() => navigate('/login', { state: { from: location, mode: 'register' } })}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
        <div className="lg:col-span-8 space-y-8">
          <CheckoutDeliveryFields
            register={register}
            errors={errors}
            deliveryType={deliveryType}
            paymentMethod={paymentMethod}
            onDeliveryTypeChange={(type) => setValue('deliveryType', type, { shouldValidate: true })}
            onPaymentMethodChange={(method) => setValue('paymentMethod', method, { shouldValidate: true })}
          />
        </div>

        <div className="lg:col-span-4">
          <CheckoutSummaryCard
            articulos={articulos}
            subtotal={subtotal}
            discountAmount={discountAmount}
            deliveryFee={deliveryFee}
            finalTotal={finalTotal}
            deliveryType={deliveryType}
            userRewardCycle={userProfile?.rewardCycle}
            minOrderResult={minOrderResult}
            storeStatus={storeStatus}
            canConfirm={canConfirm}
            isSaving={isSaving}
          />
        </div>
      </div>
    </form>
  );
};

export default CheckoutOrder;
