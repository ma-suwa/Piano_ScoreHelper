/**
 * 記号（Clef）設定
 * 各記号ごとの音符位置マッピングを定義
 */

/**
 * ト音記号（Treble Clef）の音符位置マッピング
 */
const TREBLE_CLEF_NOTE_POSITION_MAP = {
  // オクターブ3
  'D3': { lineIndex: 13, isHalfUp: false },
  'E3': { lineIndex: 13, isHalfUp: true },
  'F3': { lineIndex: 12, isHalfUp: false },
  'G3': { lineIndex: 12, isHalfUp: true },
  'A3': { lineIndex: 11, isHalfUp: false },
  'B3': { lineIndex: 11, isHalfUp: true },
  
  // オクターブ4
  'C4': { lineIndex: 10, isHalfUp: false },
  'D4': { lineIndex: 10, isHalfUp: true },
  'E4': { lineIndex: 9, isHalfUp: false },
  'F4': { lineIndex: 9, isHalfUp: true },
  'G4': { lineIndex: 8, isHalfUp: false },
  'A4': { lineIndex: 8, isHalfUp: true },
  'B4': { lineIndex: 7, isHalfUp: false },
  
  // オクターブ5
  'C5': { lineIndex: 7, isHalfUp: true },
  'D5': { lineIndex: 6, isHalfUp: false },
  'E5': { lineIndex: 6, isHalfUp: true },
  'F5': { lineIndex: 5, isHalfUp: false },
  'G5': { lineIndex: 5, isHalfUp: true },
  'A5': { lineIndex: 4, isHalfUp: false },
  'B5': { lineIndex: 4, isHalfUp: true },
  
  // オクターブ6
  'C6': { lineIndex: 3, isHalfUp: false },
  'D6': { lineIndex: 3, isHalfUp: true },
  'E6': { lineIndex: 2, isHalfUp: false },
  'F6': { lineIndex: 2, isHalfUp: true },
  'G6': { lineIndex: 1, isHalfUp: false },
  'A6': { lineIndex: 4, isHalfUp: false },
  'B6': { lineIndex: 4, isHalfUp: true },
  
  // オクターブ7
  'C7': { lineIndex: 3, isHalfUp: false },
  'D7': { lineIndex: 3, isHalfUp: true }, 
  'E7': { lineIndex: 2, isHalfUp: false },
  'F7': { lineIndex: 2, isHalfUp: true },
  'G7': { lineIndex: 1, isHalfUp: false },
  'A7': { lineIndex: 1, isHalfUp: true },
  'B7': { lineIndex: 0, isHalfUp: false },
  
  // オクターブ8
  'C8': { lineIndex: 0, isHalfUp: true },
};

/**
 * ヘ音記号（Bass Clef）の音符位置マッピング
 * ヘ音記号の5本線（index 5-9）の基準は：
 * index 5 = G2, index 6 = B2, index 7 = D3, index 8 = F3, index 9 = A3
 */
const BASS_CLEF_NOTE_POSITION_MAP = {
  // オクターブ0
  'A0': { lineIndex: 12, isHalfUp: true },
  'B0': { lineIndex: 11, isHalfUp: false },
  
  // オクターブ1
  'C1': { lineIndex: 11, isHalfUp: true },
  'D1': { lineIndex: 14, isHalfUp: false },
  'E1': { lineIndex: 14, isHalfUp: true },
  'F1': { lineIndex: 13, isHalfUp: false },
  'G1': { lineIndex: 13, isHalfUp: true },
  'A1': { lineIndex: 12, isHalfUp: false },
  'B1': { lineIndex: 12, isHalfUp: true },
  
  // オクターブ2
  'C2': { lineIndex: 11, isHalfUp: false },
  'D2': { lineIndex: 11, isHalfUp: true },
  'E2': { lineIndex: 10, isHalfUp: false },
  'F2': { lineIndex: 10, isHalfUp: true },
  'G2': { lineIndex: 9, isHalfUp: false }, // ヘ音記号の下から1本目
  'A2': { lineIndex: 9, isHalfUp: true },
  'B2': { lineIndex: 8, isHalfUp: false }, // ヘ音記号の下から2本目
  
  // オクターブ3
  'C3': { lineIndex: 8, isHalfUp: true }, // 下から1本目の下
  'D3': { lineIndex: 7, isHalfUp: false }, // ヘ音記号の下から3本目
  'E3': { lineIndex: 7, isHalfUp: true },
  'F3': { lineIndex: 6, isHalfUp: false }, // ヘ音記号の下から4本目
  'G3': { lineIndex: 6, isHalfUp: true },
  'A3': { lineIndex: 5, isHalfUp: false }, // ヘ音記号の下から5本目
  'B3': { lineIndex: 5, isHalfUp: true },
  
  // オクターブ4
  'C4': { lineIndex: 4, isHalfUp: false }, // 中央C（下から5本目の上）
  'D4': { lineIndex: 4, isHalfUp: true },
  'E4': { lineIndex: 3, isHalfUp: false },
  'F4': { lineIndex: 3, isHalfUp: true },
  'G4': { lineIndex: 2, isHalfUp: false },
  'A4': { lineIndex: 2, isHalfUp: true },
  'B4': { lineIndex: 1, isHalfUp: false },
  

};

export const CLEF_CONFIGS = {
  'treble': {
    name: 'Treble Clef',
    notePositionMap: TREBLE_CLEF_NOTE_POSITION_MAP,
  },
  'bass': {
    name: 'Bass Clef',
    notePositionMap: BASS_CLEF_NOTE_POSITION_MAP,
  },
};

