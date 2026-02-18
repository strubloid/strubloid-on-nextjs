import React from "react";
import type { GetStaticProps, NextPage } from "next";
import Header from "../components/homepage/Header";
import Github from "../components/homepage/Github";
import AboutMe from "../components/homepage/AboutMe";
import { getGithubProjects } from "../lib/github";
import { getStrubloidData } from "../lib/strubloid";
import type { CachedProject } from "../lib/github";
import type { Skill } from "../lib/strubloid";

interface HomeProps {
    githubProjects: CachedProject[];
    skills: Skill[];
}

const Home: NextPage<HomeProps> = ({ githubProjects, skills }) => (
    <>
        <Header />
        <Github projects={githubProjects} />
        <AboutMe skills={skills} />
    </>
);

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
    const githubProjects = await getGithubProjects();
    const strubloidData = getStrubloidData();
    return {
        props: {
            githubProjects,
            skills: strubloidData.skills,
        },
        revalidate: 3600,
    };
};

export default Home;
