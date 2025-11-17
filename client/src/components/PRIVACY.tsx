// src/components/TermsConditions.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Truck, Clock, Phone, Mail, AlertCircle, Gem, Heart } from 'lucide-react';

const TermsConditions = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center">
            <Gem className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Terms & Conditions</h1>
        </div>
        <p className="text-lg text-gray-600">
          DivineMahadev - Spiritual Jewelry & Sacred Murtis
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
            This website is operated by <strong>DivineMahadev</strong>, a trusted online platform 
            specializing in spiritual jewelry, sacred murtis, and divine artifacts dedicated to Hindu gods. 
            By accessing or using this website, you agree to comply with our spiritual commerce policies and terms.
          </p>
        </motion.section>

        {/* 2. Products & Custom Orders */}
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
            <h2 className="text-xl font-bold text-gray-900">Products & Custom Orders</h2>
          </div>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>All spiritual products and murtis are subject to availability and spiritual significance</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>Customized spiritual items and special puja orders must be confirmed with our spiritual advisors</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>For custom spiritual requests and blessings consultation, contact our team</span>
            </li>
          </ul>
        </motion.section>

        {/* 3. Pricing */}
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
            <h2 className="text-xl font-bold text-gray-900">Pricing & Donations</h2>
          </div>
          <p className="text-gray-700 leading-relaxed">
            All prices are in INR (Indian Rupees) and inclusive of applicable taxes. 
            Shipping charges and any additional puja samagri costs will be clearly displayed at checkout. 
            We believe in transparent pricing for all divine products.
          </p>
        </motion.section>

        {/* 4. Shipping & Delivery */}
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
            <h2 className="text-xl font-bold text-gray-900">Shipping & Divine Delivery</h2>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <Truck className="w-5 h-5 text-amber-600" />
            <span className="font-semibold text-gray-800">Sacred Packaging & Care</span>
          </div>
          <p className="text-gray-700 mb-4">
            Spiritual orders are carefully packed with sacred materials and dispatched within 2-3 working days 
            to ensure proper blessings. Deliveries are fulfilled via trusted spiritual commerce partners.
          </p>
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-amber-600" />
            <span className="text-sm text-gray-600">Delivery timelines may vary based on location and spiritual processing</span>
          </div>
        </motion.section>

        {/* 5. Cancellations */}
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
            <h2 className="text-xl font-bold text-gray-900">Cancellations</h2>
          </div>
          <p className="text-gray-700 leading-relaxed">
            Due to the spiritual nature of our products, orders cannot be cancelled once dispatched. 
            Custom spiritual items and blessed murtis cannot be cancelled once the spiritual process has begun.
          </p>
        </motion.section>

        {/* 6. Refund & Return */}
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
            <h2 className="text-xl font-bold text-gray-900">Refund & Return Policy</h2>
          </div>
          <div className="flex items-start gap-3 mb-3">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <p className="text-gray-700">
              We follow a strict <strong>No Refund & No Return</strong> policy for spiritual products. 
              However, if a divine product arrives damaged or incorrect, devotees must provide an 
              unboxing video and clear photo proof within 24 hours of delivery.
            </p>
          </div>
        </motion.section>

        {/* 7. Payments */}
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
            <h2 className="text-xl font-bold text-gray-900">Secure Payments</h2>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <Shield className="w-5 h-5 text-orange-600" />
            <span className="font-semibold text-gray-800">Blessed & Secure Transactions</span>
          </div>
          <p className="text-gray-700">
            All payments are processed securely through Razorpay (supporting UPI, cards, net banking, wallets, etc.). 
            Your financial safety is our priority in serving the divine.
          </p>
        </motion.section>

        {/* 8. Intellectual Property */}
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
            <h2 className="text-xl font-bold text-gray-900">Spiritual Intellectual Property</h2>
          </div>
          <p className="text-gray-700 leading-relaxed">
            All divine content, spiritual designs, and sacred product imagery belong to DivineMahadev. 
            Unauthorized use, reproduction, or distribution of our spiritual creations is strictly prohibited.
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
            <h2 className="text-xl font-bold">Connect with DivineMahadev</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-white" />
              <div>
                <p className="text-white/80 text-sm">Email</p>
                <p className="font-semibold">divinemahakal.in</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-white" />
              <div>
                <p className="text-white/80 text-sm">Spiritual Support</p>
                <p className="font-semibold">+91 92014 11433</p>
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
          © {new Date().getFullYear()} DivineMahadev. All rights reserved. | Spiritual Commerce
        </p>
      </div>
    </div>
  );
};

export default TermsConditions;