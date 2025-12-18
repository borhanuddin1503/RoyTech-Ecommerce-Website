import Image from "next/image";
import Banner from "./components/home/banner/Banner";
import CategoriesSection from "./components/home/categories/Categories";
import { Suspense } from "react";
import CategoriesLoading from "./components/home/categories/CategoriesLoading";
import FeaturedProducts from "./components/home/featured-products/FeaturedProducts";
import FeaturedProductsSkeleton from "./components/home/featured-products/FeaturedProductsSkeleton";
import BestSales from "./components/home/best-selling-products/BestSellingProducts";
import NewArrivals from "./components/home/new-arrivals/NewArrivals";
import WhyChooseUs from "./components/home/whyChooseUs/WhyChooseUs";
import ContactUs from "./components/home/contact-us/ContactUs";

export const metadata = {
  title: 'Roy Tech World',
  description: 'Best reasonable E-commerce website in bangladesh'
}

export default function Home() {
  return (
      <div>
        <Banner></Banner>
        <Suspense fallback={<CategoriesLoading/>}><CategoriesSection></CategoriesSection></Suspense>
        <Suspense fallback={<FeaturedProductsSkeleton/>}><FeaturedProducts></FeaturedProducts></Suspense>
        <Suspense fallback={<FeaturedProductsSkeleton/>}><BestSales></BestSales></Suspense>
        <Suspense fallback={<FeaturedProductsSkeleton/>}><NewArrivals></NewArrivals></Suspense>
        <Suspense fallback={<FeaturedProductsSkeleton/>}><WhyChooseUs/></Suspense>
        <Suspense fallback={<FeaturedProductsSkeleton/>}><ContactUs></ContactUs></Suspense>
      </div>
  );
}
