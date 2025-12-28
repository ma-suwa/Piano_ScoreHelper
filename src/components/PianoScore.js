"use client";

import React from 'react';

/**
 * ピアノ楽譜の背景
 * @param {Object} props
 * @param {number} props.lines - 表示する線の数（デフォルト: 15）
 */
const PianoScore = ({ lines = 15 }) => {
  return (
    <div
      id="piano-score"
      style={{
        position: 'relative',
        width: '100%',
        height: '300px',
        textAlign: 'center',
        fontSize: '18px',
        fontFamily: 'sans-serif',
        zIndex: 10,
      }}
    >
      {[...Array(lines)].map((_, index) => (
        <div
          key={index}
          style={{
            height: `${100 / lines}%`,
            background:
              'linear-gradient(to bottom, #000000 0%, #000000 48%, #999 48%, #999 52%, #000000 52%, #000000 100%)',
            width: '100%',
          }}
        />
      ))}
    </div>
  );
};

export default PianoScore;
