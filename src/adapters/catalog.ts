import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  writeBatch,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  serverTimestamp,
  DocumentSnapshot,
  QueryDocumentSnapshot,
} from 'firebase/firestore/lite';
import { getFirestoreInstance } from '@/adapters/firebase/providers/firestore';
import { Category, Product } from '@/core/types/catalog';
import { isFirebaseConfigured } from '@/config/env';
import { mockCatalogService } from '@/adapters/mock/mockCatalogService';

const CATS_COLLECTION = 'categories';
const PRODS_COLLECTION = 'products';
const SETTINGS_COLLECTION = 'settings';
const SNAPSHOT_DOC_ID = 'catalog_bundle';
const VERSION_DOC_ID = 'catalog_version';

const mapCategoryDoc = (doc: DocumentSnapshot | QueryDocumentSnapshot): Category => {
  const data = doc.data() || {};
  return {
    id: doc.id,
    nombre: (data.nombre as string) || '',
    orden: data.orden !== undefined ? (data.orden as number) : 999,
    imagenUrl: (data.imagenUrl as string) || '',
  };
};

const mapProductDoc = (doc: DocumentSnapshot | QueryDocumentSnapshot): Product => {
  const data = doc.data() || {};
  return {
    id: doc.id,
    nombre: (data.nombre as string) || '',
    descripcion: (data.descripcion as string) || '',
    precio: (data.precio as number) || 0,
    stock: (data.stock as number) || 0,
    imagenUrl: (data.imagenUrl as string) || '',
    categoria: (data.categoria as string) || '',
    orden: data.orden !== undefined ? (data.orden as number) : 999,
    creadoEl: (data.creadoEl as Date | string) || null,
    actualizadoEl: (data.actualizadoEl as Date | string) || null,
    permiteReserva: Boolean(data.permiteReserva),
  };
};

export const getCategories = async (): Promise<Category[]> => {
  if (!isFirebaseConfigured()) {
    return mockCatalogService.getCategories();
  }
  const db = await getFirestoreInstance();
  const catsRef = collection(db, CATS_COLLECTION);
  const snap = await getDocs(catsRef);
  return snap.docs.map(mapCategoryDoc).sort((a, b) => a.orden - b.orden);
};

export const getProductById = async (id: string): Promise<Product | null> => {
  if (!isFirebaseConfigured()) {
    return mockCatalogService.getProductById(id);
  }
  const db = await getFirestoreInstance();
  const snap = await getDoc(doc(db, PRODS_COLLECTION, id));
  return snap.exists() ? mapProductDoc(snap) : null;
};

export const getProductsByCategory = async (categoryId: string): Promise<Product[]> => {
  if (!categoryId) return [];
  if (!isFirebaseConfigured()) {
    return mockCatalogService.getProductsByCategory(categoryId);
  }
  const db = await getFirestoreInstance();
  const prodsRef = collection(db, PRODS_COLLECTION);
  const q = query(prodsRef, where('categoria', '==', categoryId), orderBy('orden'));
  const snap = await getDocs(q);
  return snap.docs.map(mapProductDoc);
};

export const getAllProducts = async (): Promise<Product[]> => {
  if (!isFirebaseConfigured()) {
    return mockCatalogService.getAllProducts();
  }
  const db = await getFirestoreInstance();
  const prodsRef = collection(db, PRODS_COLLECTION);
  const snap = await getDocs(query(prodsRef, orderBy('orden')));
  return snap.docs.map(mapProductDoc);
};

export const updateCategoryOrder = async (categories: Category[]): Promise<void> => {
  if (!isFirebaseConfigured()) {
    return;
  }
  const db = await getFirestoreInstance();
  const batch = writeBatch(db);
  categories.forEach((cat, index) => {
    const catRef = doc(db, CATS_COLLECTION, cat.id);
    batch.update(catRef, { orden: index });
  });
  await batch.commit();
};

export const updateProductOrder = async (products: Product[]): Promise<void> => {
  if (!isFirebaseConfigured()) {
    return;
  }
  const db = await getFirestoreInstance();
  const batch = writeBatch(db);
  products.forEach((prod, index) => {
    const prodRef = doc(db, PRODS_COLLECTION, prod.id);
    batch.update(prodRef, { orden: index });
  });
  await batch.commit();
};

export const addCategory = async (cat: Omit<Category, 'orden'> & { id?: string }): Promise<void> => {
  if (!isFirebaseConfigured()) {
    return mockCatalogService.addCategory(cat as Omit<Category, 'orden'>);
  }
  const db = await getFirestoreInstance();
  const catsRef = collection(db, CATS_COLLECTION);
  const snap = await getDocs(catsRef);
  const nextOrder = snap.docs.length;
  await addDoc(catsRef, { ...cat, orden: nextOrder });
};

export const updateCategory = async (
  id: string,
  updates: Partial<Category>
): Promise<void> => {
  if (!isFirebaseConfigured()) {
    return mockCatalogService.updateCategory(id, updates);
  }
  const db = await getFirestoreInstance();
  await updateDoc(doc(db, CATS_COLLECTION, id), updates);
};

export const deleteCategory = async (id: string): Promise<void> => {
  if (!isFirebaseConfigured()) {
    return mockCatalogService.deleteCategory(id);
  }
  const db = await getFirestoreInstance();
  await deleteDoc(doc(db, CATS_COLLECTION, id));
};

export const addProduct = async (product: Omit<Product, 'id' | 'orden'>): Promise<void> => {
  if (!isFirebaseConfigured()) {
    return mockCatalogService.addProduct(product);
  }
  const db = await getFirestoreInstance();
  const prodsRef = collection(db, PRODS_COLLECTION);
  const q = query(prodsRef, where('categoria', '==', product.categoria), orderBy('orden', 'desc'));
  const snap = await getDocs(q);
  const nextOrder = snap.docs.length > 0 ? (snap.docs[0].data().orden || 0) + 1 : 0;
  await addDoc(prodsRef, { ...product, orden: nextOrder, creadoEl: new Date() });
};

export const updateProduct = async (id: string, updates: Partial<Product>): Promise<void> => {
  if (!isFirebaseConfigured()) {
    return mockCatalogService.updateProduct(id, updates);
  }
  const db = await getFirestoreInstance();
  await updateDoc(doc(db, PRODS_COLLECTION, id), { ...updates, actualizadoEl: new Date() });
};

export const deleteProduct = async (id: string): Promise<void> => {
  if (!isFirebaseConfigured()) {
    return mockCatalogService.deleteProduct(id);
  }
  const db = await getFirestoreInstance();
  await deleteDoc(doc(db, PRODS_COLLECTION, id));
};

export const getCatalogMetrics = async () => {
  if (!isFirebaseConfigured()) {
    const products = await mockCatalogService.getAllProducts();
    const categories = await mockCatalogService.getCategories();
    return {
      total: products.length,
      lowStock: products.filter((p) => p.stock < 10).length,
      totalCats: categories.length,
      usagePercentage: Math.round(((categories.length + products.length) / 200) * 100),
    };
  }
  const bundle = await getPublishedBundle();
  if (!bundle) {
    return { total: 0, lowStock: 0, totalCats: 0, usagePercentage: 0 };
  }
  const total = bundle.products.length;
  const lowStock = bundle.products.filter((p) => p.stock < 5).length;
  const totalCats = bundle.categories.length;
  const usagePercentage = Math.round(((totalCats + total) / 200) * 100);
  return { total, lowStock, totalCats, usagePercentage };
};

export const publishCatalogBundle = async (): Promise<void> => {
  if (!isFirebaseConfigured()) return;
  const db = await getFirestoreInstance();
  const categories = await getCategories();
  const products = await getAllProducts();
  const bundle = {
    categories,
    products,
    publishedAt: new Date().toISOString(),
  };
  await setDoc(doc(db, SETTINGS_COLLECTION, SNAPSHOT_DOC_ID), {
    data: JSON.stringify(bundle),
  });
  await setDoc(doc(db, SETTINGS_COLLECTION, VERSION_DOC_ID), {
    version: Date.now(),
    updatedAt: serverTimestamp(),
  });
};

export const getPublishedBundle = async (): Promise<{
  categories: Category[];
  products: Product[];
} | null> => {
  if (!isFirebaseConfigured()) {
    const categories = await mockCatalogService.getCategories();
    const products = await mockCatalogService.getAllProducts();
    return { categories, products };
  }
  const db = await getFirestoreInstance();
  const snap = await getDoc(doc(db, SETTINGS_COLLECTION, SNAPSHOT_DOC_ID));
  if (!snap.exists()) return null;
  const rawData = snap.data()?.data;
  if (!rawData) return null;
  try {
    const parsed = JSON.parse(rawData);
    if (!Array.isArray(parsed?.categories) || !Array.isArray(parsed?.products)) {
      throw new Error('Invalid bundle structure');
    }
    return { categories: parsed.categories, products: parsed.products };
  } catch (e) {
    console.warn('Bundle snapshot corrupted or invalid, falling back to mock catalog', e);
    const categories = await mockCatalogService.getCategories();
    const products = await mockCatalogService.getAllProducts();
    return { categories, products };
  }
};
