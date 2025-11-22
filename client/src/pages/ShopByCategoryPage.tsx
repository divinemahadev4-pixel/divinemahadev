import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CategoryGrid from "@/components/CategoryGrid";
import ServiceHighlights from "@/components/serviceHighlight";

const ShopByCategoryPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBar />
      <Header />
      <CategoryGrid />
      <ServiceHighlights />
      <Footer />
    </div>
  );
};

export default ShopByCategoryPage;
