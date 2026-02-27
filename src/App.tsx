import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  Sparkles, 
  Zap, 
  Shield, 
  Cpu, 
  CheckCircle2, 
  Github, 
  Twitter, 
  Linkedin,
  Mail,
  Users
} from 'lucide-react';
import { cn } from './lib/utils';

const FeatureCard = ({ icon: Icon, title, description, delay }: { icon: any, title: string, description: string, delay: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors group"
  >
    <div className="w-12 h-12 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
      <Icon className="w-6 h-6 text-indigo-400" />
    </div>
    <h3 className="text-xl font-semibold mb-3 text-zinc-100">{title}</h3>
    <p className="text-zinc-400 leading-relaxed">{description}</p>
  </motion.div>
);

export default function App() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [count, setCount] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    fetch('/api/count')
      .then(res => res.json())
      .then(data => setCount(data.count))
      .catch(() => setCount(1240));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const planId = import.meta.env.VITE_WHOP_PLAN_ID;
    if (!planId) {
      setStatus('error');
      setMessage('Payment system not configured. Please set VITE_WHOP_PLAN_ID.');
      return;
    }

    setStatus('loading');
    try {
      // Still save to waitlist so we have the lead
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      // Redirect to Whop checkout with pre-filled email
      const checkoutUrl = `https://whop.com/checkout/${planId}?email=${encodeURIComponent(email)}`;
      
      if (res.ok) {
        setStatus('success');
        setMessage('Redirecting to payment...');
        setTimeout(() => {
          window.location.href = checkoutUrl;
        }, 1000);
      } else {
        // Even if they are already on the list, we should probably let them proceed to payment
        const data = await res.json();
        if (data.error === "You're already on the list!") {
          setStatus('success');
          setMessage('Welcome back! Redirecting to payment...');
          setTimeout(() => {
            window.location.href = checkoutUrl;
          }, 1000);
        } else {
          setStatus('error');
          setMessage(data.error);
        }
      }
    } catch (err) {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen font-sans bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/20 blur-[150px] rounded-full opacity-50" />
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full text-center"
        >
          <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-indigo-500/40">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 tracking-tight">
            You're on the list!
          </h1>
          
          <p className="text-xl text-zinc-400 mb-12 leading-relaxed">
            Thanks for joining the Lumina waitlist. We're excited to have you with us. 
            We'll send an invite to your inbox as soon as we're ready for more users.
          </p>

          <div className="grid sm:grid-cols-2 gap-4 mb-12">
            <a 
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("Just joined the waitlist for Lumina - the future of intelligent productivity! ✨ Check it out: " + window.location.origin)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 p-4 bg-zinc-900 border border-zinc-800 rounded-2xl hover:bg-zinc-800 transition-colors group"
            >
              <Twitter className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
              <span className="font-semibold">Share on Twitter</span>
            </a>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(window.location.origin);
                alert('Link copied to clipboard!');
              }}
              className="flex items-center justify-center gap-3 p-4 bg-zinc-900 border border-zinc-800 rounded-2xl hover:bg-zinc-800 transition-colors group"
            >
              <Users className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
              <span className="font-semibold">Invite Friends</span>
            </button>
          </div>

          <div className="p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800 text-left">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-indigo-400" />
              What's next?
            </h3>
            <ul className="space-y-4 text-zinc-400">
              <li className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-100 shrink-0">1</span>
                <p>Check your email for a confirmation (and maybe a little surprise).</p>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-100 shrink-0">2</span>
                <p>Follow us on social media for behind-the-scenes updates.</p>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-100 shrink-0">3</span>
                <p>Keep an eye out for your early access invitation.</p>
              </li>
            </ul>
          </div>

          <button 
            onClick={() => setIsSubmitted(false)}
            className="mt-12 text-zinc-500 hover:text-zinc-300 transition-colors text-sm font-medium"
          >
            ← Back to Home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans selection:bg-indigo-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-display font-bold tracking-tight">Lumina</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <a href="#features" className="hover:text-zinc-100 transition-colors">Features</a>
            <a href="#about" className="hover:text-zinc-100 transition-colors">About</a>
            <a href="#faq" className="hover:text-zinc-100 transition-colors">FAQ</a>
          </div>
          <button 
            onClick={() => document.getElementById('waitlist-form')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-4 py-2 bg-zinc-100 text-zinc-950 rounded-full text-sm font-semibold hover:bg-white transition-colors"
          >
            Get Access
          </button>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-600/20 blur-[120px] rounded-full opacity-50" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/10 blur-[100px] rounded-full opacity-30" />
          </div>

          <div className="max-w-7xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-400 mb-8"
            >
              <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
              Coming Spring 2026
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight mb-8 leading-[1.1]"
            >
              The future of <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                intelligent productivity.
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-2xl mx-auto text-lg md:text-xl text-zinc-400 mb-12 leading-relaxed"
            >
              Lumina orchestrates your workflow, automates the mundane, and lets you focus on what truly matters. Experience a new era of work.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="max-w-md mx-auto"
              id="waitlist-form"
            >
              <form onSubmit={handleSubmit} className="relative group mb-4">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
                <div className="relative flex flex-col sm:flex-row gap-2 p-2 bg-zinc-900 rounded-2xl border border-zinc-800">
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1 bg-transparent px-4 py-3 text-zinc-100 placeholder:text-zinc-600 focus:outline-none"
                  />
                  <button 
                    type="submit"
                    disabled={status === 'loading'}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-indigo-500 transition-colors disabled:opacity-50"
                  >
                    {status === 'loading' ? 'Processing...' : 'Continue to Payment'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
              
              <AnimatePresence mode="wait">
                {status === 'success' && (
                  <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-4 text-sm text-emerald-400 flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" /> {message}
                  </motion.p>
                )}
                {status === 'error' && (
                  <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-4 text-sm text-rose-400"
                  >
                    {message}
                  </motion.p>
                )}
              </AnimatePresence>

              <div className="mt-8 flex items-center justify-center gap-4 text-zinc-500">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <img 
                      key={i}
                      src={`https://picsum.photos/seed/${i + 10}/32/32`}
                      alt="User"
                      className="w-8 h-8 rounded-full border-2 border-zinc-950"
                      referrerPolicy="no-referrer"
                    />
                  ))}
                </div>
                <p className="text-sm">
                  Join <span className="text-zinc-200 font-semibold">{count.toLocaleString()}</span> others already in line
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-zinc-950">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">Built for the next generation.</h2>
              <p className="text-zinc-400 max-w-2xl mx-auto">Everything you need to supercharge your productivity, powered by state-of-the-art AI.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={Cpu}
                title="AI Orchestration"
                description="Our neural engine predicts your next move and prepares your workspace before you even think of it."
                delay={0.1}
              />
              <FeatureCard 
                icon={Zap}
                title="Lightning Fast"
                description="Built on a custom-optimized stack to ensure zero latency. Your thoughts move at the speed of light."
                delay={0.2}
              />
              <FeatureCard 
                icon={Shield}
                title="Privacy First"
                description="Your data is yours. End-to-end encryption and local-first processing keep your secrets safe."
                delay={0.3}
              />
            </div>
          </div>
        </section>

        {/* Social Proof / Stats */}
        <section className="py-24 border-y border-zinc-900 bg-zinc-900/20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
              <div>
                <div className="text-4xl font-display font-bold text-zinc-100 mb-2">99.9%</div>
                <div className="text-sm text-zinc-500 uppercase tracking-widest">Uptime</div>
              </div>
              <div>
                <div className="text-4xl font-display font-bold text-zinc-100 mb-2">250k+</div>
                <div className="text-sm text-zinc-500 uppercase tracking-widest">Tasks Automated</div>
              </div>
              <div>
                <div className="text-4xl font-display font-bold text-zinc-100 mb-2">15m</div>
                <div className="text-sm text-zinc-500 uppercase tracking-widest">Time Saved/Day</div>
              </div>
              <div>
                <div className="text-4xl font-display font-bold text-zinc-100 mb-2">4.9/5</div>
                <div className="text-sm text-zinc-500 uppercase tracking-widest">Beta Rating</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-indigo-600/10 -z-10" />
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-6xl font-display font-bold mb-8">Ready to evolve?</h2>
            <p className="text-xl text-zinc-400 mb-12">Don't get left behind. Secure your spot in the future of work today.</p>
            <button 
              onClick={() => document.getElementById('waitlist-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-500 transition-all hover:scale-105 shadow-xl shadow-indigo-500/20"
            >
              Join & Pay Now
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-zinc-900 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-display font-bold">Lumina</span>
            </div>
            
            <div className="flex items-center gap-6">
              <a href="#" className="text-zinc-500 hover:text-zinc-100 transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="text-zinc-500 hover:text-zinc-100 transition-colors"><Github className="w-5 h-5" /></a>
              <a href="#" className="text-zinc-500 hover:text-zinc-100 transition-colors"><Linkedin className="w-5 h-5" /></a>
              <a href="#" className="text-zinc-500 hover:text-zinc-100 transition-colors"><Mail className="w-5 h-5" /></a>
            </div>

            <p className="text-zinc-600 text-sm">
              © 2026 Lumina AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
