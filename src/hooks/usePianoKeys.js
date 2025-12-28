import { useState, useCallback } from 'react';

/**
 * 鍵盤の状態管理のカスタムフック
 * @returns {Object} 鍵盤の状態と制御関数
 */
export function usePianoKeys() {
  const [pressedKey, setPressedKey] = useState(null);

  const handleKeyPress = useCallback((noteName) => {
    setPressedKey(noteName);
    console.log(`Pressed: ${noteName}`);
  }, []);

  return { pressedKey, handleKeyPress };
}
