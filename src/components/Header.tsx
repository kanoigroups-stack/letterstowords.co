import { Menu, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { TabType } from '../types';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export default function Header({ activeTab, setActiveTab }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const tabs: { id: TabType; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'dictionary', label: 'Dictionary' },
    { id: 'descrambler', label: 'Descrambler' },
    { id: 'anagrams', label: 'Anagrams' },
    { id: 'wordle', label: 'Wordle' },
    { id: 'random', label: 'Random' },
  ];

  const handleTabClick = (tabId: TabType) => {
    setActiveTab(tabId);
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // FIX #9: Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // FIX #9: Close mobile menu on Escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  return (
    <>
      <nav className="bg-white border-b border-[#e2e8f0] fixed top-0 w-full z-50 transition-colors duration-100">
        <div className="flex justify-between items-center h-16 px-6 max-w-7xl mx-auto w-full">
          <button
            type="button"
            onClick={() => handleTabClick('home')}
            className="font-sans text-2xl font-black tracking-tight text-[#131b2e] active:scale-95 transition-transform duration-100 cursor-pointer flex items-center gap-1.5"
            id="appLogo"
          >
            <span className="text-[#004ac6]">Letters</span>
            <span className="text-slate-400 font-light font-serif">to</span>
            <span className="text-[#131b2e]">Words</span>
            <span className="text-[10px] bg-[#f2f3ff] text-[#004ac6] font-extrabold px-1.5 py-0.5 rounded font-mono tracking-normal ml-0.5 border border-[#e2e7ff] align-middle">
              .co
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6 items-center h-full">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  type="button"
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`relative font-sans text-sm font-medium transition-colors duration-150 h-full px-3 flex items-center cursor-pointer ${
                    isActive
                      ? 'text-[#004ac6] border-b-2 border-[#004ac6]'
                      : 'text-[#434655] hover:text-[#004ac6]'
                  }`}
                  id={`nav-tab-${tab.id}`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Mobile Hamburguer Toggle */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-[#004ac6] p-2 rounded-full hover:bg-[#f2f3ff] transition-colors duration-100 active:scale-95 cursor-pointer"
            id="mobileMenuBtn"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {isOpen && (
          <div
            ref={menuRef}
            className="md:hidden bg-white border-b border-[#e2e8f0] py-4 px-6 animate-fade-in shadow-lg"
          >
            <div className="flex flex-col space-y-3">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    type="button"
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className={`w-full text-left py-2 px-3 rounded-md text-sm font-medium transition-colors duration-100 cursor-pointer ${
                      isActive
                        ? 'bg-[#f2f3ff] text-[#004ac6]'
                        : 'text-[#434655] hover:bg-[#faf8ff]'
                    }`}
                    id={`mobile-nav-tab-${tab.id}`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </nav>
      <div className="h-16" />
    </>
  );
}
