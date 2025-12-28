import { NOTES, PIANO_RANGE } from '@/config/piano';

/**
 * ピアノキーのデータを生成
 * @returns {Array<{note: string, octave: number, isBlack: boolean, whiteKeyIndex: number}>}
 */
export function generatePianoKeys() {
  const keys = [];
  let currentOctave = PIANO_RANGE.START_OCTAVE;
  let currentNoteIndex = NOTES.indexOf(PIANO_RANGE.START_NOTE);
  let whiteKeyCount = 0;

  while (true) {
    const note = NOTES[currentNoteIndex];
    const isBlack = note.includes('#');

    // 終了条件: C8に到達
    if (currentOctave === PIANO_RANGE.END_OCTAVE && note === PIANO_RANGE.END_NOTE && !isBlack) {
      keys.push({ note, octave: currentOctave, isBlack, whiteKeyIndex: whiteKeyCount });
      break;
    } else if (
      currentOctave === PIANO_RANGE.END_OCTAVE &&
      NOTES.indexOf(note) > NOTES.indexOf(PIANO_RANGE.END_NOTE)
    ) {
      break;
    }

    keys.push({ note, octave: currentOctave, isBlack, whiteKeyIndex: whiteKeyCount });

    if (!isBlack) {
      whiteKeyCount++;
    }

    currentNoteIndex++;
    if (currentNoteIndex >= NOTES.length) {
      currentNoteIndex = 0;
      currentOctave++;
    }
  }

  return keys;
}

/**
 * フラット記号の音名を取得
 * @param {string} sharpNote - シャープ記号を含む音名（例: "C#"）
 * @returns {string} - フラット記号の音名（例: "Db"）
 */
export function getFlatNoteName(sharpNote) {
  const flatNoteMap = {
    'C#': 'D',
    'D#': 'E',
    'F#': 'G',
    'G#': 'A',
    'A#': 'B',
  };
  return flatNoteMap[sharpNote] || '';
}
