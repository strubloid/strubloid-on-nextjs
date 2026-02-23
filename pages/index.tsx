import React from "react";
import type { GetStaticProps, NextPage } from "next";
import Header from "../components/homepage/Header";
import Github from "../components/homepage/Github";
import AboutMe from "../components/homepage/AboutMe";
import Art from "../components/homepage/Art";
import { getGithubProjects } from "@lib/services/github";
import { getStrubloidData } from "@lib/services/strubloid";
import { getFlickrData } from "@lib/services/flickr";
import type { CachedProject } from "@lib/services/github";
import type { Skill } from "@lib/services/strubloid";
import type { FlickrPhoto, FlickrAlbum } from "@lib/services/flickr";

interface HomeProps {
    githubProjects: CachedProject[];
    skills: Skill[];
    flickrPhotos: FlickrPhoto[];
    flickrAlbums: FlickrAlbum[];
}

const Home: NextPage<HomeProps> = ({ githubProjects, skills, flickrPhotos, flickrAlbums }) => (
    <>
        <Header />
        <div id="art-section">
            <Art photos={flickrPhotos} albums={flickrAlbums} />
        </div>
        <div id="github-section">
            <Github projects={githubProjects} />
        </div>
        <div id="aboutme-section">
            <AboutMe skills={skills} />
        </div>
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
