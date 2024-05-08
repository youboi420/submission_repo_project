import React, { useEffect, useState } from 'react';
import '../Style/Console.css';

const ConsoleText = ({wordsList}) => {
  const [words, setWords] = useState(  ['Project', 'Goals', 'Actions']);
  const [colors] = useState(['tomato', 'rebeccapurple', 'lightblue']);
  const [letterCount, setLetterCount] = useState(1);
  const [x, setX] = useState(1);
  const [waiting, setWaiting] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setWords(wordsList);
  }, [wordsList])

  useEffect(() => {
    const interval1 = setInterval(() => {
      if (letterCount === 0 && !waiting) {
        setWaiting(true);
        setTimeout(() => {
          const usedColor = colors.shift();
          colors.push(usedColor);
          const usedWord = words.shift();
          words.push(usedWord);
          setX(1);
          setLetterCount(letterCount + x);
          setWaiting(false);
        }, 10);
      } else if (letterCount === words[0].length + 1 && !waiting) {
        setWaiting(true);
        setTimeout(() => {
          setX(-1);
          setLetterCount(letterCount + x);
          setWaiting(false);
        }, 700);
      } else if (!waiting) {
        setLetterCount(letterCount + x);
      }
    }, 120);

    const interval2 = setInterval(() => {
      setVisible((prevVisible) => !prevVisible);
    }, 400);

    return () => {
      clearInterval(interval1);
      clearInterval(interval2);
    };
  }, [letterCount, waiting, x, words, colors]);

  return (
    <div className="console-body">
      <div className="console-container">
        <div className="console-text">
          <span id="text">{words[0].substring(0, letterCount)}</span>
          <div className={visible ? 'console-underscore' : 'console-underscore hidden'}>
            &#95;
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsoleText;
