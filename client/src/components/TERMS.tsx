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
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Terms & Conditions</h1>
        </div>
        <p className="text-lg text-gray-600">
          Divine Mahakal - Spiritual Jewelry & Sacred Murtis
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
            This website is operated by <strong>Divine Mahakal</strong>, a devoted online platform
            offering spiritual jewelry, sacred murtis, and divine artifacts dedicated to Hindu deities.
            By accessing or using this website, you agree to follow our spiritual commerce policies and terms
            designed to protect both devotees and the sanctity of our offerings.
          </p>
        </motion.section>

        {/* 2. Use of Website & Eligibility */}
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
            <h2 className="text-xl font-bold text-gray-900">Use of Website & Eligibility</h2>
          </div>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>
                Divine Mahakal is a spiritual ecommerce platform. By using this website you agree to use it only
                for lawful, devotional and personal purposes and not for any fraudulent or harmful activity.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>
                You must be at least 18 years old to place an order, or use the site under the guidance of a parent
                or legal guardian who accepts these terms on your behalf.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>
                Any attempt to misuse the platform, including fake orders, payment fraud, abuse of offers or
                disrespectful communication with our team, may lead to cancellation of services and blocking of access.
              </span>
            </li>
          </ul>
        </motion.section>

        {/* 3. Orders & Acceptance */}
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
            <h2 className="text-xl font-bold text-gray-900">Orders & Acceptance</h2>
          </div>
          <p className="text-gray-700 leading-relaxed">
            When you place an order on Divine Mahakal, it is considered an <strong>offer</strong> to purchase the
            selected spiritual products. Your order is confirmed only after we verify the details, accept the
            payment method and dispatch the items. We reserve the right to accept or cancel any order in case of
            stock issues, incorrect pricing, suspicious activity or any reason related to the sanctity of our store.
          </p>
        </motion.section>

        {/* 4. Shipping & Delivery Overview */}
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
            <h2 className="text-xl font-bold text-gray-900">Shipping & Delivery Overview</h2>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <Truck className="w-5 h-5 text-amber-600" />
            <span className="font-semibold text-gray-800">Order Processing</span>
          </div>
          <p className="text-gray-700 mb-4">
            Spiritual orders are typically processed and dispatched within a few working days through trusted
            courier partners. For detailed timelines (including the current 3–5 day delivery guidance), please
            refer to our Shipping / Privacy Policy page. Actual delivery time may vary based on your location and
            courier service conditions.
          </p>
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
            Because each product is treated as a sacred item, <strong>orders cannot be cancelled once they are
            dispatched</strong>. Custom or personalized spiritual orders (special puja, custom designs, etc.) cannot
            be cancelled once confirmed, as the spiritual process and material preparation begins immediately.
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
              Divine Mahakal follows a strict <strong>No Refund & No Return</strong> policy for sacred products,
              as detailed on our dedicated Refund Policy page. The only exception is if the order is delivered
              <strong>broken, physically damaged or incorrect</strong> and you raise a request within
              <strong> 24 hours of delivery</strong> with a full unboxing video and clear photos as proof.
              All such cases are handled as per our Refund & Return Policy.
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
            <span className="font-semibold text-gray-800">Payment Processing</span>
          </div>
          <p className="text-gray-700">
            All payments are processed securely through Razorpay (supporting UPI, cards, net banking, wallets, etc.).
            We may offer Cash on Delivery (COD) or special benefits for online prepaid payments from time to time.
            Exact offers, discounts and eligibility (such as ₹50 OFF or percentage discounts) will always be
            displayed at checkout and are subject to change as per Divine Mahakal’s discretion.
          </p>
        </motion.section>

        {/* 8. Liability & Ownership */}
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
            <h2 className="text-xl font-bold text-gray-900">Intellectual Property</h2>
          </div>
          <p className="text-gray-700 leading-relaxed">
            All content, designs, and product imagery belong to Divine Mahakal. 
            Unauthorized use, reproduction, or distribution is strictly prohibited.
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
            <h2 className="text-xl font-bold">Contact Divine Mahakal</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-white" />
              <div>
                <p className="text-white/80 text-sm">Email</p>
                <p className="font-semibold">divinemahakal.in@gmail.com</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-white" />
              <div>
                <p className="text-white/80 text-sm">Phone</p>
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
          &copy; {new Date().getFullYear()} Divine Mahakal. All rights reserved. | Spiritual Commerce
        </p>
      </div>
    </div>
  );
};

export default TermsConditions;