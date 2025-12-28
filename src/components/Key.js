"use client";

import React, { useCallback } from 'react';

/**
 * ピアノの鍵盤コンポーネント
 * @param {Object} props
 * @param {string} props.note - 音名
 * @param {number} props.octave - オクターブ番号
 * @param {boolean} props.isBlack - 黒鍵かどうか
 * @param {string} props.className - CSSクラス名
 * @param {Object} props.style - インラインスタイル
 * @param {Function} props.onPress - 鍵盤が押されたときのコールバック
 * @param {boolean} props.isSelected - 選択されているかどうか
 * @param {string|null} props.label - 表示するラベル（C音のみ）
 */
const Key = ({ note, octave, isBlack, className, style, onPress, isSelected, label }) => {
  // イベントハンドラーをメモ化して最適化
  const handleMouseDown = useCallback(() => {
    onPress();
  }, [onPress]);

  const handleTouchStart = useCallback((e) => {
    e.preventDefault(); // デフォルトのタッチ動作を防止
    onPress();
  }, [onPress]);

  const handleInteractionStart = useCallback((e) => {
    e.currentTarget.classList.add('active');
  }, []);

  const handleInteractionEnd = useCallback((e) => {
    e.currentTarget.classList.remove('active');
  }, []);

  const keyClassName = `${className} ${isSelected ? 'selected' : ''}`;

  return (
    <button
      type="button"
      className={keyClassName}
      style={style}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onMouseUp={handleInteractionEnd}
      onMouseLeave={handleInteractionEnd}
      onTouchEnd={handleInteractionEnd}
      onTouchCancel={handleInteractionEnd}
      onMouseDownCapture={handleInteractionStart}
      onTouchStartCapture={handleInteractionStart}
      aria-label={`${note}${octave}`}
      aria-pressed={isSelected}
    >
      {label && <span className="key-label">{label}</span>}
    </button>
  );
};

export default React.memo(Key);
