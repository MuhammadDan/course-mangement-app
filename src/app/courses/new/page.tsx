import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CourseForm } from "@/components/course-form";

export default function NewCoursePage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Button asChild variant="ghost" size="sm" className="text-slate-600">
        <Link href="/courses">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Courses
        </Link>
      </Button>

      <div>
        <h1 className="text-3xl font-bold text-slate-800">Create Course</h1>
        <p className="text-slate-500 mt-1">
          Fill in the details below to create a new course.
        </p>
      </div>

      <CourseForm mode="create" />
    </div>
  );
}
