import React from "react";
import type { GetStaticProps, NextPage } from "next";
import Header from "../components/homepage/Header";
import Github from "../components/homepage/Github";
import AboutMe from "../components/homepage/AboutMe";
import Art from "../components/homepage/Art";
import { getGithubProjects } from "../lib/github";
import { getStrubloidData } from "../lib/strubloid";
import { getFlickrData } from "../lib/flickr";
import type { CachedProject } from "../lib/github";
import type { Skill } from "../lib/strubloid";
import type { FlickrPhoto, FlickrAlbum } from "../lib/flickr";

interface HomeProps {
    githubProjects: CachedProject[];
    skills: Skill[];
    flickrPhotos: FlickrPhoto[];
    flickrAlbums: FlickrAlbum[];
}

const Home: NextPage<HomeProps> = ({ githubProjects, skills, flickrPhotos, flickrAlbums }) => (
    <>
        <Header />
        <Art photos={flickrPhotos} albums={flickrAlbums} />
        <Github projects={githubProjects} />
        <AboutMe skills={skills} />
    </>
);

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
    const githubProjects = await getGithubProjects();
    const strubloidData = getStrubloidData();
    const flickrData = await getFlickrData();
    return {
        props: {
            githubProjects,
            skills: strubloidData.skills,
            flickrPhotos: flickrData.photos,
            flickrAlbums: flickrData.albums,
        },
        revalidate: 3600,
    };
};

export default Home;
