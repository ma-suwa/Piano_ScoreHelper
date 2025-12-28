import { useEffect } from 'react';
import { PIANO_DIMENSIONS, SCROLL_CONFIG } from '@/config/piano';

/**
 * 初期スクロール位置（C4の中央）を設定するカスタムフック
 * @param {React.RefObject} containerRef - コンテナ要素への参照
 */
export function useInitialScroll(containerRef) {
  useEffect(() => {
    const timer = setTimeout(() => {
      const c4Key = document.querySelector('.C4');
      if (c4Key && containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const keyLeft = c4Key.offsetLeft;
        containerRef.current.scrollLeft =
          keyLeft - containerWidth / 2 + PIANO_DIMENSIONS.WHITE_KEY_WIDTH / 2;
      }
    }, SCROLL_CONFIG.INITIAL_SCROLL_DELAY);

    return () => clearTimeout(timer);
  }, [containerRef]);
}
