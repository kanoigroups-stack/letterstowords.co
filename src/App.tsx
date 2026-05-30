import { useState } from 'react';
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

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [selectedWord, setSelectedWord] = useState<string | null>(null);

  // States to pass inter-tab inputs
  const [exploreWord, setExploreWord] = useState<string>('');
  const [exploreAnagram, setExploreAnagram] = useState<string>('');
  const [exploreLetters, setExploreLetters] = useState<string>('');

  // Sitemaps/Privacy dialogues from footer
  const [utilityDialog, setUtilityDialog] = useState<{
    isOpen: boolean;
    title: string;
    content: string;
  }>({
    isOpen: false,
    title: '',
    content: '',
  });

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

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'home':
        return (
          <UnscramblerTab
            initialLetters={exploreLetters}
            onWordClick={handleWordClick}
          />
        );
      case 'dictionary':
        return (
          <DictionaryTab
            initialWord={exploreWord}
            onExploreAnagrams={handleExploreAnagrams}
            onExploreLetters={handleExploreLetters}
          />
        );
      case 'descrambler':
        return <DescramblerTab onWordClick={handleWordClick} />;
      case 'anagrams':
        return (
          <AnagramsTab
            initialWord={exploreAnagram}
            onWordClick={handleWordClick}
          />
        );
      case 'wordle':
        return <WordleTab onWordClick={handleWordClick} />;
      case 'random':
        return (
          <RandomTab
            onWordClick={handleWordClick}
            onExploreLetters={handleExploreLetters}
          />
        );
      default:
        return (
          <UnscramblerTab
            initialLetters={exploreLetters}
            onWordClick={handleWordClick}
          />
        );
    }
  };

  return (
    <div className="bg-[#faf8ff] text-[#131b2e] font-sans min-h-screen flex flex-col transition-colors duration-100">
      
      {/* Sticky Top Navigation */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Container */}
      <main className="flex-grow pt-8 pb-12 px-6 max-w-7xl mx-auto w-full">
        {/* Top Responsive Ads Header (Highest Viewability for AdSense Earnings) */}
        <AdUnit slot="9876543210" format="horizontal" className="mb-8 max-w-4xl" />

        {renderActiveTab()}

        {/* Mid-Content Ad Banner (Engages users reading informative guide segments) */}
        <AdUnit slot="1234567890" format="auto" className="mt-12 max-w-4xl" />
      </main>

      {/* Footer containing legal & external tool descriptions */}
      <Footer
        onSelectTab={setActiveTab}
        onShowUtilityDialog={(title, content) =>
          setUtilityDialog({ isOpen: true, title, content })
        }
      />

      {/* Word Details Modal System */}
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

      {/* Custom Utility and Terms Dialog */}
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
