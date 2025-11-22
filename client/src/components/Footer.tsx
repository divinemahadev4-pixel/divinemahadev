import { Mail, Sparkles, Sun } from "lucide-react";
import { motion } from "framer-motion";
import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

// Social Media Icon Components
const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const YouTubeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

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
        Mahakal
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
  const whatsappNumber = "919201411433"; // WhatsApp number without + or spaces
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
            <div className="flex space-x-4">
              <motion.a
                href={instagramProfile}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.1, y: -3 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Instagram"
              >
                <div className="text-white">
                  <InstagramIcon />
                </div>
              </motion.a>
              <motion.a
                href="https://www.facebook.com/divinemahadev"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.1, y: -3 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Facebook"
              >
                <div className="text-white">
                  <FacebookIcon />
                </div>
              </motion.a>
              <motion.a
                href="https://www.youtube.com/@divinemahadev"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.1, y: -3 }}
                whileTap={{ scale: 0.95 }}
                aria-label="YouTube"
              >
                <div className="text-white">
                  <YouTubeIcon />
                </div>
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
              <motion.a
                href={`mailto:${email}`}
                className="flex items-center space-x-3 p-3 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border border-orange-200 hover:border-orange-300 hover:shadow-md transition-all duration-300 group"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="p-2 bg-orange-100 rounded-full border border-orange-200 group-hover:bg-orange-200 transition-colors duration-300">
                  <Mail size={16} className="text-orange-700" />
                </div>
                <div className="flex-1">
                  <p className="text-orange-800 hover:text-orange-600 transition-colors duration-300 text-sm">
                    {email}
                  </p>
                </div>
              </motion.a>

              <motion.a
                href={`https://wa.me/${whatsappNumber}?text=Hello%20Divine%20Mahakal!%20I%20need%20assistance.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 p-3 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border border-orange-200 hover:border-orange-300 hover:shadow-md transition-all duration-300 group"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="p-2 bg-orange-100 rounded-full border border-orange-200 group-hover:bg-orange-200 transition-colors duration-300">
                  <div className="text-orange-700">
                    <WhatsAppIcon />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-orange-800 font-semibold text-sm">Contact on WhatsApp</p>
                  <p className="text-orange-600 text-xs">{phone}</p>
                </div>
              </motion.a>
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