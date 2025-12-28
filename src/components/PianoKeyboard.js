"use client";

import React from 'react';
import Key from './Key';
import { PIANO_DIMENSIONS } from '@/config/piano';
import { getFlatNoteName } from '@/utils/pianoKeyGenerator';

/**
 * ピアノ鍵盤のコンテナ
 * @param {Object} props
 * @param {React.RefObject} props.containerRef - コンテナ要素への参照
 * @param {Array} props.keys - 鍵盤データの配列
 * @param {Function} props.onKeyPress - 鍵盤が押されたときのコールバック
 * @param {string|null} props.pressedKey - 現在押されている鍵盤
 */
const PianoKeyboard = ({ containerRef, keys, onKeyPress, pressedKey }) => {
  const { WHITE_KEY_WIDTH, TOTAL_KEY_SPACE, BLACK_KEY_WIDTH_RATIO } = PIANO_DIMENSIONS;

  return (
    <div id="piano-container" ref={containerRef}>
      {keys.map((keyData) => {
        const { note, octave, isBlack, whiteKeyIndex } = keyData;
        const noteName = `${note}${octave}`;
        let className = `key ${noteName}`;
        let style = {};

        const isSelected = pressedKey === noteName;
        const label = note === 'C' && !isBlack ? noteName : null;

        if (isBlack) {
          const flatNoteChar = getFlatNoteName(note);
          const flatNoteName = `${flatNoteChar}b${octave}`;
          const flatNoteNameUnicode = `${flatNoteChar}♭${octave}`;
          className += ` ${flatNoteName} ${flatNoteNameUnicode} black`;

          const blackKeyWidth = WHITE_KEY_WIDTH * BLACK_KEY_WIDTH_RATIO;
          const leftPosition = whiteKeyIndex * TOTAL_KEY_SPACE - blackKeyWidth / 2;

          style = {
            left: `${leftPosition}px`,
            width: `${blackKeyWidth}px`,
          };
        } else {
          className += ' white';
        }

        return (
          <Key
            key={noteName}
            note={note}
            octave={octave}
            isBlack={isBlack}
            className={className}
            style={style}
            onPress={() => onKeyPress(noteName)}
            isSelected={isSelected}
            label={label}
          />
        );
      })}
    </div>
  );
};

export default PianoKeyboard;
