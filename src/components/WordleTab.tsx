import { useState, useEffect } from 'react';
import { Sparkles, AlertCircle, HelpCircle, Trophy, BookOpen } from 'lucide-react';
import { COMMON_WORDS } from '../data/words';
import { solveWordle } from '../utils';

interface WordleTabProps {
  onWordClick: (word: string) => void;
}

export default function WordleTab({ onWordClick }: WordleTabProps) {
  const [mode, setMode] = useState<'solver' | 'game'>('solver');

  // SOLVER STATES
  const [green, setGreen] = useState<string[]>(['', '', '', '', '']);
  const [yellowLetters, setYellowLetters] = useState<string>('');
  const [yellowPositions, setYellowPositions] = useState<string[]>(['', '', '', '', '']);
  const [grayLetters, setGrayLetters] = useState<string>('');
  const [solverSuggestions, setSolverSuggestions] = useState<string[]>([]);

  // GAME STATES
  const [gameSolution, setGameSolution] = useState<string>('');
  const [gameGuesses, setGameGuesses] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState<string>('');
  const [gameStatus, setGameStatus] = useState<'IN_PROGRESS' | 'WON' | 'LOST'>('IN_PROGRESS');
  const [gameError, setGameError] = useState<string>('');

  // 1. SOLVER LOGIC HANDLER - FIXED
  useEffect(() => {
    // Build proper yellow matrix: track which letters are yellow and where they CANNOT go
    const yellowMatrix: string[][] = Array(5).fill(null).map(() => []);

    // Parse yellow positions input (e.g., "L" in position 2 means L cannot be at index 2)
    yellowPositions.forEach((letters, position) => {
      const cleanLetters = letters.toUpperCase().replace(/[^A-Z]/g, '').split('');
      yellowMatrix[position] = cleanLetters;
    });

    // Also handle the general yellow letters input (letters known to be in word but position unknown)
    const generalYellow = yellowLetters.toUpperCase().replace(/[^A-Z]/g, '').split('');
    generalYellow.forEach((letter) => {
      // Add to all positions as "cannot be here" if not already specified
      for (let i = 0; i < 5; i++) {
        if (!yellowMatrix[i].includes(letter)) {
          yellowMatrix[i].push(letter);
        }
      }
    });

    const results = solveWordle(green, yellowMatrix, grayLetters);

    // Ensure general yellow letters are all present in results
    const finalResults = results.filter((word) => {
      return generalYellow.every((letter) => word.includes(letter));
    });

    setSolverSuggestions(finalResults.slice(0, 150));
  }, [green, yellowLetters, yellowPositions, grayLetters]);

  // 2. GAME SETUP HANDLER
  const startNewGame = () => {
    const fileFive = COMMON_WORDS.filter((w) => w.length === 5);
    const randomWord = fileFive[Math.floor(Math.random() * fileFive.length)];
    setGameSolution(randomWord);
    setGameGuesses([]);
    setCurrentInput('');
    setGameStatus('IN_PROGRESS');
    setGameError('');
  };

  useEffect(() => {
    if (mode === 'game' && !gameSolution) {
      startNewGame();
    }
  }, [mode]);

  // Compute live solver suggestions based on played game guesses!
  const getLiveGameSuggestions = (): string[] => {
    if (!gameSolution || gameGuesses.length === 0) {
      return COMMON_WORDS.filter((w) => w.length === 5).slice(0, 50);
    }

    const localGreen = ['', '', '', '', ''];
    const localYellowMatrix: string[][] = Array(5).fill(null).map(() => []);
    const localYellowMatches = new Set<string>();
    const localGray = new Set<string>();

    gameGuesses.forEach((guess) => {
      for (let i = 0; i < 5; i++) {
        const char = guess[i];
        if (gameSolution[i] === char) {
          localGreen[i] = char;
        } else if (gameSolution.includes(char)) {
          localYellowMatches.add(char);
          localYellowMatrix[i].push(char);
        } else {
          localGray.add(char);
        }
      }
    });

    const results = solveWordle(
      localGreen,
      localYellowMatrix,
      Array.from(localGray).join('')
    );

    return results
      .filter((word) => {
        return Array.from(localYellowMatches).every((letter) => word.includes(letter));
      })
      .slice(0, 30);
  };

  const currentLiveSuggestions = getLiveGameSuggestions();

  // On Virtual / Hardware Key Inputs
  const handleGameKeyPress = (key: string) => {
    if (gameStatus !== 'IN_PROGRESS') return;
    setGameError('');

    if (key === 'ENTER') {
      if (currentInput.length !== 5) {
        setGameError('Word must be exactly 5 letters!');
        return;
      }

      const cleanGuess = currentInput.toUpperCase();
      if (!COMMON_WORDS.includes(cleanGuess)) {
        setGameError('Word not found in Scrabble list!');
        return;
      }

      const updated = [...gameGuesses, cleanGuess];
      setGameGuesses(updated);
      setCurrentInput('');

      if (cleanGuess === gameSolution) {
        setGameStatus('WON');
      } else if (updated.length >= 6) {
        setGameStatus('LOST');
      }
    } else if (key === 'BACKSPACE') {
      setCurrentInput(currentInput.slice(0, -1));
    } else {
      if (currentInput.length < 5 && /^[A-Z]$/i.test(key)) {
        setCurrentInput(currentInput + key.toUpperCase());
      }
    }
  };

  // BUG FIX #5: Physical keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (mode !== 'game' || gameStatus !== 'IN_PROGRESS') return;
      const key = e.key.toUpperCase();
      if (key === 'ENTER') {
        e.preventDefault();
        handleGameKeyPress('ENTER');
      } else if (key === 'BACKSPACE' || key === 'DELETE') {
        e.preventDefault();
        handleGameKeyPress('BACKSPACE');
      } else if (/^[A-Z]$/.test(key)) {
        e.preventDefault();
        handleGameKeyPress(key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, gameStatus, currentInput, gameGuesses, gameSolution]);

  // Setup Keyboard click colors based on played tries
  const getLetterKeyStyle = (char: string): string => {
    const uppercaseChar = char.toUpperCase();
    let solvedState: 'green' | 'yellow' | 'gray' | 'none' = 'none';

    for (const guess of gameGuesses) {
      for (let i = 0; i < 5; i++) {
        if (guess[i] === uppercaseChar) {
          if (gameSolution[i] === uppercaseChar) {
            solvedState = 'green';
          } else if (gameSolution.includes(uppercaseChar) && solvedState !== 'green') {
            solvedState = 'yellow';
          } else if (!gameSolution.includes(uppercaseChar) && solvedState === 'none') {
            solvedState = 'gray';
          }
        }
      }
    }

    if (solvedState === 'green') return 'bg-green-600 text-white';
    if (solvedState === 'yellow') return 'bg-yellow-500 text-white';
    if (solvedState === 'gray') return 'bg-slate-400 text-white';
    return 'bg-slate-200 text-slate-800 hover:bg-slate-300';
  };

  // Keyboard Rows
  const keyboardRows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
  ];

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-[#131b2e] leading-snug">
          Wordle Companion
        </h1>
        <p className="text-lg text-[#505f76] italic font-medium">
          The ultimate Wordle training and analysis playground!
        </p>
      </div>

      {/* Mode Selector Toggle */}
      <div className="flex justify-center">
        <div className="bg-[#f2f3ff] p-1.5 rounded-full inline-flex border border-[#e2e7ff]">
          <button
            type="button"
            onClick={() => setMode('solver')}
            className={`px-5 py-2 text-xs font-semibold rounded-full select-none transition-all cursor-pointer ${
              mode === 'solver'
                ? 'bg-[#004ac6] text-white shadow-xs'
                : 'text-[#434655] hover:text-[#004ac6]'
            }`}
          >
            Wordle Solver BOT Helper
          </button>
          <button
            type="button"
            onClick={() => setMode('game')}
            className={`px-5 py-2 text-xs font-semibold rounded-full select-none transition-all cursor-pointer ${
              mode === 'game'
                ? 'bg-[#004ac6] text-white shadow-xs'
                : 'text-[#434655] hover:text-[#004ac6]'
            }`}
          >
            Play Live Wordle Game
          </button>
        </div>
      </div>

      {mode === 'solver' ? (
        /* SOLVER HELPER PANEL */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          {/* Controls Input column */}
          <div className="bg-white border border-[#c3c6d7] rounded-xl p-6 shadow-sm space-y-6">
            <div className="flex items-center space-x-2 text-[#004ac6] border-b border-dashed border-[#e2e8f0] pb-3">
              <Sparkles size={18} />
              <h2 className="text-base font-bold text-[#131b2e]">State Filter Parameters</h2>
            </div>

            {/* Green Positions */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#505f76]">
                Green Letters (Correct Location)
              </label>
              <div className="grid grid-cols-5 gap-2">
                {green.map((val, idx) => (
                  <input
                    key={idx}
                    className="w-full h-12 text-center rounded-lg border border-[#c3c6d7] bg-[#f2f3ff] text-[#004ac6] font-extrabold text-lg uppercase focus:ring-2 focus:ring-[#004ac6] focus:outline-none"
                    type="text"
                    maxLength={1}
                    value={val}
                    onChange={(e) => {
                      const updated = [...green];
                      updated[idx] = e.target.value.toUpperCase();
                      setGreen(updated);
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Yellow Letters (General) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#505f76] mb-1">
                Yellow Letters (Present in word but wrong spot)
              </label>
              <input
                className="w-full h-11 px-3 rounded-lg border border-[#c3c6d7] bg-[#faf8ff] text-[#131b2e] font-bold text-sm tracking-wider uppercase focus:ring-2 focus:ring-[#004ac6] focus:outline-none"
                type="text"
                placeholder="Type present letters (e.g. L, T)"
                value={yellowLetters}
                onChange={(e) => setYellowLetters(e.target.value.toUpperCase())}
              />
            </div>

            {/* Yellow Positions - NEW: Position-specific yellow exclusions */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#505f76]">
                Yellow Letter Positions (Letters known to be wrong at specific spots)
              </label>
              <div className="grid grid-cols-5 gap-2">
                {yellowPositions.map((val, idx) => (
                  <div key={idx} className="text-center">
                    <input
                      className="w-full h-11 text-center rounded-lg border border-[#c3c6d7] bg-[#faf8ff] text-yellow-600 font-bold text-sm uppercase focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                      type="text"
                      maxLength={5}
                      placeholder={`Pos ${idx + 1}`}
                      value={val}
                      onChange={(e) => {
                        const updated = [...yellowPositions];
                        updated[idx] = e.target.value.toUpperCase();
                        setYellowPositions(updated);
                      }}
                    />
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-slate-400">
                Enter letters that are yellow at each position (e.g., if L is yellow in spot 2, type "L" in position 2)
              </p>
            </div>

            {/* Excluded letters */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#505f76] mb-1">
                Gray Letters (Not in Word)
              </label>
              <input
                className="w-full h-11 px-3 rounded-lg border border-[#c3c6d7] bg-[#faf8ff] text-[#131b2e] font-bold text-sm tracking-wider uppercase focus:ring-2 focus:ring-[#004ac6] focus:outline-none"
                type="text"
                placeholder="Type wrong tiles (e.g. S, R, P)"
                value={grayLetters}
                onChange={(e) => setGrayLetters(e.target.value.toUpperCase())}
              />
            </div>

            <button
              type="button"
              onClick={() => {
                setGreen(['', '', '', '', '']);
                setYellowLetters('');
                setYellowPositions(['', '', '', '', '']);
                setGrayLetters('');
              }}
              className="text-xs font-semibold text-slate-500 hover:text-[#004ac6] underline cursor-pointer"
            >
              Reset Filters
            </button>
          </div>

          {/* Solver Suggestions Output Column */}
          <div className="bg-white border border-[#c3c6d7] rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#131b2e] uppercase tracking-wider font-mono border-b border-slate-100 pb-2">
              {solverSuggestions.length} Matching Suggestions
            </h3>

            {solverSuggestions.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-6 text-center">
                No words match these criteria in Scrabble Wordle list.
              </p>
            ) : (
              <div className="max-h-[400px] overflow-y-auto border border-[#e2e8f0] rounded-lg p-3 bg-slate-50 flex flex-wrap gap-2.5">
                {solverSuggestions.map((word) => (
                  <button
                    type="button"
                    key={word}
                    onClick={() => onWordClick(word)}
                    className="bg-white hover:bg-[#e2e7ff] text-[#131b2e] hover:text-[#004ac6] border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider font-mono cursor-pointer transition-colors"
                  >
                    {word}
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>
      ) : (
        /* PLAY INTERACTIVE WORDLE GAME PANEL */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Main game board grid */}
          <div className="lg:col-span-2 bg-white border border-[#c3c6d7] rounded-xl p-6 shadow-sm space-y-6 flex flex-col items-center">
            
            <div className="w-full flex justify-between items-center border-b border-slate-100 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#505f76] flex items-center gap-1">
                <Trophy size={14} className="text-[#004ac6]" /> Play Hard Scrabble Wordle
              </span>
              <button
                type="button"
                onClick={startNewGame}
                className="text-xs font-bold text-[#004ac6] hover:underline cursor-pointer"
              >
                New Random Solution
              </button>
            </div>

            {/* Error notifications */}
            {gameError && (
              <div className="w-full bg-[#ffdad6] text-[#ba1a1a] px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                <AlertCircle size={15} />
                <span>{gameError}</span>
              </div>
            )}

            {/* Game over states */}
            {gameStatus !== 'IN_PROGRESS' && (
              <div
                className={`w-full p-4 rounded-xl text-center space-y-2 border ${
                  gameStatus === 'WON'
                    ? 'bg-[#eeefff] border-[#004ac6] text-[#004ac6]'
                    : 'bg-orange-50 border-orange-200 text-orange-800'
                }`}
              >
                <h3 className="font-extrabold text-sm uppercase font-mono">
                  {gameStatus === 'WON'
                    ? '🎉 Congratulations You Won!'
                    : '💀 Game Over!'}
                </h3>
                <p className="text-xs">
                  The correct solution was:{' '}
                  <span
                    onClick={() => onWordClick(gameSolution)}
                    className="underline font-bold font-mono tracking-wider text-base cursor-pointer hover:text-[#2563eb]"
                  >
                    {gameSolution}
                  </span>
                </p>
                <button
                  type="button"
                  onClick={startNewGame}
                  className="mt-2 bg-[#004ac6] text-white font-bold text-xs px-4 py-2 rounded-lg hover:bg-[#2563eb] cursor-pointer"
                >
                  Play Another Word
                </button>
              </div>
            )}

            {/* Board Row Squares */}
            <div className="space-y-2 my-2 font-mono">
              {Array(6)
                .fill(null)
                .map((_, rowIdx) => {
                  const guess = gameGuesses[rowIdx];
                  const isCurrent = rowIdx === gameGuesses.length;

                  return (
                    <div
                      key={rowIdx}
                      className="grid grid-cols-5 gap-2 w-[260px] md:w-[310px]"
                    >
                      {Array(5)
                        .fill(null)
                        .map((_, colIdx) => {
                          let text = '';
                          let bgClass =
                            'bg-white border-slate-300 text-[#131b2e]';

                          if (guess) {
                            text = guess[colIdx];
                            if (gameSolution[colIdx] === text) {
                              bgClass =
                                'bg-green-600 border-green-600 text-white';
                            } else if (gameSolution.includes(text)) {
                              bgClass =
                                'bg-yellow-500 border-yellow-500 text-white';
                            } else {
                              bgClass =
                                'bg-slate-500 border-slate-500 text-white';
                            }
                          } else if (isCurrent) {
                            text = currentInput[colIdx] || '';
                            bgClass = text
                              ? 'bg-white border-[#004ac6] text-[#131b2e] ring-1 ring-[#004ac6]'
                              : 'bg-white border-slate-300';
                          }

                          return (
                            <div
                              key={colIdx}
                              className={`w-11 h-11 md:w-13 md:h-13 border-2 rounded-lg flex items-center justify-center text-lg md:text-xl font-extrabold ${bgClass} select-none transition-all duration-300`}
                            >
                              {text}
                            </div>
                          );
                        })}
                    </div>
                  );
                })}
            </div>

            {/* Virtual Onboard keyboard */}
            <div className="space-y-1.5 w-full pt-4">
              {keyboardRows.map((row, rowIdx) => (
                <div key={rowIdx} className="flex justify-center gap-1">
                  {row.map((key) => {
                    const isLongKey =
                      key === 'ENTER' || key === 'BACKSPACE';
                    return (
                      <button
                        type="button"
                        key={key}
                        onClick={() => handleGameKeyPress(key)}
                        className={`h-11 font-bold rounded-md select-none text-[10px] md:text-xs cursor-pointer flex items-center justify-center transition-all ${
                          isLongKey ? 'px-2.5 md:px-4' : 'w-7 md:w-9'
                        } ${getLetterKeyStyle(key)}`}
                        style={{ minHeight: '44px' }}
                      >
                        {key === 'BACKSPACE' ? 'DEL' : key}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

          </div>

          {/* AI Companion live Helper Sidebar panel */}
          <div className="bg-white border border-[#c3c6d7] rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex items-center space-x-1 border-b border-slate-100 pb-2">
              <Sparkles size={16} className="text-[#004ac6]" />
              <h2 className="text-sm font-bold text-[#131b2e] uppercase tracking-wider font-mono">
                Live Game Solver Feed
              </h2>
            </div>

            <p className="text-xs text-slate-400 font-medium">
              This analyzer dynamically calculates valid matching answers from
              our Scrabble list based on your played attempts above!
            </p>

            {currentLiveSuggestions.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-4">
                No recommendations. Try starting a game first!
              </p>
            ) : (
              <div className="space-y-2">
                <p className="text-[10px] uppercase font-bold tracking-widest text-[#505f76]">
                  {currentLiveSuggestions.length} Solutions Left
                </p>
                <div className="max-h-[260px] overflow-y-auto border border-[#e2e8f0] rounded-lg p-2.5 bg-slate-50 flex flex-wrap gap-2">
                  {currentLiveSuggestions.map((word) => (
                    <button
                      type="button"
                      key={word}
                      onClick={() => {
                        onWordClick(word);
                      }}
                      className="bg-white hover:bg-[#eeefff] text-xs text-[#131b2e] hover:text-[#004ac6] border border-slate-200 font-semibold font-mono tracking-wider px-2 py-1.5 rounded-md cursor-pointer transition-colors"
                    >
                      {word}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-slate-500 italic">
                  Tip: Click any suggestion to see meanings & Scrabble points.
                </p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* Helpful Instructions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto pt-8 border-t border-[#c3c6d7]">
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-[#004ac6]">
            <HelpCircle size={22} />
            <h2 className="text-lg font-bold text-[#131b2e]">
              How does the Helper filter recommendations?
            </h2>
          </div>
          <p className="text-sm text-[#434655] leading-relaxed">
            By analyzing Green markers (locking letters in exact coordinates),
            Yellow markers (which mean the letter is present in the word, but
            currently placed in a wrong position), and Gray tiles (eliminating
            letters entirely from the solver grid), the engine narrows down
            5-letter options in secondary-level queries.
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-[#004ac6]">
            <HelpCircle size={22} />
            <h2 className="text-lg font-bold text-[#131b2e]">
              Dual Wordle integration
            </h2>
          </div>
          <p className="text-sm text-[#434655] leading-relaxed">
            Toggle between the generic solver and playing independent training
            games. When playing live, the integrated "Solver Feed" evaluates
            played attempts silently, showing how you can solve the board in fewer
            steps!
          </p>
        </div>
      </div>

    </div>
  );
}
