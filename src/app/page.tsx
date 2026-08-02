"use client";

import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { Differentiators } from "@/components/site/Differentiators";
import { ProductCatalog } from "@/components/site/ProductCatalog";
import { SalesChannels } from "@/components/site/SalesChannels";
import { About } from "@/components/site/About";
import { Coverage } from "@/components/site/Coverage";
import { Testimonials } from "@/components/site/Testimonials";
import { BrandEcosystem } from "@/components/site/BrandEcosystem";
import { Faq } from "@/components/site/Faq";
import { Location } from "@/components/site/Location";
import { Footer } from "@/components/site/Footer";
import { WhatsAppFloat } from "@/components/site/WhatsAppFloat";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Differentiators />
        <ProductCatalog />
        <SalesChannels />
        <About />
        <Coverage />
        <Testimonials />
        <BrandEcosystem />
        <Faq />
        <Location />
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
