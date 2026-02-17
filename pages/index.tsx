import React from "react";
import type { NextPage } from "next";
import Header from "../components/homepage/Header";
import Github from "../components/homepage/Github";
import AboutMe from "../components/homepage/AboutMe";

const Home: NextPage = () => (
    <>
        <Header />
        <Github />
        <AboutMe />
    </>
);

export default Home;
