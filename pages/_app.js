import "@css/bootstrap.min.css";
import "@css/basic.min.css";
import "@css/components.css";

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
    return <Component {...pageProps} />
}