"use client";

import React, { useEffect, useRef, useState } from 'react';
import Key from './Key';

const Piano = () => {
    const containerRef = useRef(null);
    const scrollIntervalRef = useRef(null);
    const [pressedKey, setPressedKey] = useState(null);

    // Constants from original script
    const WHITE_KEY_WIDTH = 40;
    const KEY_MARGIN = 2;
    const TOTAL_KEY_SPACE = WHITE_KEY_WIDTH + KEY_MARGIN;

    // Generate keys data
    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const keys = [];

    let currentOctave = 0;
    let currentNoteIndex = notes.indexOf('A'); // Start from A0
    let whiteKeyCount = 0;

    // We need to generate keys in a loop similar to the original script
    // but instead of appending to DOM, we build an array of data objects
    while (true) {
        const note = notes[currentNoteIndex];
        const isBlack = note.includes('#');

        // Stop condition: C8 (and it's not black)
        if (currentOctave === 8 && note === 'C' && !isBlack) {
            keys.push({ note, octave: currentOctave, isBlack, whiteKeyIndex: whiteKeyCount });
            break;
        } else if (currentOctave === 8 && (notes.indexOf(note) > notes.indexOf('C'))) {
            break;
        }

        keys.push({ note, octave: currentOctave, isBlack, whiteKeyIndex: whiteKeyCount });

        if (!isBlack) {
            whiteKeyCount++;
        }

        currentNoteIndex++;
        if (currentNoteIndex >= notes.length) {
            currentNoteIndex = 0;
            currentOctave++;
        }
    }

    // Scroll Logic
    const startScroll = (direction) => {
        if (scrollIntervalRef.current) return;
        const scrollSpeed = 10;
        const scrollAmount = direction === 'left' ? scrollSpeed : -scrollSpeed;

        const scrollStep = () => {
            if (containerRef.current) {
                containerRef.current.scrollLeft += scrollAmount;
                scrollIntervalRef.current = requestAnimationFrame(scrollStep);
            }
        };
        scrollIntervalRef.current = requestAnimationFrame(scrollStep);
    };

    const stopScroll = () => {
        if (scrollIntervalRef.current) {
            cancelAnimationFrame(scrollIntervalRef.current);
            scrollIntervalRef.current = null;
        }
    };

    // Initial scroll position (center C4)
    useEffect(() => {
        // Allow a small delay for layout to settle
        const timer = setTimeout(() => {
            const c4Key = document.querySelector('.C4'); // We'll add classes to keys
            if (c4Key && containerRef.current) {
                const containerWidth = containerRef.current.clientWidth;
                const keyLeft = c4Key.offsetLeft;
                containerRef.current.scrollLeft = keyLeft - (containerWidth / 2) + (WHITE_KEY_WIDTH / 2);
            }
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    const handleKeyPress = (noteName) => {
        setPressedKey(noteName);
        console.log(`Pressed: ${noteName}`);
    };

    return (
        <>
            <div id="controls">
                <button
                    id="scroll-left"
                    className="scroll-btn"
                    onMouseDown={() => startScroll('left')}
                    onTouchStart={(e) => { e.preventDefault(); startScroll('left'); }}
                    onMouseUp={stopScroll}
                    onMouseLeave={stopScroll}
                    onTouchEnd={stopScroll}
                    onTouchCancel={stopScroll}
                >
                    ◀
                </button>
                <span className="label">Position</span>
                <button
                    id="scroll-right"
                    className="scroll-btn"
                    onMouseDown={() => startScroll('right')}
                    onTouchStart={(e) => { e.preventDefault(); startScroll('right'); }}
                    onMouseUp={stopScroll}
                    onMouseLeave={stopScroll}
                    onTouchEnd={stopScroll}
                    onTouchCancel={stopScroll}
                >
                    ▶
                </button>
            </div>

            {pressedKey && (
                <div style={{
                    position: 'absolute',
                    top: '20px',
                    left: '0px',
                    textAlign: 'left',
                    color: 'white',
                    fontSize: '24px',
                    fontFamily: 'sans-serif',
                    zIndex: 20
                }}>
                    {pressedKey} を押しました
                </div>
            )}

            <div id="piano-container" ref={containerRef}>
                {keys.map((keyData, index) => {
                    const { note, octave, isBlack, whiteKeyIndex } = keyData;
                    const noteName = `${note}${octave}`;
                    let className = `key ${noteName}`;
                    let style = {};

                    if (isBlack) {
                        // Calculate black key classes
                        let flatNoteChar = '';
                        if (note.startsWith('C')) flatNoteChar = 'D';
                        else if (note.startsWith('D')) flatNoteChar = 'E';
                        else if (note.startsWith('F')) flatNoteChar = 'G';
                        else if (note.startsWith('G')) flatNoteChar = 'A';
                        else if (note.startsWith('A')) flatNoteChar = 'B';

                        const flatNoteName = `${flatNoteChar}b${octave}`;
                        const flatNoteNameUnicode = `${flatNoteChar}♭${octave}`;
                        className += ` ${flatNoteName} ${flatNoteNameUnicode} black`;

                        // Calculate position
                        const blackKeyWidth = WHITE_KEY_WIDTH * 0.6;
                        const leftPosition = (whiteKeyIndex * TOTAL_KEY_SPACE) - (blackKeyWidth / 2);

                        style = {
                            left: `${leftPosition}px`,
                            width: `${blackKeyWidth}px`
                        };
                    } else {
                        className += " white";
                    }

                    return (
                        <Key
                            key={noteName}
                            note={note}
                            octave={octave}
                            isBlack={isBlack}
                            className={className}
                            style={style}
                            onPress={() => handleKeyPress(noteName)}
                        />
                    );
                })}
            </div>
        </>
    );
};

export default Piano;
