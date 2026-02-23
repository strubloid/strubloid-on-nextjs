import React from "react";
import type { GetServerSideProps, NextPage } from "next";
import { Body, Header as ScrapbookHeader } from "@features/scrapbook/components";
import { server } from "@utils/constants/server";
import type { INote } from "@types";

interface ScrapbookIndexProps {
    notes: INote[];
}

const ScrapbookIndex: NextPage<ScrapbookIndexProps> = ({ notes }) => (
    <>
        <ScrapbookHeader />
        <div className="container">
            <Body notes={notes} />
        </div>
    </>
);

export const getServerSideProps: GetServerSideProps<ScrapbookIndexProps> = async () => {
    try {
        const response = await fetch(`${server}/api/notes/`);
        const { data } = await response.json();
        const notes: INote[] = Array.isArray(data) && data.length > 0 ? data : [];
        return { props: { notes } };
    } catch {
        return { props: { notes: [] } };
    }
};

export default ScrapbookIndex;
