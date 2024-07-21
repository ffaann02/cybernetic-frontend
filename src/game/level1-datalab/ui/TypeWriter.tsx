import { useState, useEffect } from 'react';

const TypeWriter = ({ text, delay, infinite = false, clearText = false }) => {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    let timeout;

    if (clearText) {
      // Clear the text if clearText is true
      setCurrentText('');
      setCurrentIndex(0);
    } else if (currentIndex < text.length) {
      timeout = setTimeout(() => {
        setCurrentText(prevText => prevText + text[currentIndex]);
        setCurrentIndex(prevIndex => prevIndex + 1);
      }, delay);
    } else if (infinite) {
      timeout = setTimeout(() => {
        setCurrentIndex(0);
        setCurrentText('');
      }, delay);
    }

    return () => clearTimeout(timeout);
  }, [currentIndex, delay, infinite, text, clearText]);

  return <span>{currentText}</span>;
};

export default TypeWriter;
