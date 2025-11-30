// src/components/ContactSection.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MessageCircle, MapPin, Heart, Shield } from 'lucide-react';

const ContactSection = () => {
  const handleWhatsAppClick = () => {
    window.open('https://wa.me/919201411433', '_blank');
  };

  const handleCallClick = () => {
    window.open('tel:+919201411433', '_self');
  };

  const handleEmailClick = () => {
    window.open('mailto:divinemahakal.in', '_self');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Divine Support</h1>
        </div>
        <p className="text-lg text-gray-600">
          We're here to help you on your spiritual journey
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {/* Email */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-100 cursor-pointer"
            onClick={handleEmailClick}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Email</p>
                <p className="font-semibold text-gray-900">divinemahakal.in@gmail.com</p>
                <p className="text-xs text-gray-500 mt-1">Click to send email</p>
              </div>
            </div>
          </motion.div>

          {/* Phone */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100 cursor-pointer"
            onClick={handleCallClick}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Phone & Spiritual Guidance</p>
                <p className="font-semibold text-gray-900">+91 92014 11433</p>
                <p className="text-xs text-gray-500 mt-1">Click to call directly</p>
              </div>
            </div>
          </motion.div>

          {/* WhatsApp */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100 cursor-pointer"
            onClick={handleWhatsAppClick}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">WhatsApp</p>
                <p className="font-semibold text-gray-900">Chat on WhatsApp</p>
                <p className="text-xs text-gray-500 mt-1">Quick spiritual queries & orders</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Address & Additional Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Address */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Sacred Address</p>
                <p className="font-semibold text-gray-900 mb-2">
                  Nayabazar Rajmahal, Sahibganj, Jharkhand
                </p>
                <p className="text-gray-700">Pin: 816108</p>
                <div className="mt-3 p-3 bg-white rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-600">
                    🕉️ Our spiritual center where divine products are blessed and dispatched
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-2xl p-6 border border-purple-100">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-gray-900">Spiritual Service Hours</h3>
            </div>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex justify-between">
                <span>Monday - Saturday:</span>
                <span className="font-semibold">9:00 AM - 7:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday:</span>
                <span className="font-semibold">10:00 AM - 5:00 PM</span>
              </div>
              <div className="mt-3 p-2 bg-white rounded-lg text-center">
                <p className="text-xs text-purple-600 font-medium">
                  🕉️ Closed during major spiritual festivals
                </p>
              </div>
            </div>
          </div>

          {/* Quick Support Note */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-r from-orange-500 to-amber-600 rounded-2xl p-6 text-white text-center"
          >
            <Heart className="w-8 h-8 mx-auto mb-3" />
            <h3 className="font-bold text-lg mb-2">Divine Assistance</h3>
            <p className="text-white/90 text-sm leading-relaxed">
              For spiritual guidance, product blessings, or order inquiries, 
              our team is here to serve you with devotion and care.
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Support Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <div className="text-center p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
            <span className="text-white text-sm">⚡</span>
          </div>
          <p className="font-semibold text-gray-900 text-sm">Quick Response</p>
          <p className="text-gray-600 text-xs">Within 2 hours</p>
        </div>

        <div className="text-center p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
            <span className="text-white text-sm">🕉️</span>
          </div>
          <p className="font-semibold text-gray-900 text-sm">Spiritual Guidance</p>
          <p className="text-gray-600 text-xs">Expert advice</p>
        </div>

        <div className="text-center p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
            <span className="text-white text-sm">🌟</span>
          </div>
          <p className="font-semibold text-gray-900 text-sm">Secure Orders</p>
          <p className="text-gray-600 text-xs">Blessed packaging</p>
        </div>
      </motion.div>

      {/* Footer Note */}
      <div className="mt-8 text-center">
        <p className="text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Divine Mahakal. Serving devotees worldwide with divine products.
        </p>
      </div>
    </div>
  );
};

export default ContactSection;