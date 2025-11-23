import React, { useState } from 'react';
import {
  Search,
  Star,
  GitFork,
  ExternalLink,
  BookOpen,
  LayoutTemplate,
  Code2,
} from 'lucide-react';
import './App.css'

const App = () => {
  const [input, setInput] = useState('');
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  // --- 🧠 BEYİN: Akıllı Sorgu Oluşturucu ---
  const generateSmartQuery = (userInput) => {
    const term = userInput.toLowerCase().trim();

    // Eğer boşsa döndür
    if (!term) return '';

    let query = '';

    // SENARYO 1: Eğitim ve Ders (Türkçe öncelikli)
    if (
      term.includes('ders') ||
      term.includes('öğren') ||
      term.includes('kurs')
    ) {
      const lang = term
        .replace(/(dersleri|ders|öğren|kurs|eğitim)/g, '')
        .trim();
      // Hem Türkçe dökümanları hem de global 'roadmap'leri getir
      query = `${lang} (tutorial OR roadmap OR education) sort:stars`;
    }
    // SENARYO 2: UI / Frontend
    else if (
      term.includes('ui') ||
      term.includes('tasarım') ||
      term.includes('component')
    ) {
      const cleanTerm = term.replace(/(ui|tasarım)/g, '').trim();
      query = `${cleanTerm} topic:ui topic:component-library sort:stars`;
    }
    // SENARYO 3: Genel "Awesome" (En iyi kaynaklar)
    else {
      // Eğer kullanıcı sadece "javascript" yazdıysa, ona "awesome-javascript" gibi kaliteli listeleri göster
      query = `awesome ${term} sort:stars`;
    }

    return query;
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!input) return;

    setLoading(true);
    setError(null);
    setRepos([]);

    try {
      const smartQuery = generateSmartQuery(input);
      // GitHub API'ye istek (Public API olduğu için rate limit olabilir)
      const response = await fetch(
        `https://api.github.com/search/repositories?q=${encodeURIComponent(
          smartQuery
        )}&per_page=12`
      );

      if (!response.ok)
        throw new Error('GitHub API limitine takıldık veya bir hata oluştu.');

      const data = await response.json();
      setRepos(data.items);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Hazır Hızlı Butonlar için Helper
  const quickSearch = (text) => {
    setInput(text);
    // State güncellenmesi asenkron olduğu için manuel tetikleme gerekebilir,
    // ama burada kullanıcıya tıklatıp enter'a bastırmak daha doğal hissettirebilir.
    // Biz direkt inputa yazdıralım.
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8 font-sans selection:bg-blue-500 selection:text-white">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 py-10">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            GitCuration
          </h1>
          <p className="text-slate-400 text-lg">
            Normal arama yapma,{' '}
            <span className="text-white font-semibold">niyetini</span> yaz. En
            iyi kaynakları getirelim.
          </p>
        </div>

        {/* Arama Alanı */}
        <form
          onSubmit={handleSearch}
          className="relative max-w-2xl mx-auto group"
        >
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-6 w-6 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
          </div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Örn: Python dersleri, React UI kütüphaneleri..."
            className="w-full pl-12 pr-4 py-4 bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-lg placeholder-slate-500 shadow-xl transition-all"
          />
          <button
            type="submit"
            className="absolute right-2 top-2 bottom-2 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Ara
          </button>
        </form>

        {/* Hızlı Etiketler (Chips) */}
        <div className="flex flex-wrap justify-center gap-3 text-sm">
          <span className="text-slate-500 py-1">Hızlı Dene:</span>
          {[
            { label: 'Javascript Dersleri', icon: <BookOpen size={14} /> },
            { label: 'React UI', icon: <LayoutTemplate size={14} /> },
            { label: 'Go Roadmap', icon: <GitFork size={14} /> },
            { label: 'Python Script', icon: <Code2 size={14} /> },
          ].map((chip) => (
            <button
              key={chip.label}
              onClick={() => quickSearch(chip.label)}
              className="flex items-center gap-2 px-4 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full transition-colors text-slate-300"
            >
              {chip.icon}
              {chip.label}
            </button>
          ))}
        </div>

        {/* Yükleniyor Durumu */}
        {loading && (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-slate-400">
              GitHub kütüphanesi taranıyor...
            </p>
          </div>
        )}

        {/* Hata Durumu */}
        {error && (
          <div className="p-4 bg-red-900/20 border border-red-900/50 text-red-200 rounded-lg text-center">
            {error}
          </div>
        )}

        {/* Sonuç Listesi */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {repos.map((repo) => (
            <div
              key={repo.id}
              className="bg-slate-800 border border-slate-700/50 rounded-xl p-6 hover:border-blue-500/50 hover:shadow-blue-500/10 hover:shadow-lg transition-all group flex flex-col"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <img
                    src={repo.owner.avatar_url}
                    alt={repo.owner.login}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-xs text-slate-400">
                    {repo.owner.login}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded text-xs font-mono">
                  <Star size={12} fill="currentColor" />
                  {repo.stargazers_count.toLocaleString()}
                </div>
              </div>

              <h3 className="text-xl font-bold text-blue-400 group-hover:text-blue-300 mb-2 line-clamp-1">
                {repo.name}
              </h3>

              <p className="text-slate-400 text-sm mb-4 line-clamp-3 flex-grow">
                {repo.description || 'Açıklama girilmemiş.'}
              </p>

              <div className="pt-4 border-t border-slate-700 flex justify-between items-center mt-auto">
                <span className="text-xs px-2 py-1 bg-slate-700 rounded text-slate-300">
                  {repo.language || 'Çeşitli'}
                </span>
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-blue-400 hover:underline"
                >
                  Repo'ya Git <ExternalLink size={14} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
