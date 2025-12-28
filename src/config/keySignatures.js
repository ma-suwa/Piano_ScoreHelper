/**
 * 調性（Key Signature）設定
 * 各調性に応じて、調号（キーシグネチャ）に含まれる音符を定義
 */

export const KEY_SIGNATURES = {
  // 長調（Major Keys） - シャープ系
  'C': { type: 'major', accidentals: [] }, // ハ長調
  'G': { type: 'major', accidentals: ['F'] }, // ト長調（F#）
  'D': { type: 'major', accidentals: ['F', 'C'] }, // ニ長調（F#, C#）
  'A': { type: 'major', accidentals: ['F', 'C', 'G'] }, // イ長調（F#, C#, G#）
  'E': { type: 'major', accidentals: ['F', 'C', 'G', 'D'] }, // ホ長調
  'B': { type: 'major', accidentals: ['F', 'C', 'G', 'D', 'A'] }, // ロ長調
  'F#': { type: 'major', accidentals: ['F', 'C', 'G', 'D', 'A', 'E'] }, // 嬰ヘ長調
  'C#': { type: 'major', accidentals: ['F', 'C', 'G', 'D', 'A', 'E', 'B'] }, // 嬰ハ長調
  
  // 長調（Major Keys） - フラット系
  'F': { type: 'major', accidentals: ['B'], flat: true }, // ヘ長調（Bb）
  'Bb': { type: 'major', accidentals: ['B', 'E'], flat: true }, // 変ロ長調（Bb, Eb）
  'Eb': { type: 'major', accidentals: ['B', 'E', 'A'], flat: true }, // 変ホ長調
  'Ab': { type: 'major', accidentals: ['B', 'E', 'A', 'D'], flat: true }, // 変イ長調
  'Db': { type: 'major', accidentals: ['B', 'E', 'A', 'D', 'G'], flat: true }, // 変ニ長調
  'Gb': { type: 'major', accidentals: ['B', 'E', 'A', 'D', 'G', 'C'], flat: true }, // 変ト長調
  'Cb': { type: 'major', accidentals: ['B', 'E', 'A', 'D', 'G', 'C', 'F'], flat: true }, // 変ハ長調
  
  // 短調（Minor Keys） - シャープ系
  'Am': { type: 'minor', accidentals: [] }, // イ短調
  'Em': { type: 'minor', accidentals: ['F'] }, // ホ短調（F#）
  'Bm': { type: 'minor', accidentals: ['F', 'C'] }, // ロ短調
  'F#m': { type: 'minor', accidentals: ['F', 'C', 'G'] }, // 嬰ヘ短調
  'C#m': { type: 'minor', accidentals: ['F', 'C', 'G', 'D'] }, // 嬰ハ短調
  'G#m': { type: 'minor', accidentals: ['F', 'C', 'G', 'D', 'A'] }, // 嬰ト短調
  'D#m': { type: 'minor', accidentals: ['F', 'C', 'G', 'D', 'A', 'E'] }, // 嬰ニ短調
  
  // 短調（Minor Keys） - フラット系
  'Dm': { type: 'minor', accidentals: ['B'], flat: true }, // ニ短調（Bb）
  'Gm': { type: 'minor', accidentals: ['B', 'E'], flat: true }, // ト短調
  'Cm': { type: 'minor', accidentals: ['B', 'E', 'A'], flat: true }, // ハ短調
  'Fm': { type: 'minor', accidentals: ['B', 'E', 'A', 'D'], flat: true }, // ヘ短調
  'Bbm': { type: 'minor', accidentals: ['B', 'E', 'A', 'D', 'G'], flat: true }, // 変ロ短調
  'Ebm': { type: 'minor', accidentals: ['B', 'E', 'A', 'D', 'G', 'C'], flat: true }, // 変ホ短調
  'Abm': { type: 'minor', accidentals: ['B', 'E', 'A', 'D', 'G', 'C', 'F'], flat: true }, // 変イ短調
};

/**
 * 黒鍵のエンハーモニック（異名同音）マッピング
 * 各黒鍵は、シャープ表記とフラット表記の両方が可能
 */
export const BLACK_KEY_NOTATIONS = {
  'C#': { sharp: 'C', flat: 'D' }, // C# = Db
  'D#': { sharp: 'D', flat: 'E' }, // D# = Eb
  'F#': { sharp: 'F', flat: 'G' }, // F# = Gb
  'G#': { sharp: 'G', flat: 'A' }, // G# = Ab
  'A#': { sharp: 'A', flat: 'B' }, // A# = Bb
};

