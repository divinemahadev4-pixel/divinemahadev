import { Instagram, Mail, Phone, Sparkles, Sun } from "lucide-react";
import { motion } from "framer-motion";
import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:3000";

type Category = { _id?: string; name?: string };

const fadeUp = (delay = 0.1) => ({
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.45, ease: "easeOut", delay },
});

// DivineMahadev Logo for Footer
const LogoBrand = () => (
  <span className="inline-flex items-center gap-3" aria-label="Divine Mahadev Logo">
    <div className="relative">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-amber-600 shadow-md flex items-center justify-center border border-orange-300">
        <div className="relative w-6 h-6 flex items-center justify-center">
          <div className="w-4 h-4 border border-white rounded-full opacity-80"></div>
          <div className="absolute w-2 h-2 bg-white rounded-full"></div>
        </div>
      </div>
    </div>
    <div className="flex flex-col items-start justify-center">
      <span className="text-[10px] font-light tracking-[0.2em] uppercase text-orange-500 mb-[-2px]">
        Divine
      </span>
      <span className="text-lg font-bold tracking-wide text-orange-800 leading-5" style={{ 
        fontFamily: "'Playfair Display', serif"
      }}>
        Mahadev
      </span>
    </div>
  </span>
);

const Footer: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCats, setLoadingCats] = useState<boolean>(true);
  const abortRef = useRef<AbortController | null>(null);

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
          .filter((c) => c.name && !seen.has(c.name!.toLowerCase()) && seen.add(c.name!.toLowerCase()));
        setCategories(norm);
      } catch (e: any) {
        if (e?.name !== "CanceledError" && e?.name !== "AbortError") {
          console.error("Footer: Failed fetching categories", e?.message || e);
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
      { label: "About Us", to: "/about" },
      { label: "Contact", to: "/contact" },
      { label: "Refund Policy", to: "/refund" },
      { label: "Privacy Policy", to: "/privacy" },
      { label: "Terms of Service", to: "/terms" },
    ],
    []
  );

  const email = "divinemahakal.in@gmail.com";
  const phone = "+91 9201411433";
  const instagramProfile = "https://www.instagram.com/divinemahadev";

  return (
    <footer
      className="relative bg-gradient-to-br from-white via-orange-50 to-amber-50/70 border-t border-orange-200/60 overflow-hidden"
      style={{ contentVisibility: "auto", containIntrinsicSize: "680px" }}
    >
      {/* Spiritual Background Elements */}
      <div className="pointer-events-none absolute top-24 right-0 w-40 h-40 rounded-full bg-orange-200/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 left-10 w-28 h-28 rounded-full bg-amber-200/20 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-orange-100/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 py-16 relative z-10 text-orange-900">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, ease: "easeOut", delay: 0.05 }}
          >
            <div className="flex items-center mb-6">
              <LogoBrand />
            </div>
            <p className="mb-6 text-orange-700 leading-relaxed text-sm">
              Your sacred destination for divine malas, blessed murtis, and spiritual artifacts. 
              Every item is infused with positive energy and blessings.
            </p>
            <div className="flex space-x-3">
              <motion.a
                href={instagramProfile}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-orange-100 rounded-full hover:bg-orange-200 transition-all duration-300 border border-orange-200"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Instagram"
              >
                <Instagram size={18} className="text-orange-700" />
              </motion.a>
              <motion.a
                href={`mailto:${email}`}
                className="p-3 bg-orange-100 rounded-full hover:bg-orange-200 transition-all duration-300 border border-orange-200"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Email"
              >
                <Mail size={18} className="text-orange-700" />
              </motion.a>
              <motion.a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="p-3 bg-orange-100 rounded-full hover:bg-orange-200 transition-all duration-300 border border-orange-200"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Phone"
              >
                <Phone size={18} className="text-orange-700" />
              </motion.a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, ease: "easeOut", delay: 0.12 }}
          >
            <h4 className="text-lg font-bold mb-6 select-none cursor-default flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-orange-600" />
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-orange-800 hover:text-orange-600 transition-all duration-300 flex items-start group"
                  >
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Categories */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, ease: "easeOut", delay: 0.18 }}
          >
            <h4 className="text-lg font-bold mb-6 select-none cursor-default flex items-center gap-2">
              <Sun className="w-4 h-4 text-orange-600" />
              Sacred Categories
            </h4>
            <ul className="space-y-3 max-h-48 overflow-y-auto">
              {loadingCats ? (
                <>
                  <li className="h-4 w-40 bg-orange-200 rounded animate-pulse" />
                  <li className="h-4 w-32 bg-orange-200 rounded animate-pulse" />
                  <li className="h-4 w-24 bg-orange-200 rounded animate-pulse" />
                </>
              ) : categories.length > 0 ? (
                categories.map((cat, idx) => {
                  const name = cat.name || "";
                  const slug = name.toLowerCase().replace(/\s+/g, "-");
                  return (
                    <li key={cat._id || `${name}-${idx}`}>
                      <Link
                        to={`/category/${slug}`}
                        className="text-orange-800 hover:text-orange-600 transition-all duration-300 flex items-start group"
                      >
                        <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <span className="group-hover:translate-x-1 transition-transform duration-300">
                          {name}
                        </span>
                      </Link>
                    </li>
                  );
                })
              ) : (
                <li className="text-orange-500 text-sm select-none">No categories available.</li>
              )}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, ease: "easeOut", delay: 0.24 }}
          >
            <h4 className="text-lg font-bold mb-6 select-none cursor-default flex items-center gap-2">
              <Mail className="w-4 h-4 text-orange-600" />
              Divine Contact
            </h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 group">
                <div className="p-2 bg-orange-100 rounded-full border border-orange-200 group-hover:bg-orange-200 transition-colors duration-300">
                  <Mail size={16} className="text-orange-700" />
                </div>
                <a 
                  href={`mailto:${email}`} 
                  className="text-orange-800 hover:text-orange-600 transition-colors duration-300"
                >
                  {email}
                </a>
              </div>
              <div className="flex items-center space-x-3 group">
                <div className="p-2 bg-orange-100 rounded-full border border-orange-200 group-hover:bg-orange-200 transition-colors duration-300">
                  <Phone size={16} className="text-orange-700" />
                </div>
                <a 
                  href={`tel:${phone.replace(/\s/g, "")}`} 
                  className="text-orange-800 hover:text-orange-600 transition-colors duration-300"
                >
                  {phone}
                </a>
              </div>
              <div className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
                <p className="text-xs text-orange-700 text-center">
                  🕉️ May Lord Shiva bless you with peace and prosperity 🕉️
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer Bottom */}
        <motion.div
          className="border-t border-orange-200/60 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-orange-600"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45, ease: "easeOut", delay: 0.3 }}
        >
          <p className="mb-4 md:mb-0 select-none text-sm flex items-center gap-2">
            <Sparkles className="w-3 h-3" />
            © 2025 Divine Mahadev. Blessed with divine energy.
          </p>
          <div className="flex space-x-6 text-sm">
            <Link to="/privacy" className="hover:text-orange-700 transition-colors duration-300">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-orange-700 transition-colors duration-300">
              Terms of Service
            </Link>
          </div>
        </motion.div>

        {/* Spiritual Blessing */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="text-orange-500 text-sm font-medium">
            Har Har Mahadev! 🙏
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;