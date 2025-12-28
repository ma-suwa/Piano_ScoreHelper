"use client";

import React, { useEffect, useRef, useState } from 'react';
import Key from './Key';
import { getNotePosition, getAccidentalForNote } from '../utils/musicNotation';
import { KEY_SIGNATURES } from '../config/keySignatures';

const Piano = () => {
    const containerRef = useRef(null);
    const scrollIntervalRef = useRef(null);
    const [pressedKey, setPressedKey] = useState(null);
    
    // 音楽設定
    const [musicConfig, setMusicConfig] = useState({
        clef: 'treble', // 'treble' | 'bass'
        keySignature: 'D', // KEY_SIGNATURESのキー
    });
    
    // 利用可能な調性のリスト
    const availableKeySignatures = Object.keys(KEY_SIGNATURES);

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
        const scrollAmount = direction === 'left' ? -scrollSpeed : scrollSpeed;

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

    // 音符位置を取得する関数（utilsからimportしたものを使用）
    const getNotePositionWithClef = (noteName) => {
        return getNotePosition(noteName, musicConfig.clef);
    };

    // 音符の位置から表示すべき線のindexを判定（0-4と10-14の範囲）
    // 実際の楽譜では、音符の位置関係を明確にするために、追加の線（レジャーライン）が表示される
    const getVisibleLines = (notePosition) => {
        if (notePosition === null) return [];
        
        const LINE_HEIGHT_PERCENT = 6.6666666667;
        
        // すべての線（0-14）の中心位置と上端・下端を計算
        const allLineInfo = [];
        for (let i = 0; i <= 14; i++) {
            const center = LINE_HEIGHT_PERCENT * (i + 0.5);
            const halfLine = LINE_HEIGHT_PERCENT / 2;
            allLineInfo.push({
                index: i,
                center: center,
                top: center - halfLine,
                bottom: center + halfLine
            });
        }
        
        // 音符がどの2本の線の間にあるか、またはどの線の上/下にあるかを判定
        let linesToShow = [];
        
        // 音符がどの線の範囲内にあるか、またはどの2本の線の間にあるかを判定
        // 最初は音符が直接関わる線のみを記録（余分な線は後のルールで追加）
        for (let i = 0; i <= 14; i++) {
            const lineInfo = allLineInfo[i];
            // 音符が線の範囲内にあるか（線の上下端の間）
            if (notePosition >= lineInfo.top && notePosition <= lineInfo.bottom) {
                // 音符がこの線の上にある
                linesToShow.push(i);
                break;
            }
        }
        
        // 音符がどの2本の線の間にあるかチェック（線と線の間）
        if (linesToShow.length === 0) {
            for (let i = 0; i < 14; i++) {
                const lowerBottom = allLineInfo[i].bottom;
                const upperTop = allLineInfo[i + 1].top;
                
                // 音符が2本の線の間にある
                if (notePosition > lowerBottom && notePosition < upperTop) {
                    linesToShow.push(i);
                    linesToShow.push(i + 1);
                    break;
                }
            }
        }
        
        // 範囲外の場合
        if (linesToShow.length === 0) {
            if (notePosition < allLineInfo[0].top) {
                linesToShow.push(0);
            } else if (notePosition > allLineInfo[14].bottom) {
                linesToShow.push(14);
                if (14 > 0) {
                    linesToShow.push(14 - 1);
                }
            }
        }
        
        // 下に行くほど線が残るルール：音符の位置から最低のlineIndexを取得
        // 音符の位置がindex[10]以上の線の範囲にある場合、その線から上（index[10]からその線まで）をすべて表示
        let lowestLineIndex = null;
        for (let i = 0; i <= 14; i++) {
            const lineInfo = allLineInfo[i];
            if (notePosition >= lineInfo.top && notePosition <= lineInfo.bottom) {
                // 音符がこの線の上にある
                lowestLineIndex = i;
                break;
            }
        }
        
        // 音符が線の間にある場合
        if (lowestLineIndex === null) {
            for (let i = 0; i < 14; i++) {
                const lowerBottom = allLineInfo[i].bottom;
                const upperTop = allLineInfo[i + 1].top;
                if (notePosition > lowerBottom && notePosition < upperTop) {
                    // 2本の線の間にある場合、下の線（大きいindex）を基準にする
                    lowestLineIndex = i + 1;
                    break;
                }
            }
        }
        
        // 下に行くほど線が残るルール：index[10]以上の線の場合、その線から上（index[10]からその線まで）をすべて表示
        if (lowestLineIndex !== null && lowestLineIndex >= 10) {
            for (let i = 10; i <= lowestLineIndex; i++) {
                if (!linesToShow.includes(i)) {
                    linesToShow.push(i);
                }
            }
        }
        
        // 上に行くほど線が残るルール：index[0]~index[4]の線の場合、その線から下（その線からindex[4]まで）をすべて表示
        if (lowestLineIndex !== null && lowestLineIndex <= 4) {
            for (let i = lowestLineIndex; i <= 4; i++) {
                if (!linesToShow.includes(i)) {
                    linesToShow.push(i);
                }
            }
        }
        
        // 0-4と10-14の範囲のみを返す（中央の5本線は常に表示されている）
        return linesToShow.filter(index => 
            (index >= 0 && index <= 4) || (index >= 10 && index <= 14)
        );
    };

    const handleKeyPress = (noteName) => {
        setPressedKey(noteName);
        console.log(`Pressed: ${noteName}`);
    };

    return (
        <>  
            {pressedKey && (
                <div style={{
                    position: 'relative',
                    top: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    textAlign: 'center',
                    color: 'white',
                    fontSize: '24px',
                    fontFamily: 'sans-serif',
                    zIndex: 20
                }}>
                    {pressedKey} を押しました
                </div>
            )}

            <div id="piano-score" style={{
                marginTop: '20px',
                position: 'relative',
                width: '100%',
                height: '300px',
                textAlign: 'center',
                fontSize: '18px',
                fontFamily: 'sans-serif',
                zIndex: 10
            }}>
                {/* 15個の要素を生成して敷き詰める */}
                {[...Array(15)].map((_, index) => {
                    const notePosition = getNotePositionWithClef(pressedKey);
                    const visibleLines = getVisibleLines(notePosition);
                    const isHiddenLine = (index >= 0 && index <= 4) || (index >= 10 && index <= 14);
                    const shouldShow = isHiddenLine
                        ? visibleLines.includes(index) ? 1 : 0
                        : 1;
                    
                    return (
                        <div key={index} style={{
                            height: '6.6666666667%', // 100% / 15
                            background: 'linear-gradient(to bottom,#000000 0%,#000000 48%,#999 48%,#999 52%,#000000 52%,#000000 100%)',
                            width: isHiddenLine ? '10%' : '100%',
                            margin: '0 auto',
                            opacity: shouldShow
                        }}></div>
                    );
                })}
                {/* 音符を楽譜の線上に配置 */}
                {pressedKey && (() => {
                    const notePosition = getNotePositionWithClef(pressedKey);
                    if (notePosition === null) return null;
                    
                    // 臨時記号の判定
                    const accidental = getAccidentalForNote(pressedKey, musicConfig);
                    
                    return (
                        <>
                            {/* シャープ記号を表示 */}
                            {accidental.showSharp && (
                                <img 
                                    src="/sharp.svg" 
                                    alt="sharp"
                                    style={{
                                        position: 'absolute',
                                        left: 'calc(50% - 25px)', // note.svgの左側に配置
                                        top: `${notePosition}%`,
                                        transform: 'translateY(-50%)',
                                        width: 'auto',
                                        height: '9.45%', // piano-scoreの高さに対する相対サイズ
                                        zIndex: 16
                                    }}
                                />
                            )}
                            {/* フラット記号を表示 */}
                            {accidental.showFlat && (
                                <img 
                                    src="/flat.svg" 
                                    alt="flat"
                                    style={{
                                        position: 'absolute',
                                        left: 'calc(50% - 25px)', // note.svgの左側に配置
                                        top: `${notePosition}%`,
                                        transform: 'translateY(-50%)',
                                        width: 'auto',
                                        height: '9.45%', // piano-scoreの高さに対する相対サイズ
                                        zIndex: 16
                                    }}
                                />
                            )}
                            {/* ナチュラル記号を表示 */}
                            {accidental.showNatural && (
                                <img 
                                    src="/natural.svg" 
                                    alt="natural"
                                    style={{
                                        position: 'absolute',
                                        left: 'calc(50% - 25px)', // note.svgの左側に配置
                                        top: `${notePosition}%`,
                                        transform: 'translateY(-50%)',
                                        width: 'auto',
                                        height: '9.45%', // piano-scoreの高さに対する相対サイズ
                                        zIndex: 16
                                    }}
                                />
                            )}
                            {/* 音符 */}
                            <img 
                                src="/note.svg" 
                                alt="note"
                                style={{
                                    position: 'absolute',
                                    left: '50%',
                                    top: `${notePosition}%`,
                                    transform: 'translate(-50%, -50%)',
                                    width: 'auto',
                                    height: '6.3%', // piano-scoreの高さに対する相対サイズ
                                    zIndex: 15
                                }}
                            />
                        </>
                    );
                })()}
            </div>

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

            {/* 音楽設定 */}
            <div style={{
                display: 'flex',
                gap: '20px',
                marginBottom: '20px',
                alignItems: 'center',
                justifyContent: 'center',
                flexWrap: 'wrap'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <label style={{ color: '#888', fontSize: '12px', fontFamily: 'sans-serif' }}>
                        記号:
                    </label>
                    <select
                        value={musicConfig.clef}
                        onChange={(e) => setMusicConfig({ ...musicConfig, clef: e.target.value })}
                        style={{
                            padding: '8px 12px',
                            backgroundColor: '#333',
                            color: 'white',
                            border: '1px solid #555',
                            borderRadius: '4px',
                            fontSize: '14px',
                            cursor: 'pointer'
                        }}
                    >
                        <option value="treble">ト音記号</option>
                        <option value="bass">ヘ音記号</option>
                    </select>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <label style={{ color: '#888', fontSize: '12px', fontFamily: 'sans-serif' }}>
                        調性:
                    </label>
                    <select
                        value={musicConfig.keySignature}
                        onChange={(e) => setMusicConfig({ ...musicConfig, keySignature: e.target.value })}
                        style={{
                            padding: '8px 12px',
                            backgroundColor: '#333',
                            color: 'white',
                            border: '1px solid #555',
                            borderRadius: '4px',
                            fontSize: '14px',
                            cursor: 'pointer',
                            minWidth: '120px'
                        }}
                    >
                        {availableKeySignatures.map((key) => (
                            <option key={key} value={key}>
                                {key}
                            </option>
                        ))}
                    </select>
                </div>
                <div style={{ color: '#888', fontSize: '12px', fontFamily: 'sans-serif' }}>
                    現在: {musicConfig.clef === 'treble' ? 'ト音記号' : 'ヘ音記号'} / {musicConfig.keySignature}
                </div>
            </div>




            <div id="piano-container" ref={containerRef}>
                {keys.map((keyData, index) => {
                    const { note, octave, isBlack, whiteKeyIndex } = keyData;
                    const noteName = `${note}${octave}`;
                    let className = `key ${noteName}`;
                    let style = {};

                    const isSelected = pressedKey === noteName;

                    // ★追加: Cの白鍵のときだけラベル用のテキストを用意する
                    const label = (note === 'C' && !isBlack) ? noteName : null;

                    if (isBlack) {
                        // ...（中略: 黒鍵の処理はそのまま）
                        let flatNoteChar = '';
                        if (note.startsWith('C')) flatNoteChar = 'D';
                        else if (note.startsWith('D')) flatNoteChar = 'E';
                        else if (note.startsWith('F')) flatNoteChar = 'G';
                        else if (note.startsWith('G')) flatNoteChar = 'A';
                        else if (note.startsWith('A')) flatNoteChar = 'B';

                        const flatNoteName = `${flatNoteChar}b${octave}`;
                        const flatNoteNameUnicode = `${flatNoteChar}♭${octave}`;
                        className += ` ${flatNoteName} ${flatNoteNameUnicode} black`;

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
                            isSelected={isSelected}
                            label={label} /* ★追加: ラベルを渡す */
                        />
                    );
                })}
            </div>
        </>
    );
};

export default Piano;
