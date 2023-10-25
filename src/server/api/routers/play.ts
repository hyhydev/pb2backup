import { z } from "zod";

import { Character, Environment, Speed, Stage, Type } from "@prisma/client";
import { isUserModeratorOrAbove } from "~/utils/auth";
import {
  contributorOrAboveProtectedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "../trpc";

export const playRouter = createTRPCRouter({
  create: contributorOrAboveProtectedProcedure
    .input(
      z.object({
        name: z.string(),
        videoUrl: z.string(),
        thumbnalUrl: z.string().optional(),
        description: z.string().optional(),
        type: z.nativeEnum(Type),
        speed: z.nativeEnum(Speed),
        environment: z.nativeEnum(Environment),
        character: z.nativeEnum(Character),
        stage: z.nativeEnum(Stage),
        difficulty: z.number().int().min(1).max(5),
        gameAbbr: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.game.update({
        where: { abbreviation: input.gameAbbr },
        data: {
          plays: {
            create: {
              userId: ctx.session.user.id,
              name: input.name,
              videoUrl: input.videoUrl,
              thumbnailUrl: input.thumbnalUrl,
              description: input.description,
              type: input.type,
              speed: input.speed,
              environment: input.environment,
              character: input.character,
              stage: input.stage,
              difficulty: input.difficulty,
              approved: isUserModeratorOrAbove(ctx.session.user.role),
            },
          },
        },
      });
    }),
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
