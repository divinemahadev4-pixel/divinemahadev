// src/components/PRIVACY.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Truck, Clock, Phone, Mail, AlertCircle, Gem, Heart } from 'lucide-react';

const PRIVACY = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center">
            <Gem className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
        </div>
        <p className="text-lg text-gray-600">
          Divine Mahakal - Privacy, Data & Shipping Policy
        </p>
      </div>

      <div className="space-y-8">
        {/* 1. General */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-100"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">1</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900">General</h2>
          </div>
          <p className="text-gray-700 leading-relaxed">
            This Privacy Policy explains how <strong>Divine Mahakal</strong> collects, uses, protects and shares
            your personal information when you visit our website, browse our sacred collections, place an order
            or contact us through WhatsApp, phone or email. By using this website, you agree to the practices
            described in this policy.
          </p>
        </motion.section>

        {/* 2. Information We Collect */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">2</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900">Information We Collect</h2>
          </div>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>
                <strong>Contact details</strong>: name, email address, phone number, shipping address and pin code
                that you provide while creating an order or contacting our support.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>
                <strong>Order information</strong>: products added to cart, orders placed, payment method used
                (handled securely by Razorpay), transaction status and delivery status.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>
                <strong>Technical and usage data</strong>: basic device / browser information, IP address, and
                cookies that help us keep your session, cart and preferences remembered.
              </span>
            </li>
          </ul>
        </motion.section>

        {/* 3. How We Use Your Information */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-100"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">3</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900">How We Use Your Information</h2>
          </div>
          <p className="text-gray-700 leading-relaxed">
            We use your information only to serve you better on your spiritual journey, including:
            processing and delivering your orders, sharing order updates by SMS/WhatsApp/email, providing
            customer support, improving our website and showing relevant divine offers from Divine Mahakal.
          </p>
        </motion.section>

        {/* 4. Shipping, Delivery & Address Use */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">4</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900">Shipping, Delivery & Address Use</h2>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <Truck className="w-5 h-5 text-amber-600" />
            <span className="font-semibold text-gray-800">Sacred Packaging & Care</span>
          </div>
          <p className="text-gray-700 mb-4">
            Your name, address and phone number are used only to process and deliver your order through trusted
            courier partners. Spiritual orders are carefully packed with sacred materials and are generally
            delivered within <strong>3–5 working days</strong>. Exact timelines can vary based on location and courier.
          </p>
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-amber-600" />
            <span className="text-sm text-gray-600">Delivery timelines may vary based on location and spiritual processing</span>
          </div>
        </motion.section>

        {/* 5. Data Sharing with Third Parties */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-100"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">5</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900">Data Sharing with Third Parties</h2>
          </div>
          <p className="text-gray-700 leading-relaxed">
            We do <strong>not</strong> sell your personal data. Your information is shared only with:
            our payment gateway (Razorpay) to securely process payments; courier and logistics partners to ship
            your order; and essential technical providers (hosting, analytics) to keep the website running.
            We may also share information if required by law or to protect our legal rights.
          </p>
        </motion.section>

        {/* 6. Data Security & Retention */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">6</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900">Data Security & Retention</h2>
          </div>
          <div className="flex items-start gap-3 mb-3">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <p className="text-gray-700">
              We use reasonable technical and organisational measures to protect your information from
              unauthorised access, misuse or loss. Payments are processed securely by Razorpay and card
              details are not stored on Divine Mahakal servers. We keep your order and contact details only
              for as long as needed for legal, accounting and devotional service purposes.
            </p>
          </div>
        </motion.section>

        {/* 7. Cookies & Online Tracking */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-100"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">7</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900">Cookies & Online Tracking</h2>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <Shield className="w-5 h-5 text-orange-600" />
            <span className="font-semibold text-gray-800">Blessed & Secure Browsing</span>
          </div>
          <p className="text-gray-700">
            We use cookies and similar technologies to remember your cart, keep you logged in and understand how
            devotees use our website. You can manage cookies through your browser settings, but some features (like
            cart and login) may not work properly if cookies are disabled.
          </p>
        </motion.section>

        {/* 8. Your Rights & Choices */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">8</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900">Your Rights & Choices</h2>
          </div>
          <p className="text-gray-700 leading-relaxed">
            You can request corrections to your contact details, ask questions about how your data is used or
            request that we limit promotional messages from Divine Mahakal. For any privacy-related request,
            please contact us on the details given below and we will do our best to support you while respecting
            legal and devotional duties.
          </p>
        </motion.section>

        {/* 9. Contact */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-r from-orange-500 to-amber-600 rounded-2xl p-6 text-white"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <Heart className="w-4 h-4 text-orange-500" />
            </div>
            <h2 className="text-xl font-bold">Connect with Divine Mahakal</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-white" />
              <div>
                <p className="text-white/80 text-sm">Email</p>
                <p className="font-semibold">
                  <a
                    href="mailto:divinemahakal.in@gmail.com"
                    className="underline decoration-white/60 hover:decoration-white"
                  >
                    divinemahakal.in@gmail.com
                  </a>
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-white" />
              <div>
                <p className="text-white/80 text-sm">Spiritual Support</p>
                <p className="font-semibold">
                  <a
                    href="https://wa.me/919201411433"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-white/60 hover:decoration-white"
                  >
                    WhatsApp: +91 92014 11433
                  </a>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/20">
            <p className="text-white/80 text-sm text-center">
              Serving devotees with authentic spiritual products and divine blessings
            </p>
          </div>
        </motion.section>
      </div>

      {/* Footer Note */}
      <div className="mt-8 text-center">
        <p className="text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Divine Mahakal. All rights reserved. | Spiritual Commerce
        </p>
      </div>
    </div>
  );
};

export default PRIVACY;