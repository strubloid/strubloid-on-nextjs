import React from "react";
import type { NextPage, GetStaticProps } from "next";
import AboutMe from "../components/homepage/AboutMe";
import { getStrubloidData } from "../lib/strubloid";
import type { Skill } from "../lib/strubloid";

interface AboutMePageProps {
    skills: Skill[];
}

const AboutMePage: NextPage<AboutMePageProps> = ({ skills }) => (
    <>
        <AboutMe skills={skills} carousel={false} />
    </>
);

export const getStaticProps: GetStaticProps<AboutMePageProps> = async () => {
    const strubloidData = getStrubloidData();
    return {
        props: {
            skills: strubloidData.skills,
        },
        revalidate: 3600,
    };
};

export default AboutMePage;
