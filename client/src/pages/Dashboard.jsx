import { motion } from 'framer-motion';

const Dashboard = () => {
  return (
    <div className="flex-1 p-8">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto"
      >
        <h1 className="text-4xl font-bold mb-8">Welcome to your Dashboard</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="glass-panel p-6">
              <h2 className="text-2xl font-semibold mb-4">Mood Overview</h2>
              <div className="h-64 flex items-center justify-center border border-slate-700 rounded-lg border-dashed">
                <p className="text-slate-400">Chart will go here</p>
              </div>
            </div>
            <div className="glass-panel p-6">
              <h2 className="text-2xl font-semibold mb-4">Recent Journals</h2>
              <div className="space-y-4">
                <p className="text-slate-400">No recent journals.</p>
              </div>
            </div>
          </div>
          <div className="space-y-8">
            <div className="glass-panel p-6 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
              <h2 className="text-2xl font-semibold mb-4 text-primary">AI Wellness Assistant</h2>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                "It looks like you've been feeling a bit stressed lately. Taking a 5-minute deep breathing break might help center your focus."
              </p>
              <button className="w-full bg-primary/20 hover:bg-primary/30 text-primary py-2 rounded-lg transition-colors text-sm font-medium">
                Get more suggestions
              </button>
            </div>
            <div className="glass-panel p-6">
              <h2 className="text-xl font-semibold mb-4">Daily Habits</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 text-slate-300">
                  <input type="checkbox" className="w-5 h-5 rounded border-slate-600 bg-slate-800/50 text-primary focus:ring-primary focus:ring-offset-slate-900" />
                  Meditate for 10 mins
                </label>
                <label className="flex items-center gap-3 text-slate-300">
                  <input type="checkbox" className="w-5 h-5 rounded border-slate-600 bg-slate-800/50 text-primary focus:ring-primary focus:ring-offset-slate-900" />
                  Drink 2L water
                </label>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
