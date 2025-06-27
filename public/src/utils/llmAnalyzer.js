/**
 * LLM-ähnliche Textanalyse mit Klassifikationskontext
 * Erweiterte Themenanalyse für RVK-Vorschläge
 */

export const analyzePicaWithLLM = (parsedData) => {
  if (!parsedData) return null;

  const fullText = [
    parsedData.title,
    parsedData.subtitle,
    parsedData.abstract,
    parsedData.toc,
    ...parsedData.subjects,
    ...parsedData.keywords,
    ...parsedData.classifications.stw,
    ...parsedData.classifications.mesh,
    ...parsedData.classifications.loc,
    ...parsedData.classifications.thesaurus,
    parsedData.enrichment.ekzAnnotation,
    parsedData.enrichment.ekzReview
  ].join(' ').toLowerCase();

  // Themenextraktion erweitert um Klassifikationshints
  const themes = {
    'Informatik/IT': ['computer', 'software', 'algorithmus', 'datenbank', 'programmierung', 'internet', 'digital', 'system', 'tech'],
    'KI/Machine Learning': ['ki', 'artificial', 'intelligence', 'machine', 'learning', 'neural', 'deep', 'algorithm', 'ai'],
    'Medizin': ['medizin', 'medical', 'health', 'patient', 'therapy', 'clinical', 'disease', 'treatment', 'hospital'],
    'Naturwissenschaften': ['physics', 'chemistry', 'biology', 'scientific', 'research', 'laboratory', 'experiment'],
    'Geisteswissenschaften': ['literature', 'history', 'philosophy', 'culture', 'language', 'text', 'interpretation'],
    'Sozialwissenschaften': ['society', 'social', 'psychology', 'education', 'political', 'economic', 'human']
  };

  // DDC-basierte Themenanalyse
  const ddcToTheme = {
    '0': 'Informatik/IT', '1': 'Philosophie', '2': 'Religion', '3': 'Sozialwissenschaften',
    '4': 'Sprachwissenschaft', '5': 'Naturwissenschaften', '6': 'Technik/Medizin',
    '7': 'Kunst', '8': 'Literatur', '9': 'Geschichte'
  };

  const detectedThemes = [];
  const confidence = {};
  const classificationHints = [];

  // Textbasierte Themenextraktion
  Object.entries(themes).forEach(([theme, keywords]) => {
    let score = 0;
    keywords.forEach(keyword => {
      const regex = new RegExp(keyword, 'gi');
      const matches = (fullText.match(regex) || []).length;
      score += matches;
    });
    
    if (score > 0) {
      detectedThemes.push(theme);
      confidence[theme] = Math.min(100, score * 10);
    }
  });

  // DDC-basierte Themenerkennung
  if (parsedData.classifications.ddc.length > 0 || parsedData.classifications.ddcFull.length > 0) {
    const allDdc = [...parsedData.classifications.ddc, ...parsedData.classifications.ddcFull];
    allDdc.forEach(ddc => {
      const firstDigit = ddc.charAt(0);
      const theme = ddcToTheme[firstDigit];
      if (theme && !detectedThemes.includes(theme)) {
        detectedThemes.push(theme);
        confidence[theme] = (confidence[theme] || 0) + 30;
        classificationHints.push(`DDC ${ddc} → ${theme}`);
      }
    });
  }

  // Weitere Klassifikationshints
  if (parsedData.classifications.nlm.length > 0) {
    if (!detectedThemes.includes('Medizin')) {
      detectedThemes.push('Medizin');
      confidence['Medizin'] = (confidence['Medizin'] || 0) + 40;
      classificationHints.push('NLM-Klassifikation → Medizin');
    }
  }

  if (parsedData.classifications.mesh.length > 0) {
    if (!detectedThemes.includes('Medizin')) {
      detectedThemes.push('Medizin');
      confidence['Medizin'] = (confidence['Medizin'] || 0) + 35;
      classificationHints.push('MeSH-Begriffe → Medizin');
    }
  }

  // Fachgebiet-Klassifikation
  let primarySubject = 'Allgemein';
  let maxScore = 0;
  
  Object.entries(confidence).forEach(([theme, score]) => {
    if (score > maxScore) {
      maxScore = score;
      primarySubject = theme;
    }
  });

  return {
    primarySubject,
    detectedThemes,
    confidence,
    classificationHints,
    recommendation: `Basierend auf der Analyse deutet der Text hauptsächlich auf ${primarySubject} hin. Relevante Themen: ${detectedThemes.join(', ')}.`,
    usedClassifications: {
      ddc: parsedData.classifications.ddc.length + parsedData.classifications.ddcFull.length,
      nlm: parsedData.classifications.nlm.length,
      mesh: parsedData.classifications.mesh.length,
      stw: parsedData.classifications.stw.length,
      existing_rvk: parsedData.rvkNotations.length
    }
  };
};
