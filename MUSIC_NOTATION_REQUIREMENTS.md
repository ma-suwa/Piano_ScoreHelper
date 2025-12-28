# 楽譜表記システム 要件定義・設計案

## 1. 要件定義

### 1.1 機能要件

#### 1.1.1 調性（Key Signature）の管理
- **目的**: 各調性に応じて、どの音符にシャープ/フラットが必要かを判定
- **対応する調性**:
  - 長調: C, G, D, A, E, B, F#, C# (シャープ系)
  - 長調: F, Bb, Eb, Ab, Db, Gb, Cb (フラット系)
  - 短調: Am, Em, Bm, F#m, C#m, G#m, D#m (シャープ系)
  - 短調: Dm, Gm, Cm, Fm, Bbm, Ebm, Abm (フラット系)

#### 1.1.2 記号（Clef）の管理
- **目的**: ト音記号、ヘ音記号など、記号ごとの音符位置マッピング
- **対応する記号**:
  - ト音記号（Treble Clef / G Clef）
  - ヘ音記号（Bass Clef / F Clef）
  - その他（将来拡張可能）

#### 1.1.3 臨時記号（Accidental）の判定
- **目的**: 押された鍵盤に対して、シャープ/フラット/ナチュラルのどれを表示するか判定
- **判定ロジック**:
  1. 調性による調号（Key Signature）の確認
  2. 押された鍵盤が黒鍵か白鍵かの確認
  3. 調号に含まれる音符かどうかの確認
  4. 臨時記号の表示判定

### 1.2 非機能要件

#### 1.2.1 拡張性
- 新しい調性を追加しやすい
- 新しい記号を追加しやすい
- 判定ロジックを変更しやすい

#### 1.2.2 保守性
- 設定データとロジックの分離
- 明確な責務分担
- テストしやすい構造

#### 1.2.3 パフォーマンス
- 判定処理は高速であること
- メモリ使用量を抑えること

## 2. 設計案

### 2.1 データ構造設計

#### 2.1.1 調性設定（Key Signature Configuration）

```javascript
const KEY_SIGNATURES = {
  // 長調（Major Keys）
  'C': { type: 'major', accidentals: [] }, // ハ長調
  'G': { type: 'major', accidentals: ['F'] }, // ト長調（F#）
  'D': { type: 'major', accidentals: ['F', 'C'] }, // ニ長調（F#, C#）
  'A': { type: 'major', accidentals: ['F', 'C', 'G'] }, // イ長調（F#, C#, G#）
  'E': { type: 'major', accidentals: ['F', 'C', 'G', 'D'] }, // ホ長調
  'B': { type: 'major', accidentals: ['F', 'C', 'G', 'D', 'A'] }, // ロ長調
  'F#': { type: 'major', accidentals: ['F', 'C', 'G', 'D', 'A', 'E'] }, // 嬰ヘ長調
  'C#': { type: 'major', accidentals: ['F', 'C', 'G', 'D', 'A', 'E', 'B'] }, // 嬰ハ長調
  
  'F': { type: 'major', accidentals: ['B'], flat: true }, // ヘ長調（Bb）
  'Bb': { type: 'major', accidentals: ['B', 'E'], flat: true }, // 変ロ長調（Bb, Eb）
  'Eb': { type: 'major', accidentals: ['B', 'E', 'A'], flat: true }, // 変ホ長調
  'Ab': { type: 'major', accidentals: ['B', 'E', 'A', 'D'], flat: true }, // 変イ長調
  'Db': { type: 'major', accidentals: ['B', 'E', 'A', 'D', 'G'], flat: true }, // 変ニ長調
  'Gb': { type: 'major', accidentals: ['B', 'E', 'A', 'D', 'G', 'C'], flat: true }, // 変ト長調
  'Cb': { type: 'major', accidentals: ['B', 'E', 'A', 'D', 'G', 'C', 'F'], flat: true }, // 変ハ長調
  
  // 短調（Minor Keys）
  'Am': { type: 'minor', accidentals: [] }, // イ短調
  'Em': { type: 'minor', accidentals: ['F'] }, // ホ短調（F#）
  'Bm': { type: 'minor', accidentals: ['F', 'C'] }, // ロ短調
  'F#m': { type: 'minor', accidentals: ['F', 'C', 'G'] }, // 嬰ヘ短調
  'C#m': { type: 'minor', accidentals: ['F', 'C', 'G', 'D'] }, // 嬰ハ短調
  'G#m': { type: 'minor', accidentals: ['F', 'C', 'G', 'D', 'A'] }, // 嬰ト短調
  'D#m': { type: 'minor', accidentals: ['F', 'C', 'G', 'D', 'A', 'E'] }, // 嬰ニ短調
  
  'Dm': { type: 'minor', accidentals: ['B'], flat: true }, // ニ短調（Bb）
  'Gm': { type: 'minor', accidentals: ['B', 'E'], flat: true }, // ト短調
  'Cm': { type: 'minor', accidentals: ['B', 'E', 'A'], flat: true }, // ハ短調
  'Fm': { type: 'minor', accidentals: ['B', 'E', 'A', 'D'], flat: true }, // ヘ短調
  'Bbm': { type: 'minor', accidentals: ['B', 'E', 'A', 'D', 'G'], flat: true }, // 変ロ短調
  'Ebm': { type: 'minor', accidentals: ['B', 'E', 'A', 'D', 'G', 'C'], flat: true }, // 変ホ短調
  'Abm': { type: 'minor', accidentals: ['B', 'E', 'A', 'D', 'G', 'C', 'F'], flat: true }, // 変イ短調
};
```

#### 2.1.2 記号設定（Clef Configuration）

```javascript
const CLEF_CONFIGS = {
  'treble': {
    name: 'Treble Clef',
    notePositionMap: { /* 既存のnotePositionMap */ },
    // 将来、ヘ音記号用のマッピングを追加
  },
  'bass': {
    name: 'Bass Clef',
    notePositionMap: { /* ヘ音記号用のマッピング */ },
  },
};
```

#### 2.1.3 アプリケーション設定（Application Configuration）

```javascript
const MUSIC_CONFIG = {
  clef: 'treble', // 'treble' | 'bass' | ...
  keySignature: 'C', // KEY_SIGNATURESのキー
};
```

### 2.2 判定ロジック設計

#### 2.2.1 黒鍵の表記マッピング

```javascript
/**
 * 黒鍵のエンハーモニック（異名同音）マッピング
 * 各黒鍵は、シャープ表記とフラット表記の両方が可能
 */
const BLACK_KEY_NOTATIONS = {
  // 黒鍵名 → { sharp: 'C#', flat: 'Db' } の形式
  'C#': { sharp: 'C', flat: 'D' }, // C# = Db
  'D#': { sharp: 'D', flat: 'E' }, // D# = Eb
  'F#': { sharp: 'F', flat: 'G' }, // F# = Gb
  'G#': { sharp: 'G', flat: 'A' }, // G# = Ab
  'A#': { sharp: 'A', flat: 'B' }, // A# = Bb
};
```

#### 2.2.2 臨時記号判定関数

```javascript
/**
 * 押された鍵盤に対して、表示すべき臨時記号を判定
 * @param {string} pressedNote - 押された鍵盤名（例: 'C4', 'C#4'）
 * @param {object} config - 現在の設定（clef, keySignature）
 * @returns {object} - { showSharp: boolean, showFlat: boolean, showNatural: boolean }
 */
function getAccidentalForNote(pressedNote, config) {
  const keySig = KEY_SIGNATURES[config.keySignature];
  const isFlatKey = keySig.flat === true; // フラット系の調かどうか
  const noteBase = extractNoteBase(pressedNote); // 'C4' → 'C', 'C#4' → 'C#'
  const octave = extractOctave(pressedNote); // 'C4' → 4
  
  // 1. 黒鍵を押した場合
  if (pressedNote.includes('#')) {
    const blackKeyNotation = BLACK_KEY_NOTATIONS[noteBase]; // 'C#' → { sharp: 'C', flat: 'D' }
    
    if (!blackKeyNotation) {
      // 想定外の黒鍵（通常発生しない）
      return { showSharp: true, showFlat: false, showNatural: false };
    }
    
    // 調によって、シャープ表記かフラット表記かを決定
    if (isFlatKey) {
      // フラット系の調: フラット表記を使用
      // 例: C#4 → Db4 として表示（フラット記号）
      // 調号に含まれるかチェック（Dbが調号に含まれる場合）
      const flatNote = blackKeyNotation.flat; // 'D'
      const isInKeySignature = keySig.accidentals.includes(flatNote);
      
      if (isInKeySignature) {
        // 調号に含まれる場合、ナチュラルを表示（調号をキャンセル）
        return { showSharp: false, showFlat: false, showNatural: true };
      } else {
        // 調号に含まれない場合、フラットを表示
        return { showSharp: false, showFlat: true, showNatural: false };
      }
    } else {
      // シャープ系の調: シャープ表記を使用
      // 例: C#4 → C#4 として表示（シャープ記号）
      const sharpNote = blackKeyNotation.sharp; // 'C'
      const isInKeySignature = keySig.accidentals.includes(sharpNote);
      
      if (isInKeySignature) {
        // 調号に含まれる場合、ナチュラルを表示（調号をキャンセル）
        return { showSharp: false, showFlat: false, showNatural: true };
      } else {
        // 調号に含まれない場合、シャープを表示
        return { showSharp: true, showFlat: false, showNatural: false };
      }
    }
  }
  
  // 2. 白鍵を押した場合
  const baseNote = noteBase; // 'C', 'D', 'E', etc.
  
  // 調号に含まれる音符かチェック
  const isInKeySignature = keySig.accidentals.includes(baseNote);
  
  if (isInKeySignature) {
    // 調号に含まれる場合、ナチュラルを表示（調号をキャンセル）
    return { showSharp: false, showFlat: false, showNatural: true };
  } else {
    // 調号に含まれない場合、何も表示しない（調号に従う）
    return { showSharp: false, showFlat: false, showNatural: false };
  }
}
```

#### 2.2.2 音符位置取得関数（記号対応版）

```javascript
/**
 * 記号と調性を考慮した音符位置を取得
 * @param {string} noteName - 音符名
 * @param {string} clef - 記号名
 * @returns {number} - 位置（%）
 */
function getNotePosition(noteName, clef = 'treble') {
  const clefConfig = CLEF_CONFIGS[clef];
  const positionMap = clefConfig.notePositionMap;
  
  // 既存のロジックを記号ごとに分離
  // ...
}
```

### 2.3 実装構造

#### 2.3.1 ファイル構成案

```
src/
  components/
    Piano.js (メインコンポーネント)
  config/
    keySignatures.js (調性設定)
    clefConfigs.js (記号設定)
  utils/
    musicNotation.js (判定ロジック)
```

#### 2.3.2 状態管理

```javascript
const [musicConfig, setMusicConfig] = useState({
  clef: 'treble',
  keySignature: 'C',
});
```

### 2.4 拡張ポイント

1. **新しい調性の追加**: `KEY_SIGNATURES`にエントリを追加するだけ
2. **新しい記号の追加**: `CLEF_CONFIGS`にエントリとマッピングを追加
3. **判定ロジックの変更**: `getAccidentalForNote`関数を修正
4. **UI設定**: 設定UIから`musicConfig`を変更可能にする

## 3. 実装優先順位

### Phase 1: 基本構造の実装
1. 設定データの分離（keySignatures.js, clefConfigs.js）
2. 判定ロジックの分離（musicNotation.js）
3. 現在の実装を新しい構造に移行

### Phase 2: 調性対応
1. 主要な調性（C, G, F, D, A, E, B）の実装
2. フラット系調性の実装
3. 短調の実装

### Phase 3: 記号対応
1. ヘ音記号の位置マッピング実装
2. 記号切り替え機能

### Phase 4: UI拡張
1. 調性選択UI
2. 記号選択UI

## 4. 考慮事項

### 4.1 エンハーモニック（異名同音）
- C#とDbは同じ音だが、調性によって表記が異なる
- 黒鍵の表記は調によって決まる：
  - **シャープ系の調**（G, D, A, E, B, F#, C#）: 黒鍵はシャープ表記（C#, D#, F#, G#, A#）
  - **フラット系の調**（F, Bb, Eb, Ab, Db, Gb, Cb）: 黒鍵はフラット表記（Db, Eb, Gb, Ab, Bb）
- 例：同じ黒鍵でも、ト長調では「F#」、ヘ長調では「Gb」と表記されることがあるが、
  通常は調号の体系に合わせて表記する（ト長調ならF#、ヘ長調ならBb）

### 4.2 黒鍵の表記ルール
- 黒鍵を押した場合、調に応じて：
  - その黒鍵が調号に含まれている場合 → ナチュラルを表示（調号をキャンセル）
  - その黒鍵が調号に含まれていない場合 → 調の体系に応じてシャープまたはフラットを表示

### 4.2 オクターブの扱い
- 調号は全オクターブに適用される
- オクターブに関係なく判定する

### 4.3 パフォーマンス
- 設定データは定数として定義し、再計算を避ける
- 判定ロジックは軽量に保つ

