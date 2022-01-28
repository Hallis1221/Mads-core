import Head from "next/head"
import { ReactElement } from "react";

export default function Header({ title = "", description = "", image = undefined }: any): ReactElement {
    return (
        <Head>
            <title>{title}</title>
            <meta property="og:title" content={title} />
            <meta property="og:type" content="website" />
            <meta property="og:url" content="https://marketads.me" />
            <meta property="og:image" content={image} />
            <meta property="og:description" content={description} />
            <meta name="theme-color" content="#FF0000" />
            <meta name="twitter:card" content="summary_large_image" />
        </Head>);
}