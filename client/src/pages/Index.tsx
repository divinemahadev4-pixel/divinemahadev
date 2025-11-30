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
import image_phone from "../utils/image_phone.jpg"
import footer_image from "../utils/footer_image.png"

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
          imageSrc={footer_image}
          mobileImageSrc={image_phone}
          alt="100+ products for your spiritual journey"
        />

        <FeaturedProducts />

        <AboutSection />
        {/* Second scroll-zoom hero image after Divine Products */}
        <ScrollZoomHero
          imageSrc={footer_image}
          mobileImageSrc={image_phone}
        />
        <ServiceHighlights />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
