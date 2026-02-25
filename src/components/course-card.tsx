"use client";

import Link from "next/link";
import { Clock, GraduationCap, Tag, DollarSign, Eye, EyeOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Course {
  id: string;
  title: string;
  description: string | null;
  instructor: string;
  duration_hours: number | null;
  level: string | null;
  category: string | null;
  price: number | null;
  is_published: boolean | null;
  created_at: string | null;
}

const levelColors: Record<string, string> = {
  beginner: "bg-green-100 text-green-700 border-green-200",
  intermediate: "bg-yellow-100 text-yellow-700 border-yellow-200",
  advanced: "bg-red-100 text-red-700 border-red-200",
};

export function CourseCard({ course }: { course: Course }) {
  return (
    <Card className="flex flex-col h-full hover:shadow-md transition-shadow border border-slate-200 bg-white">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg font-semibold text-slate-800 line-clamp-2 leading-tight">
            {course.title}
          </CardTitle>
          {course.is_published ? (
            <Eye className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
          ) : (
            <EyeOff className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
          )}
        </div>
        <div className="flex items-center gap-1 text-sm text-slate-500">
          <GraduationCap className="h-3.5 w-3.5" />
          <span>{course.instructor}</span>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-3">
        {course.description && (
          <p className="text-sm text-slate-600 line-clamp-3">
            {course.description}
          </p>
        )}
        <div className="flex flex-wrap gap-2">
          {course.level && (
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full border ${
                levelColors[course.level] ?? "bg-slate-100 text-slate-600"
              }`}
            >
              {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
            </span>
          )}
          {course.category && (
            <Badge variant="secondary" className="text-xs">
              <Tag className="h-3 w-3 mr-1" />
              {course.category}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-500">
          {course.duration_hours != null && (
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {course.duration_hours}h
            </span>
          )}
          {course.price != null && (
            <span className="flex items-center gap-1">
              <DollarSign className="h-3.5 w-3.5" />
              {course.price === 0 ? "Free" : `$${course.price.toFixed(2)}`}
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-3 border-t border-slate-100">
        <Button
          asChild
          variant="outline"
          size="sm"
          className="w-full hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200"
        >
          <Link href={`/courses/${course.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
