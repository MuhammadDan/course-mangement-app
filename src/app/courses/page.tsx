import { Suspense } from "react";
import Link from "next/link";
import { Plus, BookOpen } from "lucide-react";
import { CourseCard } from "@/components/course-card";
import { CourseFilters } from "@/components/course-filters";
import { Pagination } from "@/components/pagination";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

interface SearchParams {
  page?: string;
  search?: string;
  level?: string;
}

async function CoursesList({ searchParams }: { searchParams: SearchParams }) {
  const page = Math.max(1, parseInt(searchParams.page ?? "1", 10));
  const search = searchParams.search ?? "";
  const level = (searchParams.level as "beginner" | "intermediate" | "advanced" | "all") ?? "all";

  const supabase = await createClient();
  const PAGE_SIZE = 9;
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = supabase
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

  const { data: courses, count } = await query;
  const total = count ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  const spRecord: Record<string, string> = {};
  if (search) spRecord.search = search;
  if (level && level !== "all") spRecord.level = level;

  if (!courses || courses.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
          <BookOpen className="h-8 w-8 text-indigo-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-700 mb-2">
          {search || level !== "all" ? "No courses found" : "No courses yet"}
        </h3>
        <p className="text-slate-500 mb-6">
          {search || level !== "all"
            ? "Try adjusting your filters."
            : "Create your first course to get started."}
        </p>
        {!search && level === "all" && (
          <Button asChild className="bg-indigo-600 hover:bg-indigo-700">
            <Link href="/courses/new">
              <Plus className="h-4 w-4 mr-2" />
              Create Course
            </Link>
          </Button>
        )}
      </div>
    );
  }

  return (
    <>
      <p className="text-sm text-slate-500 mb-4">
        Showing {from + 1}–{Math.min(to + 1, total)} of {total} course{total !== 1 ? "s" : ""}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
      <Pagination page={page} totalPages={totalPages} searchParams={spRecord} />
    </>
  );
}

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Courses</h1>
          <p className="text-slate-500 mt-1">Browse and manage all courses</p>
        </div>
        <Button asChild className="bg-indigo-600 hover:bg-indigo-700 sm:shrink-0">
          <Link href="/courses/new">
            <Plus className="h-4 w-4 mr-2" />
            New Course
          </Link>
        </Button>
      </div>

      <CourseFilters />

      <Suspense
        fallback={
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-64 bg-slate-200 rounded-xl animate-pulse"
              />
            ))}
          </div>
        }
      >
        <CoursesList searchParams={sp} />
      </Suspense>
    </div>
  );
}
