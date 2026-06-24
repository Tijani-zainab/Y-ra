import { db } from './firebase';
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  increment,
} from 'firebase/firestore';

export interface URLData {
  id?: string;
  originalUrl: string;
  shortCode: string;
  customSlug?: string;
  userId: string;
  createdAt?: any;
  clicks: number;
  title?: string;
  description?: string;
  analytics: {
    totalClicks: number;
    clicksByDate: { [date: string]: number };
    clicksByCountry: { [country: string]: number };
    clicksByDevice: { [device: string]: number };
  };
}

// Generate a random short code
export function generateShortCode(length: number = 6): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Validate URL format
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Create a shortened URL
export async function createShortUrl(
  originalUrl: string,
  userId: string,
  customSlug?: string,
  title?: string,
  description?: string
): Promise<URLData> {
  if (!isValidUrl(originalUrl)) {
    throw new Error('Invalid URL format');
  }

  if (!userId) {
    throw new Error('User ID is required');
  }

  const shortCode = customSlug || generateShortCode();

  // Check if custom slug already exists
  if (customSlug) {
    const existingUrl = await getShortUrlByCode(customSlug);
    if (existingUrl) {
      throw new Error('Custom slug already exists');
    }
  }

  const urlData: Omit<URLData, 'id'> = {
    originalUrl,
    shortCode,
    customSlug,
    userId,
    title,
    description,
    clicks: 0,
    analytics: {
      totalClicks: 0,
      clicksByDate: {},
      clicksByCountry: {},
      clicksByDevice: {},
    },
  };

  const docRef = await addDoc(collection(db, 'urls'), {
    ...urlData,
    createdAt: serverTimestamp(),
  });

  return {
    ...urlData,
    id: docRef.id,
  };
}

// Get URL by short code
export async function getShortUrlByCode(shortCode: string): Promise<URLData | null> {
  const q = query(collection(db, 'urls'), where('shortCode', '==', shortCode));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return null;
  }

  const doc = querySnapshot.docs[0];
  return {
    id: doc.id,
    ...doc.data(),
  } as URLData;
}

// Get all URLs for a user
export async function getUserUrls(userId: string): Promise<URLData[]> {
  const q = query(collection(db, 'urls'), where('userId', '==', userId));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as URLData[];
}

// Track click on a shortened URL
export async function trackClick(
  shortCode: string,
  country?: string,
  device?: string
): Promise<void> {
  const urlData = await getShortUrlByCode(shortCode);

  if (!urlData || !urlData.id) {
    throw new Error('URL not found');
  }

  const today = new Date().toISOString().split('T')[0];

  const updateData: any = {
    clicks: increment(1),
    'analytics.totalClicks': increment(1),
  };

  if (country) {
    updateData[`analytics.clicksByCountry.${country}`] = increment(1);
  }

  if (device) {
    updateData[`analytics.clicksByDevice.${device}`] = increment(1);
  }

  updateData[`analytics.clicksByDate.${today}`] = increment(1);

  await updateDoc(doc(db, 'urls', urlData.id), updateData);
}

// Delete a shortened URL
export async function deleteShortUrl(urlId: string, userId: string): Promise<void> {
  const urlDoc = await getDoc(doc(db, 'urls', urlId));

  if (!urlDoc.exists()) {
    throw new Error('URL not found');
  }

  const urlData = urlDoc.data() as URLData;

  if (urlData.userId !== userId) {
    throw new Error('Unauthorized to delete this URL');
  }

  await deleteDoc(doc(db, 'urls', urlId));
}

// Update a shortened URL
export async function updateShortUrl(
  urlId: string,
  userId: string,
  updates: Partial<URLData>
): Promise<URLData> {
  const urlDoc = await getDoc(doc(db, 'urls', urlId));

  if (!urlDoc.exists()) {
    throw new Error('URL not found');
  }

  const urlData = urlDoc.data() as URLData;

  if (urlData.userId !== userId) {
    throw new Error('Unauthorized to update this URL');
  }

  await updateDoc(doc(db, 'urls', urlId), updates);

  return {
    ...urlData,
    ...updates,
    id: urlId,
  };
}

// Generate QR code URL (using QR code API)
export function generateQRCodeUrl(text: string): string {
  const encodedText = encodeURIComponent(text);
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodedText}`;
}

// Detect device type from user agent
export function detectDevice(userAgent: string): string {
  if (/mobile|android|iphone|ipad/i.test(userAgent)) {
    return 'Mobile';
  }
  if (/tablet|ipad/i.test(userAgent)) {
    return 'Tablet';
  }
  return 'Desktop';
}
