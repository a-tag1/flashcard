# Firebase セットアップガイド

Firebase を使用して複数端末でのデータ同期を実装します。

## Step 1: Firebase プロジェクト作成

### 1.1 Firebase Console にアクセス
1. https://console.firebase.google.com に移動
2. Google アカウントでログイン（既にあるので OK）

### 1.2 新しいプロジェクト作成
1. 「プロジェクトを作成」をクリック
2. プロジェクト名：`flashcard-app`
3. Google アナリティクス：オフでも OK（後で有効化可能）
4. 「作成」をクリック

### 1.3 プロジェクト作成完了後

プロジェクトダッシュボードが表示されたら、以下の情報をメモしておきます：
- Project ID（後で使用）
- Web API Key（後で使用）

---

## Step 2: Web アプリの登録

### 2.1 Firebase プロジェクトに Web アプリを追加
1. ダッシュボード左側で「プロジェクト設定」 (⚙️) をクリック
2. 「アプリ」タブから「ウェブアプリを追加」を選択
3. アプリのニックネーム：`flashcard-web`
4. 「Firebase Hosting も設定します」にはチェック不要
5. 「アプリを登録」をクリック

### 2.2 Firebase 設定情報をコピー
以下のような設定情報が表示されます：

```javascript
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
```

この情報は後で `index.html` に埋め込みます。

---

## Step 3: Authentication（ログイン）設定

### 3.1 Google ログインを有効化
1. Firebase Console の左メニューから「Authentication」をクリック
2. 「Sign-in method」タブをクリック
3. 「Google」をクリック
4. 右上の「有効にする」をオン
5. 「プロジェクトサポートメール」は自動選択
6. 「保存」をクリック

### 3.2 OAuth 同意画面の設定（必要な場合）
- 初回は Google Cloud Console にリダイレクトされる場合があります
- その場合、指示に従って OAuth 同意画面を設定してください

---

## Step 4: Firestore データベース設定

### 4.1 Firestore Database を作成
1. Firebase Console の左メニューから「Firestore Database」をクリック
2. 「データベースを作成」をクリック
3. ロケーション：`asia-northeast1` (東京)
4. セキュリティルール：「テストモード」で開始
5. 「作成」をクリック

### 4.2 セキュリティルール設定
データベース作成後、「ルール」タブを開いて、以下に変更：

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
      match /data {
        allow read, write: if request.auth.uid == userId;
      }
    }
  }
}
```

この設定により、各ユーザーは自分のデータのみアクセス可能になります。

---

## Step 5: デプロイ設定（Vercel）

### 5.1 Environment Variables を設定
後で Vercel にデプロイする際に、以下の環境変数が必要になります：
- Firebase API Key
- Firebase Auth Domain
- Firebase Project ID

これらは `.env.local` に保存して、Git に追跡されないようにします。

---

## 📋 チェックリスト

- [x] Firebase プロジェクト作成完了
- [x] Web アプリ登録完了
- [ ] Firebase Config を保存
- [x] Google Sign-in 有効化
- [x] Firestore Database 作成完了
- [x] セキュリティルール設定完了

---

---

## Step 6: Firebase 設定情報の取得場所（詳細）

### 6.1 プロジェクト設定にアクセス

**方法1: 左下メニューから**
```
Firebase Console ダッシュボード
  → 左下の ⚙️ アイコン（プロジェクト設定）をクリック
  → 「全般」タブが開く
```

**方法2: アプリ設定から（推奨）**
```
Firebase Console ダッシュボード
  → 左下の ⚙️ (プロジェクト設定) をクリック
  → 「アプリ」タブをクリック
  → 登録した Web アプリをクリック
  → "SDK セットアップと構成" セクションに設定情報が表示される
```

### 6.2 設定情報の見た目

以下のようなコードが表示されます：

```javascript
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDxxx...",
  authDomain: "flashcard-app-xxxxx.firebaseapp.com",
  projectId: "flashcard-app-xxxxx",
  storageBucket: "flashcard-app-xxxxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef1234567890"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
```

### 6.3 必要な6つの値

この中から、以下の6つをコピーしてください：

| 項目 | 説明 |
|------|------|
| **apiKey** | Firebase Web API キー（最初の文字列） |
| **authDomain** | 認証用ドメイン（`xxxxx.firebaseapp.com`） |
| **projectId** | プロジェクト ID（プロジェクト名の一部） |
| **storageBucket** | ストレージバケット（`xxxxx.appspot.com`） |
| **messagingSenderId** | メッセージング ID（数字） |
| **appId** | アプリ ID（`1:xxxxx:web:xxxxx`形式） |

### 6.4 設定情報コピーの例

```
apiKey: AIzaSyDxxx...
authDomain: flashcard-app-abc123.firebaseapp.com
projectId: flashcard-app-abc123
storageBucket: flashcard-app-abc123.appspot.com
messagingSenderId: 123456789012
appId: 1:123456789012:web:abc123def456ghi789
```

---

## 次のステップ

Firebase セットアップが完了したら、以下を実装します：

1. **index.html に Firebase SDK を統合**
2. **ログイン UI を実装**
3. **データ同期機能を実装**
4. **Vercel にデプロイ**
