import { INFINITE_SCROLLING_RESULTS } from "@/config";
import { db } from "@/lib/db";
import PostFeed from "./PostFeed";
import { getAuthSession } from "@/lib/auth";

const CustomFeed = async () => {
  const session = await getAuthSession();

  // custom finding maybe
  const posts = await db.chart.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      votes: true,
      comments: true,
      raceweekend: true,
    },
    take: INFINITE_SCROLLING_RESULTS,
  });

  return <PostFeed initialPosts={posts} />;
};

export default CustomFeed;
