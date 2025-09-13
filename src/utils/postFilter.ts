import { SITE } from "@/config";
import type { BlogCollectionEntry } from "@/types";

const postFilter = ({ data }: BlogCollectionEntry) => {
  const isPublishTimePassed =
    Date.now() >
    new Date(data.pubDatetime).getTime() - SITE.scheduledPostMargin;
  return !data.draft && (import.meta.env.DEV || isPublishTimePassed);
};

export default postFilter;
