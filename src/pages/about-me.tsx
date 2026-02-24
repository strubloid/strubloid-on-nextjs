import React from "react";
import type { NextPage, GetStaticProps } from "next";
import { AboutMe } from "@features/home/components";
import { Timeline } from "@shared/components";
import { getStrubloidData } from "@lib/services/strubloid";
import { getTimelineData } from "@lib/services/timeline";
import { getBackgroundPhotos } from "@lib/services/background";
import type { Skill } from "@lib/services/strubloid";
import type { TimelineItem } from "@lib/services/timeline";
import type { BackgroundPhoto } from "@lib/services/background";

interface AboutMePageProps {
    skills: Skill[];
    rafaelTimeline: TimelineItem[];
    backgroundPhotos: BackgroundPhoto[];
}

const AboutMePage: NextPage<AboutMePageProps> = ({ skills, rafaelTimeline, backgroundPhotos }) => (
    <>
        <Timeline items={rafaelTimeline} backgroundPhotos={backgroundPhotos} title="Who Am I ?" />
        <AboutMe skills={skills} carousel={false} />
    </>
);

export const getStaticProps: GetStaticProps<AboutMePageProps> = async () => {
    const strubloidData = getStrubloidData();
    const timelineData = getTimelineData();
    const backgroundData = getBackgroundPhotos();

    return {
        props: {
            skills: strubloidData.skills,
            rafaelTimeline: timelineData,
            backgroundPhotos: backgroundData.photos,
        },
        revalidate: 3600,
    };
};

export default AboutMePage;
