"use client";

import React from 'react';

/**
 * 押された鍵盤を表示するコンポーネント
 * @param {Object} props
 * @param {string|null} props.noteName - 押された音名
 */
const PressedKeyDisplay = ({ noteName }) => {
  if (!noteName) return null;

  return (
    <div
      style={{
        position: 'relative',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        color: 'white',
        fontSize: '24px',
        fontFamily: 'sans-serif',
        zIndex: 20,
      }}
    >
      {noteName} を押しました
    </div>
  );
};

export default PressedKeyDisplay;
