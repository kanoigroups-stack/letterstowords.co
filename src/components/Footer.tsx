import { TabType } from '../types';

interface FooterProps {
  onSelectTab: (tab: TabType) => void;
  onShowUtilityDialog: (title: string, content: string) => void;
}

export default function Footer({ onSelectTab, onShowUtilityDialog }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-[#e2e8f0] w-full py-8 mt-auto transition-colors duration-100 font-sans">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Column */}
        <div className="space-y-3">
          <span className="font-semibold text-lg text-[#131b2e] opacity-90 block flex items-center gap-1">
            Letters<span className="text-[#004ac6]">to</span>Words
          </span>
          <nav className="flex flex-wrap gap-x-4 gap-y-2">
            <button
              type="button"
              className="text-[#505f76] hover:text-[#004ac6] hover:underline transition-all duration-100 text-xs font-semibold bg-transparent border-none cursor-pointer"
              onClick={() =>
                onShowUtilityDialog(
                  'Crossword Solver',
                  'Our integrated Crossword Solver is configured via the Letters to Words tool! Simply use wildcards (? or *) as blanks for letters you do not know. For example, search "A?P?E" to discover words that match the pattern, such as "APPLE"!'
                )
              }
            >
              Crossword Solver
            </button>
            <button
              type="button"
              className="text-[#505f76] hover:text-[#004ac6] hover:underline transition-all duration-100 text-xs font-semibold bg-transparent border-none cursor-pointer"
              onClick={() =>
                onShowUtilityDialog(
                  'Scrabble Help',
                  'To get optimal Scrabble and Words with Friends lists, toggle the advanced panel on the Home Tab. You can specify dictionaries like ENABLE (for Words with Friends) or NWL (standard North American Scrabble), and filter by exact starting/ending positions!'
                )
              }
            >
              Scrabble Help
            </button>
            <button
              type="button"
              className="text-[#505f76] hover:text-[#004ac6] hover:underline transition-all duration-100 text-xs font-semibold bg-transparent border-none cursor-pointer"
              onClick={() =>
                onShowUtilityDialog(
                  'Rhyme Finder',
                  'Looking for rhyming words? Open the Home Tab, toggle Advanced Options, and specify the letters you want the word to finish with in the "Ends with" box! This generates custom rhyming words ending with your specific suffix.'
                )
              }
            >
              Rhyme Finder
            </button>
          </nav>
        </div>

        {/* Right Column */}
        <div className="space-y-3 md:text-right flex flex-col md:items-end justify-end">
          <nav className="flex flex-wrap md:justify-end gap-x-4 gap-y-2">
            <button
              type="button"
              className="text-[#505f76] hover:text-[#004ac6] hover:underline transition-all duration-100 text-xs font-semibold bg-transparent border-none cursor-pointer"
              onClick={() =>
                onShowUtilityDialog(
                  'Privacy Policy',
                  'Your privacy is our priority. Because Letters to Words executes entirely client-side on your device, none of the letters, search words, crossword solves, or game plays are transmitted to any server. Your session is 100% private and offline-first.'
                )
              }
            >
              Privacy Policy
            </button>
            <button
              type="button"
              className="text-[#505f76] hover:text-[#004ac6] hover:underline transition-all duration-100 text-xs font-semibold bg-transparent border-none cursor-pointer"
              onClick={() =>
                onShowUtilityDialog(
                  'Terms of Service',
                  'Welcome to Letters to Words. By utilizing this offline-capable solver, you agree to play responsibly, enjoy training your word vocabulary, and have fun expanding your dictionary memory in Scrabble, Wordle, and anagram puzzles.'
                )
              }
            >
              Terms of Service
            </button>
            {/* BUG FIX #8: Sitemap now links to actual sitemap.xml file instead of showing a dialog */}
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#505f76] hover:text-[#004ac6] hover:underline transition-all duration-100 text-xs font-semibold cursor-pointer"
            >
              Sitemap
            </a>
          </nav>
          <p className="text-xs text-[#505f76]">
            © {currentYear} Letters to Words. All rights reserved. Made in beautiful high-contrast slate layout.
          </p>
        </div>
      </div>
    </footer>
  );
}
