/**
 * PICA-Format Parser für K10plus
 * Parst PICA-Daten und extrahiert alle relevanten Metadaten
 */

export const parsePicaData = (picaText) => {
  if (!picaText) return null;
  
  const lines = picaText.split('\n').filter(line => line.trim());
  const parsed = {
    title: '',
    subtitle: '',
    author: '',
    year: '',
    publisher: '',
    subjects: [],
    abstract: '',
    toc: '',
    isbn: '',
    issn: '',
    language: '',
    keywords: [],
    rvkNotations: [],
    rvkInvalid: [],
    notes: '',
    thesis: '',
    catalogUrl: '',
    // Klassifikationssysteme
    classifications: {
      ddc: [],
      ddcFull: [],
      asb: [],
      ssd: [],
      sfb: [],
      kab: [],
      ekz: [],
      dnbGenre: [],
      lcc: [],
      nlm: [],
      dnbOld: [],
      dnbNew: [],
      dbs: [],
      ssg: [],
      olc: [],
      fachkat: [],
      other: [],
      fivRegional: [],
      fivSubject: [],
      fivOther: [],
      basis: [],
      stw: [],
      stwAuto: [],
      stwProv: [],
      zbw: [],
      fivThemes: [],
      fivAspects: [],
      loc: [],
      mesh: [],
      thesaurus: [],
      oldPrints: [],
      projects: [],
      music: [],
      localNotations: [],
      localSubjects: []
    },
    // Anreicherungen
    enrichment: {
      ekzAnnotation: '',
      ekzReview: ''
    }
  };

  lines.forEach(line => {
    const match = line.match(/^(\d{4})\s*(.*)$/);
    if (!match) return;
    
    const [, field, content] = match;
    const cleanContent = content.replace(/\$[a-z]/g, ' ').replace(/\s+/g, ' ').trim();
    
    switch (field) {
      case '4000': // Haupttitel, Titelzusatz, Verantwortlichkeitsangabe
        parsed.title = cleanContent;
        break;
      case '4002': // Paralleltitel, paralleler Titelzusatz
        if (parsed.subtitle) parsed.subtitle += '; ';
        parsed.subtitle += cleanContent;
        break;
      case '3000': // Person/Familie als 1. geistiger Schöpfer
        parsed.author = cleanContent;
        break;
      case '3001': // 2. Verfasser
      case '3002': // weitere Verfasser
      case '3010': // Person/Familie als 2. und weiterer geistiger Schöpfer
        if (parsed.author) parsed.author += '; ';
        parsed.author += cleanContent;
        break;
      case '3100': // Körperschaft als 1. geistiger Schöpfer
      case '3110': // Körperschaft als 2. und weiterer geistiger Schöpfer
        if (parsed.author) parsed.author += '; ';
        parsed.author += cleanContent;
        break;
      case '1100': // Erscheinungsdatum/Entstehungsdatum
        parsed.year = cleanContent;
        break;
      case '4030': // Veröffentlichungsangabe
        parsed.publisher = cleanContent;
        break;
      case '4207': // Inhaltliche Zusammenfassung
        parsed.abstract += cleanContent + ' ';
        break;
      case '4222': // Angaben zu enthaltenen unselbstständigen Werken
        parsed.toc += cleanContent + ' ';
        break;
      case '4960': // URL für Kataloganreicherung
        parsed.catalogUrl = cleanContent;
        break;
      case '2000': // ISBN
        parsed.isbn = cleanContent;
        break;
      case '2005': // Autorisierte ISSN
      case '2010': // ISSN
        parsed.issn = cleanContent;
        break;
      case '1500': // Sprachcodes
        parsed.language = cleanContent;
        break;
      case '4201': // Sonstige Anmerkungen
        parsed.notes += cleanContent + ' ';
        break;
      case '4204': // Hochschulschriftenvermerk
        parsed.thesis = cleanContent;
        break;
      
      // Klassifikationssysteme
      case '5010': // DDC-Notation
        parsed.classifications.ddc.push(cleanContent);
        break;
      case '5020': // Allgemeine Systematik für Bibliotheken (ASB)
        parsed.classifications.asb.push(cleanContent);
        break;
      case '5021': // Systematik der Stadtbibliothek Duisburg (SSD)
        parsed.classifications.ssd.push(cleanContent);
        break;
      case '5022': // Systematik für Bibliotheken (SfB)
        parsed.classifications.sfb.push(cleanContent);
        break;
      case '5023': // Klassifikation für Allgemeinbibliotheken (KAB)
        parsed.classifications.kab.push(cleanContent);
        break;
      case '5024': // Systematiken der ekz
        parsed.classifications.ekz.push(cleanContent);
        break;
      case '5025': // Gattungsbegriffe (DNB)
        parsed.classifications.dnbGenre.push(cleanContent);
        break;
      case '5030': // LCC-Notation
        parsed.classifications.lcc.push(cleanContent);
        break;
      case '5040': // Klassifikation der National Library of Medicine (NLM)
        parsed.classifications.nlm.push(cleanContent);
        break;
      case '5050': // Sachgruppen der Deutschen Nationalbibliografie bis 2003
        parsed.classifications.dnbOld.push(cleanContent);
        break;
      case '5051': // Sachgruppen der Deutschen Nationalbibliografie ab 2004
        parsed.classifications.dnbNew.push(cleanContent);
        break;
      case '5055': // Deutsche Bibliotheksstatistik (DBS)
        parsed.classifications.dbs.push(cleanContent);
        break;
      case '5056': // SSG-Nummer/FID-Kennzeichen
        parsed.classifications.ssg.push(cleanContent);
        break;
      case '5057': // SSG-Angabe für thematische OLC-Ausschnitte
        parsed.classifications.olc.push(cleanContent);
        break;
      case '5058': // Selektionskennzeichen für Fachkataloge
        parsed.classifications.fachkat.push(cleanContent);
        break;
      case '5060': // Notation eines Klassifikationssystems
        parsed.classifications.other.push(cleanContent);
        break;
      case '5070': // FIV-Regionalklassifikation
        parsed.classifications.fivRegional.push(cleanContent);
        break;
      case '5071': // FIV-Sachklassifikation
        parsed.classifications.fivSubject.push(cleanContent);
        break;
      case '5072': // Sonstige Notation des FIV
        parsed.classifications.fivOther.push(cleanContent);
        break;
      case '5090': // Regensburger Verbundklassifikation (RVK)
        parsed.rvkNotations.push(cleanContent);
        break;
      case '5091': // Nicht mehr gültige Notationen der RVK
        parsed.rvkInvalid.push(cleanContent);
        break;
      case '5301': // Basisklassifikation
        parsed.classifications.basis.push(cleanContent);
        break;
      case '5500': // LoC Subject Headings
        parsed.classifications.loc.push(cleanContent);
        break;
      case '5510': // Medical Subject Headings (MeSH)
        parsed.classifications.mesh.push(cleanContent);
        break;
      case '5520': // Schlagwörter aus einem Thesaurus und freie Schlagwörter
        parsed.classifications.thesaurus.push(cleanContent);
        break;
      case '5570': // Gattungsbegriffe bei Alten Drucken
        parsed.classifications.oldPrints.push(cleanContent);
        break;
      case '5590': // Erschließung von Musikalien nach Besetzung und Form/Gattung
        parsed.classifications.music.push(cleanContent);
        break;
      case '5952': // ekz-Annotation
        parsed.enrichment.ekzAnnotation = cleanContent;
        break;
      case '5953': // ekz-Rezension
        parsed.enrichment.ekzReview = cleanContent;
        break;
    }
    
    // Bereichsabfragen für mehrstellige Felder
    const fieldNum = parseInt(field);
    
    // 5100-5199: Schlagwortfolgen (DNB und Verbünde)
    if (fieldNum >= 5100 && fieldNum <= 5199) {
      parsed.subjects.push(cleanContent);
    }
    // 5200-5229: STW-Schlagwörter
    else if (fieldNum >= 5200 && fieldNum <= 5229) {
      parsed.classifications.stw.push(cleanContent);
    }
    // 5230-5239: STW-Schlagwörter - automatisierte verbale Sacherschließung
    else if (fieldNum >= 5230 && fieldNum <= 5239) {
      parsed.classifications.stwAuto.push(cleanContent);
    }
    // 5240-5248: STW-Schlagwörter - Platzhalter
    else if (fieldNum >= 5240 && fieldNum <= 5248) {
      parsed.classifications.stwProv.push(cleanContent);
    }
    // 5249: ZBW-Schlagwörter - Veröffentlichungsart
    else if (fieldNum === 5249) {
      parsed.classifications.zbw.push(cleanContent);
    }
    // 5250: Vorläufige Schlagwörter (STW)
    else if (fieldNum === 5250) {
      parsed.classifications.stwProv.push(cleanContent);
    }
    // 5260: FIV-Schlagwörter (Themen)
    else if (fieldNum === 5260) {
      parsed.classifications.fivThemes.push(cleanContent);
    }
    // 5270: FIV-Schlagwörter (Aspekte)
    else if (fieldNum === 5270) {
      parsed.classifications.fivAspects.push(cleanContent);
    }
    // 5400-5499: DDC-Notation: Vollständige Notation
    else if (fieldNum >= 5400 && fieldNum <= 5499) {
      parsed.classifications.ddcFull.push(cleanContent);
    }
    // 5550-5559: Schlagwortfolgen (GBV, SWB, K10plus)
    else if (fieldNum >= 5550 && fieldNum <= 5559) {
      parsed.subjects.push(cleanContent);
    }
    // 5580-5589: Einzelschlagwörter (Projekte)
    else if (fieldNum >= 5580 && fieldNum <= 5589) {
      parsed.classifications.projects.push(cleanContent);
    }
    // 6300-6399: Lokale Notationen auf bibliografischer Ebene
    else if (fieldNum >= 6300 && fieldNum <= 6399) {
      parsed.classifications.localNotations.push(cleanContent);
    }
    // 6400-6499: Lokale Schlagwörter auf bibliografischer Ebene
    else if (fieldNum >= 6400 && fieldNum <= 6499) {
      parsed.classifications.localSubjects.push(cleanContent);
    }
    // 6500-6599: Lokale Schlagwörter (Exemplar-Ebene)
    else if (fieldNum >= 6500 && fieldNum <= 6599) {
      parsed.keywords.push(cleanContent);
    }
  });

  // Bereinigung
  parsed.abstract = parsed.abstract.trim();
  parsed.toc = parsed.toc.trim();
  parsed.notes = parsed.notes.trim();
  parsed.subjects = [...new Set(parsed.subjects.filter(s => s.length > 0))];
  parsed.keywords = [...new Set(parsed.keywords.filter(k => k.length > 0))];
  parsed.rvkNotations = [...new Set(parsed.rvkNotations.filter(r => r.length > 0))];
  parsed.rvkInvalid = [...new Set(parsed.rvkInvalid.filter(r => r.length > 0))];
  
  // Klassifikationssysteme bereinigen
  Object.keys(parsed.classifications).forEach(key => {
    parsed.classifications[key] = [...new Set(parsed.classifications[key].filter(item => item.length > 0))];
  });

  return parsed;
};
