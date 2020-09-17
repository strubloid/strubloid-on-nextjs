import "@scss-global/_variables.scss";
import "@scss-global/_buttons.scss";
import "@scss-global/_general_mixins.scss";
import "@css/strubloid.css";
import "@css/components.css";

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
    return <Component {...pageProps} />
}