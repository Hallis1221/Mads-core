import { Owner } from "./owner";
import { Tag } from "./tag";

export type Ad = {
  type: String;

  // The "theme". This is the ad's "category"
  theme: String;

  // the ad's id
  id: String;

  // The ad's user friendly title
  title: String;

  // The link users will go to when they click on the ad
  link: String;

  // If the ad has type "image", this is the image's URL
  image: String;

  // if the ad has type "video", this is the video's URL
  video: String;

  // Tags are used to filter ads to be relevant to the content
  tags: Array<Tag>;

  // The "owner" of the ad. This is the user who created the ad
  owner: Owner;

  // The start date of the ad. The campaign start. This is optional but can provide better analytics
  startDate: String;

  // The end date of the ad. The campaign end. This is optional
  endDate: String;

  // The max number of times the ad can be clicked / how many clicks have been paid for
  maxClicks: Number;

  // The max number of times this ad can be viewed / how many views have been paid for
  maxViews: Number;
};
