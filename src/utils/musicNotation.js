/**
 * 楽譜表記関連のユーティリティ関数
 */

import { KEY_SIGNATURES, BLACK_KEY_NOTATIONS } from '../config/keySignatures';
import { CLEF_CONFIGS } from '../config/clefConfigs';

const LINE_HEIGHT_PERCENT = 6.6666666667;

/**
 * 音符名から音符の基本名（C, D, E, etc.）を抽出
 * @param {string} noteName - 音符名（例: 'C4', 'C#4'）
 * @returns {string} - 基本名（例: 'C', 'C#'）
 */
export function extractNoteBase(noteName) {
  if (!noteName) return null;
  const match = noteName.match(/^([CDEFGAB]#?)/);
  return match ? match[1] : null;
}

/**
 * 音符名からオクターブを抽出
 * @param {string} noteName - 音符名（例: 'C4', 'C#4'）
 * @returns {number} - オクターブ（例: 4）
 */
export function extractOctave(noteName) {
  if (!noteName) return null;
  const match = noteName.match(/(\d+)$/);
  return match ? parseInt(match[1], 10) : null;
}

/**
 * 押された鍵盤に対して、表示すべき臨時記号を判定
 * @param {string} pressedNote - 押された鍵盤名（例: 'C4', 'C#4'）
 * @param {object} config - 現在の設定 { clef: string, keySignature: string }
 * @returns {object} - { showSharp: boolean, showFlat: boolean, showNatural: boolean }
 */
export function getAccidentalForNote(pressedNote, config) {
  if (!pressedNote || !config) {
    return { showSharp: false, showFlat: false, showNatural: false };
  }

  const keySig = KEY_SIGNATURES[config.keySignature];
  if (!keySig) {
    // 調性が設定されていない場合のデフォルト動作
    // 黒鍵ならシャープ、白鍵なら何も表示しない
    if (pressedNote.includes('#')) {
      return { showSharp: true, showFlat: false, showNatural: false };
    }
    return { showSharp: false, showFlat: false, showNatural: false };
  }

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
      // シャープ系の調
      const sharpNote = blackKeyNotation.sharp; // 'C#' → 'C', 'F#' → 'F'
      const isInKeySignature = keySig.accidentals.includes(sharpNote);
      
      if (isInKeySignature) {
        // 調号に含まれる黒鍵を押した場合、何も表示しない（調号に従う）
        // 例: ニ長調でC4#を押した場合 → 何も表示しない（調号のC#なので）
        // 例: ニ長調でF4#を押した場合 → 何も表示しない（調号のF#なので）
        return { showSharp: false, showFlat: false, showNatural: false };
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
    // 調号に含まれる白鍵を押した場合
    // 特殊ルール: Fのみ、調号に含まれている場合にフラットを表示
    // それ以外（C, G, D, A, E, B）は何も表示しない
    // 例: ニ長調でF4を押した場合 → フラット表示（F#をキャンセル）
    // 例: ニ長調でC4を押した場合 → 何も表示しない
    if (baseNote === 'F') {
      return { showSharp: false, showFlat: true, showNatural: false };
    }
    // それ以外の調号に含まれる白鍵は何も表示しない
    return { showSharp: false, showFlat: false, showNatural: false };
  } else {
    // 調号に含まれない場合、何も表示しない（調号に従う）
    return { showSharp: false, showFlat: false, showNatural: false };
  }
}

/**
 * 記号と調性を考慮した音符位置を取得
 * @param {string} noteName - 音符名（例: 'C4', 'C#4'）
 * @param {string} clef - 記号名（'treble' | 'bass'）
 * @returns {number|null} - 位置（%）またはnull
 */
export function getNotePosition(noteName, clef = 'treble') {
  if (!noteName) return null;

  // 黒鍵（#を含む）の場合は対応する白鍵の位置を返す
  if (noteName.includes('#')) {
    const whiteKeyName = noteName.replace('#', '');
    return getNotePosition(whiteKeyName, clef);
  }

  // 白鍵の形式（C0-C8, D0-D8, ...）を検証
  if (!/^[CDEFGAB]\d+$/.test(noteName)) return null;

  const clefConfig = CLEF_CONFIGS[clef];
  if (!clefConfig) return null;

  const notePositionMap = clefConfig.notePositionMap;

  // 音符名から位置を取得
  const notePos = notePositionMap[noteName];
  if (!notePos) return null;

  const { lineIndex, isHalfUp } = notePos;

  // 線の中心位置を計算
  const lineCenter = LINE_HEIGHT_PERCENT * (lineIndex + 0.5);

  // 「半分上」の場合はLINE_HEIGHT_PERCENT / 2だけ上（%が小さい方向）
  const calculatedPosition = isHalfUp 
    ? lineCenter - (LINE_HEIGHT_PERCENT / 2)
    : lineCenter;

  return Math.max(0, Math.min(100, calculatedPosition)); // 0-100%の範囲に制限
}

