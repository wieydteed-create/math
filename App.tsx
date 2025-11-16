
import React, { useState, useCallback } from 'react';
import { GRADE_LEVELS } from './constants';
import { analyzeFormula } from './services/geminiService';

const LoadingSpinner: React.FC<{ size?: string }> = ({ size = 'w-5 h-5' }) => (
  <svg className={`animate-spin text-white ${size}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const App: React.FC = () => {
  const [grade, setGrade] = useState<string>(GRADE_LEVELS[9]); // 고1 기본값
  const [formula, setFormula] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    if (!formula.trim()) {
      setError('분석할 공식을 입력해주세요.');
      return;
    }
    setError(null);
    setIsLoading(true);
    setResponse('');

    try {
      const result = await analyzeFormula(grade, formula);
      setResponse(result);
    } catch (e) {
      setError('공식 분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [grade, formula]);

  const ResponseDisplay: React.FC = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center p-10 bg-slate-50 rounded-lg">
          <LoadingSpinner size="w-12 h-12" />
          <p className="mt-4 text-slate-600 font-semibold">AI가 공식을 분석하고 있습니다...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg" role="alert">
          <p className="font-bold">오류</p>
          <p>{error}</p>
        </div>
      );
    }

    if (response) {
      // Simple Markdown-like rendering
      const lines = response.split('\n');
      return (
        <div className="bg-slate-50 p-6 rounded-lg prose prose-slate max-w-none">
          {lines.map((line, index) => {
            if (line.startsWith('### ')) {
              return <h3 key={index} className="text-xl font-bold mt-4 mb-2 text-slate-800">{line.substring(4)}</h3>;
            }
            if (line.startsWith('`') && line.endsWith('`')) {
              return <pre key={index} className="bg-slate-200 p-3 rounded-md text-slate-800 font-mono text-sm whitespace-pre-wrap">{line.slice(1, -1)}</pre>;
            }
            return <p key={index} className="my-2 leading-relaxed">{line}</p>;
          })}
        </div>
      );
    }
    
    return (
      <div className="text-center p-10 bg-slate-50 rounded-lg">
        <p className="text-slate-500">궁금한 수학 공식을 입력하고 AI 분석을 시작하세요!</p>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center p-4 sm:p-6 lg:p-8 text-slate-800">
      <header className="text-center my-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          AI 수학 공식 도우미
        </h1>
        <p className="mt-3 text-lg text-slate-600 max-w-2xl mx-auto">
          복잡한 수학 공식, AI와 함께라면 더 이상 어렵지 않아요.
        </p>
      </header>

      <main className="w-full max-w-2xl">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 sm:p-8 space-y-6 transition-all">
          <div>
            <label htmlFor="grade-select" className="block text-sm font-medium text-slate-700 mb-2">
              학년 선택
            </label>
            <select
              id="grade-select"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm"
            >
              {GRADE_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="formula-input" className="block text-sm font-medium text-slate-700 mb-2">
              수학 공식 입력
            </label>
            <textarea
              id="formula-input"
              rows={4}
              value={formula}
              onChange={(e) => setFormula(e.target.value)}
              placeholder="예: a² + b² = c²"
              className="mt-1 block w-full text-base border-slate-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm transition"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !formula.trim()}
            className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? <LoadingSpinner /> : null}
            {isLoading ? '분석 중...' : 'AI로 분석하기'}
          </button>
        </form>

        <section className="mt-8">
          <ResponseDisplay />
        </section>
      </main>

      <footer className="text-center py-8 mt-auto">
        <p className="text-sm text-slate-500">Powered by Gemini API</p>
      </footer>
    </div>
  );
};

export default App;
