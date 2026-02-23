import { useEffect, useState } from "react";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";

// Design System (2025 Organic & Warm)
import "../public/scss/global/_design-system.scss";

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

// Component SCSS from new feature-based locations
import "../src/features/scrapbook/components/Notes.scss";
import "../src/features/scrapbook/components/Header.scss";
import "../src/features/contact/components/ContactMe.scss";
import "../src/features/contact/components/ContactMeHeader.scss";
import "../src/shared/components/BasicHeader.scss";
import "../src/shared/components/TransparentNavbar.scss";
import "../src/shared/components/Footer.scss";
import "../src/features/home/components/AboutMe.scss";
import "../src/features/home/components/Art.scss";
import "../src/features/home/components/Github.scss";
import "../src/features/home/components/Header.scss";

import "../public/scss/pages/artistic.scss";

import "../public/scss/global/_fonts.scss";
import "../public/scss/global/_cool_effects.scss";
import "../public/scss/global/_quote.scss";
import "../public/scss/global/_basic.scss";

import Layout from "@shared/components/Layout";

export default function MyApp({ Component, pageProps }: AppProps) {
    const router = useRouter();
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        // Disable automatic scroll restoration to prevent browser from remembering scroll position
        if ("scrollRestoration" in window.history) {
            window.history.scrollRestoration = "manual";
        }

        // Reset scroll position on mount and after a small delay to ensure it takes effect
        window.scrollTo(0, 0);
        const timer = setTimeout(() => window.scrollTo(0, 0), 0);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const handleStart = () => setIsTransitioning(true);
        const handleComplete = () => {
            setIsTransitioning(false);
            window.scrollTo(0, 0);
        };

        router.events.on("routeChangeStart", handleStart);
        router.events.on("routeChangeComplete", handleComplete);
        router.events.on("routeChangeError", handleComplete);

        return () => {
            router.events.off("routeChangeStart", handleStart);
            router.events.off("routeChangeComplete", handleComplete);
            router.events.off("routeChangeError", handleComplete);
        };
    }, [router]);

    return (
        <Layout>
            <div className={`page-content${isTransitioning ? " page-transitioning" : ""}`}>
                <Component {...pageProps} />
            </div>
        </Layout>
    );
}
