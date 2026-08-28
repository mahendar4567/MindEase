import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { LineChart, Shield, Zap, Sparkles } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="glass-panel p-6 flex flex-col items-center text-center hover:-translate-y-2 transition-transform duration-300"
  >
    <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center mb-4">
      <Icon className="w-7 h-7 text-primary" />
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-slate-400">{description}</p>
  </motion.div>
);

const LandingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] px-4">
      <div className="max-w-6xl mx-auto flex flex-col items-center pt-20 pb-32">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-8 text-secondary"
        >
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-medium">AI-Powered Mental Wellness</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-5xl md:text-7xl font-bold text-center mb-6 leading-tight"
        >
          Your personal space for <br />
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            emotional clarity
          </span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-xl text-slate-400 text-center max-w-2xl mb-12"
        >
          Track your mood, journal your thoughts, and receive AI-driven wellness suggestions to reduce stress and improve your mental well-being.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex items-center gap-6"
        >
          <Link to="/register" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40">
            Start Your Journey
          </Link>
          <Link to="/login" className="glass-panel px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/5 transition-all">
            Welcome Back
          </Link>
        </motion.div>
      </div>

      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 pb-32">
        <FeatureCard 
          icon={LineChart} 
          title="Mood Analytics" 
          description="Visualize your emotional trends over time with beautiful, interactive charts and insights."
          delay={0.4}
        />
        <FeatureCard 
          icon={Zap} 
          title="AI Wellness Assistant" 
          description="Receive personalized suggestions and coping mechanisms based on your mood patterns."
          delay={0.5}
        />
        <FeatureCard 
          icon={Shield} 
          title="Private & Secure" 
          description="Your journals and emotional data are encrypted and kept strictly private."
          delay={0.6}
        />
      </div>
    </div>
  );
};

export default LandingPage;
