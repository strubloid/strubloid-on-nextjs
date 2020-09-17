// import '@fortawesome/fontawesome-free/js/fontawesome';
// import '@fortawesome/fontawesome-free/js/solid';
// import '@fortawesome/fontawesome-free/js/regular';
// import '@fortawesome/fontawesome-free/js/brands';

import "@css/bootstrap.min.css";
import "@css/basic.min.css";

import "@scss-global/_variables.scss";
import "@scss-global/_buttons.scss";
import "@scss-global/_general_mixins.scss";

import "@css/components.css";

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
    return <Component {...pageProps} />
}