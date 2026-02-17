import type { AppProps } from "next/app";

// Global SCSS (extracted from Now UI Kit Pro v1.3.0)
import "../public/scss/global/_variables.scss";
import "../public/scss/global/_buttons.scss";
import "../public/scss/global/_general_mixins.scss";
import "semantic-ui-css/semantic.min.css";

import "../public/scss/global/_now-ui-icons.scss";
import "../public/scss/global/_typography.scss";
import "../public/scss/global/_alerts.scss";
import "../public/scss/global/_forms.scss";
import "../public/scss/global/_nav-pills-tabs.scss";
import "../public/scss/global/_dropdowns.scss";
import "../public/scss/global/_images.scss";
import "../public/scss/global/_modals.scss";
import "../public/scss/global/_tables.scss";
import "../public/scss/global/_info-media.scss";
import "../public/scss/global/_cards.scss";
import "../public/scss/global/_pages.scss";
import "../public/scss/global/_sections.scss";
import "../public/scss/global/_responsive.scss";

// Component SCSS (compiled at build time by Next.js)
import "../components/scrapbook/Notes.scss";
import "../components/scrapbook/Header.scss";
import "../components/contact/ContactMe.scss";
import "../components/contact/ContactMeHeader.scss";
import "../components/shared/BasicHeader.scss";
import "../components/shared/TransparentNavbar.scss";
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
