import type { AppProps } from "next/app";

import "../public/scss/global/_variables.scss";
import "../public/scss/global/_buttons.scss";
import "../public/scss/global/_general_mixins.scss";
import "semantic-ui-css/semantic.min.css";
import "../public/css/strubloid.css";

// Component SCSS (compiled at build time by Next.js)
import "../components/scrapbook/Notes.scss";
import "../components/scrapbook/Header.scss";
import "../components/contact/ContactMe.scss";
import "../components/contact/ContactMeHeader.scss";
import "../components/shared/BasicHeader.scss";
import "../components/shared/Footer.scss";
import "../components/homepage/AboutMe.scss";
import "../components/homepage/Github.scss";
import "../components/homepage/Header.scss";

import "../public/scss/global/_fonts.scss";
import "../public/scss/global/_cool_effects.scss";
import "../public/scss/global/_quote.scss";
import "../public/scss/global/_basic.scss";

import Layout from "../components/Layout";

export default function MyApp({ Component, pageProps }: AppProps) {
    return (
        <Layout>
            <Component {...pageProps} />
        </Layout>
    );
}
