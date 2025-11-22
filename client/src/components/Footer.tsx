import { Mail, Sparkles, Sun, MapPin, ArrowRight, Phone } from "lucide-react";
import { motion } from "framer-motion";
import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

// --- Icons & Assets ---

const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
);

const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
);

const YouTubeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
);

const WhatsAppIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
);

// Subtle Mandala for background
const MandalaBackground = () => (
  <svg className="absolute top-0 right-0 w-[600px] h-[600px] opacity-[0.03] text-orange-900 animate-spin-slow pointer-events-none" viewBox="0 0 100 100" style={{ animationDuration: '60s' }}>
    <path fill="currentColor" d="M50 0 L55 35 L90 50 L55 65 L50 100 L45 65 L10 50 L45 35 Z" />
    <circle cx="50" cy="50" r="20" stroke="currentColor" strokeWidth="0.5" fill="none" />
    <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="0.5" fill="none" />
    <path stroke="currentColor" strokeWidth="0.5" fill="none" d="M50 10 Q60 10 70 20 Q80 30 90 50 Q80 70 70 80 Q60 90 50 90 Q40 90 30 80 Q20 70 10 50 Q20 30 30 20 Q40 10 50 10" />
  </svg>
);

// --- Configuration ---

const API_URL = import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:3000";

type Category = { _id?: string; name?: string };

const LogoBrand = () => (
  <span className="inline-flex items-center gap-4" aria-label="Divine Mahadev Logo">
    <div className="relative group cursor-default">
      <div className="absolute inset-0 bg-orange-400 rounded-full blur opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
      <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 via-orange-600 to-amber-700 shadow-lg flex items-center justify-center border-2 border-orange-200/50">
        <div className="relative w-7 h-7 flex items-center justify-center">
          <div className="w-5 h-5 border-[1.5px] border-white rounded-full opacity-90"></div>
          <div className="absolute w-2.5 h-2.5 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]"></div>
        </div>
      </div>
    </div>
    <div className="flex flex-col items-start justify-center">
      <span className="text-[11px] font-medium tracking-[0.25em] uppercase text-orange-600 mb-[-2px]">
        Divine
      </span>
      <span className="text-2xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-orange-800 to-amber-900 leading-6" style={{
        fontFamily: "'Playfair Display', serif"
      }}>
        Mahakal
      </span>
    </div>
  </span>
);

const Footer: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCats, setLoadingCats] = useState<boolean>(true);
  const abortRef = useRef<AbortController | null>(null);

  // Fetch Categories
  useEffect(() => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    (async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/getAllData`, {
          withCredentials: true,
          timeout: 10000,
          signal: controller.signal,
        });
        const cats: Category[] = Array.isArray(data?.data?.categories) ? data.data.categories : [];
        const seen = new Set<string>();
        const norm = cats
          .map((c) => ({ _id: c?._id, name: c?.name?.trim() }))
          .filter((c) => c.name && !seen.has(c.name!.toLowerCase()) && seen.add(c.name!.toLowerCase()))
          .slice(0, 6); // Limit to 6 for design balance
        setCategories(norm);
      } catch (e: any) {
        if (e?.name !== "CanceledError" && e?.name !== "AbortError") {
          setCategories([]);
        }
      } finally {
        setLoadingCats(false);
      }
    })();
    return () => controller.abort();
  }, []);

  const quickLinks = useMemo(
    () => [
      { label: "Our Story", to: "/about" },
      { label: "Refund Policy", to: "/refund" },
      { label: "Privacy Policy", to: "/privacy" },
      { label: "Terms of Service", to: "/terms" },
    ],
    []
  );

  const email = "divinemahakal.in@gmail.com";
  const phone = "+91 9201411433";
  const whatsappNumber = "919201411433";
  const instagramProfile = "https://www.instagram.com/divinemahadev";

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  };



  return (
    <footer
      className="relative pt-24 pb-10 bg-gradient-to-b from-orange-50 via-orange-50/80 to-white overflow-hidden"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Decorative Top Wave Divider */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none z-10 transform rotate-180">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-12 fill-white">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
        </svg>
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <MandalaBackground />
        <div className="absolute top-[10%] left-[5%] w-64 h-64 rounded-full bg-orange-300/10 blur-3xl" />
        <div className="absolute bottom-[10%] right-[5%] w-80 h-80 rounded-full bg-amber-400/10 blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >

          {/* --- Brand Section (4 cols) --- */}
          <motion.div className="lg:col-span-4 flex flex-col items-start" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }}>
            <LogoBrand />
            <p className="mt-6 text-orange-900/80 leading-relaxed text-[15px] pr-4">
              Discover the sacred energy of Lord Shiva. We provide authentic, blessed Rudraksha malas, Murtis, and spiritual artifacts to enhance your meditation and bring peace to your home.
            </p>

            <div className="mt-8 flex items-center gap-4">
              <SocialLink href={instagramProfile} icon={<InstagramIcon />} color="from-pink-500 to-purple-600" label="Instagram" />
              <SocialLink href="https://www.facebook.com/divinemahadev" icon={<FacebookIcon />} color="from-blue-600 to-blue-700" label="Facebook" />
              <SocialLink href="https://www.youtube.com/@divinemahadev" icon={<YouTubeIcon />} color="from-red-500 to-red-600" label="YouTube" />
            </div>
          </motion.div>

          {/* --- Quick Links (2 cols) --- */}
          <motion.div className="lg:col-span-2 lg:pl-4" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: 0.1 }}>
            <h4 className="text-lg font-serif font-bold text-orange-900 mb-6 flex items-center gap-2">
              Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <FooterLink to={link.to}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* --- Categories (3 cols) --- */}
          <motion.div className="lg:col-span-3" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: 0.2 }}>
            <h4 className="text-lg font-serif font-bold text-orange-900 mb-6 flex items-center gap-2">
              Sacred Collections
            </h4>
            <ul className="space-y-3">
              {loadingCats ? (
                Array(3).fill(0).map((_, i) => (
                  <li key={i} className="h-4 w-3/4 bg-orange-200/50 rounded animate-pulse" />
                ))
              ) : categories.length > 0 ? (
                categories.map((cat, idx) => {
                  const slug = cat.name?.toLowerCase().replace(/\s+/g, "-");
                  return (
                    <li key={idx}>
                      <FooterLink to={`/category/${slug}`}>{cat.name}</FooterLink>
                    </li>
                  );
                })
              ) : (
                <li className="text-orange-800/60 italic text-sm">Collections updating...</li>
              )}
            </ul>
          </motion.div>

          {/* --- Contact (3 cols) --- */}
          <motion.div className="lg:col-span-3" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: 0.3 }}>
            <h4 className="text-lg font-serif font-bold text-orange-900 mb-6">
              Divine Support
            </h4>
            <div className="space-y-4">
              {/* WhatsApp Card */}
              <motion.a
                href={`https://wa.me/${whatsappNumber}?text=Hari%20Om!%20I%20need%20assistance.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-3 rounded-xl bg-white/40 backdrop-blur-sm border border-orange-200 hover:border-green-400 hover:bg-white/60 transition-all duration-300 group shadow-sm"
                whileHover={{ y: -2 }}
              >
                <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center group-hover:bg-green-500 group-hover:text-white transition-colors">
                  <WhatsAppIcon />
                </div>
                <div>
                  <p className="text-xs font-semibold text-orange-900/60 uppercase tracking-wider">Chat with us</p>
                  <p className="text-orange-900 font-medium">{phone}</p>
                </div>
              </motion.a>

              {/* Email Card */}
              <motion.a
                href={`mailto:${email}`}
                className="flex items-center gap-4 p-3 rounded-xl bg-white/40 backdrop-blur-sm border border-orange-200 hover:border-orange-400 hover:bg-white/60 transition-all duration-300 group shadow-sm"
                whileHover={{ y: -2 }}
              >
                <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-colors">
                  <Mail size={18} />
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-semibold text-orange-900/60 uppercase tracking-wider">Email Support</p>
                  <p className="text-orange-900 font-medium text-sm truncate">{email}</p>
                </div>
              </motion.a>

              <div className="flex items-start gap-2 mt-4 text-orange-800/80 text-sm">
                <MapPin size={16} className="mt-1 flex-shrink-0 text-orange-600" />
                <span>Ujjain, Mahakal Nagari,<br />Madhya Pradesh, India</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* --- Footer Bottom --- */}
        <motion.div
          className="border-t border-orange-200/60 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-orange-800/70"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
        >
          <p className="flex items-center gap-2 mb-4 md:mb-0 font-medium">
            <span>&copy; {new Date().getFullYear()} Divine Mahakal.</span>
            <span className="hidden md:inline text-orange-300">|</span>
            <span className="italic">Blessed with devotion.</span>
          </p>

          <div className="flex items-center gap-1 text-xs font-medium bg-orange-100/50 px-3 py-1 rounded-full border border-orange-200/50">
            Made with <span className="text-red-500 text-base leading-none mx-0.5">♥</span> in India
          </div>
        </motion.div>

        {/* Chant Overlay */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 opacity-5 select-none pointer-events-none">
          <span className="text-6xl font-bold font-serif text-orange-900">ॐ नमः शिवाय</span>
        </div>
      </div>
    </footer>
  );
};

// --- Helper Components for Cleaner Code ---

const SocialLink = ({ href, icon, color, label }: { href: string; icon: React.ReactNode; color: string, label: string }) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className={`w-10 h-10 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-md shadow-orange-900/10 relative overflow-hidden group`}
    whileHover={{ scale: 1.1, rotate: 5 }}
    whileTap={{ scale: 0.95 }}
  >
    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
    {icon}
  </motion.a>
);

const FooterLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
  <Link
    to={to}
    className="group flex items-center text-orange-800/80 hover:text-orange-600 transition-colors duration-200"
  >
    <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mr-2 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:mr-3" />
    <span className="group-hover:translate-x-1 transition-transform duration-300">{children}</span>
  </Link>
);

export default Footer;