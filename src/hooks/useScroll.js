import { useEffect, useRef } from 'react';
import { SCROLL_CONFIG } from '@/config/piano';

/**
 * スクロール制御のカスタムフック
 * @returns {Object} スクロール制御の関数
 */
export function useScroll(containerRef) {
  const scrollIntervalRef = useRef(null);

  const startScroll = (direction) => {
    if (scrollIntervalRef.current) return;
    
    const scrollAmount = direction === 'left' ? -SCROLL_CONFIG.SPEED : SCROLL_CONFIG.SPEED;

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

  // クリーンアップ
  useEffect(() => {
    return () => {
      if (scrollIntervalRef.current) {
        cancelAnimationFrame(scrollIntervalRef.current);
      }
    };
  }, []);

  return { startScroll, stopScroll };
}
