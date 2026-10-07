import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  updateProfile, 
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  getDocFromServer
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { OrderRecord } from './types.ts';

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Firebase Auth
export const auth = getAuth(app);

// Use the specific firestoreDatabaseId if configured
export const db = firebaseConfig.firestoreDatabaseId 
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Connection test
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore offline or checking connection:', error);
    }
  }
}
testConnection();

/**
 * Friendly Korean translation for Firebase Auth error codes
 */
export function getKoreanAuthErrorMessage(code: string): string {
  switch (code) {
    case 'auth/weak-password':
      return '비밀번호는 최소 6자 이상이어야 합니다. 6자 이상으로 설정해 주세요.';
    case 'auth/email-already-in-use':
      return '이미 가입되어 있는 이메일 주소입니다. 다른 이메일로 가입하시거나 로그인해 주세요.';
    case 'auth/invalid-email':
      return '올바른 이메일 형식이 아닙니다 (예: name@example.com).';
    case 'auth/user-not-found':
      return '등록되지 않은 이메일 주소입니다. 먼저 회원가입을 진행해 주세요.';
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return '이메일 또는 비밀번호가 올바르지 않습니다. 다시 한 번 확인해 주세요.';
    case 'auth/too-many-requests':
      return '로그인 시도가 너무 많아 일시적으로 제한되었습니다. 잠시 후 다시 시도해 주세요.';
    case 'auth/network-request-failed':
      return '네트워크 연결이 원활하지 않습니다. 인터넷 연결을 확인해 주세요.';
    default:
      return '인증 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';
  }
}

/**
 * Sign up with email, password and display name
 */
export async function signUpWithEmail(name: string, email: string, pass: string): Promise<User> {
  const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
  if (name.trim()) {
    await updateProfile(userCredential.user, {
      displayName: name.trim()
    });
  }
  return userCredential.user;
}

/**
 * Sign in with email and password
 */
export async function signInWithEmail(email: string, pass: string): Promise<User> {
  const userCredential = await signInWithEmailAndPassword(auth, email, pass);
  return userCredential.user;
}

/**
 * Sign in with email and password, or auto-create account if user does not exist yet
 */
export async function signInOrAutoSignUp(email: string, pass: string, name: string): Promise<{ user: User; isNew: boolean }> {
  try {
    const user = await signInWithEmail(email, pass);
    return { user, isNew: false };
  } catch (err: any) {
    // If user not found or invalid credential on non-existent account, attempt registration
    if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
      try {
        const newUser = await signUpWithEmail(name, email, pass);
        return { user: newUser, isNew: true };
      } catch (signupErr) {
        // If sign-up fails because email already exists, throw original invalid-credential error
        throw err;
      }
    }
    throw err;
  }
}

/**
 * Quick direct sign in for demo (Stepan)
 */
export async function quickDemoSignIn(name: string = '스테판'): Promise<User> {
  const demoEmail = 'stepan@nature.com';
  const demoPass = 'stepan1234';
  try {
    return await signInWithEmail(demoEmail, demoPass);
  } catch (err) {
    try {
      return await signUpWithEmail(name, demoEmail, demoPass);
    } catch {
      // Fallback in case of conflict
      const randomDemoEmail = `stepan_${Date.now()}@nature.com`;
      return await signUpWithEmail(name, randomDemoEmail, demoPass);
    }
  }
}

/**
 * Sign out
 */
export async function signOutUser(): Promise<void> {
  await firebaseSignOut(auth);
}

const ORDERS_COLLECTION = 'orders';

/**
 * Creates a real order in Firestore database
 */
export async function createOrderInDb(order: Omit<OrderRecord, 'id'>): Promise<string> {
  const colRef = collection(db, ORDERS_COLLECTION);
  const docRef = await addDoc(colRef, {
    ...order,
    createdAt: new Date().toISOString()
  });
  return docRef.id;
}

/**
 * Fetches all orders (for merchant dashboard)
 */
export async function getOrdersFromDb(): Promise<OrderRecord[]> {
  const colRef = collection(db, ORDERS_COLLECTION);
  const q = query(colRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...(docSnap.data() as Omit<OrderRecord, 'id'>)
  }));
}

/**
 * Real-time listener for orders (instant notification for store owner)
 */
export function subscribeToOrders(onUpdate: (orders: OrderRecord[]) => void): () => void {
  const colRef = collection(db, ORDERS_COLLECTION);
  const q = query(colRef, orderBy('createdAt', 'desc'));
  
  return onSnapshot(q, (snapshot) => {
    const list = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...(docSnap.data() as Omit<OrderRecord, 'id'>)
    }));
    onUpdate(list);
  }, (err) => {
    console.error('Realtime orders sync error:', err);
  });
}

/**
 * Updates order status (e.g. 접수완료 -> 입금확인 -> 배송준비 -> 배송중 -> 배송완료)
 */
export async function updateOrderStatusInDb(
  orderId: string, 
  status: OrderRecord['status'], 
  trackingNumber?: string
): Promise<void> {
  const docRef = doc(db, ORDERS_COLLECTION, orderId);
  const updateData: Partial<OrderRecord> = { status };
  if (trackingNumber !== undefined) {
    updateData.trackingNumber = trackingNumber;
  }
  await updateDoc(docRef, updateData);
}

/**
 * Lookup orders by customer phone number
 */
export async function lookupOrdersByPhone(phone: string): Promise<OrderRecord[]> {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const colRef = collection(db, ORDERS_COLLECTION);
  const snapshot = await getDocs(colRef);

  return snapshot.docs
    .map((docSnap) => ({
      id: docSnap.id,
      ...(docSnap.data() as Omit<OrderRecord, 'id'>)
    }))
    .filter((order) => {
      const orderCleanPhone = (order.phone || '').replace(/[^0-9]/g, '');
      return orderCleanPhone === cleanPhone || order.phone.includes(phone);
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
