/**
 * nameMatcher.js
 * Code-based beneficiary name matching without AI.
 * Handles:
 * - Case & whitespace normalisation
 * - Honorific stripping (Devi, Kumari, Smt, etc.)
 * - Initials matching ("Sunita Devi" vs "Sunita D.")
 * - Devanagari to English transliteration ("सुनीता देवी" vs "Sunita Devi")
 * - Phonetic spelling variants (ee/i, oo/u, v/w)
 * - Safe messaging: Says "Possible name difference found", NEVER "fraud".
 */

// Devanagari unicode mapping
const DEVANAGARI_MAP = {
  // Independent Vowels
  'अ': 'a', 'आ': 'a', 'इ': 'i', 'ई': 'i', 'उ': 'u', 'ऊ': 'u',
  'ऋ': 'ri', 'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au',
  // Matras (Vowel signs)
  'ा': 'a', 'ि': 'i', 'ी': 'i', 'ु': 'u', 'ू': 'u',
  'ृ': 'ri', 'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au',
  'ं': 'n', 'ँ': 'n', 'ः': 'h',
  // Consonants
  'क': 'k', 'ख': 'kh', 'ग': 'g', 'घ': 'gh', 'ङ': 'ng',
  'च': 'ch', 'छ': 'chh', 'ज': 'j', 'झ': 'jh', 'ञ': 'ny',
  'ट': 't', 'ठ': 'th', 'ड': 'd', 'ढ': 'dh', 'ण': 'n',
  'त': 't', 'थ': 'th', 'द': 'd', 'ध': 'dh', 'न': 'n',
  'प': 'p', 'फ': 'ph', 'ब': 'b', 'भ': 'bh', 'म': 'm',
  'य': 'y', 'र': 'r', 'ल': 'l', 'व': 'v',
  'श': 'sh', 'ष': 'sh', 'स': 's', 'ह': 'h',
  'क्ष': 'ksh', 'त्र': 'tr', 'ज्ञ': 'gy',
  'ड़': 'd', 'ढ़': 'dh', 'ज़': 'z', 'फ़': 'f', 'क़': 'k', 'ख़': 'kh', 'ग़': 'gh'
};

const HONORIFICS = new Set([
  // English
  'smt', 'shrimati', 'smti', 'devi', 'kumari', 'km', 'bai', 'ben',
  'khatoon', 'begum', 'mrs', 'ms', 'miss', 'dr', 'shri', 'mr', 'w/o', 'd/o', 's/o',
  // Transliterated / Hindi
  'shrimatee', 'shreemati', 'ku',
  'श्रीमती', 'देवी', 'कुमारी', 'कु', 'बाई', 'बेन', 'खातून', 'बेगम', 'श्री'
]);

/**
 * Transliterates Devanagari text to Roman phonetic Latin characters
 */
export function transliterateDevanagari(text) {
  if (!text) return '';
  let result = '';
  const len = text.length;

  for (let i = 0; i < len; i++) {
    const char = text[i];
    const nextChar = i + 1 < len ? text[i + 1] : '';

    if (char === '्') {
      // Halant suppresses inherent vowel; skip
      continue;
    }

    if (DEVANAGARI_MAP[char]) {
      result += DEVANAGARI_MAP[char];
    } else {
      result += char;
    }
  }

  return result;
}

/**
 * Normalises phonetic variations common in Indian English
 */
export function phoneticSimplify(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/ee/g, 'i')
    .replace(/oo/g, 'u')
    .replace(/w/g, 'v')
    .replace(/sh/g, 's')
    .replace(/aa/g, 'a')
    .replace(/(.)\1+/g, '$1'); // Collapse consecutive duplicate letters
}

/**
 * Clean and tokenize a name into an array of words, stripping honorifics
 */
export function tokenizeName(name, stripHonorifics = true) {
  if (!name || typeof name !== 'string') return [];

  // Transliterate if Hindi / Devanagari
  const romanized = transliterateDevanagari(name);

  // Lowercase, remove special characters except spaces and letters/digits
  const cleaned = romanized
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const rawTokens = cleaned.split(' ').filter(Boolean);

  if (!stripHonorifics) {
    return rawTokens;
  }

  const filtered = rawTokens.filter(t => !HONORIFICS.has(t));
  // If stripping left nothing, fallback to rawTokens
  return filtered.length > 0 ? filtered : rawTokens;
}

/**
 * Calculate Levenshtein Distance
 */
export function levenshteinDistance(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          Math.min(
            matrix[i][j - 1] + 1,     // insertion
            matrix[i - 1][j] + 1      // deletion
          )
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Similarity ratio between two strings [0.0 - 1.0]
 */
export function stringSimilarity(str1, str2) {
  const s1 = phoneticSimplify(str1);
  const s2 = phoneticSimplify(str2);
  if (s1 === s2) return 1.0;
  const maxLen = Math.max(s1.length, s2.length);
  if (maxLen === 0) return 1.0;
  const dist = levenshteinDistance(s1, s2);
  return Math.max(0, 1 - dist / maxLen);
}

/**
 * Checks if a single token matches another by exact match, phonetic similarity, or initial
 */
function tokenMatches(t1, t2) {
  if (!t1 || !t2) return false;
  const p1 = phoneticSimplify(t1);
  const p2 = phoneticSimplify(t2);

  if (p1 === p2) return true;

  // Single letter initial match: e.g. 'd' and 'devi', or 's' and 'sunita'
  if (t1.length === 1 || t2.length === 1) {
    return t1[0] === t2[0];
  }

  // High phonetic similarity
  return stringSimilarity(t1, t2) >= 0.8;
}

/**
 * Primary comparison function
 * Returns: {
 *   match: boolean,
 *   score: number (0 - 1),
 *   percentage: number (0 - 100),
 *   status: 'matched' | 'difference_found',
 *   message_hi: string,
 *   message_en: string,
 *   name1: string,
 *   name2: string
 * }
 */
export function compareBeneficiaryNames(name1, name2) {
  const raw1 = (name1 || '').trim();
  const raw2 = (name2 || '').trim();

  if (!raw1 || !raw2) {
    return {
      match: false,
      score: 0,
      percentage: 0,
      status: 'difference_found',
      message_hi: 'नाम अनुपलब्ध है',
      message_en: 'Name not provided',
      name1: raw1,
      name2: raw2
    };
  }

  // 1. Tokenize with and without honorifics
  const tokens1Clean = tokenizeName(raw1, true);
  const tokens2Clean = tokenizeName(raw2, true);
  const tokens1Raw = tokenizeName(raw1, false);
  const tokens2Raw = tokenizeName(raw2, false);

  // If exact match after Devanagari transliteration & lowercase
  const str1 = tokens1Clean.join(' ');
  const str2 = tokens2Clean.join(' ');
  if (str1 === str2 && str1.length > 0) {
    return {
      match: true,
      score: 1.0,
      percentage: 100,
      status: 'matched',
      message_hi: 'दोनों दस्तावेज़ों में नाम पूरी तरह मेल खाता है',
      message_en: 'Names match across documents',
      name1: raw1,
      name2: raw2
    };
  }

  // 2. Token-by-token comparison (handles initials, ordering, honorific omission)
  const setA = tokens1Clean.length > 0 ? tokens1Clean : tokens1Raw;
  const setB = tokens2Clean.length > 0 ? tokens2Clean : tokens2Raw;

  let matchedTokens = 0;
  const usedB = new Set();

  for (let i = 0; i < setA.length; i++) {
    for (let j = 0; j < setB.length; j++) {
      if (!usedB.has(j) && tokenMatches(setA[i], setB[j])) {
        matchedTokens++;
        usedB.add(j);
        break;
      }
    }
  }

  const maxTokens = Math.max(setA.length, setB.length);
  const tokenScore = maxTokens > 0 ? matchedTokens / maxTokens : 0;

  // 3. Overall string phonetic similarity
  const overallSim = stringSimilarity(str1, str2);

  // 4. Also check if the primary first name matches
  const firstNameMatch = setA.length > 0 && setB.length > 0 && tokenMatches(setA[0], setB[0]);

  // Combined score
  const finalScore = Math.max(tokenScore, overallSim);
  const percentage = Math.round(finalScore * 100);

  // Consider it a match if:
  // - High overall similarity (>= 0.75), OR
  // - All tokens in the shorter name matched (e.g. "Sunita" in "Sunita Devi", or "Sunita D." vs "Sunita Devi") AND first name matches
  const isMatch = (finalScore >= 0.75) || (firstNameMatch && matchedTokens >= Math.min(setA.length, setB.length));

  if (isMatch) {
    return {
      match: true,
      score: finalScore,
      percentage,
      status: 'matched',
      message_hi: 'दस्तावेज़ों में नाम मेल खाता है',
      message_en: 'Names match with acceptable spelling/initial tolerance',
      name1: raw1,
      name2: raw2
    };
  }

  // Safe messaging: Never say fraud!
  return {
    match: false,
    score: finalScore,
    percentage,
    status: 'difference_found',
    message_hi: 'संभावित नाम में अंतर पाया गया। कृपया दोनों नामों की पुष्टि करें।',
    message_en: 'Possible name difference found. Please confirm or correct both names.',
    name1: raw1,
    name2: raw2
  };
}
