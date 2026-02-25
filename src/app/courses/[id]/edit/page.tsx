import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { CourseForm } from "@/components/course-form";

export default async function EditCoursePage({
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

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Button asChild variant="ghost" size="sm" className="text-slate-600">
        <Link href={`/courses/${id}`}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Course
        </Link>
      </Button>

      <div>
        <h1 className="text-3xl font-bold text-slate-800">Edit Course</h1>
        <p className="text-slate-500 mt-1">Update the course details below.</p>
      </div>

      <CourseForm
        mode="edit"
        courseId={course.id}
        defaultValues={{
          title: course.title,
          description: course.description ?? "",
          instructor: course.instructor,
          duration_hours: course.duration_hours?.toString() ?? "",
          level: (course.level as "beginner" | "intermediate" | "advanced" | undefined) ?? "none",
          category: course.category ?? "",
          price: course.price?.toString() ?? "",
          is_published: course.is_published ?? false,
        }}
      />
    </div>
  );
}
