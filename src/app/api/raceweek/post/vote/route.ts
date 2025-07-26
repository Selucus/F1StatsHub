import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { redis } from "@/lib/redis";
import { PostVoteValidator } from "@/lib/validators/vote";
import { CachedPost } from "@/types/redis";
import { z } from "zod";

const CACHE_AFTER_UPVOTES = 1;

export async function PATCH(req: Request) {
  try {
    const body = await req.json();

    const { postId, voteType } = PostVoteValidator.parse(body);

    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorised", { status: 401 });
    }

    const existingVote = await db.vote.findFirst({
      where: {
        userId: session.user.id,
        chartId: postId,
      },
    });
    const post = await db.chart.findUnique({
      where: {
        id: postId,
      },
      include: {
        votes: true,
      },
    });

    if (!post) {
      return new Response("Post not found", { status: 404 });
    }

    if (existingVote) {
      if (existingVote.type === voteType) {
        await db.vote.delete({
          where: {
            userId_chartId: {
              chartId: postId,
              userId: session.user.id,
            },
          },
        });

        // recount votes
        const votesAmt = post.votes.reduce((acc: number, vote) => {
          if (vote.type === "UP") return acc + 1;
          if (vote.type === "DOWN") return acc - 1;
          return acc;
        }, 0);

        if (votesAmt >= CACHE_AFTER_UPVOTES) {
          const cachePayload: CachedPost = {
            content: JSON.stringify(post.content),
            id: post.id,
            title: post.title,
            currentVote: voteType,
          };

          await redis.hset;
        }
        return new Response("OK");
      }

      await db.vote.update({
        where: {
          userId_chartId: {
            chartId: postId,
            userId: session.user.id,
          },
        },
        data: {
          type: voteType,
        },
      });

      // Recount the votes
      const votesAmt = post.votes.reduce((acc, vote) => {
        if (vote.type === "UP") return acc + 1;
        if (vote.type === "DOWN") return acc - 1;
        return acc;
      }, 0);

      if (votesAmt >= CACHE_AFTER_UPVOTES) {
        const cachePayload: CachedPost = {
          content: JSON.stringify(post.content),
          id: post.id,
          title: post.title,
          currentVote: voteType,
        };

        await redis.hset(`post:${postId}`, cachePayload); // Store the post data as a hash
      }
      return new Response("OK");
    }

    // no existing vote
    await db.vote.create({
      data: {
        type: voteType,
        userId: session.user.id,
        chartId: postId,
      },
    });
    // Recount the votes
    const votesAmt = post.votes.reduce((acc, vote) => {
      if (vote.type === "UP") return acc + 1;
      if (vote.type === "DOWN") return acc - 1;
      return acc;
    }, 0);

    if (votesAmt >= CACHE_AFTER_UPVOTES) {
      const cachePayload: CachedPost = {
        content: JSON.stringify(post.content),
        id: post.id,
        title: post.title,
        currentVote: voteType,
      };

      await redis.hset(`post:${postId}`, cachePayload); // Store the post data as a hash
    }
    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }
    console.log(error);

    return new Response("Could not register vote", { status: 500 });
  }
}
