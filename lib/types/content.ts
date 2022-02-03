import { Owner } from "./owner";

export type Content = {
  // The content's id (ContentID)
  _id: string | undefined | null;

  // The theme for the content
  theme: string;

  // The title of the content
  title: string;

  // The link the content will go to
  link: string;

  // The tags for the content
  tags: Array<string>;

  // The owner of the content
  owner: Owner;
};
