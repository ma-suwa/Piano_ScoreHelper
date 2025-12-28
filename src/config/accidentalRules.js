/**
 * 臨時記号判定ルール（仕様書に基づく）
 */

// シャープ系の調のテーブル（仕様書に基づく）
// 列: 0=C/Am, 1=G/Em, 2=D/Bm, 3=A/F#m, 4=E/C#m, 5=B/G#m, 6=F#/D#m, 7=C#/A#m
const SHARP_KEY_TABLE = {
  'C_natural':  { '0': 'NONE', '1': 'NONE', '2': 'NATURAL', '3': 'NATURAL', '4': 'NATURAL', '5': 'NATURAL', '6': 'NATURAL', '7': 'SHARP' }, // ★1はSHARPとして扱う
  'C_sharp':    { '0': 'SHARP', '1': 'SHARP', '2': 'NONE', '3': 'NONE', '4': 'NONE', '5': 'NONE', '6': 'NONE', '7': 'NONE' },
  'D_natural':  { '0': 'NONE', '1': 'NONE', '2': 'NONE', '3': 'NONE', '4': 'NONE', '5': 'NONE', '6': 'NONE', '7': 'NATURAL' },
  'D_sharp':    { '0': 'SHARP', '1': 'SHARP', '2': 'SHARP', '3': 'SHARP', '4': 'SHARP', '5': 'SHARP', '6': 'NONE', '7': 'NONE' },
  'E_natural':  { '0': 'NONE', '1': 'NONE', '2': 'NONE', '3': 'NONE', '4': 'NONE', '5': 'NONE', '6': 'SHARP', '7': 'SHARP' }, // ★2はSHARPとして扱う
  'F_natural':  { '0': 'NONE', '1': 'NATURAL', '2': 'NATURAL', '3': 'NATURAL', '4': 'NATURAL', '5': 'NATURAL', '6': 'NATURAL', '7': 'NATURAL' }, // ★1はNATURALとして扱う
  'F_sharp':    { '0': 'SHARP', '1': 'NONE', '2': 'NONE', '3': 'NONE', '4': 'NONE', '5': 'NONE', '6': 'NONE', '7': 'NONE' },
  'G_natural':  { '0': 'NONE', '1': 'NONE', '2': 'NONE', '3': 'NATURAL', '4': 'NATURAL', '5': 'NATURAL', '6': 'NATURAL', '7': 'NATURAL' },
  'G_sharp':    { '0': 'SHARP', '1': 'SHARP', '2': 'SHARP', '3': 'NONE', '4': 'NONE', '5': 'NONE', '6': 'NONE', '7': 'NONE' },
  'A_natural':  { '0': 'NONE', '1': 'NONE', '2': 'NONE', '3': 'NONE', '4': 'NONE', '5': 'NONE', '6': 'NONE', '7': 'NATURAL' },
  'A_sharp':    { '0': 'SHARP', '1': 'SHARP', '2': 'SHARP', '3': 'SHARP', '4': 'SHARP', '5': 'NONE', '6': 'NONE', '7': 'NONE' },
  'B_natural':  { '0': 'NONE', '1': 'NONE', '2': 'NONE', '3': 'NONE', '4': 'NONE', '5': 'NONE', '6': 'NONE', '7': 'NATURAL' }, // ★1はNATURALとして扱う
};

// フラット系の調のテーブル（仕様書に基づく）
// 列: 1=F/Dm, 2=Bb/Gm, 3=Eb/Cm, 4=Ab/Fm, 5=Db/Bbm, 6=Gb/Ebm, 7=Cb/Abm
const FLAT_KEY_TABLE = {
  'C_natural':  { '1': 'NONE', '2': 'NONE', '3': 'NONE', '4': 'NONE', '5': 'NONE', '6': 'NATURAL', '7': 'FLAT' }, // ★3はFLATとして扱う
  'D_flat':     { '1': 'FLAT', '2': 'FLAT', '3': 'FLAT', '4': 'FLAT', '5': 'NONE', '6': 'NONE', '7': 'NONE' },
  'D_natural':  { '1': 'NONE', '2': 'NONE', '3': 'NONE', '4': 'NATURAL', '5': 'NATURAL', '6': 'NATURAL', '7': 'NATURAL' },
  'E_flat':     { '1': 'FLAT', '2': 'NONE', '3': 'NONE', '4': 'NONE', '5': 'NONE', '6': 'NONE', '7': 'NONE' },
  'E_natural':  { '1': 'NONE', '2': 'NATURAL', '3': 'NATURAL', '4': 'NATURAL', '5': 'NATURAL', '6': 'NATURAL', '7': 'NATURAL' },
  'F_natural':  { '1': 'NONE', '2': 'NONE', '3': 'NONE', '4': 'NONE', '5': 'NONE', '6': 'NONE', '7': 'FLAT' }, // ★3はFLATとして扱う
  'G_flat':     { '1': 'FLAT', '2': 'FLAT', '3': 'FLAT', '4': 'FLAT', '5': 'FLAT', '6': 'NONE', '7': 'NONE' },
  'G_natural':  { '1': 'NONE', '2': 'NONE', '3': 'NONE', '4': 'NONE', '5': 'NATURAL', '6': 'NATURAL', '7': 'NATURAL' },
  'A_flat':     { '1': 'FLAT', '2': 'FLAT', '3': 'NONE', '4': 'NONE', '5': 'NONE', '6': 'NONE', '7': 'NONE' },
  'A_natural':  { '1': 'NONE', '2': 'NONE', '3': 'NATURAL', '4': 'NATURAL', '5': 'NATURAL', '6': 'NATURAL', '7': 'NATURAL' },
  'B_flat':     { '1': 'NONE', '2': 'NONE', '3': 'NONE', '4': 'NONE', '5': 'NONE', '6': 'NONE', '7': 'NONE' },
  'B_natural':  { '1': 'NATURAL', '2': 'NATURAL', '3': 'NATURAL', '4': 'NATURAL', '5': 'NATURAL', '6': 'NATURAL', '7': 'FLAT' }, // ★3はFLATとして扱う
};

/**
 * 調号からシャープ/フラットの数を取得
 * @param {object} keySig - KEY_SIGNATURESのエントリ
 * @returns {number} - シャープ/フラットの数
 */
export function getAccidentalCount(keySig) {
  if (!keySig) return 0;
  return keySig.accidentals ? keySig.accidentals.length : 0;
}

/**
 * 物理キー名をテーブルのキー形式に変換
 * @param {string} noteBase - 音符の基本名（例: 'C', 'C#', 'D'）
 * @param {boolean} isFlatKey - フラット系の調かどうか
 * @returns {string} - テーブルのキー（例: 'C_natural', 'C_sharp', 'D_flat'）
 */
function getTableKey(noteBase, isFlatKey) {
  if (noteBase.includes('#')) {
    // シャープが含まれる場合
    if (isFlatKey) {
      // フラット系の調では、黒鍵はフラット表記になる
      // C# -> Db, D# -> Eb, F# -> Gb, G# -> Ab, A# -> Bb
      const flatMap = {
        'C#': 'D_flat',
        'D#': 'E_flat',
        'F#': 'G_flat',
        'G#': 'A_flat',
        'A#': 'B_flat',
      };
      return flatMap[noteBase] || `${noteBase.replace('#', '')}_sharp`;
    } else {
      // シャープ系の調では、黒鍵はシャープ表記
      return `${noteBase.replace('#', '')}_sharp`;
    }
  } else {
    // 白鍵
    return `${noteBase}_natural`;
  }
}

/**
 * 仕様書に基づく臨時記号判定
 * @param {string} pressedNote - 押された鍵盤名（例: 'C4', 'C#4'）
 * @param {object} config - 現在の設定 { clef: string, keySignature: string }
 * @param {object} keySig - KEY_SIGNATURESのエントリ
 * @returns {object} - { showSharp: boolean, showFlat: boolean, showNatural: boolean }
 */
export function getAccidentalFromTable(pressedNote, config, keySig) {
  if (!pressedNote || !keySig) {
    return { showSharp: false, showFlat: false, showNatural: false };
  }

  const isFlatKey = keySig.flat === true;
  
  // 音符の基本名を抽出
  const noteBase = pressedNote.match(/^([CDEFGAB]#?)/)?.[1];
  if (!noteBase) {
    return { showSharp: false, showFlat: false, showNatural: false };
  }

  // テーブルのキーを取得
  const tableKey = getTableKey(noteBase, isFlatKey);
  
  // シャープ/フラットの数を取得
  const accidentalCount = getAccidentalCount(keySig);
  const countKey = accidentalCount.toString();

  let result;
  if (isFlatKey) {
    // フラット系の調
    // テーブルに存在する場合のみ参照
    if (FLAT_KEY_TABLE[tableKey] && FLAT_KEY_TABLE[tableKey][countKey]) {
      result = FLAT_KEY_TABLE[tableKey][countKey];
    } else {
      // テーブルに存在しない場合はデフォルト（黒鍵ならフラット、白鍵ならNONE）
      if (pressedNote.includes('#')) {
        result = 'FLAT';
      } else {
        result = 'NONE';
      }
    }
  } else {
    // シャープ系の調（C Major = 0 sharp を含む）
    result = SHARP_KEY_TABLE[tableKey]?.[countKey] || 'NONE';
  }

  // 結果を返り値の形式に変換
  return {
    showSharp: result === 'SHARP',
    showFlat: result === 'FLAT',
    showNatural: result === 'NATURAL',
  };
}

