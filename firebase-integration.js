// ============================================
// Firebase + Flashcard Integration Module
// ============================================

import { 
  loginWithGoogle, 
  logout, 
  getCurrentUser, 
  onUserStateChange,
  getAuthInstance
} from "./firebase-config.js";

import { 
  syncToFirestore, 
  syncFromFirestore, 
  initializeAppData, 
  autoSyncData 
} from "./firebase-sync.js";

// ============================================
// グローバル状態管理
// ============================================

let state = null;
let currentUser = null;
let isSyncing = false;

/**
 * アプリ初期化時にFirebase認証状態をリスニング
 */
export async function initializeFirebaseIntegration() {
  await onUserStateChange(async (user) => {
    currentUser = user;
    updateAuthUI(user);

    if (user) {
      console.log("✅ User logged in:", user.email);
      // ユーザーがログインしたらクラウドからデータを同期
      await syncAppDataFromCloud();
    } else {
      console.log("❌ User logged out");
      // ログアウト時はローカルのみ
    }
  });
}

/**
 * ログイン処理
 */
export async function handleLogin() {
  try {
    const user = await loginWithGoogle();
    console.log("✅ Login successful:", user.email);
    // UI更新はonAuthStateChangeで自動実行
    return user;
  } catch (error) {
    console.error("❌ Login failed:", error);
    showToast(`ログイン失敗: ${error.message}`);
    throw error;
  }
}

/**
 * ログアウト処理
 */
export async function handleLogout() {
  try {
    await logout();
    console.log("✅ Logout successful");
    showToast("ログアウトしました");
  } catch (error) {
    console.error("❌ Logout failed:", error);
    showToast(`ログアウト失敗: ${error.message}`);
  }
}

/**
 * クラウドからアプリデータを同期
 */
async function syncAppDataFromCloud() {
  if (isSyncing) return;
  
  isSyncing = true;
  try {
    const localState = state || JSON.parse(localStorage.getItem('modernFlashcardApp') || 
                        '{"playlists":[],"cards":[],"settings":{}}');
    
    const mergedState = await initializeAppData(localState);
    
    // 状態を更新
    if (mergedState) {
      state = mergedState;
      console.log("✅ App data synchronized from cloud");
    }
  } catch (error) {
    console.error("❌ Error syncing from cloud:", error);
  } finally {
    isSyncing = false;
  }
}

/**
 * アプリデータを保存（ローカル + クラウド）
 */
export async function saveAppData() {
  if (!state) return;

  try {
    // 自動同期（ローカル + クラウド両方に保存）
    await autoSyncData(state);
    console.log("✅ Data saved");
  } catch (error) {
    console.error("❌ Error saving data:", error);
    showToast("データ保存に失敗しました（ローカルには保存されました）");
  }
}

/**
 * 手動同期ボタン用
 */
export async function manualSync() {
  const auth = await getAuthInstance();
  
  if (!auth.currentUser) {
    showToast("ログインが必要です");
    return;
  }

  try {
    showToast("同期中...");
    await syncToFirestore(state);
    showToast("同期完了しました");
  } catch (error) {
    console.error("Sync error:", error);
    showToast("同期に失敗しました");
  }
}

/**
 * Auth UI を更新
 */
function updateAuthUI(user) {
  const loginContainer = document.getElementById('auth-login-container');
  const userContainer = document.getElementById('auth-user-container');

  if (user) {
    // ログイン状態
    if (loginContainer) loginContainer.classList.add('hidden');
    if (userContainer) userContainer.classList.remove('hidden');

    // ユーザー情報を表示
    const userEmail = document.getElementById('user-email');
    const userName = document.getElementById('user-name');
    const userAvatar = document.getElementById('user-avatar');

    if (userEmail) userEmail.textContent = user.email;
    if (userName) userName.textContent = user.displayName || user.email.split('@')[0];
    if (userAvatar && user.photoURL) {
      userAvatar.src = user.photoURL;
      userAvatar.style.display = 'block';
    }
  } else {
    // ログアウト状態
    if (loginContainer) loginContainer.classList.remove('hidden');
    if (userContainer) userContainer.classList.add('hidden');
  }
}

/**
 * 状態取得・設定用の公開API
 */
export function getAppState() {
  return state;
}

export function setAppState(newState) {
  state = newState;
}

export async function getCurrentAppUser() {
  const auth = await getAuthInstance();
  return auth.currentUser;
}

/**
 * Toast表示（既存関数と互換性あり）
 */
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (toast) {
    toast.textContent = msg;
    toast.classList.remove('opacity-0', 'translate-y-[-20px]');
    toast.classList.add('opacity-100', 'translate-y-0');
    setTimeout(() => {
      toast.classList.remove('opacity-100', 'translate-y-0');
      toast.classList.add('opacity-0', 'translate-y-[-20px]');
    }, 2500);
  }
}
