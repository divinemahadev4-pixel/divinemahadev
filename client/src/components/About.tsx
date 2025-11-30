// src/components/AboutUs.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Gem, Heart, Target, Truck, Shield, Sparkles } from 'lucide-react';

const AboutUs = () => {
  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-4 mb-6"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center">
            <Gem className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">About Divine Mahakal</h1>
            <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-amber-600 mx-auto rounded-full"></div>
          </div>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
        >
          Your sacred destination for authentic spiritual jewelry, divine murtis, and blessed artifacts 
          dedicated to Hindu gods and goddesses.
        </motion.p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-3xl p-8 border border-orange-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Divine Mission</h2>
            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              At Divine Mahakal, our mission is to bring divine blessings and spiritual connection 
              to devotees through authentic, carefully crafted spiritual products. Every piece we create 
              carries sacred energy and is made with devotional care.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed">
              We believe in preserving traditional craftsmanship while making spiritual artifacts 
              accessible to devotees across India.
            </p>
          </div>

          {/* Values */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm text-center"
            >
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Authenticity</h3>
              <p className="text-gray-600 text-sm">Genuine spiritual products with traditional blessings</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm text-center"
            >
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Devotion</h3>
              <p className="text-gray-600 text-sm">Crafted with spiritual dedication and care</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Visual Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="relative"
        >
          <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-3xl p-8 border border-amber-200">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Spiritual Assurance</h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                Each product undergoes spiritual sanctification and quality checks before reaching our devotees. 
                We maintain the highest standards of authenticity in every divine piece.
              </p>
              
              <div className="flex items-center justify-center gap-2 bg-white rounded-2xl p-4 border border-amber-200">
                <Truck className="w-5 h-5 text-amber-600" />
                <span className="font-semibold text-gray-900">Pan-India Delivery</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
      >
        <div className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl p-6 text-white text-center">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Gem className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg mb-2">Divine Products</h3>
          <p className="text-white/90 text-sm">
            Spiritual jewelry, sacred murtis, and blessed artifacts
          </p>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-6 text-white text-center">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg mb-2">Sacred Craftsmanship</h3>
          <p className="text-white/90 text-sm">
            Traditional techniques with spiritual significance
          </p>
        </div>

        <div className="bg-gradient-to-br from-orange-600 to-amber-700 rounded-2xl p-6 text-white text-center">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg mb-2">Devotional Service</h3>
          <p className="text-white/90 text-sm">
            Serving devotees with spiritual guidance and care
          </p>
        </div>
      </motion.div>

      {/* Closing Statement */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="text-center bg-gradient-to-r from-gray-50 to-blue-50 rounded-3xl p-8 border border-gray-200"
      >
        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Join Our Spiritual Family</h2>
        <p className="text-gray-700 text-lg leading-relaxed max-w-3xl mx-auto">
          We deliver divine blessings and authentic spiritual products across India through trusted partners, 
          ensuring every package reaches you with the same care and devotion with which it was created.
        </p>
      </motion.div>

      {/* Footer Note */}
      <div className="mt-12 text-center">
        <p className="text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Divine Mahakal. Spreading divine blessings across India.
        </p>
      </div>
    </div>
  );
};

export default AboutUs;