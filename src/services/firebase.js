import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, updateDoc, doc, deleteDoc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const getUrunler = async () => {
  const urunlerCol = collection(db, 'urunler');
  const urunlerSnapshot = await getDocs(urunlerCol);
  const urunlerList = urunlerSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return urunlerList;
};

import { generateQRCode } from './qrService';

export const addUrun = async (urun) => {
  const urunlerCol = collection(db, 'urunler');
  const newDocRef = doc(urunlerCol); // Auto-generate an ID reference
  
  // Generate QR code URL pointing to this specific product index/id
  const productUrl = `${window.location.origin}?product=${newDocRef.id}`;
  const qrCodeDataUrl = await generateQRCode(productUrl);
  
  const productData = {
    ...urun,
    qrCode: qrCodeDataUrl
  };
  
  await setDoc(newDocRef, productData);
  return { id: newDocRef.id, ...productData };
};

export const updateUrun = async (id, updatedData) => {
  const urunRef = doc(db, 'urunler', id);
  
  // Even in update, let's ensure they have a QR code just in case it's an old item missing it
  if (!updatedData.qrCode) {
    const productUrl = `${window.location.origin}?product=${id}`;
    updatedData.qrCode = await generateQRCode(productUrl);
  }
  
  await updateDoc(urunRef, updatedData);
  return { id, ...updatedData };
};

export const deleteUrun = async (id) => {
  const urunRef = doc(db, 'urunler', id);
  await deleteDoc(urunRef);
};

export const addOdeme = async (odemeData) => {
  const odemelerCol = collection(db, 'odemeler');
  const docRef = await addDoc(odemelerCol, odemeData);
  return { id: docRef.id, ...odemeData };
};

export const getOdemeler = async () => {
  const odemelerCol = collection(db, 'odemeler');
  const odemelerSnapshot = await getDocs(odemelerCol);
  const odemelerList = odemelerSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return odemelerList;
};

export const deleteOdeme = async (id) => {
  const odemeRef = doc(db, 'odemeler', id);
  await deleteDoc(odemeRef);
};

// --- Ürün Grupları (Product Groups) CRUD İşlemleri ---

export const getUrunGruplari = async () => {
  const gruplarCol = collection(db, 'urungrubu');
  const gruplarSnapshot = await getDocs(gruplarCol);
  const gruplarList = gruplarSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return gruplarList;
};

export const addUrunGrubu = async (grupData) => {
  const gruplarCol = collection(db, 'urungrubu');
  const newDocRef = doc(gruplarCol); 
  await setDoc(newDocRef, grupData);
  return { id: newDocRef.id, ...grupData };
};

export const updateUrunGrubu = async (id, updatedData) => {
  const grupRef = doc(db, 'urungrubu', id);
  await updateDoc(grupRef, updatedData);
  return { id, ...updatedData };
};

export const deleteUrunGrubu = async (id) => {
  const grupRef = doc(db, 'urungrubu', id);
  await deleteDoc(grupRef);
};
