"use client";

import React from 'react';

// 引数に label を追加
const Key = ({ note, octave, isBlack, className, style, onPress, isSelected, label }) => {
    const handleMouseDown = () => {
        onPress();
    };

    const handleTouchStart = (e) => {
        onPress();
    };

    return (
        <button
            type="button"
            className={`${className} ${isSelected ? 'selected' : ''}`}
            style={style}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onMouseUp={(e) => e.currentTarget.classList.remove('active')}
            onMouseLeave={(e) => e.currentTarget.classList.remove('active')}
            onTouchEnd={(e) => e.currentTarget.classList.remove('active')}
            onTouchCancel={(e) => e.currentTarget.classList.remove('active')}
            onMouseDownCapture={(e) => e.currentTarget.classList.add('active')}
            onTouchStartCapture={(e) => e.currentTarget.classList.add('active')}
        >
            {/* ★追加: ラベルがあれば表示する */}
            {label && <span className="key-label">{label}</span>}
        </button>
    );
};

export default Key;