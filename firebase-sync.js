// Firebase Sync Functions
import { getAuthInstance, getDbInstance } from "./firebase-config.js";

const SYNC_VERSION = 1;

/**
 * アプリの状態をFirestoreに保存
 * @param {object} state - アプリの状態オブジェクト
 * @returns {Promise<boolean>}
 */
export async function syncToFirestore(state) {
  try {
    const auth = await getAuthInstance();
    const db = await getDbInstance();
    const { doc, setDoc } = await import("https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js");
    
    if (!auth.currentUser) {
      console.warn("⚠️  User not authenticated, saving to localStorage only");
      return false;
    }

    const userId = auth.currentUser.uid;
    const dataRef = doc(db, "users", userId, "data", "appData");
    
    const dataToSync = {
      playlists: state.playlists || [],
      cards: state.cards || [],
      settings: state.settings || {},
      version: SYNC_VERSION,
      lastModified: new Date().toISOString()
    };

    await setDoc(dataRef, dataToSync, { merge: true });
    console.log("✅ Data synced to Firestore");
    return true;
  } catch (error) {
    console.error("❌ Firestore sync error:", error);
    return false;
  }
}

/**
 * Firestoreからアプリの状態を取得
 * @returns {Promise<object|null>}
 */
export async function syncFromFirestore() {
  try {
    const auth = await getAuthInstance();
    const db = await getDbInstance();
    const { doc, getDoc } = await import("https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js");
    
    if (!auth.currentUser) {
      console.warn("⚠️  User not authenticated, reading from localStorage only");
      return null;
    }

    const userId = auth.currentUser.uid;
    const dataRef = doc(db, "users", userId, "data", "appData");
    const docSnap = await getDoc(dataRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log("✅ Data loaded from Firestore");
      return {
        playlists: data.playlists || [],
        cards: data.cards || [],
        settings: data.settings || {}
      };
    } else {
      console.log("ℹ️  No data found in Firestore");
      return null;
    }
  } catch (error) {
    console.error("❌ Firestore read error:", error);
    return null;
  }
}

/**
 * 起動時に実行：クラウドとローカルのデータを同期
 * @param {object} localState - ローカルストレージの状態
 * @returns {Promise<object>}
 */
export async function initializeAppData(localState) {
  const auth = await getAuthInstance();
  
  // ユーザーがログインしていない場合はローカルのみ
  if (!auth.currentUser) {
    console.log("User not logged in, using local data only");
    return localState;
  }

  try {
    // Firestoreからデータを取得
    const cloudData = await syncFromFirestore();

    // クラウドデータがない場合、ローカルデータをアップロード
    if (!cloudData) {
      console.log("No cloud data, uploading local data to Firestore");
      await syncToFirestore(localState);
      return localState;
    }

    console.log("Using cloud data as source of truth");
    return cloudData;
  } catch (error) {
    console.error("Error initializing app data:", error);
    console.log("Falling back to local data");
    return localState;
  }
}

/**
 * データ変更時に呼び出す（自動同期）
 * @param {object} state - アプリの状態
 */
export async function autoSyncData(state) {
  const auth = await getAuthInstance();
  
  if (!auth.currentUser) {
    // ログインしていない場合はローカルのみ保存
    localStorage.setItem('modernFlashcardApp', JSON.stringify(state));
    return;
  }

  try {
    // ローカルとクラウドの両方に保存
    localStorage.setItem('modernFlashcardApp', JSON.stringify(state));
    await syncToFirestore(state);
  } catch (error) {
    console.error("Error auto-syncing data:", error);
  }
}
