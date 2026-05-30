export interface UnscrambleOptions {
  dictionary: 'nwl' | 'csw' | 'enable';
  mustInclude: string;
  startsWith: string;
  endsWith: string;
}

export interface WordInfo {
  word: string;
  definition?: string;
  partOfSpeech?: string;
  points: number;
}

export type TabType = 'home' | 'dictionary' | 'descrambler' | 'anagrams' | 'wordle' | 'random';

export interface GroupedResults {
  [length: number]: string[];
}

export interface WordleState {
  guesses: string[];
  currentGuess: string;
  solution: string;
  gameStatus: 'IN_PROGRESS' | 'WON' | 'LOST';
}
