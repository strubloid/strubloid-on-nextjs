import React from "react";
import type { NextPage } from "next";
import { NewNote, Header as ScrapbookHeader } from "@features/scrapbook/components";

const NewNotePage: NextPage = () => (
    <>
        <ScrapbookHeader />
        <div className="container">
            <NewNote />
        </div>
    </>
);

export default NewNotePage;
