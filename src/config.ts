export const SITE = {
  website: "https://ashuqi.com/", // replace this with your deployed domain
  author: "ShuQi",
  profile: "https://ashuqi.com.app/about",
  desc: "Share tutorials, code optimization tips, and hands-on project experience in Java/Web development, algorithms, and related fields.",
  title: "ShuQi Blog",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 4,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  showBackButton: true, // show back button in post detail
  editPost: {
    enabled: false,
    text: "Suggest Changes",
    url: "",
  },
  dynamicOgImage: true,
  timezone: "Asia/Shanghai", // Default global timezone (IANA format) https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
} as const;
