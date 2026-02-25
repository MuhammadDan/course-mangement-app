"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc/provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  instructor: z.string().min(1, "Instructor is required"),
  duration_hours: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : undefined))
    .pipe(z.number().int().positive().optional()),
  level: z
    .enum(["beginner", "intermediate", "advanced", "none"])
    .optional(),
  category: z.string().optional(),
  price: z
    .string()
    .optional()
    .transform((v) => (v !== undefined && v !== "" ? parseFloat(v) : undefined))
    .pipe(z.number().min(0).optional()),
  is_published: z.boolean().optional(),
});

type FormValues = {
  title: string;
  description?: string;
  instructor: string;
  duration_hours?: string;
  level?: "beginner" | "intermediate" | "advanced" | "none";
  category?: string;
  price?: string;
  is_published?: boolean;
};

interface CourseFormProps {
  mode: "create" | "edit";
  courseId?: string;
  defaultValues?: Partial<FormValues>;
}

export function CourseForm({ mode, courseId, defaultValues }: CourseFormProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      title: "",
      description: "",
      instructor: "",
      duration_hours: "",
      level: "none",
      category: "",
      price: "",
      is_published: false,
      ...defaultValues,
    },
  });

  const isPublished = watch("is_published");

  const createMutation = trpc.courses.create.useMutation({
    onSuccess: (data) => {
      toast.success("Course created successfully!");
      router.push(`/courses/${data.id}`);
      router.refresh();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const updateMutation = trpc.courses.update.useMutation({
    onSuccess: (data) => {
      toast.success("Course updated successfully!");
      router.push(`/courses/${data.id}`);
      router.refresh();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  const onSubmit = (values: FormValues) => {
    const level =
      values.level === "none" || !values.level ? null : values.level;
    const duration_hours = values.duration_hours
      ? parseInt(values.duration_hours, 10)
      : null;
    const price =
      values.price !== undefined && values.price !== ""
        ? parseFloat(values.price)
        : null;

    const payload = {
      title: values.title,
      description: values.description || undefined,
      instructor: values.instructor,
      duration_hours,
      level: level as "beginner" | "intermediate" | "advanced" | null | undefined,
      category: values.category || undefined,
      price,
      is_published: values.is_published ?? false,
    };

    if (mode === "create") {
      createMutation.mutate(payload);
    } else if (courseId) {
      updateMutation.mutate({ id: courseId, ...payload });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card className="border border-slate-200">
        <CardHeader>
          <CardTitle className="text-lg text-slate-700">
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">
              Course Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder="e.g. Introduction to TypeScript"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="instructor">
              Instructor <span className="text-red-500">*</span>
            </Label>
            <Input
              id="instructor"
              placeholder="e.g. Jane Doe"
              {...register("instructor")}
            />
            {errors.instructor && (
              <p className="text-sm text-red-500">
                {errors.instructor.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the course content, goals, and audience..."
              rows={4}
              {...register("description")}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border border-slate-200">
        <CardHeader>
          <CardTitle className="text-lg text-slate-700">
            Course Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="level">Level</Label>
              <Select
                defaultValue={defaultValues?.level ?? "none"}
                onValueChange={(v) =>
                  setValue(
                    "level",
                    v as "beginner" | "intermediate" | "advanced" | "none"
                  )
                }
              >
                <SelectTrigger id="level">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Not specified</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                placeholder="e.g. Programming, Design"
                {...register("category")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration_hours">Duration (hours)</Label>
              <Input
                id="duration_hours"
                type="number"
                min={1}
                placeholder="e.g. 10"
                {...register("duration_hours")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (USD)</Label>
              <Input
                id="price"
                type="number"
                min={0}
                step={0.01}
                placeholder="0 for free"
                {...register("price")}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Switch
              id="is_published"
              checked={isPublished}
              onCheckedChange={(v) => setValue("is_published", v)}
            />
            <Label htmlFor="is_published" className="cursor-pointer">
              Publish course
              <span className="block text-xs text-slate-400 font-normal">
                Published courses are visible to all users
              </span>
            </Label>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {mode === "create" ? "Creating..." : "Saving..."}
            </>
          ) : mode === "create" ? (
            "Create Course"
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </form>
  );
}
