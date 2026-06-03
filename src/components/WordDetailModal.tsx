import { X, Award, Info, Search, RefreshCw, BookOpen } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getScrabblePoints, getLocalDefinition } from '../data/words';

interface WordDetailModalProps {
  word: string;
  onClose: () => void;
  onSearchAnagrams: (word: string) => void;
  onSearchDictionary: (word: string) => void;
}

export default function WordDetailModal({
  word,
  onClose,
  onSearchAnagrams,
  onSearchDictionary,
}: WordDetailModalProps) {
  const [definition, setDefinition] = useState<string>('');
  const [partOfSpeech, setPartOfSpeech] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [points, setPoints] = useState<number>(0);

  // FIX #7: Lock body scroll when modal opens, unlock when it closes
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  useEffect(() => {
    if (!word) return;
    
    // Set Scrabble points
    setPoints(getScrabblePoints(word));

    // Look up locally first
    const local = getLocalDefinition(word);
    if (local) {
      setDefinition(local.definition);
      setPartOfSpeech(local.partOfSpeech);
    } else {
      setDefinition(`A valid custom word found in Scrabble dictionary scoring ${getScrabblePoints(word)} points.`);
      setPartOfSpeech('Noun/Word');
    }

    // Try fetching definition live if online from standard Free Dictionary API!
    setIsLoading(true);
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`)
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Not found');
      })
      .then((data) => {
        if (data && data[0]) {
          const firstEntry = data[0];
          const meaning = firstEntry.meanings?.[0];
          if (meaning) {
            setPartOfSpeech(meaning.partOfSpeech || 'Noun');
            const defText = meaning.definitions?.[0]?.definition;
            if (defText) {
              setDefinition(defText);
            }
          }
        }
      })
      .catch(() => {
        // Fallback already prepared
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [word]);

  return (
    <div className="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center p-4 animate-fade-in backdrop-blur-xs font-sans">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full border border-[#c3c6d7] overflow-hidden transform scale-100 transition-transform">
        
        {/* Header */}
        <div className="bg-[#004ac6] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen size={20} />
            <h3 className="font-bold text-lg tracking-tight uppercase font-mono">Word Details</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          
          {/* Large Word Display */}
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-[#131b2e] tracking-tight font-sans">
              {word.toUpperCase()}
            </h2>
            <div className="flex justify-center items-center gap-2">
              <span className="inline-block bg-[#f2f3ff] text-[#004ac6] text-xs font-semibold px-2.5 py-1 rounded-full uppercase">
                {partOfSpeech}
              </span>
              <span className="inline-block bg-[#ffede6] text-[#943700] text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 font-mono">
                <Award size={13} /> {points} PTS
              </span>
              <span className="inline-block bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-full font-mono">
                {word.length} Letters
              </span>
            </div>
          </div>

          {/* Definition block */}
          <div className="bg-[#faf8ff] p-4 rounded-lg border border-[#e2e7ff] space-y-2">
            <div className="flex items-center space-x-1 text-[#434655] text-xs font-bold uppercase tracking-wider font-mono">
              <Info size={14} className="text-[#004ac6]" />
              <span>Definition / Meaning</span>
            </div>
            {isLoading ? (
              <div className="flex items-center space-x-2 py-2 text-sm text-slate-500">
                <div className="animate-spin h-4 w-4 border-2 border-[#004ac6] border-t-transparent rounded-full" />
                <span>Fetching live definition...</span>
              </div>
            ) : (
              <p className="text-sm text-[#131b2e] leading-relaxed">
                {definition}
              </p>
            )}
          </div>

          {/* Inter-tool Actions */}
          <div className="space-y-3 pt-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider font-mono">
              Actions
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  onSearchAnagrams(word);
                  onClose();
                }}
                className="flex items-center justify-center gap-2 py-2.5 px-4 bg-white border border-[#c3c6d7] hover:border-[#004ac6] hover:bg-[#f2f3ff] text-sm font-medium rounded-lg text-[#004ac6] transition-colors cursor-pointer"
              >
                <RefreshCw size={14} />
                <span>Find Anagrams</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onSearchDictionary(word);
                  onClose();
                }}
                className="flex items-center justify-center gap-2 py-2.5 px-4 bg-white border border-[#c3c6d7] hover:border-[#004ac6] hover:bg-[#f2f3ff] text-sm font-medium rounded-lg text-[#004ac6] transition-colors cursor-pointer"
              >
                <Search size={14} />
                <span>Deep Lookup</span>
              </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 text-center">
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-slate-500 hover:text-[#004ac6] font-semibold cursor-pointer bg-transparent border-none"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}
