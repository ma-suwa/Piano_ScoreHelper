"use client";

import React, { useRef, useMemo } from 'react';
import PressedKeyDisplay from './PressedKeyDisplay';
import PianoScore from './PianoScore';
import ScrollControls from './ScrollControls';
import PianoKeyboard from './PianoKeyboard';
import { generatePianoKeys } from '@/utils/pianoKeyGenerator';
import { useScroll } from '@/hooks/useScroll';
import { useInitialScroll } from '@/hooks/useInitialScroll';
import { usePianoKeys } from '@/hooks/usePianoKeys';

/**
 * ピアノコンポーネント
 * 88鍵ピアノのメインコンポーネント
 */
const Piano = () => {
  const containerRef = useRef(null);
  
  // カスタムフックで状態とロジックを管理
  const { pressedKey, handleKeyPress } = usePianoKeys();
  const { startScroll, stopScroll } = useScroll(containerRef);
  
  // 鍵盤データを生成（メモ化して再計算を防ぐ）
  const keys = useMemo(() => generatePianoKeys(), []);

  // 初期スクロール位置を設定
  useInitialScroll(containerRef);

  return (
    <>
      <PressedKeyDisplay noteName={pressedKey} />
      <PianoScore lines={15} />
      <ScrollControls
        onScrollLeft={() => startScroll('left')}
        onScrollRight={() => startScroll('right')}
        onScrollStop={stopScroll}
      />
      <PianoKeyboard
        containerRef={containerRef}
        keys={keys}
        onKeyPress={handleKeyPress}
        pressedKey={pressedKey}
      />
    </>
  );
};

export default Piano;
