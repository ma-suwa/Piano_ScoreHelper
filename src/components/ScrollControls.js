"use client";

import React from 'react';

/**
 * スクロールコントロールボタン
 * @param {Object} props
 * @param {Function} props.onScrollLeft - 左スクロール開始時のコールバック
 * @param {Function} props.onScrollRight - 右スクロール開始時のコールバック
 * @param {Function} props.onScrollStop - スクロール停止時のコールバック
 */
const ScrollControls = ({ onScrollLeft, onScrollRight, onScrollStop }) => {
  const handleLeftStart = (e) => {
    if (e.type === 'touchstart') e.preventDefault();
    onScrollLeft();
  };

  const handleRightStart = (e) => {
    if (e.type === 'touchstart') e.preventDefault();
    onScrollRight();
  };

  const commonHandlers = {
    onMouseUp: onScrollStop,
    onMouseLeave: onScrollStop,
    onTouchEnd: onScrollStop,
    onTouchCancel: onScrollStop,
  };

  return (
    <div id="controls">
      <button
        id="scroll-left"
        className="scroll-btn"
        onMouseDown={handleLeftStart}
        onTouchStart={handleLeftStart}
        {...commonHandlers}
        aria-label="左にスクロール"
      >
        ◀
      </button>
      <span className="label">Position</span>
      <button
        id="scroll-right"
        className="scroll-btn"
        onMouseDown={handleRightStart}
        onTouchStart={handleRightStart}
        {...commonHandlers}
        aria-label="右にスクロール"
      >
        ▶
      </button>
    </div>
  );
};

export default ScrollControls;
