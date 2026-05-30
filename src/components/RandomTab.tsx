import { useState, useEffect, FormEvent } from 'react';
import { HelpCircle, RefreshCw, Sparkles, Award, Lightbulb, Play, Shuffle } from 'lucide-react';
import { COMMON_WORDS, getScrabblePoints, getLocalDefinition } from '../data/words';

interface RandomTabProps {
  onWordClick: (word: string) => void;
  onExploreLetters: (letters: string) => void;
}

export default function RandomTab({ onWordClick, onExploreLetters }: RandomTabProps) {
  // RANDOM WORD OF THE MOMENT STATE
  const [randomWord, setRandomWord] = useState<string>('');
  const [definition, setDefinition] = useState<string>('');
  const [partOfSpeech, setPartOfSpeech] = useState<string>('');

  // DAILY SCRAMBLE GAME STATES
  const [scrambleTarget, setScrambleTarget] = useState<string>('');
  const [scrambledLetters, setScrambledLetters] = useState<string[]>([]);
  const [userGuess, setUserGuess] = useState<string>('');
  const [gameFeedback, setGameFeedback] = useState<{ status: 'IDLE' | 'CORRECT' | 'WRONG'; text: string }>({
    status: 'IDLE',
    text: '',
  });
  const [showHint, setShowHint] = useState<boolean>(false);
  const [gameStreak, setGameStreak] = useState<number>(0);

  // Pick Random Word
  const generateRandomWord = () => {
    // Pick word of length 5-10
    const filterWords = COMMON_WORDS.filter(w => w.length >= 5 && w.length <= 10);
    const word = filterWords[Math.floor(Math.random() * filterWords.length)];
    setRandomWord(word);

    const lookup = getLocalDefinition(word);
    if (lookup) {
      setDefinition(lookup.definition);
      setPartOfSpeech(lookup.partOfSpeech);
    } else {
      setDefinition(`A fantastic Scrabble-certified word scoring ${getScrabblePoints(word)} points.`);
      setPartOfSpeech('Noun/Word');
    }
  };

  // Setup/Start Scramble Puzzle
  const startNewScramble = () => {
    const filterWords = COMMON_WORDS.filter(w => w.length >= 4 && w.length <= 7);
    const target = filterWords[Math.floor(Math.random() * filterWords.length)];
    setScrambleTarget(target);
    setUserGuess('');
    setGameFeedback({ status: 'IDLE', text: '' });
    setShowHint(false);

    // Scramble letters
    const letters = target.split('');
    // Fisher Yates scramble Shuffle
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    // Handle edge case where scramble is identical to solve
    if (letters.join('') === target && letters.length > 1) {
      [letters[0], letters[1]] = [letters[1], letters[0]];
    }
    setScrambledLetters(letters);
  };

  useEffect(() => {
    generateRandomWord();
    startNewScramble();
  }, []);

  const handleGuessSubmit = (e: FormEvent) => {
    e.preventDefault();
    const cleanGuess = userGuess.toUpperCase().trim();
    if (!cleanGuess) return;

    if (cleanGuess === scrambleTarget) {
      setGameFeedback({ status: 'CORRECT', text: '🎉 Awesome! That is the correct word!' });
      setGameStreak(gameStreak + 1);
    } else if (COMMON_WORDS.includes(cleanGuess) && cleanGuess.length === scrambleTarget.length) {
      // Valid word but not target
      setGameFeedback({
        status: 'CORRECT',
        text: `💡 Hey! "${cleanGuess}" is a valid word but not the specific one scrambled. Good vocabulary!`,
      });
      setGameStreak(gameStreak + 1);
    } else {
      setGameFeedback({ status: 'WRONG', text: '❌ Not quite! Review the letters and try again.' });
    }
  };

  const handleReveal = () => {
    setGameFeedback({
      status: 'WRONG',
      text: `The word was: ${scrambleTarget.toUpperCase()}`,
    });
    setGameStreak(0);
  };

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-[#131b2e] leading-snug">
          Vocabulary Training Gym
        </h1>
        <p className="text-lg text-[#505f76] italic font-medium">
          Daily vocabulary generator and anagram word search training.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        
        {/* Left Side: Word of the moment card */}
        <div className="bg-white border border-[#c3c6d7] rounded-xl p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-dashed border-[#e2e8f0] pb-3">
            <div className="flex items-center space-x-2 text-[#004ac6]">
              <Sparkles size={20} />
              <h2 className="text-base font-bold text-[#131b2e]">Word of the Day</h2>
            </div>
            <button
              onClick={generateRandomWord}
              className="text-[#004ac6] hover:text-[#2563eb] hover:bg-[#f2f3ff] p-1.5 rounded-full transition-colors cursor-pointer flex items-center gap-1 text-xs font-semibold"
            >
              <RefreshCw size={14} />
              <span>Next</span>
            </button>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <h3
                onClick={() => onWordClick(randomWord)}
                className="text-2xl font-extrabold text-[#1a0dab] hover:underline hover:text-[#004ac6] cursor-pointer tracking-wide uppercase font-serif"
              >
                {randomWord}
              </h3>
              
              <div className="flex flex-wrap gap-2 text-xs font-bold">
                <span className="bg-[#f2f3ff] text-[#004ac6] px-2 py-0.5 rounded-full uppercase">
                  {partOfSpeech}
                </span>
                <span className="bg-[#ffede6] text-[#943700] px-2.5 py-0.5 rounded-full flex items-center gap-1 font-mono">
                  <Award size={13} /> {getScrabblePoints(randomWord)} PTS
                </span>
              </div>
            </div>

            <div className="bg-[#faf8ff] p-4 rounded-lg border border-[#e2e7ff]">
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest text-[10px] mb-1 font-mono">
                Definition
              </p>
              <p className="text-sm text-[#131b2e] leading-relaxed">
                {definition}
              </p>
            </div>

            {/* Links integration */}
            <div className="pt-2">
              <button
                onClick={() => onExploreLetters(randomWord)}
                className="text-xs text-[#004ac6] hover:underline font-bold"
              >
                Explore subsets of "{randomWord}" on Home tab →
              </button>
            </div>
          </div>

        </div>

        {/* Right Side: Playable Word Scramble game */}
        <div className="bg-white border border-[#c3c6d7] rounded-xl p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-dashed border-[#e2e8f0] pb-3">
            <div className="flex items-center space-x-2 text-[#004ac6]">
              <Shuffle size={20} />
              <h2 className="text-base font-bold text-[#131b2e] uppercase font-mono">
                Word Scramble Training
              </h2>
            </div>
            
            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase font-mono mr-1">
                Streak:
              </span>
              <span className="bg-[#eeefff] text-[#004ac6] font-extrabold font-mono text-sm px-2 py-1 rounded">
                {gameStreak}
              </span>
            </div>
          </div>

          <div className="space-y-4 text-center">
            <p className="text-xs text-[#505f76] font-semibold uppercase tracking-wider">
              Scrambled Tiles:
            </p>
            
            {/* Visual scrambled letter blocks */}
            <div className="flex justify-center gap-2 font-mono">
              {scrambledLetters.map((letter, idx) => (
                <div
                  key={idx}
                  className="w-10 h-10 md:w-12 md:h-12 bg-[#004ac6] text-white rounded-lg flex items-center justify-center font-extrabold text-lg md:text-xl shadow-sm tracking-wide select-none transform rotate-2 hover:rotate-0 hover:scale-105 transition-all"
                >
                  {letter}
                </div>
              ))}
            </div>

            {/* Answer Feed Input Form */}
            <form onSubmit={handleGuessSubmit} className="space-y-4 pt-2">
              <div className="flex gap-2 max-w-sm mx-auto">
                <input
                  className="flex-grow h-11 px-3 text-center uppercase tracking-wider rounded-lg border border-[#c3c6d7] bg-[#faf8ff] text-[#131b2e] font-extrabold text-base focus:ring-2 focus:ring-[#004ac6] focus:outline-none"
                  type="text"
                  placeholder="Guess Scrambled Word"
                  value={userGuess}
                  onChange={(e) => setUserGuess(e.target.value)}
                />
                <button
                  type="submit"
                  className="px-5 h-11 bg-[#004ac6] hover:bg-[#2563eb] text-white font-bold rounded-lg text-sm transition-colors cursor-pointer shadow-sm active:scale-95"
                >
                  Check
                </button>
              </div>

              {gameFeedback.text && (
                <p className={`text-xs font-bold ${
                  gameFeedback.status === 'CORRECT' ? 'text-green-600' : 'text-[#ba1a1a]'
                }`}>
                  {gameFeedback.text}
                </p>
              )}

              {/* Advanced hints */}
              <div className="flex justify-center gap-4 text-xs font-bold pt-1">
                <button
                  type="button"
                  onClick={() => setShowHint(true)}
                  className="text-[#004ac6] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Lightbulb size={13} />
                  <span>Reveal Hint</span>
                </button>
                <button
                  type="button"
                  onClick={handleReveal}
                  className="text-slate-500 hover:underline cursor-pointer"
                >
                  Give Up / Reveal
                </button>
                <button
                  type="button"
                  onClick={startNewScramble}
                  className="text-[#004ac6] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Play size={13} />
                  <span>Next Scramble →</span>
                </button>
              </div>

              {showHint && scrambleTarget && (
                <div className="p-3 bg-slate-50 rounded-lg text-xs leading-relaxed text-slate-600 animate-slide-up max-w-sm mx-auto border border-dashed border-slate-200 text-left">
                  <span className="font-bold text-[#004ac6] block mb-1">HINT DEFINITION:</span>
                  {getLocalDefinition(scrambleTarget)?.definition || 'No local hints, but it starts with ' + scrambleTarget[0] + '!'}
                </div>
              )}
            </form>
          </div>

        </div>

      </div>

      {/* Helpful Instructions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto pt-8 border-t border-[#c3c6d7]">
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-[#004ac6]">
            <HelpCircle size={22} />
            <h2 className="text-lg font-bold text-[#131b2e]">
              How often are new scrambled targets added?
            </h2>
          </div>
          <p className="text-sm text-[#434655] leading-relaxed">
            Every session pulls from our localized standard 3,200 Scrabble dictionaries, creating unlimited random permutations. Play frequently to test your anagram spelling skills and keep an active win streak going!
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-[#004ac6]">
            <HelpCircle size={22} />
            <h2 className="text-lg font-bold text-[#131b2e]">
              How are Word of the Moment results filtered?
            </h2>
          </div>
          <p className="text-sm text-[#434655] leading-relaxed">
            The Word of the Day highlights medium-level terms (5 to 10 letters) that carry distinct Scrabble weight, making them excellent choices for tile score multiplication and board strategy!
          </p>
        </div>
      </div>

    </div>
  );
}
