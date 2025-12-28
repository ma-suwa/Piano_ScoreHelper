/**
 * ピアノアプリケーションの設定定数
 */

// 鍵盤の寸法
export const PIANO_DIMENSIONS = {
  WHITE_KEY_WIDTH: 40,
  KEY_MARGIN: 2,
  BLACK_KEY_WIDTH_RATIO: 0.6,
  get TOTAL_KEY_SPACE() {
    return this.WHITE_KEY_WIDTH + this.KEY_MARGIN;
  },
};

// スクロール設定
export const SCROLL_CONFIG = {
  SPEED: 10,
  INITIAL_SCROLL_DELAY: 100,
};

// 音符の定義
export const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// ピアノの範囲（A0からC8まで）
export const PIANO_RANGE = {
  START_NOTE: 'A',
  START_OCTAVE: 0,
  END_NOTE: 'C',
  END_OCTAVE: 8,
};

// フラット記号のマッピング
export const FLAT_NOTE_MAP = {
  'C#': 'D',
  'D#': 'E',
  'F#': 'G',
  'G#': 'A',
  'A#': 'B',
};
