# 88-Key Piano App

インタラクティブな88鍵ピアノアプリケーション。Next.js と React で構築されています。

## 機能

- 🎹 88鍵のフルサイズピアノ（A0からC8まで）
- 🎵 リアルタイムでの鍵盤選択表示
- ↔️ 左右スクロール機能
- 📱 レスポンシブデザイン（タッチ操作対応）
- 🎨 美しいグラデーションと影効果

## プロジェクト構造

```
src/
├── app/                    # Next.js アプリケーションルート
│   ├── layout.js          # ルートレイアウト
│   ├── page.js            # メインページ
│   └── globals.css        # グローバルスタイル
├── components/            # Reactコンポーネント
│   ├── Piano.js           # メインピアノコンポーネント
│   ├── PianoKeyboard.js   # 鍵盤コンテナ
│   ├── Key.js             # 個別の鍵盤
│   ├── ScrollControls.js  # スクロールボタン
│   ├── PianoScore.js      # 楽譜背景
│   └── PressedKeyDisplay.js # 押された鍵盤の表示
├── hooks/                 # カスタムReactフック
│   ├── useScroll.js       # スクロール制御
│   ├── useInitialScroll.js # 初期スクロール位置
│   └── usePianoKeys.js    # 鍵盤状態管理
├── utils/                 # ユーティリティ関数
│   └── pianoKeyGenerator.js # 鍵盤データ生成
└── config/                # 設定ファイル
    └── piano.js           # ピアノの定数設定
```

## 技術スタック

- **Next.js 16.1.1** - Reactフレームワーク
- **React 19.2.3** - UIライブラリ
- **CSS3** - スタイリング（グラデーション、影、アニメーション）

## 開発

### インストール

```bash
npm install
```

### 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

### ビルド

```bash
npm run build
```

### 本番環境で起動

```bash
npm start
```

## コード構成の特徴

### 関心の分離

- **コンポーネント**: UI表示に専念
- **フック**: 状態管理とビジネスロジック
- **ユーティリティ**: 純粋な関数・計算ロジック
- **設定**: 定数とマジックナンバーの一元管理

### パフォーマンス最適化

- `React.memo` による不要な再レンダリング防止
- `useMemo` によるデータ生成の最適化
- `useCallback` によるイベントハンドラーのメモ化

### アクセシビリティ

- `aria-label` と `aria-pressed` 属性
- セマンティックなHTML要素の使用
- キーボード・タッチ両方の操作に対応

## ライセンス

MIT
