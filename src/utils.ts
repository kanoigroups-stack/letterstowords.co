import { COMMON_WORDS, getScrabblePoints } from './data/words';
import { UnscrambleOptions, GroupedResults } from './types';

// Count characters in a string
export function countChars(str: string): { [char: string]: number } {
  const counts: { [char: string]: number } = {};
  const upper = str.toUpperCase();
  for (let i = 0; i < upper.length; i++) {
    const char = upper[i];
    if (/[A-Z]/.test(char)) {
      counts[char] = (counts[char] || 0) + 1;
    }
  }
  return counts;
}

// Check if a word can be formed of available letters plus given count of wildcards (? or *)
export function canFormWord(
  candidateWord: string,
  rackCounts: { [char: string]: number },
  wildcardCount: number
): boolean {
  const wordCounts = countChars(candidateWord);
  let neededWildcards = 0;

  for (const char in wordCounts) {
    const needed = wordCounts[char];
    const available = rackCounts[char] || 0;
    if (needed > available) {
      neededWildcards += (needed - available);
    }
  }

  return neededWildcards <= wildcardCount;
}

// Solve Unscramble
export function solveUnscramble(
  inputLetters: string,
  options: UnscrambleOptions
): GroupedResults {
  const cleanInput = inputLetters.toUpperCase();
  
  // Count wildcards from input letters
  let inputWildcardCount = 0;
  for (let i = 0; i < cleanInput.length; i++) {
    if (cleanInput[i] === '?' || cleanInput[i] === '*') {
      inputWildcardCount++;
    }
  }

  const startsWith = options.startsWith.toUpperCase().trim();
  const endsWith = options.endsWith.toUpperCase().trim();
  const mustInclude = options.mustInclude.toUpperCase().trim();

  // Combine letters in hand with board constraints to ensure matching words are checkable
  // For example if you have "PLE" and "Starts with A", the pool of tiles has A + P + L + E.
  const poolLetters = cleanInput.replace(/[^A-Z]/g, '');
  const rackCounts = countChars(poolLetters);

  const matchedWords: string[] = [];

  for (const word of COMMON_WORDS) {
    // 1. Minimum check length
    if (word.length < 2) continue;

    // 2. Starts with filter
    if (startsWith && !word.startsWith(startsWith)) continue;

    // 3. Ends with filter
    if (endsWith && !word.endsWith(endsWith)) continue;

    // 4. Must include filter
    if (mustInclude) {
      let containsAll = true;
      const wordCounts = countChars(word);
      const reqCounts = countChars(mustInclude);
      for (const char in reqCounts) {
        if ((wordCounts[char] || 0) < reqCounts[char]) {
          containsAll = false;
          break;
        }
      }
      if (!containsAll) continue;
    }

    // 5. Letter pool check using the wildcard logic
    if (canFormWord(word, rackCounts, inputWildcardCount)) {
      matchedWords.push(word);
    }
  }

  // Group by length
  const results: GroupedResults = {};
  for (const word of matchedWords) {
    const len = word.length;
    if (!results[len]) {
      results[len] = [];
    }
    results[len].push(word);
  }

  return results;
}

// Exact Anagram Solver: find words containing EXACTLY the same characters (no more, no less)
export function solveAnagram(inputWord: string): string[] {
  const cleanStr = inputWord.toUpperCase().trim().replace(/[^A-Z]/g, '');
  if (!cleanStr) return [];

  const inputCounts = countChars(cleanStr);
  const matched: string[] = [];

  for (const word of COMMON_WORDS) {
    if (word.length !== cleanStr.length) continue;
    if (word === cleanStr) continue; // Skip identical word

    const wordCounts = countChars(word);
    let isMatch = true;

    for (const char in inputCounts) {
      if (wordCounts[char] !== inputCounts[char]) {
        isMatch = false;
        break;
      }
    }

    if (isMatch) {
      matched.push(word);
    }
  }

  return matched;
}

// BUG FIX #6: Wordle Solver Assistant - Fixed duplicate letter handling
export function solveWordle(
  green: string[],
  yellow: string[][], // index 0-4: letters that cannot be in this position but ARE in the word
  gray: string
): string[] {
  const fiveLetterWords = COMMON_WORDS.filter(w => w.length === 5);
  const graySet = new Set(gray.toUpperCase().split(''));
  
  // Flatten yellow list to find what letters MUST be in the word
  const mustHaveYellow = new Set<string>();
  yellow.forEach(list => list.forEach(letter => mustHaveYellow.add(letter.toUpperCase())));

  return fiveLetterWords.filter(word => {
    // Check Green positions
    for (let i = 0; i < 5; i++) {
      if (green[i] && green[i].trim() !== '' && word[i] !== green[i].toUpperCase()) {
        return false;
      }
    }

    // BUG FIX #6: Improved Gray handling for duplicate letters
    // Count how many of each letter are "green" (confirmed exact positions)
    const greenLetterCounts: { [char: string]: number } = {};
    for (let i = 0; i < 5; i++) {
      if (green[i] && green[i].trim() !== '') {
        const letter = green[i].toUpperCase();
        greenLetterCounts[letter] = (greenLetterCounts[letter] || 0) + 1;
      }
    }

    // Check Gray list - but allow letters that appear as green elsewhere
    for (let i = 0; i < 5; i++) {
      const letter = word[i];
      if (graySet.has(letter)) {
        // Count total occurrences of this letter in the word
        const totalInWord = word.split('').filter(c => c === letter).length;
        // Count how many are confirmed green for this letter
        const greenCount = greenLetterCounts[letter] || 0;
        // Count how many are confirmed yellow for this letter
        let yellowCount = 0;
        for (let j = 0; j < 5; j++) {
          if (word[j] === letter && yellow[j] && yellow[j].includes(letter)) {
            yellowCount++;
          }
        }
        
        // If the word has MORE of this letter than green positions confirm,
        // and this letter is gray, reject it
        // But if this exact position is green, allow it
        if (green[i] === letter) continue;
        
        // Calculate minimum required occurrences from yellow clues
        const requiredFromYellow = Array.from(mustHaveYellow).filter(y => y === letter).length > 0 ? 1 : 0;
        const minimumRequired = greenCount + requiredFromYellow;
        
        // If word has more of this letter than minimum required, and it's gray, reject
        const wordLetterCount = word.split('').filter(c => c === letter).length;
        if (wordLetterCount > minimumRequired) {
          return false;
        }
      }
    }

    // Check Yellow constraints:
    // 1. Must contain all yellow letters somewhere in the word
    for (const yellowLetter of mustHaveYellow) {
      if (!word.includes(yellowLetter)) {
        return false;
      }
    }

    // 2. Cannot have a yellow letter in the specific forbidden spot
    for (let i = 0; i < 5; i++) {
      const letter = word[i];
      if (yellow[i] && yellow[i].includes(letter)) {
        return false;
      }
    }

    // BUG FIX #6: Additional check - ensure yellow letters aren't ONLY in green positions
    // (they must appear at least once in a non-green, non-yellow-forbidden position)
    for (const yellowLetter of mustHaveYellow) {
      let foundValidPosition = false;
      for (let i = 0; i < 5; i++) {
        if (word[i] === yellowLetter && green[i] !== yellowLetter && (!yellow[i] || !yellow[i].includes(yellowLetter))) {
          foundValidPosition = true;
          break;
        }
      }
      // If yellow letter only appears in green positions, that's wrong
      // (unless there are multiple occurrences)
      if (!foundValidPosition) {
        // Check if there are multiple occurrences in the word
        const occurrences = word.split('').filter(c => c === yellowLetter).length;
        const greenOccurrences = green.filter(g => g === yellowLetter).length;
        if (occurrences <= greenOccurrences) {
          return false;
        }
      }
    }

    return true;
  });
}
