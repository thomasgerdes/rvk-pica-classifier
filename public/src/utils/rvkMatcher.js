/**
 * RVK-Matcher - Intelligente Zuordnung von Begriffen zu RVK-Notationen
 * Erweiterte RVK-Datenbank mit spezifischen Bereichen
 */

// Erweiterte RVK-Datenbank
const rvkDatabase = {
  // Informatik
  'computer': { notation: 'ST 110', benennung: 'Allgemeine Informatik', subject: 'Informatik' },
  'algorithmus': { notation: 'ST 134', benennung: 'Algorithmen', subject: 'Informatik' },
  'datenbank': { notation: 'ST 270', benennung: 'Datenbanken', subject: 'Informatik' },
  'machine learning': { notation: 'ST 300', benennung: 'Künstliche Intelligenz', subject: 'Informatik' },
  'ki': { notation: 'ST 300', benennung: 'Künstliche Intelligenz', subject: 'Informatik' },
  'software': { notation: 'ST 230', benennung: 'Software Engineering', subject: 'Informatik' },
  'programmierung': { notation: 'ST 250', benennung: 'Programmierung', subject: 'Informatik' },
  'netzwerk': { notation: 'ST 200', benennung: 'Rechnernetze', subject: 'Informatik' },
  'internet': { notation: 'ST 205', benennung: 'Internet', subject: 'Informatik' },
  'sicherheit': { notation: 'ST 277', benennung: 'Datensicherheit', subject: 'Informatik' },
  
  // Medizin
  'medizin': { notation: 'YB 1800', benennung: 'Allgemeine Medizin', subject: 'Medizin' },
  'chirurgie': { notation: 'YI 1000', benennung: 'Chirurgie', subject: 'Medizin' },
  'psychiatrie': { notation: 'YH 1600', benennung: 'Psychiatrie', subject: 'Medizin' },
  'kardiologie': { notation: 'YB 7200', benennung: 'Kardiologie', subject: 'Medizin' },
  'radiologie': { notation: 'YR 1600', benennung: 'Radiologie', subject: 'Medizin' },
  'pharmakologie': { notation: 'VS 5000', benennung: 'Pharmakologie', subject: 'Medizin' },
  
  // Naturwissenschaften
  'physik': { notation: 'UC 100', benennung: 'Allgemeine Physik', subject: 'Physik' },
  'quantenphysik': { notation: 'UO 4000', benennung: 'Quantenphysik', subject: 'Physik' },
  'chemie': { notation: 'VE 5000', benennung: 'Allgemeine Chemie', subject: 'Chemie' },
  'biologie': { notation: 'WC 4000', benennung: 'Allgemeine Biologie', subject: 'Biologie' },
  'mathematik': { notation: 'SK 110', benennung: 'Mathematik allgemein', subject: 'Mathematik' },
  'statistik': { notation: 'SK 850', benennung: 'Statistik', subject: 'Mathematik' },
  
  // Geisteswissenschaften
  'geschichte': { notation: 'NB 1400', benennung: 'Allgemeine Geschichte', subject: 'Geschichte' },
  'philosophie': { notation: 'CC 1000', benennung: 'Allgemeine Philosophie', subject: 'Philosophie' },
  'literatur': { notation: 'EC 1850', benennung: 'Allgemeine Literaturwissenschaft', subject: 'Literatur' },
  'linguistik': { notation: 'ES 100', benennung: 'Allgemeine Sprachwissenschaft', subject: 'Linguistik' },
  'sprachwissenschaft': { notation: 'ES 100', benennung: 'Allgemeine Sprachwissenschaft', subject: 'Linguistik' },
  
  // Sozialwissenschaften
  'psychologie': { notation: 'CW 1000', benennung: 'Allgemeine Psychologie', subject: 'Psychologie' },
  'soziologie': { notation: 'MS 1000', benennung: 'Allgemeine Soziologie', subject: 'Soziologie' },
  'pädagogik': { notation: 'DF 1000', benennung: 'Allgemeine Pädagogik', subject: 'Pädagogik' },
  'politik': { notation: 'MG 10000', benennung: 'Politikwissenschaft', subject: 'Politik' },
  'wirtschaft': { notation: 'QC 000', benennung: 'Allgemeine Wirtschaftswissenschaft', subject: 'Wirtschaft' },
  
  // Spezielle Bereiche
  'medienpaedagogik': { notation: 'DW 4000', benennung: 'Medienpädagogik', subject: 'Pädagogik' },
  'biomedizin': { notation: 'WD 4000', benennung: 'Biomedizin', subject: 'Medizin' },
  'neurologie': { notation: 'YG 4000', benennung: 'Neurologie', subject: 'Medizin' },
  'ethik': { notation: 'CC 7200', benennung: 'Ethik', subject: 'Philosophie' }
};

// Ähnlichkeitsmapping für intelligente Suche
const similarityMap = {
  'künstlich': 'ki',
  'intelligenz': 'ki',
  'lernen': 'machine learning',
  'neural': 'machine learning',
  'gesundheit': 'medizin',
  'behandlung': 'medizin',
  'diagnose': 'medizin',
  'rechner': 'computer',
  'digital': 'computer',
  'technologie': 'computer',
  'wissenschaft': 'physik',
  'forschung': 'physik',
  'analyse': 'statistik',
  'daten': 'datenbank',
  'information': 'datenbank',
  'sprache': 'linguistik',
  'text': 'linguistik',
  'gesellschaft': 'soziologie',
  'bildung': 'pädagogik',
  'lehre': 'pädagogik'
};

// Ähnlichkeitssuche für nicht-exakte Matches
const findSimilarMatch = (word) => {
  for (const [key, targetKeyword] of Object.entries(similarityMap)) {
    if (word.includes(key) || key.includes(word)) {
      const rvkInfo = rvkDatabase[targetKeyword];
      if (rvkInfo) {
        return { ...rvkInfo, relevance: rvkInfo.relevance ? rvkInfo.relevance - 10 : 70 };
      }
    }
  }
  return null;
};

// Hauptfunktion: Intelligente RVK-Suche
export const findRVKNotations = (parsedData, analysis) => {
  if (!parsedData) return [];

  const searchText = [
    parsedData.title,
    parsedData.subtitle,
    parsedData.abstract,
    parsedData.toc,
    ...parsedData.subjects,
    ...parsedData.keywords,
    ...parsedData.classifications.stw,
    ...parsedData.classifications.mesh,
    ...parsedData.classifications.loc,
    ...parsedData.classifications.thesaurus
  ].join(' ').toLowerCase();

  const suggestions = [];
  const usedNotations = new Set();

  // Direkte Keyword-Suche
  Object.entries(rvkDatabase).forEach(([keyword, rvkInfo]) => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
    const matches = (searchText.match(regex) || []).length;
    
    if (matches > 0 && !usedNotations.has(rvkInfo.notation)) {
      suggestions.push({
        ...rvkInfo,
        keyword,
        frequency: matches,
        relevance: Math.min(100, 60 + (matches * 15)),
        source: 'Direkter Match'
      });
      usedNotations.add(rvkInfo.notation);
    }
  });

  // Ähnlichkeitssuche
  Object.entries(similarityMap).forEach(([word, targetKeyword]) => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = (searchText.match(regex) || []).length;
    
    if (matches > 0) {
      const rvkInfo = rvkDatabase[targetKeyword];
      if (rvkInfo && !usedNotations.has(rvkInfo.notation)) {
        suggestions.push({
          ...rvkInfo,
          keyword: word,
          frequency: matches,
          relevance: Math.min(100, 40 + (matches * 10)),
          source: 'Ähnlichkeitsanalyse'
        });
        usedNotations.add(rvkInfo.notation);
      }
    }
  });

  return suggestions
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, 10);
};
