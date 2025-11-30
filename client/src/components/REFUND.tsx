// src/components/RefundPolicy.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Shield, X, Package, Gift, AlertCircle, Camera, Clock } from 'lucide-react';

const RefundPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Refund & Return Policy</h1>
        </div>
        <p className="text-lg text-gray-600">
          Divine Mahakal - Spiritual Commerce Guidelines
        </p>
      </div>

      <div className="space-y-6">
        {/* Refund & Return Policy */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6 border border-red-200"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center">
              <X className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Refund & Return Policy</h2>
              <p className="text-red-600 text-sm font-medium">No refunds or returns except damaged delivery</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-red-100 space-y-3">
            <p className="text-gray-700 leading-relaxed">
              Due to the sacred and spiritual nature of our products, <strong>all purchases are generally final sale</strong>.
              We do not accept returns, refunds, or exchanges for divine items, murtis, and spiritual jewelry once they have been dispatched and delivered in good condition.
            </p>
            <p className="text-gray-700 text-sm leading-relaxed">
              <strong>Only exception:</strong> if your order is delivered <strong>broken, physically damaged, or incorrect</strong>,
              you must raise a request within <strong>24 hours of delivery</strong> with complete proof (unboxing video + clear photos),
              as explained in the "Damaged Divine Products" section below.
            </p>
          </div>
        </motion.section>

        {/* No Cancellations */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">No Cancellations After Dispatch</h2>
              <p className="text-amber-600 text-sm font-medium">Orders are final once shipped</p>
            </div>
          </div>
          <p className="text-gray-700 leading-relaxed">
            Once a spiritual order is blessed and dispatched from our center, it cannot be cancelled, 
            altered, or modified. The divine process begins immediately after dispatch.
          </p>
        </motion.section>

        {/* Customized Orders */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-200"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
              <Gift className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Customized Spiritual Orders</h2>
              <p className="text-orange-600 text-sm font-medium">Personalized divine items</p>
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-gray-700">
              Custom spiritual requests including:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Personalized puja items and sacred jewelry</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Special blessings and mantra engravings</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Custom spiritual packaging and offerings</span>
              </li>
            </ul>
            <div className="bg-white rounded-xl p-4 border border-orange-100 mt-3">
              <p className="text-orange-700 font-semibold text-sm">
                ⚡ Customized divine items are non-refundable and non-returnable. 
                All custom requests must be finalized before order confirmation.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Damaged Products */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Damaged Divine Products</h2>
              <p className="text-blue-600 text-sm font-medium">Immediate action required</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <p className="text-blue-800 text-sm font-medium mb-2">
                In the rare case of damage or incorrect delivery of sacred items:
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Camera className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">Share unboxing video of the entire package</span>
                </div>
                <div className="flex items-center gap-3">
                  <Camera className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">Clear photo proof of damaged/incorrect item</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">Within 24 hours of delivery</span>
                </div>
              </div>
            </div>

            {/* Contact for Refund Issues */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Contact for Damage Issues</h3>
              </div>
              
              <div className="space-y-3">
                <p className="text-gray-700 text-sm">
                  For damaged products or delivery issues, contact us immediately:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-white rounded-lg p-3 border border-green-100">
                    <p className="text-xs text-gray-600 mb-1">Email</p>
                    <p className="font-semibold text-gray-900 text-sm">
                      <a
                        href="mailto:divinemahakal.in@gmail.com"
                        className="text-emerald-700 hover:underline"
                      >
                        divinemahakal.in@gmail.com
                      </a>
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-3 border border-green-100">
                    <p className="text-xs text-gray-600 mb-1">WhatsApp</p>
                    <p className="font-semibold text-gray-900 text-sm">
                      <a
                        href="https://wa.me/919201411433"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-700 hover:underline"
                      >
                        +91 92014 11433
                      </a>
                    </p>
                  </div>
                </div>

                <div className="bg-green-500 rounded-lg p-3 text-white text-center">
                  <p className="text-sm font-semibold">
                    Provide order ID + unboxing video for quick resolution
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Important Notes */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-2xl p-6 border border-purple-200 text-center"
        >
          <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Spiritual Commerce Assurance</h3>
          <p className="text-gray-700 text-sm leading-relaxed">
            While we maintain a strict no-refund policy due to the sacred nature of our products, 
            we ensure every item is carefully blessed, packed with devotion, and quality-checked 
            before dispatch to our valued devotees.
          </p>
        </motion.section>
      </div>

      {/* Support Footer */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-8 text-center p-4 bg-gray-50 rounded-2xl border border-gray-200"
      >
        <p className="text-gray-600 text-sm">
          Need assistance with a damaged product? Contact us within 24 hours of delivery with evidence.
        </p>
        <div className="flex justify-center gap-4 mt-3">
          <a
            href="mailto:divinemahakal.in@gmail.com"
            className="text-xs text-gray-500 hover:underline"
          >
            Email: divinemahakal.in@gmail.com
          </a>
          <a
            href="https://wa.me/919201411433"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-500 hover:underline"
          >
            WhatsApp: +91 92014 11433
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default RefundPolicy;