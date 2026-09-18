import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  serverTimestamp,
  QueryDocumentSnapshot,
  DocumentSnapshot,
} from 'firebase/firestore/lite';
import { getFirestoreInstance, mapDoc } from '@/adapters/firebase/providers/firestore';
import { Banner } from '@/core/types/banner';
import { isFirebaseConfigured } from '@/config/env';
import { mockCatalogService } from '@/adapters/mock/mockCatalogService';

const BANNERS_COLLECTION = 'banners';

const mapBannerDoc = (snap: QueryDocumentSnapshot | DocumentSnapshot): Banner => {
  const item = mapDoc<Banner>(snap);
  return {
    ...item,
    active: item.active ?? true,
    order: item.order ?? 0,
    onlyImage: item.onlyImage ?? false,
    imageFit: item.imageFit || 'cover',
  };
};

export const getBanners = async (): Promise<Banner[]> => {
  if (!isFirebaseConfigured()) {
    return mockCatalogService.getBanners();
  }
  const db = await getFirestoreInstance();
  const bannersRef = collection(db, BANNERS_COLLECTION);
  const q = query(bannersRef, orderBy('order', 'asc'));
  const snap = await getDocs(q);
  return snap.docs.map(mapBannerDoc);
};

export const getBannerById = async (id: string): Promise<Banner | null> => {
  if (!isFirebaseConfigured()) {
    const banners = await mockCatalogService.getAllBanners();
    return banners.find((b) => b.id === id) || null;
  }
  const db = await getFirestoreInstance();
  const snap = await getDoc(doc(db, BANNERS_COLLECTION, id));
  return snap.exists() ? mapBannerDoc(snap) : null;
};

export const addBanner = async (
  banner: Omit<Banner, 'id' | 'createdAt'> | Omit<Banner, 'id' | 'order' | 'createdAt'>
): Promise<void> => {
  if (!isFirebaseConfigured()) {
    return mockCatalogService.addBanner(banner);
  }
  const db = await getFirestoreInstance();
  const bannersRef = collection(db, BANNERS_COLLECTION);
  const snap = await getDocs(bannersRef);
  const nextOrder = 'order' in banner && typeof banner.order === 'number' ? banner.order : snap.size;
  await addDoc(bannersRef, {
    ...banner,
    order: nextOrder,
    createdAt: serverTimestamp(),
  });
};

export const updateBanner = async (id: string, updates: Partial<Banner>): Promise<void> => {
  if (!isFirebaseConfigured()) {
    return mockCatalogService.updateBanner(id, updates);
  }
  const db = await getFirestoreInstance();
  await updateDoc(doc(db, BANNERS_COLLECTION, id), {
    ...updates,
    updatedAt: serverTimestamp(),
  });
};

export const deleteBanner = async (id: string): Promise<void> => {
  if (!isFirebaseConfigured()) {
    return mockCatalogService.deleteBanner(id);
  }
  const db = await getFirestoreInstance();
  await deleteDoc(doc(db, BANNERS_COLLECTION, id));
};

export const upsertDefaultBanner = async (
  banner: Omit<Banner, 'id' | 'createdAt' | 'order'>
): Promise<void> => {
  if (!isFirebaseConfigured()) return;
  const db = await getFirestoreInstance();
  const ref = doc(db, BANNERS_COLLECTION, 'default');
  const snap = await getDoc(ref);
  if (snap.exists()) {
    await updateDoc(ref, { ...banner, updatedAt: serverTimestamp() });
  } else {
    await setDoc(ref, {
      ...banner,
      order: -1,
      createdAt: serverTimestamp(),
    });
  }
};
