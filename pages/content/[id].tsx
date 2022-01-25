import Head from "next/head";
import { ReactElement, useEffect, useState } from "react";
import { correctPassword } from "../../lib/auth";
import MainAd from "../../components/ad";
import {
  getContentWithID,
  pingAdData,
  pingContentData,
  registerView,
} from "../../lib/logic/requests/frontend";
import {
  createContentData,
  getContentIDS,
  findAd,
  getAdIDS,
  createAdData,
} from "../../lib/logic/requests/backend";
import { loadEnvConfig } from "@next/env";
import CornerLogo from "../../components/logo";
import ReactiveCountdown from "../../components/countdown";
import ReactiveAdInfo from "../../components/ad/info";
import NotSeriousFooter from "../../components/footer";
import Header from "../../components/ad/head";
import TopAuth from "../../components/auth/topbar";
import NavBar from "../../components/navigation/navbar";
import { Ad } from "../../lib/types/ad";

export default function AdPage(props: any): ReactElement {
  // get the ad and content from props, fetched by the server in getStaticProps
  const ad = props.ad;
  const content = props.content;

  // useState for isDone. This is used to indicate state on wheter or not the ad or countdown is done
  const [isDone, setIsDone] = useState(false);

  // useEffect for registering the view. Every time the page is loaded or the adID or contentID changes, this will be called
  useEffect(() => {
    console.log("Registering view");
    if (ad.id && content.id) registerView(ad.id, content.id);
  }, [ad.id, content.id]);

  // incase something happend with getstaticprops and htis wasnt registered as a 404 already, we here ensure that ad nor the content is null. If either is null, we return a 404 page
  if (!ad || !content) return <div>Ad not found</div>;
  // TODO Warning: Cannot update a component (`AdPage`) while rendering a different component (`Countdown$1`). To locate the bad setState() call inside `Countdown$1`, follow the stack trace as described in https://reactjs.org/link/setstate-in-render

  return (
    <div className="py-0 px-0">
      <Header title={content.title + " by " + content.owner.displayName + " | " + "Market Advertisments"} description={"Support " + content.owner.displayName + " by downloading " + content.title + " through mads!"} />

      <main className=" relative min-h-screen  flex-1 flex flex-col">
      < NavBar />
      
        <div className=" relative flex items-center flex-wrap flex-col pt-48 lg:relative lg:pt-32 md:pt-48 ">
          <div className="overflow-auto mb-4 p-0 pt-0 flex flex-col text-inherit border-2 border-solid border-gray-300 border-opacity-60 rounded-xl transition-colors duration-200 ease hover:text-blue-600 hover:border-blue-600 focus:text-blue-600 focus:border-blue-600 active:border-blue-600 active:text-blue-600">
            <MainAd ad={ad} content={content} setIsDone={setIsDone} />

            <div className="flex flex-row p-4 pt-2 pb-3 text-left justify-between">
              <ReactiveAdInfo ad={ad} />

              <ReactiveCountdown
                ad={ad}
                content={content}
                isDone={isDone}
                setIsDone={setIsDone}
              />
            </div>
          </div>
        </div>
      </main>
      
      <NotSeriousFooter />
    </div>
  );
}

// getStaticProps is a function that is called by NextJS at build time. With revalidate we force the server to re-fetch the data every x seconds.
export async function getStaticProps({ params }: any) {
  // get the contentID from the url/params
  const { id } = params;

  // initilize the ad and content as null
  let content;
  let ad: Ad;

  try {
    // get the content from the database
    content = await getContentWithID(id);
    if (content === null) {
      console.log("Error getting content with id: " + id);
      return { notFound: true };
    }
    // map the tags into an array
    let tags = content.tags.map((tag: { tag: any }) => tag.tag);
    let theme = content.theme;

    // find a relevant ad with similair tags and preferred theme
    ad = await findAd(tags, theme, id, correctPassword);
    console.log("Content with id of " + id + " matched ad with id of " + ad.id);
  } catch (error) {
    console.log("Error getting content with id: " + id + " " + error);
    // if something went wrong, we return a 404 page. For example if the contentID or no ad was found
    return { notFound: true };
  }

  console.log("returning props");
  return {
    props: {
      ad,
      content,
    },
    revalidate: 1800, // half an hour, if this is to be updated so have the code that handles matching
  };
}

// getStaticPaths is a function that is called by NextJS at build time. It returns an array of paths that are used to generate the pages.
export async function getStaticPaths() {
  // ensure that the env config is loaded
  loadEnvConfig("../../.env.local");

  // create a list of all contentIDs initalized as an empty array
  let contentids: { id: string }[] = [];
  let adids: { id: string }[] = [];

  // if we dont have a password in the env config, we throw an error
  if (!correctPassword) throw new Error("Password is not set in .env.local");

  // get all contentIDs from the database and save them in the ids array
  contentids = await getContentIDS(correctPassword);
  // get all adIDs from the database and save them in the ids array
  adids = await getAdIDS(correctPassword);

  // create an array of paths from the id of each element in the ids array
  const paths = contentids.map((content: { id: string }) => {
    return {
      params: {
        id: content.id,
      },
    };
  });

  try {
    // go trough each contentID and ensure the contentData exists, if not create it
    for (const id in contentids) {
      await pingContentData(contentids[id].id, correctPassword).catch(async (e) => {
        console.log(
          "Contentdata not found for id: " + contentids[id].id,
          ". Creating... (",
          e,
          ")"
        );
        await createContentData(contentids[id].id, correctPassword);
      });
    }

    // go trough each adID and ensure the adData exists, if not create it
    for (const id in adids) {
      await pingAdData(adids[id].id).catch(async (e) => {
        console.log(
          "Addata not found for id: " + adids[id].id,
          ". Creating... (",
          e,
          ")"
        );
        await createAdData(adids[id].id, correctPassword);
      });
    }
  } catch (error) {
    console.log(error);
  }

  // return the paths with a fallback of blocking.
  // We'll pre-render only these paths at build time.
  // { fallback: blocking } will server-render pages
  // on-demand if the path doesn't exist.
  return {
    paths,
    fallback: "blocking",
  };
}
