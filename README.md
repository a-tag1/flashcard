# 🎓 Modern Flashcards - 複数端末同期対応版

複数の端末でデータを共有できるフラッシュカード学習アプリです。

**Firebase** を使用した **Google ログイン** と **クラウド同期** に対応しており、PC、スマートフォン、タブレットで同じデータを共有できます。

---

## ✨ **主な特徴**

✅ **複数端末での同期**
- Google アカウントでログイン
- Firestore でクラウド同期
- PC とスマートフォンでデータを共有

✅ **フラッシュカード学習**
- カードをめくって学習
- 習得度を管理 (0% ～ 100%)
- 進捗を追跡

✅ **柔軟なプレイリスト管理**
- 複数のカテゴリを作成
- 各プレイリストで単語を整理

✅ **充実した設定**
- 4つのカラーテーマ
- 5種類のフォント
- 文字サイズ調整

✅ **バックアップ機能**
- JSON 形式で書き出し
- 復元が可能

✅ **オフラインに対応**
- ログイン前でもローカルで使用可能
- インターネット接続時に同期

---

## 🚀 **クイックスタート（5分）**

### **1. アプリを起動**

```bash
# ターミナルで実行
cd flashcard
npx http-server -p 8000 -c-1

# ブラウザで開く
http://localhost:8000
```

### **2. Google でログイン**

1. Settings タブを開く
2. 「🔐 Google でログイン」をクリック
3. Google アカウントを選択

### **3. プレイリストを作成**

1. Lists タブを開く
2. 「新規作成」をクリック
3. プレイリスト名を入力

### **4. 単語を追加**

1. Words タブを開く
2. 「追加」をクリック
3. 表面（単語）と裏面（意味）を入力

### **5. 学習を開始**

1. Learn タブを開く
2. プレイリストを選択
3. カードをめくって学習

**詳細は [QUICKSTART.md](./QUICKSTART.md) を参照**

---

## 📱 **複数端末での同期**

```
PC で作成したカード
     ↓
Google ログイン
     ↓
Firestore（クラウド）に保存
     ↓
スマートフォンで同じアカウントでログイン
     ↓
すべてのカードが表示される ✅
```

---

## 📚 **使い方ガイド**

| ガイド | 説明 |
|--------|------|
| [QUICKSTART.md](./QUICKSTART.md) | **5分で開始** - 最速スタートガイド |
| [USAGE_GUIDE.md](./USAGE_GUIDE.md) | **詳細ガイド** - すべての機能説明 |
| [USAGE_GUIDE_VISUAL.md](./USAGE_GUIDE_VISUAL.md) | **ビジュアルガイド** - スクリーンショット付き |

---

## 🛠️ **技術スタック**

### **フロントエンド**
- HTML5
- CSS3 (Tailwind CSS)
- JavaScript (ES6+)
- ES Modules

### **バックエンド・サービス**
- Firebase Authentication (Google OAuth)
- Firestore Database (NoSQL)

### **ブラウザ互換性**
- ✅ Chrome (最新)
- ✅ Firefox (最新)
- ✅ Safari (最新)
- ✅ Edge (最新)

---

## 📁 **ファイル構成**

```
flashcard/
├── index.html                    メインアプリケーション
├── firebase-config.js            Firebase 初期化・認証
├── firebase-sync.js              Firestore 同期ロジック
├── firebase-integration.js       UI 統合・状態管理
├── manifest.webmanifest          PWA マニフェスト
├── icons/                        アプリアイコン
│   ├── icon.svg
│   ├── icon-192.png
│   ├── apple-touch-icon.png
│   └── icon-512.png
├── README.md                     このファイル
├── QUICKSTART.md                 クイックスタート
├── USAGE_GUIDE.md                詳細ガイド
├── USAGE_GUIDE_VISUAL.md         ビジュアルガイド
├── FIREBASE_SETUP.md             Firebase セットアップ
├── IMPLEMENTATION_COMPLETE.md    実装完了レポート
└── IMPLEMENTATION_PLAN.md        実装計画書
```

---

## 🔐 **セキュリティ**

### **認証**
- Google OAuth 2.0
- Firebase Authentication

### **データ保護**
- Firestore セキュリティルール
- ユーザー認証ユーザーのみアクセス可能
- HTTPS 暗号化通信

### **Firestore ルール**
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

---

## ⚙️ **Firebase セットアップ**

### **必要な情報**
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### **セットアップ手順**
1. Firebase Console で新規プロジェクト作成
2. Web アプリを登録
3. Google Sign-in を有効化
4. Firestore Database を作成
5. セキュリティルールを設定
6. `firebase-config.js` に設定情報を入力

**詳細は [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) を参照**

---

## 🚀 **デプロイ**

### **ローカル開発**

```bash
# サーバー起動
npx http-server -p 8000 -c-1

# ブラウザで開く
http://localhost:8000
```

### **Vercel デプロイ**

```bash
# Git にプッシュ
git add .
git commit -m "feat: Add Firebase integration"
git push origin main

# Vercel に接続してデプロイ
# https://vercel.com/new
```

### **Firebase Hosting デプロイ**

```bash
# Firebase CLI インストール
npm install -g firebase-tools

# デプロイ
firebase deploy
```

---

## 📊 **機能一覧**

### **学習機能**
- ✅ フラッシュカード表示
- ✅ カード翻し（表 ↔ 裏）
- ✅ スワイプでカード移動
- ✅ 習得度管理 (0% ～ 100%)
- ✅ 進捗表示

### **データ管理**
- ✅ プレイリスト作成・編集・削除
- ✅ 単語追加・編集・削除
- ✅ プレイリスト別フィルター
- ✅ ジャンル分類

### **同期機能**
- ✅ Google ログイン
- ✅ Firestore クラウド同期
- ✅ 自動同期（起動時・更新時）
- ✅ 手動同期ボタン
- ✅ オフライン対応

### **設定機能**
- ✅ 4つのカラーテーマ
- ✅ 5種類のフォント
- ✅ 文字サイズ調整（表・裏）
- ✅ バックアップ書き出し
- ✅ バックアップ読み込み
- ✅ データ初期化

### **UI/UX**
- ✅ レスポンシブデザイン
- ✅ ダークモード対応
- ✅ スムーズなアニメーション
- ✅ Touch 対応

---

## 🆘 **トラブルシューティング**

### **ログインできない**
```
1. インターネット接続確認
2. ブラウザキャッシュクリア (Ctrl+Shift+Delete)
3. 別のブラウザで試す
4. Firebase プロジェクト設定確認
```

### **データが同期されない**
```
1. 両方の端末で同じアカウントでログイン
2. Settings で「🔄 データを同期」をクリック
3. ページをリロード (F5)
4. Firestore ルール確認
```

### **ローカルサーバーが起動しない**
```
1. ポート 8000 が使用中でないか確認
2. Node.js がインストール済みか確認
3. 別のポートで起動: npx http-server -p 3000
```

---

## 📞 **サポート**

### **よくある質問**
- [USAGE_GUIDE.md - FAQ](./USAGE_GUIDE.md#-よくある質問faq)

### **バグ報告**
問題が発生した場合は、以下をお知らせください：
1. 具体的な操作手順
2. エラーメッセージ
3. 使用デバイス・ブラウザ
4. ブラウザコンソール出力 (F12)

---

## 📝 **ライセンス**

このプロジェクトは自由に使用できます。

---

## 🎯 **今後の改善予定**

- [ ] リアルタイム同期（WebSocket）
- [ ] 学習統計ダッシュボード
- [ ] 音声機能
- [ ] 画像対応
- [ ] マルチ言語対応
- [ ] Android/iOS アプリ
- [ ] オフライン完全対応
- [ ] エクスポート機能拡張 (Excel, PDF)

---

## ✅ **チェックリスト**

### **初期設定**
- [ ] Firebase プロジェクト作成
- [ ] Web アプリ登録
- [ ] Google Sign-in 有効化
- [ ] Firestore Database 作成
- [ ] セキュリティルール設定
- [ ] `firebase-config.js` に設定情報入力

### **ローカルテスト**
- [ ] アプリ起動確認
- [ ] Google ログイン確認
- [ ] プレイリスト作成確認
- [ ] 単語追加確認
- [ ] 学習機能確認
- [ ] 複数端末同期確認

### **デプロイ前**
- [ ] バックアップ作成
- [ ] 全機能テスト
- [ ] モバイルテスト
- [ ] セキュリティ確認

---

## 🙏 **謝辞**

このプロジェクトは以下のサービス・ツールを使用しています：

- Firebase (Google)
- Tailwind CSS
- イコン (Material Design)

---

**さあ、学習を始めましょう！** 🚀

---

## 📞 **クイックリンク**

- 🚀 [クイックスタート](./QUICKSTART.md)
- 📚 [詳細ガイド](./USAGE_GUIDE.md)
- 🎨 [ビジュアルガイド](./USAGE_GUIDE_VISUAL.md)
- 🔧 [Firebase セットアップ](./FIREBASE_SETUP.md)
- ✅ [実装完了レポート](./IMPLEMENTATION_COMPLETE.md)
