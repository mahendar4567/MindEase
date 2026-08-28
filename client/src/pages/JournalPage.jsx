import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Plus, Sparkles, X, Loader2, Save } from 'lucide-react';
import axios from 'axios';

const JournalPage = () => {
  const [entries, setEntries] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newEntry, setNewEntry] = useState({ title: '', content: '' });
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // Mock initial fetch
  useEffect(() => {
    setEntries([
      {
        _id: '1',
        title: 'A surprisingly good day',
        content: 'Today started off chaotic, but after taking a 10-minute walk, I felt much more centered. I managed to finish my project and even had time to read a few chapters of my book.',
        aiSuggestion: 'It is wonderful to hear that stepping away gave you the clarity you needed. Remember that taking breaks is not a luxury, but a necessity for your well-being.',
        date: new Date().toISOString()
      }
    ]);
  }, []);

  const handleSave = async () => {
    if (!newEntry.title || !newEntry.content) return;
    
    setIsGeneratingAI(true);
    
    try {
      // Simulate API call and AI generation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const entry = {
        _id: Date.now().toString(),
        ...newEntry,
        aiSuggestion: "Your reflection shows a lot of self-awareness. Continuing to articulate your feelings like this can profoundly impact your daily peace of mind.",
        date: new Date().toISOString()
      };
      
      setEntries([entry, ...entries]);
      setIsAdding(false);
      setNewEntry({ title: '', content: '' });
    } catch (err) {
      console.error("Failed to save journal");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <BookOpen className="text-pink-400" /> Private Journal
          </h1>
          <p className="text-slate-400">Reflect on your day, unburden your mind.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-medium transition-all shadow-lg shadow-pink-500/25"
        >
          <Plus size={20} />
          New Entry
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', marginBottom: 32 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            className="overflow-hidden"
          >
            <div className="glass-panel p-6 rounded-[2rem] border border-pink-500/30">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-white">Create Entry</h3>
                <button 
                  onClick={() => setIsAdding(false)}
                  className="p-2 rounded-full hover:bg-white/10 text-slate-400 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <input 
                type="text"
                placeholder="What's on your mind?"
                value={newEntry.title}
                onChange={(e) => setNewEntry({...newEntry, title: e.target.value})}
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-4 px-4 text-white font-medium focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all mb-4 text-lg"
              />
              
              <textarea 
                placeholder="Write your thoughts here... How are you feeling? What happened today?"
                value={newEntry.content}
                onChange={(e) => setNewEntry({...newEntry, content: e.target.value})}
                className="w-full h-48 bg-slate-900/50 border border-white/10 rounded-xl py-4 px-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all mb-6 resize-none"
              />
              
              <div className="flex justify-between items-center bg-indigo-500/10 p-4 rounded-xl border border-indigo-500/20 mb-6">
                <div className="flex items-center gap-3">
                  <Sparkles className="text-indigo-400" size={20} />
                  <span className="text-indigo-200 text-sm font-medium">AI Insight will be generated upon saving</span>
                </div>
              </div>
              
              <div className="flex justify-end gap-4">
                <button 
                  onClick={() => setIsAdding(false)}
                  className="px-6 py-3 rounded-xl font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  disabled={isGeneratingAI || !newEntry.title || !newEntry.content}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-pink-500 hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium transition-all"
                >
                  {isGeneratingAI ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                  {isGeneratingAI ? 'Saving & Analyzing...' : 'Save Entry'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-6">
        {entries.map((entry, index) => (
          <motion.div 
            key={entry._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card p-6 sm:p-8 rounded-3xl"
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-white">{entry.title}</h2>
              <span className="text-sm font-medium text-slate-400 bg-slate-900/50 px-3 py-1 rounded-full border border-white/5">
                {new Date(entry.date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
              </span>
            </div>
            
            <p className="text-slate-300 leading-relaxed mb-8 whitespace-pre-wrap">
              {entry.content}
            </p>
            
            {entry.aiSuggestion && (
              <div className="relative overflow-hidden rounded-2xl p-[1px]">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-30" />
                <div className="relative bg-[#0f172a] rounded-2xl p-6 h-full w-full">
                  <div className="flex items-center gap-2 mb-3 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400 font-semibold">
                    <Sparkles size={18} className="text-indigo-400" />
                    AI Reflection
                  </div>
                  <p className="text-indigo-100/80 leading-relaxed italic">
                    "{entry.aiSuggestion}"
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default JournalPage;
