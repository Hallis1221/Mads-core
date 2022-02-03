export type ContentData = {
  // The content's id (ContentID)
  contentID: string;

  // The amount of views the content has received
  views: number | null | undefined;

  // The amount of clicks the content has received
  clicks: number | null  | undefined;

  // The amount of skips the content has received
  skips: number | null | undefined;
};
