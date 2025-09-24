import React, { useState } from 'react';
import { FaSpellCheck } from 'react-icons/fa';

const App = () => {
  const [sentence, setSentence] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckGrammar = async () => {
    if (!sentence.trim()) {
      alert("Please enter a sentence to check!");
      return;
    }

    setIsLoading(true);
    setAnalysis('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/check-grammar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sentence }),
      });

      if (!response.ok) throw new Error('Server error');

      const data = await response.json();
      setAnalysis(data.analysis);
    } catch (error) {
      console.error("Failed to fetch analysis:", error);
      alert("Oops! Something went wrong while checking grammar.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-black text-white flex flex-col items-center p-6">
      <div className="w-full max-w-3xl mx-auto">
        <header className="text-center my-8">
          <h1 className="text-5xl font-bold text-green-400 flex items-center justify-center gap-3">
            <FaSpellCheck className="animate-bounce" />
            AI Grammar & Spelling Checker
          </h1>
          <p className="text-lg mt-2 text-gray-300">
            Type any sentence and I’ll correct grammar & spelling with explanations.
          </p>
        </header>

        <main>
          <div className="bg-white/10 p-6 rounded-2xl shadow-lg backdrop-blur-md border border-green-400/30">
            <textarea
              value={sentence}
              onChange={(e) => setSentence(e.target.value)}
              placeholder="Example: She go to school yesturday."
              className="w-full p-4 rounded-xl bg-black/50 text-green-300 placeholder-gray-400 focus:ring-2 focus:ring-green-400 focus:outline-none"
              rows="5"
            />

            <button
              onClick={handleCheckGrammar}
              disabled={isLoading}
              className="w-full mt-4 flex items-center justify-center gap-2 text-xl font-bold bg-green-400 text-black py-4 rounded-xl hover:bg-green-500 transition-transform transform hover:scale-105 disabled:bg-gray-500"
            >
              {isLoading ? (
                <>
                  <span>Checking...</span>
                  <FaSpellCheck className="animate-spin" />
                </>
              ) : (
                <>
                  <span>Check Grammar</span>
                  <FaSpellCheck />
                </>
              )}
            </button>
          </div>

          {analysis && (
            <div className="mt-8 bg-white/10 p-8 rounded-2xl shadow-2xl text-green-200 leading-relaxed">
              <h2 className="text-3xl font-bold text-center mb-4 text-green-300">Analysis</h2>
              <p className="text-lg whitespace-pre-wrap">{analysis}</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
