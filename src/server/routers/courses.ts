import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/trpc";

export const courseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  instructor: z.string().min(1, "Instructor is required"),
  duration_hours: z.number().int().positive().optional().nullable(),
  level: z.enum(["beginner", "intermediate", "advanced"]).optional().nullable(),
  category: z.string().optional().nullable(),
  price: z.number().min(0).optional().nullable(),
  is_published: z.boolean().optional(),
});

const PAGE_SIZE = 9;

export const coursesRouter = createTRPCRouter({
  list: publicProcedure
    .input(
      z.object({
        page: z.number().int().min(1).default(1),
        search: z.string().optional(),
        level: z
          .enum(["beginner", "intermediate", "advanced", "all"])
          .optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, search, level } = input;
      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      let query = ctx.supabase
        .from("courses")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(from, to);

      if (search) {
        query = query.or(
          `title.ilike.%${search}%,description.ilike.%${search}%,instructor.ilike.%${search}%`
        );
      }

      if (level && level !== "all") {
        query = query.eq("level", level);
      }

      const { data, error, count } = await query;

      if (error) throw new Error(error.message);

      return {
        courses: data ?? [],
        total: count ?? 0,
        pageSize: PAGE_SIZE,
        page,
        totalPages: Math.ceil((count ?? 0) / PAGE_SIZE),
      };
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from("courses")
        .select("*")
        .eq("id", input.id)
        .single();

      if (error) throw new Error(error.message);
      return data;
    }),

  create: protectedProcedure
    .input(courseSchema)
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from("courses")
        .insert({ ...input, created_by: ctx.user.id })
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    }),

  update: protectedProcedure
    .input(courseSchema.partial().extend({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...rest } = input;
      const { data, error } = await ctx.supabase
        .from("courses")
        .update({ ...rest, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { error } = await ctx.supabase
        .from("courses")
        .delete()
        .eq("id", input.id);

      if (error) throw new Error(error.message);
      return { success: true };
    }),
});
