import React from "react";
import type { GetStaticProps, NextPage } from "next";
import Header from "../components/homepage/Header";
import Github from "../components/homepage/Github";
import AboutMe from "../components/homepage/AboutMe";
import { getGithubProjects } from "../lib/github";
import type { CachedProject } from "../lib/github";

interface HomeProps {
    githubProjects: CachedProject[];
}

const Home: NextPage<HomeProps> = ({ githubProjects }) => (
    <>
        <Header />
        <Github projects={githubProjects} />
        <AboutMe />
    </>
);

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
    const githubProjects = await getGithubProjects();
    return {
        props: { githubProjects },
        revalidate: 3600, // re-fetch every 1 hour
    };
};

export default Home;
