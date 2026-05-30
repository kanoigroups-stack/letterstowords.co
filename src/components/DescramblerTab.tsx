import { useState, FormEvent } from 'react';
import { HelpCircle, Sparkles, Shuffle, Star } from 'lucide-react';
import { countChars, canFormWord } from '../utils';
import { COMMON_WORDS, getScrabblePoints } from '../data/words';

interface DescramblerTabProps {
  onWordClick: (word: string) => void;
}

export default function DescramblerTab({ onWordClick }: DescramblerTabProps) {
  // Word Wheel States
  const [wheelLetters, setWheelLetters] = useState<string>('RNDLI');
  const [centerLetter, setCenterLetter] = useState<string>('A');
  const [wheelResults, setWheelResults] = useState<string[]>([]);
  const [hasSolvedWheel, setHasSolvedWheel] = useState<boolean>(false);

  // Puzzle scramble phrase solver state
  const [anagramPhrase, setAnagramPhrase] = useState<string>('');
  const [phraseResults, setPhraseResults] = useState<string[]>([]);
  const [hasSolvedPhrase, setHasSolvedPhrase] = useState<boolean>(false);

  // Solve Word Wheel: Words must contain centerLetter, and can only use centerLetter + wheelLetters
  const handleSolveWheel = (e: FormEvent) => {
    e.preventDefault();
    const center = centerLetter.toUpperCase().trim().replace(/[^A-Z]/g, '');
    const surrounding = wheelLetters.toUpperCase().trim().replace(/[^A-Z]/g, '');
    
    if (!center) return;

    const fullAvailableLetters = center + surrounding;
    const rackCounts = countChars(fullAvailableLetters);
    const matches: string[] = [];

    for (const word of COMMON_WORDS) {
      if (word.length < 3) continue; // Words in wheels are typically 3+ letters
      if (!word.includes(center)) continue; // MUST contain center letter

      if (canFormWord(word, rackCounts, 0)) {
        matches.push(word);
      }
    }

    setWheelResults(matches.sort((a, b) => b.length - a.length || a.localeCompare(b)));
    setHasSolvedWheel(true);
  };

  const handleSolvePhrase = (e: FormEvent) => {
    e.preventDefault();
    const cleanPhrase = anagramPhrase.toUpperCase().trim().replace(/[^A-Z]/g, '');
    if (!cleanPhrase) return;

    const rackCounts = countChars(cleanPhrase);
    const matches: string[] = [];

    for (const word of COMMON_WORDS) {
      if (word.length < 3) continue;
      if (canFormWord(word, rackCounts, 0)) {
        matches.push(word);
      }
    }

    setPhraseResults(matches.sort((a, b) => b.length - a.length || a.localeCompare(b)));
    setHasSolvedPhrase(false); // Wait, yes!
    setHasSolvedPhrase(true);
  };

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-[#131b2e] leading-snug">
          Word Wheel & Descrambler
        </h1>
        <p className="text-lg text-[#505f76] italic font-medium">
          Dethrone Word Wheels, spelling bees, and multi-letter board challenges!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        
        {/* Left Side: Word Wheel Solver */}
        <div className="bg-white border border-[#c3c6d7] rounded-xl p-6 shadow-sm space-y-6">
          <div className="flex items-center space-x-2 text-[#004ac6] border-b border-dashed border-[#e2e8f0] pb-3">
            <Sparkles size={20} />
            <h2 className="text-lg font-bold text-[#131b2e]">Word Wheel Solver</h2>
          </div>

          <form onSubmit={handleSolveWheel} className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#505f76] mb-1.5 text-center">
                  Center Tile [MUST]
                </label>
                <input
                  className="w-full h-12 text-center rounded-lg border border-[#c3c6d7] bg-[#f2f3ff] text-[#004ac6] font-extrabold text-xl uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-[#004ac6]"
                  type="text"
                  maxLength={1}
                  value={centerLetter}
                  onChange={(e) => setCenterLetter(e.target.value)}
                />
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#505f76] mb-1.5">
                  Surrounding Letters
                </label>
                <input
                  className="w-full h-12 px-3 rounded-lg border border-[#c3c6d7] bg-[#faf8ff] text-[#131b2e] font-bold text-lg uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-[#004ac6]"
                  type="text"
                  placeholder="e.g. RNDLI"
                  value={wheelLetters}
                  onChange={(e) => setWheelLetters(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-12 bg-[#004ac6] hover:bg-[#2563eb] text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-[0.98]"
            >
              <Shuffle size={16} />
              <span>Solve Word Wheel</span>
            </button>
          </form>

          {/* Results for Word Wheel */}
          {hasSolvedWheel && (
            <div className="space-y-3 animate-fade-in">
              <h3 className="text-sm font-bold text-[#131b2e] uppercase tracking-wider font-mono">
                {wheelResults.length} Solutions Found
              </h3>
              
              {wheelResults.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No matches using those wheel configurations.</p>
              ) : (
                <div className="max-h-[220px] overflow-y-auto border border-[#e2e8f0] rounded-lg p-3 bg-slate-50 flex flex-wrap gap-2.5">
                  {wheelResults.map((word) => (
                    <button
                      key={word}
                      onClick={() => onWordClick(word)}
                      className="bg-white hover:bg-[#e2e7ff] text-[#131b2e] hover:text-[#004ac6] border border-slate-200 px-2.5 py-1.5 rounded-md text-xs font-semibold tracking-wider font-mono flex items-center space-x-1 cursor-pointer transition-colors"
                    >
                      <Star size={10} className="text-yellow-500 fill-yellow-500" />
                      <span>{word}</span>
                      <span className="text-[9px] text-[#943700] bg-[#ffede6] px-1 rounded font-normal">
                        {getScrabblePoints(word)}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Right Side: Letters Phrase Solver */}
        <div className="bg-white border border-[#c3c6d7] rounded-xl p-6 shadow-sm space-y-6">
          <div className="flex items-center space-x-2 text-[#004ac6] border-b border-dashed border-[#e2e8f0] pb-3">
            <Shuffle size={20} />
            <h2 className="text-lg font-bold text-[#131b2e]">Letter Pool Sub-Words</h2>
          </div>

          <form onSubmit={handleSolvePhrase} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#505f76] mb-1.5">
                Bulk Input Letters
              </label>
              <input
                className="w-full h-12 px-3 rounded-lg border border-[#c3c6d7] bg-[#faf8ff] text-[#131b2e] font-bold text-lg uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-[#004ac6]"
                type="text"
                placeholder="Type letters to check all subwords"
                value={anagramPhrase}
                onChange={(e) => setAnagramPhrase(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full h-12 bg-white hover:bg-[#f2f3ff] text-[#004ac6] border border-[#004ac6] font-bold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
            >
              <span>Discover Sub-Words</span>
            </button>
          </form>

          {/* Results for Phrase Solver */}
          {hasSolvedPhrase && (
            <div className="space-y-3 animate-fade-in">
              <h3 className="text-sm font-bold text-[#131b2e] uppercase tracking-wider font-mono">
                {phraseResults.length} Subwords Found
              </h3>
              
              {phraseResults.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No matches using those letters.</p>
              ) : (
                <div className="max-h-[220px] overflow-y-auto border border-[#e2e8f0] rounded-lg p-3 bg-slate-50 flex flex-wrap gap-2">
                  {phraseResults.map((word) => (
                    <button
                      key={word}
                      onClick={() => onWordClick(word)}
                      className="bg-white hover:bg-[#e2e7ff] text-[#131b2e] border border-slate-200 px-2 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors"
                    >
                      {word}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

      </div>

      {/* Helpful Instructions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto pt-8 border-t border-[#c3c6d7]">
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-[#004ac6]">
            <HelpCircle size={22} />
            <h2 className="text-lg font-bold text-[#131b2e]">
              What is a Word Wheel?
            </h2>
          </div>
          <p className="text-sm text-[#434655] leading-relaxed">
            Many mobile games and daily newspaper puzzles present letters in a circle with a single key tile in the center. Solving require generating words that contain that pivotal center tile using only letters inside the wheel context. This specialized solver strips out words that don't include that letter, giving you high-scoring answers instantly.
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-[#004ac6]">
            <HelpCircle size={22} />
            <h2 className="text-lg font-bold text-[#131b2e]">
              How are Subwords calculated?
            </h2>
          </div>
          <p className="text-sm text-[#434655] leading-relaxed">
            Subword generation checks individual subsets of letters in your pool and matches them against the dictionary database, sorting result listings by length. This is perfect for solving Boggle racks or word puzzle boards with mixed letters!
          </p>
        </div>
      </div>

    </div>
  );
}
