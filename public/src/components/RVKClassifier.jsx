import React, { useState } from 'react';
import { Search, BookOpen, TreePine, ArrowRight, Copy, ExternalLink, Book, Target, Lightbulb, Star, FileText, Zap, Brain, Database } from 'lucide-react';
import { parsePicaData } from '../utils/picaParser';
import { analyzePicaWithLLM } from '../utils/llmAnalyzer';
import { findRVKNotations } from '../utils/rvkMatcher';
import { getExamplePicaData } from '../utils/exampleData';

const RVKClassifier = () => {
  const [searchMode, setSearchMode] = useState('pica');
  const [searchTerm, setSearchTerm] = useState('');
  const [picaData, setPicaData] = useState('');
  const [parsedPica, setParsedPica] = useState(null);
  const [searchType, setSearchType] = useState('nodes');
  const [format, setFormat] = useState('json');
  const [apiUrl, setApiUrl] = useState('');
  const [results, setResults] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [llmAnalysis, setLlmAnalysis] = useState(null);

  const generateApiUrl = (type, term, outputFormat) => {
    const baseUrl = 'http://rvk.uni-regensburg.de/api';
    const testUrl = 'http://rvk.uni-regensburg.de/apitest';
    
    const useTestApi = outputFormat === 'jsonp';
    const base = useTestApi ? testUrl : baseUrl;
    
    return `${base}/${outputFormat}/${type}/${encodeURIComponent(term)}`;
  };

  const handlePicaAnalysis = async () => {
    if (!picaData.trim()) return;
    
    setLoading(true);
    setResults(null);
    setSuggestions([]);
    setParsedPica(null);
    setLlmAnalysis(null);
    
    setTimeout(() => {
      // 1. PICA parsen
      const parsed = parsePicaData(picaData);
      setParsedPica(parsed);
      
      // 2. LLM-Analyse
      const analysis = analyzePicaWithLLM(parsed);
      setLlmAnalysis(analysis);
      
      // 3. RVK-Vorschläge
      const rvkSuggestions = findRVKNotations(parsed, analysis);
      setSuggestions(rvkSuggestions);
      
      setLoading(false);
    }, 1500);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const searchTypes = [
    { value: 'nodes', label: 'Begriffssuche', description: 'Suche nach Begriff in Benennung und Register' },
    { value: 'register', label: 'Registersuche', description: 'Suche im RVK-Register' },
    { value: 'node', label: 'Notation abrufen', description: 'Spezifische Notation abfragen' }
  ];

  const formats = [
    { value: 'json', label: 'JSON' },
    { value: 'xml', label: 'XML' },
    { value: 'jsonp', label: 'JSONP' }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <div className="bg-white rounded-xl shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Database className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-800">PICA-RVK Klassifikator</h1>
          </div>
          <p className="text-gray-600">PICA-Daten intelligent analysieren und RVK-Notationen vorschlagen</p>
        </div>

        {/* Modus-Auswahl */}
        <div className="flex justify-center mb-6">
          <div className="bg-gray-100 rounded-lg p-1 flex">
            <button
              onClick={() => setSearchMode('pica')}
              className={`px-4 py-2 rounded-md transition-colors ${
                searchMode === 'pica' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <FileText className="h-4 w-4 inline mr-2" />
              PICA-Analyse
            </button>
            <button
              onClick={() => setSearchMode('direct')}
              className={`px-4 py-2 rounded-md transition-colors ${
                searchMode === 'direct' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Search className="h-4 w-4 inline mr-2" />
              Direkte Suche
            </button>
          </div>
        </div>

        {/* PICA-Eingabe */}
        {searchMode === 'pica' && (
          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">PICA-Daten eingeben</h3>
              <button
                onClick={() => setPicaData(getExamplePicaData())}
                className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
              >
                <Lightbulb className="h-4 w-4 mr-1" />
                Beispiel laden
              </button>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PICA-Format Daten *
              </label>
              <textarea
                value={picaData}
                onChange={(e) => setPicaData(e.target.value)}
                placeholder="Hier PICA-Daten einfügen... (z.B. 4000 $aTitel, 3000 $aAutor, etc.)"
                rows="12"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              />
            </div>

            <button
              onClick={handlePicaAnalysis}
              disabled={!picaData.trim() || loading}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              <Zap className="h-5 w-5 mr-2" />
              PICA analysieren & RVK vorschlagen
            </button>
          </div>
        )}

        {/* Direkte Suche */}
        {searchMode === 'direct' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Suchtyp</label>
              <select 
                value={searchType} 
                onChange={(e) => setSearchType(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {searchTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
              <select 
                value={format} 
                onChange={(e) => setFormat(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {formats.map(fmt => (
                  <option key={fmt.value} value={fmt.value}>{fmt.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Suchbegriff</label>
              <div className="flex">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="z.B. Machine Learning"
                  className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => setApiUrl(generateApiUrl(searchType, searchTerm, format))}
                  disabled={!searchTerm.trim()}
                  className="px-4 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">
              {searchMode === 'pica' ? 'Analysiere PICA-Daten mit LLM...' : 'Suche läuft...'}
            </p>
          </div>
        )}

        {/* Geparste PICA-Daten */}
        {parsedPica && !loading && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Extrahierte Metadaten (K10plus-Format)
            </h4>
            
            {/* Grunddaten */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
              <div>
                <strong>Titel (4000):</strong> {parsedPica.title}
                {parsedPica.subtitle && <div><strong>Paralleltitel (4002):</strong> {parsedPica.subtitle}</div>}
                <div><strong>Autor (3000/3001):</strong> {parsedPica.author}</div>
                <div><strong>Jahr (1100):</strong> {parsedPica.year}</div>
                <div><strong>Verlag (4030):</strong> {parsedPica.publisher}</div>
                <div><strong>ISBN (2000):</strong> {parsedPica.isbn}</div>
                {parsedPica.issn && <div><strong>ISSN (2005):</strong> {parsedPica.issn}</div>}
                <div><strong>Sprache (1500):</strong> {parsedPica.language}</div>
              </div>
              <div>
                <div><strong>Schlagwörter (5100-5199):</strong> {parsedPica.subjects.join(', ')}</div>
                <div><strong>Lokale Keywords (6500-6599):</strong> {parsedPica.keywords.join(', ')}</div>
                {parsedPica.rvkNotations.length > 0 && (
                  <div className="text-green-700"><strong>Vorh. RVK-Notationen (5090):</strong> {parsedPica.rvkNotations.join(', ')}</div>
                )}
                {parsedPica.rvkInvalid.length > 0 && (
                  <div className="text-red-600"><strong>Ungültige RVK (5091):</strong> {parsedPica.rvkInvalid.join(', ')}</div>
                )}
                {parsedPica.thesis && <div><strong>Hochschulschrift (4204):</strong> {parsedPica.thesis}</div>}
                {parsedPica.catalogUrl && <div><strong>Katalog-URL (4960):</strong> <a href={parsedPica.catalogUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Link</a></div>}
              </div>
            </div>

            {/* Klassifikationssysteme */}
            {Object.values(parsedPica.classifications).some(arr => arr.length > 0) && (
              <div className="mb-4">
                <h5 className="font-medium text-gray-700 mb-2">📚 Klassifikationssysteme:</h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                  {parsedPica.classifications.ddc.length > 0 && (
                    <div><strong>DDC (5010):</strong> {parsedPica.classifications.ddc.join(', ')}</div>
                  )}
                  {parsedPica.classifications.ddcFull.length > 0 && (
                    <div><strong>DDC vollständig (5400-5499):</strong> {parsedPica.classifications.ddcFull.join(', ')}</div>
                  )}
                  {parsedPica.classifications.nlm.length > 0 && (
                    <div><strong>NLM (5040):</strong> {parsedPica.classifications.nlm.join(', ')}</div>
                  )}
                  {parsedPica.classifications.mesh.length > 0 && (
                    <div><strong>MeSH (5510):</strong> {parsedPica.classifications.mesh.join(', ')}</div>
                  )}
                  {parsedPica.classifications.stw.length > 0 && (
                    <div><strong>STW (5200-5229):</strong> {parsedPica.classifications.stw.join(', ')}</div>
                  )}
                  {parsedPica.classifications.basis.length > 0 && (
                    <div><strong>Basisklassifikation (5301):</strong> {parsedPica.classifications.basis.join(', ')}</div>
                  )}
                </div>
              </div>
            )}

            {parsedPica.abstract && (
              <div className="mt-3">
                <strong>Abstract (4207):</strong> {parsedPica.abstract}
              </div>
            )}
          </div>
        )}

        {/* LLM-Analyse */}
        {llmAnalysis && !loading && (
          <div className="mb-6 p-4 bg-purple-50 rounded-lg">
            <h4 className="font-semibold text-purple-800 mb-3 flex items-center">
              <Brain className="h-5 w-5 mr-2" />
              LLM-Themenanalyse mit Klassifikationskontext
            </h4>
            <div className="space-y-2">
              <div><strong>Hauptfachgebiet:</strong> {llmAnalysis.primarySubject}</div>
              <div><strong>Erkannte Themen:</strong> {llmAnalysis.detectedThemes.join(', ')}</div>
              <div className="text-sm text-purple-700">{llmAnalysis.recommendation}</div>
            </div>
          </div>
        )}

        {/* RVK-Vorschläge */}
        {suggestions.length > 0 && !loading && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Empfohlene RVK-Notationen ({suggestions.length})
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {suggestions.map((suggestion, index) => (
                <div key={index} className="bg-white border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl font-bold text-blue-700">{suggestion.notation}</span>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm text-gray-600 ml-1">{suggestion.relevance}%</span>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-1">{suggestion.benennung}</p>
                      <p className="text-sm text-gray-500 mb-1">Fachgebiet: {suggestion.subject}</p>
                      <p className="text-xs text-blue-600">
                        {suggestion.source}: "{suggestion.keyword}" ({suggestion.frequency}× gefunden)
                      </p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(suggestion.notation)}
                      className="text-blue-600 hover:text-blue-800 ml-2"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* API URL für direkte Suche */}
        {apiUrl && searchMode === 'direct' && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-700">Generierte API-URL:</h3>
              <button onClick={() => copyToClipboard(apiUrl)} className="text-blue-600 hover:text-blue-800 text-sm">
                <Copy className="h-4 w-4 mr-1 inline" />Kopieren
              </button>
            </div>
            <code className="text-sm bg-white p-2 rounded border block break-all">{apiUrl}</code>
          </div>
        )}

        {/* Keine Ergebnisse */}
        {searchMode === 'pica' && picaData && suggestions.length === 0 && !loading && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
            <p className="text-yellow-800">
              Für die eingegebenen PICA-Daten konnten keine passenden RVK-Notationen gefunden werden. 
              Probieren Sie das Beispiel oder andere PICA-Daten.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RVKClassifier;
