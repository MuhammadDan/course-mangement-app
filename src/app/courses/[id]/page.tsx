import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  Clock,
  DollarSign,
  GraduationCap,
  Pencil,
  Tag,
  Eye,
  EyeOff,
  Calendar,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DeleteCourseButton } from "@/components/delete-course-button";

const levelColors: Record<string, string> = {
  beginner: "bg-green-100 text-green-700 border-green-200",
  intermediate: "bg-yellow-100 text-yellow-700 border-yellow-200",
  advanced: "bg-red-100 text-red-700 border-red-200",
};

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: course, error } = await supabase
    .from("courses")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !course) {
    notFound();
  }

  const createdAt = course.created_at
    ? new Date(course.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back button */}
      <Button asChild variant="ghost" size="sm" className="text-slate-600">
        <Link href="/courses">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Courses
        </Link>
      </Button>

      <Card className="border border-slate-200 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {course.is_published ? (
                  <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                    <Eye className="h-3.5 w-3.5" /> Published
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                    <EyeOff className="h-3.5 w-3.5" /> Draft
                  </span>
                )}
              </div>
              <CardTitle className="text-2xl font-bold text-slate-800 leading-tight">
                {course.title}
              </CardTitle>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200"
              >
                <Link href={`/courses/${course.id}/edit`}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </Link>
              </Button>
              <DeleteCourseButton courseId={course.id} />
            </div>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="pt-6 space-y-6">
          {/* Meta info */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                Instructor
              </span>
              <span className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                <GraduationCap className="h-4 w-4 text-indigo-500" />
                {course.instructor}
              </span>
            </div>
            {course.duration_hours != null && (
              <div className="flex flex-col gap-1">
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                  Duration
                </span>
                <span className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                  <Clock className="h-4 w-4 text-indigo-500" />
                  {course.duration_hours} hours
                </span>
              </div>
            )}
            {course.price != null && (
              <div className="flex flex-col gap-1">
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                  Price
                </span>
                <span className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                  <DollarSign className="h-4 w-4 text-indigo-500" />
                  {course.price === 0 ? "Free" : `$${Number(course.price).toFixed(2)}`}
                </span>
              </div>
            )}
            {createdAt && (
              <div className="flex flex-col gap-1">
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                  Created
                </span>
                <span className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                  <Calendar className="h-4 w-4 text-indigo-500" />
                  {createdAt}
                </span>
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {course.level && (
              <span
                className={`text-sm font-medium px-3 py-1 rounded-full border ${
                  levelColors[course.level] ?? "bg-slate-100 text-slate-600"
                }`}
              >
                {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
              </span>
            )}
            {course.category && (
              <Badge variant="secondary">
                <Tag className="h-3.5 w-3.5 mr-1" />
                {course.category}
              </Badge>
            )}
          </div>

          {/* Description */}
          {course.description && (
            <div>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Description
              </h3>
              <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                {course.description}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
