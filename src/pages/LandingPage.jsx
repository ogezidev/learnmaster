// src/pages/LandingPage.jsx
import React from "react";
import Navbar from "../components/Navbar/Navbar";
import Banner from "../components/Banner/Banner";
import BannerCard from "../components/BannerCard/BannerCard";
import BannerGrid from "../components/BannerCard/BannerGrid";
import SectionThree from "../components/SectionThree/SectionThree";
import Frase from "../components/Frase/Frase";

function LandingPage() {
  return (
    <>
      <Navbar />
      <Banner />
      <Frase />
      <BannerCard />
      <BannerGrid />
      <SectionThree />
    </>
  );
}

export default LandingPage;
