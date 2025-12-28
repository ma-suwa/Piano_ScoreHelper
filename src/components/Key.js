"use client";

import React from 'react';

const Key = ({ note, octave, isBlack, className, style, onPress }) => {
    const handleMouseDown = () => {
        onPress();
    };

    const handleTouchStart = (e) => {
        // Prevent default to avoid double firing with mouse events if mixed, 
        // but mainly to prevent scrolling/zooming while playing
        // e.preventDefault(); // Might interfere with scrolling if not careful, but for keys it's usually good.
        // However, the original script had e.preventDefault() on scroll buttons, not keys explicitly for all touch events, 
        // but keys had touchstart.
        // Let's keep it simple.
        onPress();
    };

    return (
        <button
            type="button"
            className={className}
            style={style}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            // We can add active state handling here if needed, but CSS :active works for mouse.
            // For touch, we might need state or the .active class toggle like in the original script.
            // The original script added .active class on mousedown/touchstart and removed on mouseup/touchend etc.
            // React's :active pseudo-class works for mouse, but for touch we might want to simulate it 
            // to ensure the visual feedback is instant and consistent.
            // For now, let's rely on CSS :active and see if it's enough, 
            // or we can implement the class toggling if the user wants exact parity.
            // The original script DID use JS to toggle .active class.
            // Let's implement that for better touch feedback.
            onMouseUp={(e) => e.currentTarget.classList.remove('active')}
            onMouseLeave={(e) => e.currentTarget.classList.remove('active')}
            onTouchEnd={(e) => e.currentTarget.classList.remove('active')}
            onTouchCancel={(e) => e.currentTarget.classList.remove('active')}
            onMouseDownCapture={(e) => e.currentTarget.classList.add('active')}
            onTouchStartCapture={(e) => e.currentTarget.classList.add('active')}
        />
    );
};

export default Key;
