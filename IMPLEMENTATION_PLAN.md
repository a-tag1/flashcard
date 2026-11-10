# Firebase 統合 - 実装スケジュール

## 📋 実装内容

### ファイル構成
```
flashcard/
├── index.html                 (元ファイル - 修正版)
├── firebase-config.js         (Firebase初期化)
├── firebase-sync.js           (データ同期ロジック)
├── firebase-integration.js    (UI統合)
├── .env.example               (環境変数テンプレート)
└── FIREBASE_SETUP.md          (セットアップガイド)
```

---

## 🔧 index.html への統合手順

### Step 1: Firebase SDKスクリプトを追加
`<head>` セクションに以下を追加：

```html
<!-- Firebase SDKs -->
<script type="module">
  // Firebase scripts will be dynamically imported
</script>
```

### Step 2: ログイン UI セクションを追加
`<settings>` ビュー内に以下を追加：

```html
<!-- 認証セクション -->
<div class="app-card p-6 rounded-2xl mb-6">
  <h3 class="text-lg font-bold mb-4">アカウント</h3>
  
  <!-- ログイン前 -->
  <div id="auth-login-container">
    <button onclick="window.firebaseApp.handleLogin()" 
      class="w-full py-3 rounded-xl text-white font-semibold transition-opacity hover:opacity-90" 
      style="background-color: var(--primary);">
      🔐 Google でログイン
    </button>
  </div>
  
  <!-- ログイン後 -->
  <div id="auth-user-container" class="hidden">
    <div class="flex items-center gap-3 mb-4">
      <img id="user-avatar" class="w-12 h-12 rounded-full" alt="Avatar" style="display: none;">
      <div class="flex-1">
        <p class="font-bold" id="user-name">ユーザー名</p>
        <p class="text-sm text-[var(--text-muted)]" id="user-email">メール</p>
      </div>
    </div>
    
    <button onclick="window.firebaseApp.manualSync()" 
      class="w-full py-2 mb-2 rounded-xl border border-[var(--border)] font-semibold text-[var(--text-main)] hover:bg-[var(--primary-light)] transition-colors">
      🔄 データを同期
    </button>
    
    <button onclick="window.firebaseApp.handleLogout()" 
      class="w-full py-2 rounded-xl text-red-500 font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
      🚪 ログアウト
    </button>
  </div>
</div>
```

### Step 3: 既存のsaveData関数を修正
現在のコード：
```javascript
function saveData() {
  localStorage.setItem('modernFlashcardApp', JSON.stringify(state));
}
```

修正後：
```javascript
async function saveData() {
  // Firebase統合版
  if (window.firebaseApp) {
    await window.firebaseApp.saveAppData();
  } else {
    // フォールバック
    localStorage.setItem('modernFlashcardApp', JSON.stringify(state));
  }
}
```

### Step 4: init関数の修正
現在のコード：
```javascript
function init() {
  const saved = localStorage.getItem('modernFlashcardApp');
  state = saved ? JSON.parse(saved) : defaultState();
  applySettings();
  navigate('learn');
}
```

修正後：
```javascript
async function init() {
  const saved = localStorage.getItem('modernFlashcardApp');
  state = saved ? JSON.parse(saved) : defaultState();
  
  // Firebase初期化
  if (window.firebaseApp) {
    window.firebaseApp.setAppState(state);
    await window.firebaseApp.initializeFirebaseIntegration();
  }
  
  applySettings();
  navigate('learn');
}
```

---

## 🚀 実装順序

1. ✅ Firebase Config ファイル作成 → **完了**
2. ✅ Firebase Sync ファイル作成 → **完了**
3. ✅ Firebase Integration ファイル作成 → **完了**
4. ⏳ index.html にログイン UI を追加 → **次のステップ**
5. ⏳ index.html に Firebase スクリプトをロード → **次のステップ**
6. ⏳ 動作テスト → **次のステップ**
7. ⏳ Vercel デプロイ → **最後**

---

## 📝 設定確認

Firebase config 情報は既に以下に格納されています：
- [firebase-config.js](/firebase-config.js)

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDvioUzYqLPGe1pr86pa0oocbpsYU3kIoU",
  authDomain: "flashcard-app-703e3.firebaseapp.com",
  projectId: "flashcard-app-703e3",
  storageBucket: "flashcard-app-703e3.appspot.storage",
  messagingSenderId: "167284996806",
  appId: "1:167284996806:web:778d50ff2ec2f4de6175c7"
};
```

---

## ⚠️ 注意事項

- **セキュリティ**: firebaseConfig.js には秘密情報が含まれています
  - Git にコミットする場合は `.gitignore` に追加してください
  - または環境変数を使用してください

- **ブラウザ互換性**: 現在の実装は ES Modules を使用しています
  - モダンブラウザ対応（Chrome, Firefox, Safari, Edge）
  - 古いブラウザ対応が必要な場合は build step が必要

---

## 次のステップ

Step 4 に進む準備ができたら、お知らせください。

index.html への統合修正を行います。
