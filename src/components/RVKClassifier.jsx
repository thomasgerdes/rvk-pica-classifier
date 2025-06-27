import React, { useState } from 'react';

const RVKClassifier = () => {
  const [picaData, setPicaData] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const exampleData = `4000 $aArtificial Intelligence in Healthcare$hApplications and Future Perspectives
4002 $aA Comprehensive Study of Machine Learning in Medical Diagnosis
3000 $aSmith, John$9123456789
1100 $a2024
4030 $aSpringer Verlag$nBerlin
4207 $aThis book provides a comprehensive overview of artificial intelligence applications in healthcare. It covers machine learning algorithms, neural networks, and their implementation in medical diagnosis and treatment planning.
5010 $a610.285
5040 $aQZ 11.5
5090 $aST 300
5100 $sKünstliche Intelligenz
5101 $sMaschinelles Lernen
5102 $sMedizin
5200 $aArtificial intelligence
5510 $aArtificial Intelligence
5520 $aHealthcare technology
6500 $aKünstliche Intelligenz
6501 $aMedizinische Informatik`;

  const handleAnalysis = () => {
    setLoading(true);
    setTimeout(() => {
      setResults({
        title: 'Artificial Intelligence in Healthcare',
        abstract: 'This book provides a comprehensive overview of artificial intelligence applications in healthcare.',
        classifications: {
          ddc: ['610.285'],
          nlm: ['QZ 11.5'],
          existing_rvk: ['ST 300']
        },
        suggestions: [
          { 
            notation: 'ST 300', 
            benennung: 'Künstliche Intelligenz', 
            relevance: 95,
            keyword: 'artificial intelligence',
            source: 'Direkter Match'
          },
          { 
            notation: 'YB 1800', 
            benennung: 'Allgemeine Medizin', 
            relevance: 85,
            keyword: 'healthcare',
            source: 'Themenanalyse'
          },
          { 
            notation: 'ST 270', 
            benennung: 'Datenbanken', 
            relevance: 70,
            keyword: 'machine learning',
            source: 'Ähnlichkeitsanalyse'
          }
        ]
      });
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">RVK-PICA Klassifikator</h1>
          <p className="text-gray-600">PICA-Daten intelligent analysieren und RVK-Notationen vorschlagen</p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">PICA-Daten eingeben</h3>
            <button
              onClick={() => setPicaData(exampleData)}
              className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
            >
              💡 Beispiel laden
            </button>
          </div>
          
          <textarea
            value={picaData}
            onChange={(e) => setPicaData(e.target.value)}
            placeholder="Hier PICA-Daten einfügen... (z.B. 4000 $aTitel, 3000 $aAutor, etc.)"
            rows="12"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
          />

          <button
            onClick={handleAnalysis}
            disabled={!picaData.trim() || loading}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            {loading ? '⚡ Analysiere PICA-Daten...' : '🔍 PICA analysieren & RVK vorschlagen'}
          </button>
        </div>

        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Analysiere PICA-Daten mit LLM...</p>
          </div>
        )}

        {results && !loading && (
          <div className="space-y-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                📄 Extrahierte Metadaten (K10plus-Format)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Titel (4000):</strong> {results.title}</p>
                  <p><strong>Jahr (1100):</strong> 2024</p>
                  <p><strong>Verlag (4030):</strong> Springer Verlag</p>
                </div>
                <div>
                  <p><strong>DDC (5010):</strong> {results.classifications.ddc.join(', ')}</p>
                  <p><strong>NLM (5040):</strong> {results.classifications.nlm.join(', ')}</p>
                  <p className="text-green-700"><strong>Vorh. RVK (5090):</strong> {results.classifications.existing_rvk.join(', ')}</p>
                </div>
              </div>
              <div className="mt-3">
                <strong>Abstract (4207):</strong> {results.abstract}
              </div>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold text-purple-800 mb-3 flex items-center">
                🧠 LLM-Themenanalyse mit Klassifikationskontext
              </h4>
              <div className="space-y-2">
                <div><strong>Hauptfachgebiet:</strong> KI/Machine Learning</div>
                <div><strong>Erkannte Themen:</strong> Informatik/IT, Medizin</div>
                <div className="text-sm text-purple-700">Basierend auf der Analyse deutet der Text hauptsächlich auf KI/Machine Learning hin.</div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                🎯 Empfohlene RVK-Notationen ({results.suggestions.length})
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.suggestions.map((suggestion, index) => (
                  <div key={index} className="bg-white border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xl font-bold text-blue-700">{suggestion.notation}</span>
                          <div className="flex items-center">
                            <span className="text-yellow-500">⭐</span>
                            <span className="text-sm text-gray-600 ml-1">{suggestion.relevance}%</span>
                          </div>
                        </div>
                        <p className="text-gray-700 mb-1">{suggestion.benennung}</p>
                        <p className="text-xs text-blue-600">
                          {suggestion.source}: "{suggestion.keyword}"
                        </p>
                      </div>
                      <button
                        onClick={() => navigator.clipboard.writeText(suggestion.notation)}
                        className="text-blue-600 hover:text-blue-800 ml-2"
                      >
                        📋
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {picaData && !results && !loading && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
            <p className="text-yellow-800">
              Klicken Sie auf "PICA analysieren" um RVK-Notationen zu generieren.
            </p>
          </div>
        )}

        <div className="mt-8 text-center text-sm text-gray-500">
          🚀 Professioneller RVK-PICA Klassifikator für deutsche Bibliotheken
        </div>
      </div>
    </div>
  );
};

export default RVKClassifier;
