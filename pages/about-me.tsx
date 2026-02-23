import React from "react";
import type { NextPage, GetStaticProps } from "next";
import AboutMe from "../components/homepage/AboutMe";
import Timeline from "../components/shared/Timeline";
import { getStrubloidData } from "../lib/strubloid";
import { rafaelTimeline } from "../data/rafael-timeline";
import type { Skill } from "../lib/strubloid";

interface AboutMePageProps {
    skills: Skill[];
}

const AboutMePage: NextPage<AboutMePageProps> = ({ skills }) => (
    <>
        <Timeline items={rafaelTimeline} title="Who Am I ?" />
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
