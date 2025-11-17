import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Sparkles, Star, MapPin } from "lucide-react";

const AboutSection = () => {
  const navigate = useNavigate();
  
  // Proper Mahakaleshwar Shivling images from Ujjain
  const mahakalShivling = "https://images.unsplash.com/photo-1601965268859-ef6d31a3cd8e?w=600&h=700&fit=crop&crop=center";
  const ujjainMahakal = "https://images.unsplash.com/photo-1587132137056-4c6e318b9856?w=600&h=700&fit=crop&crop=center";
  const shivlingImage = "https://tse1.mm.bing.net/th/id/OIP.tHQ6SUrbkhuHAkJJZ4q12AAAAA?cb=ucfimg2&pid=ImgDet&ucfimg=1&w=203&h=276&c=7&dpr=1.3&o=7&rm=3"
  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-br from-white via-orange-50 to-amber-50/30">
      {/* Spiritual decorative elements */}
      <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-orange-200/20 blur-3xl"></div>
      <div className="absolute -bottom-40 -right-20 w-72 h-72 rounded-full bg-amber-200/20 blur-3xl"></div>
      <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-orange-100/30 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div 
            className="text-center lg:text-left"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <motion.div
              className="inline-flex items-center gap-2 mb-4 bg-orange-100/50 rounded-full px-4 py-1 border border-orange-200"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            >
              <MapPin className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-semibold text-orange-700 uppercase tracking-wide">Blessed from Ujjain</span>
            </motion.div>
            
            <motion.h2 
              className="text-4xl md:text-5xl font-bold mb-8 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Divine Blessings from
              <br />
              <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">Mahakaleshwar Ujjain</span>
            </motion.h2>
            
            <motion.p 
              className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
            >
              At DivineMahadev, we bring you sacred spiritual items blessed in the holy city of Ujjain, 
              home to the majestic Mahakaleshwar Jyotirlinga. Each mala, murti, and spiritual artifact carries 
              the divine energy of Lord Shiva directly from the sacred temple.
            </motion.p>
            
            <motion.p 
              className="text-lg text-gray-700 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
            >
              Our collection includes authentic Rudraksha malas, sacred Shiva lingams, divine murtis, 
              and spiritual accessories that are carefully selected and blessed in Mahakal Temple 
              to bring positive energy, peace, and prosperity to your life.
            </motion.p>

            {/* Spiritual Features */}
            <motion.div 
              className="grid grid-cols-2 gap-4 mb-8 max-w-md"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
            >
              <div className="flex items-center gap-2 text-sm text-orange-700">
                <Sparkles className="w-4 h-4 text-orange-500" />
                <span>Mahakal Blessed</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-orange-700">
                <Star className="w-4 h-4 text-orange-500" />
                <span>Authentic Rudraksha</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-orange-700">
                <Sparkles className="w-4 h-4 text-orange-500" />
                <span>Divine Energy</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-orange-700">
                <Star className="w-4 h-4 text-orange-500" />
                <span>Direct from Ujjain</span>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.6, ease: "easeOut" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                size="lg"
                className="rounded-full px-8 py-6 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-lg font-semibold shadow-lg hover:shadow-xl border-0"
                onClick={() => navigate("/about")}
              >
                Discover Our Divine Story
              </Button>
            </motion.div>
          </motion.div>

          {/* Mahakaleshwar Shivling Image */}
          <motion.div 
            className="relative flex justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          >
            <div className="relative w-full max-w-md">
              {/* Main Shivling Image */}
              <div className="relative overflow-hidden rounded-3xl border-4 border-white shadow-2xl">
                <img
                  src={shivlingImage}
                  alt="Mahakaleshwar Jyotirlinga - Sacred Shivling of Ujjain"
                  className="w-full h-[500px] object-cover transform transition-transform duration-700 hover:scale-105"
                />
                {/* Spiritual overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-orange-900/30 via-transparent to-transparent"></div>
                {/* Sacred light effect */}
                <div className="absolute inset-0 bg-orange-200/10 mix-blend-overlay"></div>
              </div>
              
              {/* Floating spiritual blessing */}
              <motion.div 
                className="absolute -bottom-6 -left-6 bg-white p-5 rounded-xl shadow-2xl max-w-xs border-2 border-orange-200 z-10"
                initial={{ opacity: 0, y: 30, x: -30 }}
                whileInView={{ opacity: 1, y: 0, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.7, ease: "easeOut" }}
                whileHover={{ rotate: -2, scale: 1.02 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-orange-500" />
                  <p className="text-sm font-semibold text-orange-700">Mahakal Blessed</p>
                </div>
                <p className="text-xs italic text-gray-600 leading-relaxed">
                  "Every spiritual item carries blessings from Mahakaleshwar Jyotirlinga"
                </p>
              </motion.div>

              {/* Ujjain Location Badge */}
              <motion.div 
                className="absolute -top-4 -right-4 bg-gradient-to-r from-orange-600 to-amber-600 text-white px-4 py-2 rounded-full shadow-lg z-10"
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.8, type: "spring" }}
              >
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <MapPin className="w-3 h-3" />
                  <span>Ujjain, MP</span>
                </div>
              </motion.div>

              {/* Sacred Bhasma Aarti Effect */}
              <motion.div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-orange-200/20 rounded-full blur-xl"
                animate={{ 
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              {/* Spiritual Flowers/Offerings */}
              <motion.div
                className="absolute bottom-8 left-8 w-8 h-8 bg-orange-300 rounded-full opacity-70"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 0.9, 0.7]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="absolute top-12 right-8 w-6 h-6 bg-amber-400 rounded-full opacity-60"
                animate={{ 
                  scale: [1, 1.3, 1],
                  opacity: [0.6, 0.8, 0.6]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              />
            </div>
          </motion.div>
        </div>

        {/* Bottom Spiritual Quote */}
        <motion.div
          className="mt-16 text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.9 }}
        >
          <div className="bg-orange-50/50 rounded-2xl p-6 border border-orange-200">
            <p className="text-lg text-orange-800 font-medium italic">
              "ॐ नमः शिवाय! Experience the divine blessings of Mahakaleshwar Jyotirlinga through our sacred collection directly from the holy city of Ujjain."
            </p>
            <p className="text-sm text-orange-600 mt-2">Har Har Mahadev! 🕉️</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;