import Layout from "../shared/components/Layout";
import Head from "next/head";

export default function Privacy() {
    return (
        <Layout>
            <Head>
                <title>Privacy Policy | Strubloid</title>
                <meta name="description" content="Strubloid privacy policy." />
            </Head>
            <div style={{ maxWidth: 700, margin: "0 auto", padding: "2rem" }}>
                <h1>Privacy Policy</h1>
                <p>Your privacy is important to us. This Privacy Policy explains how Strubloid collects, uses, and protects your information.</p>
                <h2>Information We Collect</h2>
                <ul>
                    <li>Personal information you provide (such as email address, name, etc.)</li>
                    <li>Usage data and analytics</li>
                </ul>
                <h2>How We Use Your Information</h2>
                <ul>
                    <li>To provide and improve our services</li>
                    <li>To communicate with you</li>
                    <li>To comply with legal obligations</li>
                </ul>
                <h2>Data Protection</h2>
                <p>We implement appropriate security measures to protect your data. Your information is not shared with third parties except as required by law.</p>
                <h2>Contact</h2>
                <p>
                    If you have any questions about this Privacy Policy, please contact us at <a href="mailto:mail@strubloid.com">Email</a>.
                </p>
            </div>
        </Layout>
    );
}
