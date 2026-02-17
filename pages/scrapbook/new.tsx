import React from "react";
import type { NextPage } from "next";
import NewNote from "../../components/scrapbook/NewNote";
import ScrapbookHeader from "../../components/scrapbook/Header";

const NewNotePage: NextPage = () => (
    <>
        <ScrapbookHeader />
        <div className="container">
            <NewNote />
        </div>
    </>
);

export default NewNotePage;
