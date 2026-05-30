import { useState, useEffect, FormEvent } from 'react';
import { Search, ChevronDown, ChevronUp, X, Award, HelpCircle } from 'lucide-react';
import { solveUnscramble } from '../utils';
import { getScrabblePoints } from '../data/words';
import { UnscrambleOptions, GroupedResults } from '../types';

interface UnscramblerTabProps {
  initialLetters?: string;
  onWordClick: (word: string) => void;
}

export default function UnscramblerTab({
  initialLetters = '',
  onWordClick,
}: UnscramblerTabProps) {
  const [letters, setLetters] = useState<string>(initialLetters);
  const [showOptions, setShowOptions] = useState<boolean>(false);
  
  // Advanced options state
  const [options, setOptions] = useState<UnscrambleOptions>({
    dictionary: 'nwl',
    mustInclude: '',
    startsWith: '',
    endsWith: '',
  });

  const [results, setResults] = useState<GroupedResults>({});
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  useEffect(() => {
    if (initialLetters) {
      setLetters(initialLetters);
      // Automatically trigger on mount if letters are passed in from other tab
      const res = solveUnscramble(initialLetters, options);
      setResults(res);
      setHasSearched(true);
    }
  }, [initialLetters]);

  const handleSearch = (e?: FormEvent) => {
    if (e) e.preventDefault();
    const cleanLetters = letters.toUpperCase().trim();
    if (!cleanLetters) return;

    const res = solveUnscramble(cleanLetters, options);
    setResults(res);
    setHasSearched(true);
  };

  const handleClear = () => {
    setLetters('');
    setResults({});
    setHasSearched(false);
  };

  // Count total words found
  const totalFound = (Object.values(results) as string[][]).reduce(
    (count, words) => count + words.length,
    0
  );

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      
      {/* Hero Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[#131b2e] leading-none">
          Letters <span className="text-[#004ac6]">to</span> Words
        </h1>
        <h2 className="text-xl md:text-2xl font-bold text-[#475569] tracking-tight">
          Letters to Words Unscrambler & Scrabble Word Finder
        </h2>
        <p className="text-base text-[#52525b] font-medium max-w-lg mx-auto">
          Unscramble random letters into high-scoring Scrabble words, perfect anagrams, Words with Friends plays, and Daily Wordle hints instantly.
        </p>
      </div>

      {/* Main Input Area Panel */}
      <form
        onSubmit={handleSearch}
        className="bg-white border border-[#c3c6d7] rounded-xl p-6 shadow-sm space-y-4 max-w-2xl mx-auto"
      >
        <div className="relative">
          <label
            className="block text-sm font-semibold text-[#131b2e] mb-2"
            htmlFor="lettersInput"
          >
            Enter your letters
          </label>
          <div className="relative flex items-center">
            <input
              className="w-full h-14 pl-4 pr-12 rounded-lg border border-[#c3c6d7] bg-[#faf8ff] text-[#131b2e] text-lg font-bold uppercase tracking-wider placeholder:normal-case placeholder:font-normal placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#004ac6] focus:border-transparent transition-all duration-100"
              id="lettersInput"
              placeholder="Enter letters (max: 15, use ? or * for blank)"
              type="text"
              value={letters}
              onChange={(e) => setLetters(e.target.value)}
              maxLength={15}
            />
            {letters && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-4 text-slate-400 hover:text-[#131b2e] transition-colors p-1 rounded-full hover:bg-slate-100 cursor-pointer"
                id="clearBtn"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Action Button */}
        <button
          type="submit"
          className="w-full h-14 bg-[#004ac6] hover:bg-[#2563eb] text-white font-bold rounded-lg transition-all duration-100 active:scale-[0.98] flex items-center justify-center gap-2 shadow-sm cursor-pointer"
          id="unscrambleBtn"
        >
          <Search size={22} />
          <span>Unscramble It</span>
        </button>

        {/* Collapsible Advanced Options Toggle */}
        <div className="pt-2 border-t border-[#c3c6d7]">
          <button
            type="button"
            onClick={() => setShowOptions(!showOptions)}
            className="flex items-center justify-between w-full text-sm font-semibold text-[#505f76] hover:text-[#004ac6] transition-colors cursor-pointer py-1"
            id="optionsToggle"
          >
            <span>Advanced Options</span>
            {showOptions ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>

          {/* Collapsible options Content */}
          {showOptions && (
            <div className="mt-4 space-y-4 animate-fade-in">
              <div>
                <label
                  className="block text-xs font-bold uppercase tracking-wider text-[#505f76] mb-1 px-1"
                  htmlFor="dictionarySelect"
                >
                  Select Dictionary
                </label>
                <select
                  className="w-full h-10 rounded-lg border border-[#c3c6d7] bg-[#faf8ff] text-[#131b2e] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#004ac6] px-3 cursor-pointer"
                  id="dictionarySelect"
                  value={options.dictionary}
                  onChange={(e) =>
                    setOptions({
                      ...options,
                      dictionary: e.target.value as 'nwl' | 'csw' | 'enable',
                    })
                  }
                >
                  <option value="nwl">NWL (North American Standard)</option>
                  <option value="csw">CSW (Global Scrabble Standard)</option>
                  <option value="enable">ENABLE (Words With Friends)</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label
                    className="block text-xs font-bold uppercase tracking-wider text-[#505f76] mb-1 px-1"
                    htmlFor="mustInclude"
                  >
                    Must include
                  </label>
                  <input
                    className="w-full h-10 rounded-lg border border-[#c3c6d7] bg-[#faf8ff] text-[#131b2e] text-sm px-3 uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-[#004ac6]"
                    id="mustInclude"
                    type="text"
                    placeholder="e.g. A"
                    value={options.mustInclude}
                    onChange={(e) =>
                      setOptions({ ...options, mustInclude: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label
                    className="block text-xs font-bold uppercase tracking-wider text-[#505f76] mb-1 px-1"
                    htmlFor="startsWith"
                  >
                    Starts with
                  </label>
                  <input
                    className="w-full h-10 rounded-lg border border-[#c3c6d7] bg-[#faf8ff] text-[#131b2e] text-sm px-3 uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-[#004ac6]"
                    id="startsWith"
                    type="text"
                    placeholder="e.g. C"
                    value={options.startsWith}
                    onChange={(e) =>
                      setOptions({ ...options, startsWith: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label
                    className="block text-xs font-bold uppercase tracking-wider text-[#505f76] mb-1 px-1"
                    htmlFor="endsWith"
                  >
                    Ends with
                  </label>
                  <input
                    className="w-full h-10 rounded-lg border border-[#c3c6d7] bg-[#faf8ff] text-[#131b2e] text-sm px-3 uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-[#004ac6]"
                    id="endsWith"
                    type="text"
                    placeholder="e.g. S"
                    value={options.endsWith}
                    onChange={(e) =>
                      setOptions({ ...options, endsWith: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </form>

      {/* Results Section */}
      {hasSearched && (
        <div className="space-y-6 max-w-2xl mx-auto" id="resultsArea">
          <div className="flex items-center justify-between border-b border-[#c3c6d7] pb-2">
            <h2 className="text-xl font-bold text-[#131b2e]">
              <span className="text-[#004ac6] font-mono mr-1">{totalFound}</span> Words Found
            </h2>
          </div>

          {totalFound === 0 ? (
            <div className="text-center py-10 bg-white border border-[#c3c6d7] rounded-xl p-6">
              <p className="text-slate-500 text-sm font-medium">
                No words match your tile rack and filter configuration. Try adding fewer filters or wildcards!
              </p>
            </div>
          ) : (
            <div className="space-y-4" id="resultsContainer">
              {Object.keys(results)
                .map(Number)
                .sort((a, b) => b - a)
                .map((len) => {
                  const words = results[len];
                  return (
                    <div
                      key={len}
                      className="bg-white border border-[#c3c6d7] rounded-xl p-5 shadow-xs space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#505f76] bg-[#f2f3ff] text-[#004ac6] px-2.5 py-1 rounded-md">
                          {len} Letter Words
                        </span>
                        <span className="text-xs text-slate-400 font-medium">
                          {words.length} items
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {words.sort().map((word) => (
                          <button
                            key={word}
                            onClick={() => onWordClick(word)}
                            className="bg-[#faf8ff] hover:bg-[#e2e7ff] text-[#131b2e] hover:text-[#004ac6] border border-[#e2e8f0] px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-100 flex items-center space-x-1 hover:scale-105 cursor-pointer shadow-2xs"
                          >
                            <span className="tracking-wide font-sans">{word}</span>
                            <span className="text-[10px] text-[#943700] bg-[#ffede6] px-1 rounded font-mono font-bold">
                              {getScrabblePoints(word)}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}

      {/* Detailed SEO Optimization Column & Guide Section */}
      <div className="max-w-4xl mx-auto pt-10 border-t border-[#c3c6d7] space-y-8">
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-extrabold text-[#131b2e]">
            Ultimate Word Unscrambler & Letter Solver Guide
          </h3>
          <p className="text-sm text-[#505f76] max-w-lg mx-auto">
            Master your vocabulary training, solve tricky anagram racks, and learn the rules of Letters to Words.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* FAQ 1 */}
          <div className="bg-white border border-[#e2e8f0] hover:border-[#cbd5e1] rounded-xl p-6 transition-all duration-100 shadow-3xs space-y-3">
            <div className="flex items-center space-x-2 text-[#004ac6]">
              <HelpCircle size={20} />
              <h4 className="font-bold text-[#131b2e] text-base">
                How does the Word Unscrambler tool work?
              </h4>
            </div>
            <p className="text-sm text-[#434655] leading-relaxed">
              Our free <strong>word unscrambler</strong> solves complex letters in milliseconds. By typing your mixed letter rack into the prompt, the backend algorithm analyzes the letters and cross-references them against premium official tournament dictionary databases (NWL, CSW, ENABLE) to find every valid combination grouped by word length.
            </p>
          </div>

          {/* FAQ 2 */}
          <div className="bg-white border border-[#e2e8f0] hover:border-[#cbd5e1] rounded-xl p-6 transition-all duration-100 shadow-3xs space-y-3">
            <div className="flex items-center space-x-2 text-[#004ac6]">
              <HelpCircle size={20} />
              <h4 className="font-bold text-[#131b2e] text-base">
                Can I use blank tiles or wildcard letters?
              </h4>
            </div>
            <p className="text-sm text-[#434655] leading-relaxed">
              Yes, absolutely! If you are playing games with blank tiles, you can represent them using a question mark (<code>?</code>) or asterisk (<code>*</code>). The <strong>Letters to Words</strong> engine will dynamically calculate all possible alphabetic substitutions to output high-scoring word combinations.
            </p>
          </div>

          {/* FAQ 3 */}
          <div className="bg-white border border-[#e2e8f0] hover:border-[#cbd5e1] rounded-xl p-6 transition-all duration-100 shadow-3xs space-y-3">
            <div className="flex items-center space-x-2 text-[#004ac6]">
              <HelpCircle size={20} />
              <h4 className="font-bold text-[#131b2e] text-base">
                Is this tool compliant with Scrabble & WWF?
              </h4>
            </div>
            <p className="text-sm text-[#434655] leading-relaxed">
              Yes, our unscramble tool provides exact Scrabble word point counts based on standard layouts. You can select <strong>NWL</strong> (North American Scrabble), <strong>CSW</strong> (Collins/Global Scrabble), or <strong>ENABLE</strong> (ideal for Words With Friends) dictionaries.
            </p>
          </div>

          {/* FAQ 4 */}
          <div className="bg-white border border-[#e2e8f0] hover:border-[#cbd5e1] rounded-xl p-6 transition-all duration-100 shadow-3xs space-y-3">
            <div className="flex items-center space-x-2 text-[#004ac6]">
              <HelpCircle size={20} />
              <h4 className="font-bold text-[#131b2e] text-base">
                How do I lock words to start or end with a letter?
              </h4>
            </div>
            <p className="text-sm text-[#434655] leading-relaxed">
              By using our <strong>Advanced Options</strong> dropdown, you can set precise search constraints. Simply enter desired letters into the "Starts with", "Ends with", or "Must include" form fields to find perfect word fits for open columns on your real game board.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
