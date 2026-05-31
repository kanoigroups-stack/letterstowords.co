import { useState, useEffect } from 'react';
import { Search, RotateCcw, AlertCircle, Sparkles, HelpCircle } from 'lucide-react';
import { solveAnagram } from '../utils';

interface AnagramsTabProps {
  initialWord?: string;
  onWordClick: (word: string) => void;
}

export default function AnagramsTab({ initialWord = '', onWordClick }: AnagramsTabProps) {
  const [wordInput, setWordInput] = useState<string>(initialWord);
  const [searchedWord, setSearchedWord] = useState<string>('');
  const [anagrams, setAnagrams] = useState<string[]>([]);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  useEffect(() => {
    if (initialWord) {
      setWordInput(initialWord);
      handleSearch(initialWord);
    }
  }, [initialWord]);

  const handleSearch = (wordToSearch?: string) => {
    const target = (wordToSearch || wordInput).toUpperCase().trim().replace(/[^A-Z]/g, '');
    if (!target) return;

    setSearchedWord(target);
    const results = solveAnagram(target);
    setAnagrams(results);
    setHasSearched(true);
  };

  const handleClear = () => {
    setWordInput('');
    setAnagrams([]);
    setHasSearched(false);
  };

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-[#131b2e] leading-snug">
          Anagram Solver
        </h1>
        <p className="text-lg text-[#505f76] italic font-medium">
          Discover perfect anagram rearrangements of any word!
        </p>
      </div>

      {/* Input panel card - RESPONSIVE FIX: stacked on mobile, side-by-side on md+ */}
      <div className="bg-white border border-[#c3c6d7] rounded-xl p-6 shadow-sm max-w-2xl mx-auto space-y-4">
        <label className="block text-sm font-semibold text-[#131b2e]">
          Enter Word / Letters
        </label>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            className="flex-grow h-12 px-4 rounded-lg border border-[#c3c6d7] bg-[#faf8ff] text-[#131b2e] font-bold text-base uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-[#004ac6] transition-all"
            placeholder="Type word (e.g. CINEMA, LISTEN, ELVIS)"
            type="text"
            value={wordInput}
            onChange={(e) => setWordInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            onClick={() => handleSearch()}
            className="px-6 h-12 bg-[#004ac6] hover:bg-[#2563eb] text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95 shrink-0"
          >
            <Search size={18} />
            <span>Find Anagrams</span>
          </button>
        </div>
      </div>

      {/* Results Block */}
      {hasSearched && (
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="flex items-center justify-between border-b border-[#c3c6d7] pb-2">
            <h2 className="text-lg font-bold text-[#131b2e]">
              Anagrams of <span className="text-[#004ac6] font-mono">{searchedWord}</span>
            </h2>
            <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded font-mono font-medium">
              {anagrams.length} exact matches
            </span>
          </div>

          {anagrams.length === 0 ? (
            <div className="text-center py-10 bg-white border border-[#c3c6d7] rounded-xl p-6 flex flex-col items-center space-y-2">
              <AlertCircle size={24} className="text-slate-400" />
              <p className="text-slate-500 text-sm font-medium">
                No exact anagrams of "{searchedWord}" found in our database. Try another word!
              </p>
            </div>
          ) : (
            <div className="bg-white border border-[#c3c6d7] rounded-xl p-6 shadow-2xs space-y-3">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider font-mono">
                Click any word below to see meanings & scrabble values
              </p>
              <div className="flex flex-wrap gap-2.5 pt-2">
                {anagrams.map((word) => (
                  <button
                    key={word}
                    onClick={() => onWordClick(word)}
                    className="bg-[#faf8ff] hover:bg-[#e2e7ff] text-[#131b2e] hover:text-[#004ac6] border border-[#e2e8f0] px-4 py-2 rounded-lg text-sm font-bold tracking-wider font-mono cursor-pointer transition-all hover:scale-105 shadow-2xs"
                  >
                    {word}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Informational boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto pt-8 border-t border-[#c3c6d7]">
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-[#004ac6]">
            <HelpCircle size={22} />
            <h2 className="text-lg font-bold text-[#131b2e]">
              What is a perfect Anagram?
            </h2>
          </div>
          <p className="text-sm text-[#434655] leading-relaxed">
            Unlike standard unscrambling which yields smaller fragments (e.g. "DOG" → "GO", "DO"), a perfect anagram uses **exactly** the same number of letters in a different permutation (e.g. "LISTEN" → "SILENT"). Perfect anagram solvers are extremely fun for riddle challenges and literary puzzles!
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-[#004ac6]">
            <HelpCircle size={22} />
            <h2 className="text-lg font-bold text-[#131b2e]">
              Are blank letters anagrammed?
            </h2>
          </div>
          <p className="text-sm text-[#434655] leading-relaxed">
            Perfect anagrams require matching the exact letter counts, so wildcard tiles are not used in pure anagram modes. If you wish to solve with blanks or blank tiles, use our main **Home Tab Unscrambler** with wildcard markers (? or *)!
          </p>
        </div>
      </div>

    </div>
  );
}
