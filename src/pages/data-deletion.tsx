import Head from "next/head";

export default function DataDeletion() {
    return (
        <>
            <Head>
                <title>Data Deletion Policy | Strubloid</title>
                <meta name="description" content="How to request data deletion from Strubloid." />
            </Head>
            <div style={{ maxWidth: 700, margin: "0 auto", padding: "2rem" }}>
                <h1>Data Deletion Policy</h1>
                <p>
                    At Strubloid, we respect your privacy and your right to control your personal data. If you wish to have your data deleted from our systems, please contact us at{" "}
                    <a href="mailto:mail@strubloid.com">Email</a> with your request. We will process your request in accordance with applicable laws and regulations.
                </p>
                <h2>How to Request Data Deletion</h2>
                <ol>
                    <li>
                        Send an email to <a href="mailto:mail@strubloid.com">Email</a> with the subject "Data Deletion Request".
                    </li>
                    <li>Include any relevant information that will help us identify your data (such as your account email or username).</li>
                    <li>We will confirm your request and delete your data as required.</li>
                </ol>
                <p>If you have any questions about our data deletion process, please do not hesitate to contact us.</p>
            </div>
        </>
    );
}
