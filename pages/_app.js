import "@scss-global/_variables.scss";
import "@scss-global/_buttons.scss";
import "@scss-global/_general_mixins.scss";
import 'semantic-ui-css/semantic.min.css'
import "@css/strubloid.css";
import "@css/components.css";
import "public/scss/global/_fonts.scss";
import "public/scss/global/_cool_effects.scss";
import "public/scss/global/_quote.scss";
import "public/scss/global/_basic.scss";
import Layout from '@components/Layout';

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
    return <Layout>
        <Component {...pageProps} />
    </Layout>
}