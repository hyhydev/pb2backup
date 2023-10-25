import { z } from "zod";

import { Character, Environment, Speed, Stage, Type } from "@prisma/client";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const playRouter = createTRPCRouter({
  getAllApproved: publicProcedure
    .input(
      z.object({
        currentPage: z.number().int().min(1),
        pageSize: z.number().int().min(1),
        filter: z
          .object({
            c: z.nativeEnum(Character).optional(),
            e: z.nativeEnum(Environment).optional(),
            t: z.nativeEnum(Type).optional(),
            st: z.nativeEnum(Stage).optional(),
            sp: z.nativeEnum(Speed).optional(),
            d: z.number().int().min(1).max(5).optional(),
          })
          .optional(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.play.findMany({
        orderBy: [{ createdAt: "desc" }],
        where: {
          approved: true,
          archived: false,
          character: input.filter?.c,
          environment: input.filter?.e,
          type: input.filter?.t,
          stage: input.filter?.st,
          speed: input.filter?.sp,
          difficulty: input.filter?.d,
        },
        skip: (input.currentPage - 1) * input.pageSize,
        take: input.pageSize,
        include: {
          user: { select: { id: true, name: true, image: true } },
          bookmarks: { where: { userId: ctx.session?.user.id } },
        },
      });
    }),
});
