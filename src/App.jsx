import React, { useState } from 'react';
import { Search, Star, GitFork, ExternalLink, BookOpen, LayoutTemplate, Code2, Menu } from 'lucide-react';
import './App.css'
const App = () => {
  const [input, setInput] = useState('');
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- 🧠 BEYİN: Mantık aynı kalıyor ---
  const generateSmartQuery = (userInput) => {
    const term = userInput.toLowerCase().trim();
    if (!term) return '';

    let query = '';
    if (term.includes('ders') || term.includes('öğren') || term.includes('kurs')) {
      const lang = term.replace(/(dersleri|ders|öğren|kurs|eğitim)/g, '').trim();
      query = `${lang} (tutorial OR roadmap OR education) sort:stars`;
    } else if (term.includes('ui') || term.includes('tasarım') || term.includes('component')) {
      const cleanTerm = term.replace(/(ui|tasarım)/g, '').trim();
      query = `${cleanTerm} topic:ui topic:component-library sort:stars`;
    } else {
      query = `awesome ${term} sort:stars`;
    }
    return query;
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!input) return;

    setLoading(true);
    setError(null);
    setRepos([]); // Önceki sonuçları temizle

    try {
      const smartQuery = generateSmartQuery(input);
      const response = await fetch(
        `https://api.github.com/search/repositories?q=${encodeURIComponent(smartQuery)}&per_page=12`
      );
      if (!response.ok) throw new Error('GitHub API limitine takıldık.');
      const data = await response.json();
      setRepos(data.items || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const quickSearch = (text) => setInput(text);

  return (
    // 1. DEĞİŞİKLİK: padding mobilde (p-4) az, masaüstünde (md:p-8) çok
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8 font-sans selection:bg-blue-500 selection:text-white">
      <div className="max-w-6xl mx-auto space-y-6 md:space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-3 py-6 md:py-10">
          {/* 2. DEĞİŞİKLİK: Yazı boyutu mobilde küçük (3xl), büyük ekranda büyük (5xl) */}
          <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            GitCuration
          </h1>
          <p className="text-slate-400 text-sm md:text-lg px-2">
            Normal arama yapma, <span className="text-white font-semibold">niyetini</span> yaz.
          </p>
        </div>

        {/* Arama Alanı */}
        <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 md:h-6 md:w-6 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
          </div>
          {/* 3. DEĞİŞİKLİK: Input yüksekliği ve text boyutu dokunmatik için optimize edildi */}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Örn: Python dersleri..."
            className="w-full pl-10 md:pl-12 pr-24 py-3 md:py-4 bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-base md:text-lg placeholder-slate-500 shadow-xl transition-all"
          />
          <button 
            type="submit"
            className="absolute right-1.5 top-1.5 bottom-1.5 px-4 md:px-6 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg font-medium text-sm md:text-base transition-colors"
          >
            Ara
          </button>
        </form>

        {/* Hızlı Etiketler (Chips) - Yatay Kaydırma Eklendi */}
        {/* 4. DEĞİŞİKLİK: Mobilde taşmaması için 'overflow-x-auto' eklendi. */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 text-sm pb-2">
          {/* Mobilde "Hızlı Dene" yazısını gizleyebiliriz veya küçük tutabiliriz */}
          <span className="hidden md:inline text-slate-500 py-1">Hızlı Dene:</span>
          {[
            { label: 'Javascript Dersleri', icon: <BookOpen size={14} /> },
            { label: 'React UI', icon: <LayoutTemplate size={14} /> },
            { label: 'Go Roadmap', icon: <GitFork size={14} /> },
            { label: 'Python Script', icon: <Code2 size={14} /> },
          ].map((chip) => (
            <button
              key={chip.label}
              onClick={() => quickSearch(chip.label)}
              // Dokunmatik ekranlar için butonları biraz daha rahat basılabilir yaptık
              className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full transition-colors text-slate-300 text-xs md:text-sm whitespace-nowrap"
            >
              {chip.icon}
              {chip.label}
            </button>
          ))}
        </div>

        {/* Yükleniyor */}
        {loading && (
          <div className="text-center py-8 md:py-12">
            <div className="w-10 h-10 md:w-12 md:h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        )}

        {/* Hata */}
        {error && (
          <div className="mx-2 p-4 bg-red-900/20 border border-red-900/50 text-red-200 rounded-lg text-center text-sm md:text-base">
            {error}
          </div>
        )}

        {/* Sonuç Listesi */}
        {/* 5. DEĞİŞİKLİK: Grid yapısı -> Mobilde 1, Tablette 2, PC'de 3 sütun */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 pb-10">
          {repos.map((repo) => (
            <div key={repo.id} className="bg-slate-800 border border-slate-700/50 rounded-xl p-5 md:p-6 hover:border-blue-500/50 shadow-md hover:shadow-lg transition-all group flex flex-col">
              
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                   <img src={repo.owner.avatar_url} alt={repo.owner.login} className="w-6 h-6 rounded-full" />
                   <span className="text-xs text-slate-400 truncate max-w-[100px]">{repo.owner.login}</span>
                </div>
                <div className="flex items-center gap-1 text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded text-xs font-mono">
                  <Star size={12} fill="currentColor" />
                  {/* Büyük sayıları kısalt (15k gibi) - basit gösterim */}
                  {repo.stargazers_count > 1000 ? (repo.stargazers_count / 1000).toFixed(1) + 'k' : repo.stargazers_count}
                </div>
              </div>
              
              <h3 className="text-lg md:text-xl font-bold text-blue-400 group-hover:text-blue-300 mb-2 line-clamp-1 break-all">
                {repo.name}
              </h3>
              
              <p className="text-slate-400 text-sm mb-4 line-clamp-3 flex-grow leading-relaxed">
                {repo.description || "Açıklama girilmemiş."}
              </p>

              <div className="pt-4 border-t border-slate-700 flex justify-between items-center mt-auto">
                 <span className="text-xs px-2 py-1 bg-slate-700 rounded text-slate-300 truncate max-w-[80px]">
                    {repo.language || "N/A"}
                 </span>
                 <a 
                  href={repo.html_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  // Mobilde butonun daha kolay tıklanması için padding artırılabilir veya touch target büyütülebilir
                  className="flex items-center gap-1 text-sm text-blue-400 hover:underline active:text-blue-300"
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