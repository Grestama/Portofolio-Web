import { useEffect, useState } from "react";

const KONAMI_CODE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

export function useKonamiCode(callback: () => void) {
  const [inputIndex, setInputIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === KONAMI_CODE[inputIndex]) {
        if (inputIndex === KONAMI_CODE.length - 1) {
          callback();
          setInputIndex(0);
        } else {
          setInputIndex(inputIndex + 1);
        }
      } else {
        // Reset if wrong key, but allow restart if first key matches
        if (e.key === KONAMI_CODE[0]) {
          setInputIndex(1);
        } else {
          setInputIndex(0);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [inputIndex, callback]);
}
