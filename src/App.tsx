import { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import UnscramblerTab from './components/UnscramblerTab';
import DictionaryTab from './components/DictionaryTab';
import DescramblerTab from './components/DescramblerTab';
import AnagramsTab from './components/AnagramsTab';
import WordleTab from './components/WordleTab';
import RandomTab from './components/RandomTab';
import WordDetailModal from './components/WordDetailModal';
import AdUnit from './components/AdUnit';
import { TabType } from './types';
import { X, Info } from 'lucide-react';

// SEO: Different title and description for each tab
const TAB_SEO = {
  home: {
    title: 'Word Unscrambler: Letters to Words | Official Scrabble Word Finder',
    description: 'Official Word Unscrambler by Letters to Words! Unscramble random letters online to find high-scoring Scrabble words, Wordle helper tips, and perfect anagram solutions instantly.',
  },
  dictionary: {
    title: 'Dictionary Lookup | Letters to Words - Scrabble Word Definitions',
    description: 'Free online dictionary lookup for Scrabble words. Check word legality, point values, definitions, and phonetics for NWL, CSW, and ENABLE dictionaries.',
  },
  descrambler: {
    title: 'Word Wheel & Descrambler | Letters to Words Solver',
    description: 'Solve Word Wheel puzzles and descramble letter pools instantly. Find all valid subwords from any set of letters for Scrabble, Words with Friends, and word games.',
  },
  anagrams: {
    title: 'Anagram Solver | Letters to Words - Perfect Anagram Finder',
    description: 'Discover perfect anagram rearrangements of any word instantly. Our anagram solver finds exact letter permutations for Scrabble, crosswords, and word puzzles.',
  },
  wordle: {
    title: 'Wordle Solver & Trainer | Letters to Words Companion',
    description: 'The ultimate Wordle helper and training tool. Solve Wordle puzzles with our AI bot, play practice games, and get live suggestions based on green, yellow, and gray tile patterns.',
  },
  random: {
    title: 'Vocabulary Training | Letters to Words - Daily Word Gym',
    description: 'Build your vocabulary with daily word of the day, anagram scramble training games, and Scrabble point practice. Perfect for word game enthusiasts.',
  },
};

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [selectedWord, setSelectedWord] = useState<string | null>(null);

  const [exploreWord, setExploreWord] = useState<string>('');
  const [exploreAnagram, setExploreAnagram] = useState<string>('');
  const [exploreLetters, setExploreLetters] = useState<string>('');

  const [utilityDialog, setUtilityDialog] = useState<{
    isOpen: boolean;
    title: string;
    content: string;
  }>({
    isOpen: false,
    title: '',
    content: '',
  });

  // SEO: Update page title and description when tab changes
  useEffect(() => {
    const seo = TAB_SEO[activeTab];
    document.title = seo.title;
    
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', seo.description);
    }
  }, [activeTab]);

  // SEO: Update URL hash so users can bookmark/share specific tabs
  useEffect(() => {
    if (activeTab !== 'home') {
      window.history.replaceState(null, '', `#${activeTab}`);
    } else {
      window.history.replaceState(null, '', '/');
    }
  }, [activeTab]);

  // SEO: Read URL hash on page load to show correct tab
  useEffect(() => {
    const hash = window.location.hash.replace('#', '') as TabType;
    if (hash && ['home', 'dictionary', 'descrambler', 'anagrams', 'wordle', 'random'].includes(hash)) {
      setActiveTab(hash);
    }
  }, []);

  const handleWordClick = (word: string) => {
    setSelectedWord(word);
  };

  const handleExploreAnagrams = (word: string) => {
    setExploreAnagram(word);
    setActiveTab('anagrams');
  };

  const handleExploreLetters = (letters: string) => {
    setExploreLetters(letters);
    setActiveTab('home');
  };

  // FIX #11: Use 'contents' instead of 'block' to prevent layout issues
  const showTab = (tab: TabType) => activeTab === tab ? 'contents' : 'hidden';

  return (
    <div className="bg-[#faf8ff] text-[#131b2e] font-sans min-h-screen flex flex-col transition-colors duration-100">
      
      {/* Top Navigation */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Skip to content link for accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-[#004ac6] focus:text-white focus:px-4 focus:py-2 focus:rounded-lg"
      >
        Skip to main content
      </a>

      {/* Main Content */}
      <main id="main-content" className="flex-grow pt-8 pb-12 px-6 max-w-7xl mx-auto w-full">
        
        {/* Top Ad */}
        <AdUnit slot="9876543210" format="horizontal" className="mb-8 max-w-4xl" />

        {/* SEO FIX: All 6 tabs are ALWAYS in the HTML */}
        {/* Google can see all content, but users only see the active one */}
        
        <div className={showTab('home')}>
          <UnscramblerTab
            initialLetters={exploreLetters}
            onWordClick={handleWordClick}
          />
        </div>

        <div className={showTab('dictionary')}>
          <DictionaryTab
            initialWord={exploreWord}
            onExploreAnagrams={handleExploreAnagrams}
            onExploreLetters={handleExploreLetters}
          />
        </div>

        <div className={showTab('descrambler')}>
          <DescramblerTab onWordClick={handleWordClick} />
        </div>

        <div className={showTab('anagrams')}>
          <AnagramsTab
            initialWord={exploreAnagram}
            onWordClick={handleWordClick}
          />
        </div>

        <div className={showTab('wordle')}>
          <WordleTab onWordClick={handleWordClick} />
        </div>

        <div className={showTab('random')}>
          <RandomTab
            onWordClick={handleWordClick}
            onExploreLetters={handleExploreLetters}
          />
        </div>

        {/* Bottom Ad */}
        <AdUnit slot="1234567890" format="auto" className="mt-12 max-w-4xl" />
      </main>

      {/* Footer */}
      <Footer
        onSelectTab={setActiveTab}
        onShowUtilityDialog={(title, content) =>
          setUtilityDialog({ isOpen: true, title, content })
        }
      />

      {/* Word Details Popup */}
      {selectedWord && (
        <WordDetailModal
          word={selectedWord}
          onClose={() => setSelectedWord(null)}
          onSearchAnagrams={handleExploreAnagrams}
          onSearchDictionary={(word) => {
            setExploreWord(word);
            setActiveTab('dictionary');
          }}
        />
      )}

      {/* Utility Dialog */}
      {utilityDialog.isOpen && (
        <div className="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center p-4 animate-fade-in backdrop-blur-xs font-sans">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full border border-[#c3c6d7] overflow-hidden">
            <div className="bg-[#004ac6] text-white px-5 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Info size={18} />
                <h3 className="font-bold text-sm tracking-tight uppercase font-mono">
                  {utilityDialog.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setUtilityDialog({ isOpen: false, title: '', content: '' })}
                className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-6">
              <p className="text-[#131b2e] text-sm leading-relaxed text-slate-700">
                {utilityDialog.content}
              </p>
            </div>
            <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 text-right">
              <button
                type="button"
                onClick={() => setUtilityDialog({ isOpen: false, title: '', content: '' })}
                className="bg-[#004ac6] hover:bg-[#2563eb] text-white text-xs font-bold px-4 py-2 rounded-lg cursor-pointer transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
