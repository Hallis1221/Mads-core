// Frontend imports
import { ReactElement, useEffect, useState } from "react";
import MainAd from "../../components/ad";
import Header from "../../components/ad/head";
import ReactiveAdInfo from "../../components/ad/info";
import ReactiveCountdown from "../../components/countdown";
import NotSeriousFooter from "../../components/footer";
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

export default function AdPage(props: any): ReactElement {
  // get the ad and content from props, fetched by the server in getStaticProps
  const ad = props.ad;
  const content = props.content;

  // useState for isDone. This is used to indicate state on wheter or not the ad or countdown is done
  const [isDone, setIsDone] = useState(false);

  // useEffect for registering the view. Every time the page is loaded or the adID or contentID changes, this will be called
  useEffect(() => {
    console.log("Registering view for adID: " + ad.id, "contentID: " + content.id);
    registerView( content.id, ad.id);
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

      <NotSeriousFooter />
    </div>
  );
}

// getStaticProps is a function that is called by NextJS at build time. With revalidate we force the server to re-fetch the data every x seconds.
export async function getStaticProps({ params }: any) {
  console.log("Fetching props");

  // get the contentID from the url/params
  const { id } = params;

  // initilize the ad and content as null
  let content: object | any;
  let ad: object | any;

  console.log("Connecting to database");
  console.time("Connected to database in");

  await connectDB();
  console.timeEnd("Connected to database in");


  try {
    // get the content from the database
    console.log("Fetching content");
    console.time("Fetched content in");

    content = await getContent(id);
    console.timeEnd("Fetching content");

    if (content === null) {
      console.error("Error getting content with id: " + id);
      return { notFound: true };
    }

    // map the tags into an array
    let tags = content.tags.map((tag: { tag: any }) => tag.tag);
    let theme = content.theme;

    // find a relevant ad with similair tags and preferred theme. Ignore errors as its likely that the match already exists
    console.log("Fetching ad");
    console.time("Fetched ad in");

    ad = await matchWithAd(tags, theme, id);
    console.timeEnd("Fetched ad in");

    console.log(
      "Content with id of " + id + " matched ad with id of " + ad._id
    );
  } catch (error) {
    console.log("Error getting content with id: " + id + " " + error);
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

  console.log("Fetched props for content with id: " + id);
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
  console.log("Getting static paths");
  console.time("Got static paths in");

  // create a list of all contentIDs initalized as an empty array
  let contentids: { id: string }[] = [];
  let adids: { id: string }[] = [];

  // if we dont have an apikey in the env config, we throw an error
  if (!apiKey) throw new Error("Apikey is not set in .env.local");

  console.log("Connecting to database");
  console.time("Connected to database in");

  await connectDB();
  console.timeEnd("Connected to database in");

  console.log("Fetching contentids");
  console.time("Fetched contentids in");
  // get all contentIDs from the database and save them in the ids array
  contentids = await ContentDB.find({});

  console.timeEnd("Fetched contentids in");

  console.log("Fetching adids");
  console.time("Fetched adids in");

  // get all adIDs from the database and save them in the ids array
  adids = await AdDB.find({});

  console.timeEnd("Fetched adids in");

  // create an array of paths from the id of each element in the ids array
  const paths = contentids.map((content: { id: string }) => {
    return {
      params: {
        id: content.id,
      },
    };
  });

  console.log("Ensuring contentdata");

  // go trough each contentID and ensure the contentData exists, if not create it
  for (const id in contentids) {
    console.log("Checking content with id: " + contentids[id].id);
    console.time("Checked content with id: " + contentids[id].id + " in");
    await ContentDataDB.findOne({ contentID: contentids[id].id }).catch(
      async (e) => {
        console.log(
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
    console.timeEnd("Checked content with id: " + contentids[id].id + " in");
  }
  // go trough each adID and ensure the adData exists, if not create it
  for (const id in adids) {
    await AdDataDB.findOne({ adID: adids[id].id }).catch(async (e) => {
      console.log(
        "Addata not found for id: " + adids[id].id,
        ". Creating... (",
        e,
        ")"
      );
      console.time("Created adata for id: " + adids[id].id + " in");
      await AdDataDB.create({
        adID: adids[id].id,
        clicks: 0,
        views: 0,
        skips: 0,
        matches: [],
      });

      console.timeEnd("Created adata for id: " + adids[id].id + " in");
    });
  }

  // return the paths with a fallback of blocking.
  // We'll pre-render only these paths at build time.
  // { fallback: blocking } will server-render pages
  // on-demand if the path doesn't exist.
  console.log("Paths; ", paths);
  console.timeEnd("Got static paths in");
  return {
    paths,
    fallback: "blocking",
  };
}
