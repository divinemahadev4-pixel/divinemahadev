import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import FeaturedProducts from "@/components/FeaturedProducts";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";
import BannerSlider from "@/components/BannerSlider";
import CategoryGrid from "@/components/CategoryGrid";
import ServiceHighlights from "@/components/serviceHighlight";
import ScrollZoomHero from "@/components/ScrollZoomHero";
import image1 from "../utils/image1.jpg"
import image2 from "../utils/image2.jpg"

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-purple-50 to-pink-50">
      <AnnouncementBar />
      <Header />
      {/* Full-width banner section */}
      <BannerSlider />

      {/* Rest of the content with pastel purple background */}
      <div className="bg-gradient-to-br from-purple-100/50 via-purple-50/30 to-pink-50/50">
        <CategoryGrid />

        {/* Scroll-zoom hero image after Divine Collection */}
        <ScrollZoomHero
          imageSrc={image1}
          alt="100+ products for your spiritual journey"
          caption="100+ Products • Your one stop destination for spiritual needs"
        />

        <FeaturedProducts />

        {/* Second scroll-zoom hero image after Divine Products */}
        <ScrollZoomHero
          imageSrc={image2}
          caption="Curated divine products to guide your spiritual path"
        />
        <AboutSection />
        <ServiceHighlights />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
