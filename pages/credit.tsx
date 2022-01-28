import Head from "next/head";

export default function CreditPage({ }) {
  return (
    <>
    <Head>
      <title>Mads Credits</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <main>
        (Some) Designs <a className="line-through">stolen from</a> by <a href="https://twitter.com/epicth3emilis">Epic</a>
        <br />
        Free QA by <a href="https://twitter.com/epicth3emilisn">Epic</a> 
    </main>
    </>
  );
}