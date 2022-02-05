// Frontend imports
import { ReactElement, useEffect, useState } from "react";
import MainAd from "../../components/ad";
import Header from "../../components/ad/head";
import ReactiveAdInfo from "../../components/ad/info";
import ReactiveCountdown from "../../components/countdown";
import NavBar from "../../components/navigation/navbar";
import { registerView } from "../../lib/api/requests/frontend";

// Backend imports
import { apiKey } from "../../lib/auth/api";
import AdDB from "../../lib/db/models/ad";
import AdDataDB from "../../lib/db/models/ad/data";
import ContentDB from "../../lib/db/models/content";
import ContentDataDB from "../../lib/db/models/content/data";
import { matchWithAd } from "../../lib/server/ad/findAd";
import connectDB from "../../lib/db/connect/mongoose/connect";
import { getContent } from "../../lib/server/content/getContent";
import SeriousFooter from "../../components/footer/serious";
import { logger } from "../../lib/log";

export default function AdPage(props: any): ReactElement {
  // get the ad and content from props, fetched by the server in getStaticProps
  const ad = props.ad;
  const content = props.content;

  // useState for isDone. This is used to indicate state on wheter or not the ad or countdown is done
  const [isDone, setIsDone] = useState(false);

  // useEffect for registering the view. Every time the page is loaded or the adID or contentID changes, this will be called
  useEffect(() => {
    console.log(
      "Registering view for adID: " + ad.id,
      "contentID: " + content.id
    );
    registerView(content.id, ad.id);
  }, [ad.id, content.id]);

  // incase something happend with getstaticprops and htis wasnt registered as a 404 already, we here ensure that ad nor the content is null. If either is null, we return a 404 page
  if (!ad || !content) return <div>Ad not found</div>;
  // TODO Warning: Cannot update a component (`AdPage`) while rendering a different component (`Countdown$1`). To locate the bad setState() call inside `Countdown$1`, follow the stack trace as described in https://reactjs.org/link/setstate-in-render
  return (
    <div className="py-0 px-0">
      <Header
        title={
          content.title +
          " by " +
          content.owner.displayName +
          " | " +
          "Market Advertisments"
        }
        description={
          "Support " +
          content.owner.displayName +
          " by downloading " +
          content.title +
          " through mads!"
        }
      />

      <main className=" relative min-h-screen  flex-1 flex flex-col">
        <NavBar />

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

      <SeriousFooter />
    </div>
  );
}

// getStaticProps is a function that is called by NextJS at build time. With revalidate we force the server to re-fetch the data every x seconds.
export async function getStaticProps({ params }: any) {
  logger.info(`Fetching props for content with id: ${params.id}`);
  let proptimer = logger.startTimer();

  // get the contentID from the url/params
  const { id } = params;

  // initilize the ad and content as null
  let content: object | any;
  let ad: object | any;

  await connectDB();

  try {
    // get the content from the database
    content = await getContent(id);
    if (content === null) {
      logger.error("Error getting content with id: " + id + ". It was null");
      return { notFound: true };
    }

    // map the tags into an array
    let tags = content.tags.map((tag: { tag: any }) => tag.tag);
    let theme = content.theme;

    // find a relevant ad with similair tags and preferred theme. Ignore errors as its likely that the match already exists

    ad = await matchWithAd(tags, theme, id);

    logger.info(
      "Content with id of " + id + " matched ad with id of " + ad._id
    );
  } catch (error) {
    logger.error("Error getting content with id: " + id + " " + error);
    throw error;
    // if something went wrong, we return a 404 page. For example if the contentID or no ad was found
    return { notFound: true };
  }

  // We need to do _id.toString() to make sure that the adID is a string and not an object
  let adTags: { tag: any; _id: any }[] = [];
  ad.tags.forEach((tag: { tag: any; _id: any }) => {
    adTags.push({
      tag: tag.tag,
      _id: tag._id.toString(),
    });
  });

  ad = {
    id: ad._id.toString(),
    type: ad.type,
    theme: ad.theme,
    title: ad.title,
    link: ad.link,
    image: ad.image || null,
    video: ad.video || null,
    tags: adTags,
    owner: {
      displayName: ad.owner.displayName,
      uid: ad.owner.uid,
      _id: ad.owner._id.toString(),
    },
  };

  let contentTags: { tag: any; _id: any }[] = [];
  content.tags.forEach((tag: { tag: any; _id: any }) => {
    contentTags.push({
      tag: tag.tag,
      _id: tag._id.toString(),
    });
  });

  content = {
    id: content._id.toString(),
    theme: content.theme,
    title: content.title,
    link: content.link,
    tags: contentTags,
    owner: {
      displayName: content.owner.displayName,
      uid: content.owner.uid,
      _id: content.owner._id.toString(),
    },
  };

  proptimer.done({
    message: "Fetched props for content with id: " + id,
  });
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
  logger.warn("Getting static paths");
  let pathtimer = logger.startTimer();

  // create a list of all contentIDs initalized as an empty array
  let contentids: { id: string }[] = [];
  let adids: { id: string }[] = [];

  // if we dont have an apikey in the env config, we throw an error
  if (!apiKey) throw new Error("Apikey is not set in .env.local");

  await connectDB();

  let cidtimer = logger.startTimer();
  // get all contentIDs from the database and save them in the ids array
  contentids = await ContentDB.find({});

  cidtimer.done({
    message: "Fetched all contentIDs",
  });

  let aidtimer = logger.startTimer();

  // get all adIDs from the database and save them in the ids array
  adids = await AdDB.find({});

  aidtimer.done({
    message: "Fetched all adIDs",
  });

  // create an array of paths from the id of each element in the ids array
  const paths = contentids.map((content: { id: string }) => {
    return {
      params: {
        id: content.id,
      },
    };
  });

  logger.debug(
    "Generated " +
      paths.length +
      " paths for " +
      contentids.length +
      " contentIDs."
  );

  logger.debug(`
Ensuring that all content has corresponding contentdata`);

  // go trough each contentID and ensure the contentData exists, if not create it
  for (const id in contentids) {
    let ctimer = logger.startTimer();
    await ContentDataDB.findOne({ contentID: contentids[id].id }).catch(
      async (e) => {
        logger.warn(
          "Contentdata not found for id: " + contentids[id].id,
          ". Creating... (",
          e,
          ")"
        );
        await ContentDataDB.create({
          contentID: contentids[id].id,
          views: 0,
          clicks: 0,
          skips: 0,
        });
      }
    );
    ctimer.done({
      message: "Checked content with id: " + contentids[id].id,
      level: "debug",
    });
  }
  // go trough each adID and ensure the adData exists, if not create it
  for (const id in adids) {
    let adtimer = logger.startTimer();
    await AdDataDB.findOne({ adID: adids[id].id }).catch(async (e) => {
      logger.warn(
        "Addata not found for id: " + adids[id].id,
        ". Creating... (",
        e,
        ")"
      );

      await AdDataDB.create({
        adID: adids[id].id,
        clicks: 0,
        views: 0,
        skips: 0,
        matches: [],
      });
    });
    adtimer.done({
      message: "Checked ad with id: " + adids[id].id,
      level: "debug",
    });
  }

  // return the paths with a fallback of blocking.
  // We'll pre-render only these paths at build time.
  // { fallback: blocking } will server-render pages
  // on-demand if the path doesn't exist.
  pathtimer.done({
    message: "Generated static paths",
  });

  return {
    paths,
    fallback: "blocking",
  };
}
