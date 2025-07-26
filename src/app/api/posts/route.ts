import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

export async function GET(req: Request) {
  const url = new URL(req.url);

  const session = await getAuthSession();

  try {
    const { limit, page, raceWeekendName } = z
      .object({
        limit: z.string(),
        page: z.string(),
        raceWeekendName: z.string().nullish().optional(),
      })
      .parse({
        raceWeekendName: url.searchParams.get("raceweekend"),
        limit: url.searchParams.get("limit"),
        page: url.searchParams.get("page"),
      });

    let whereClause = {};

    if (raceWeekendName) {
      whereClause = {
        Raceweekend: {
          name: raceWeekendName,
        },
      };
    } // add else if to check if logged in and serve based on that

    const posts = await db.chart.findMany({
      take: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
      orderBy: {
        createdAt: "desc",
      },
      include: {
        raceweekend: true,
        votes: true,
        comments: true,
      },
      where: whereClause,
    });

    return new Response(JSON.stringify(posts));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request data passed", { status: 422 });
    }
    console.log(error);

    return new Response("Could not fetch more posts", { status: 500 });
  }
}
