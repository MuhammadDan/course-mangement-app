"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function CourseFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const level = searchParams.get("level") ?? "all";

  const applyFilters = (newSearch: string, newLevel: string) => {
    const params = new URLSearchParams();
    if (newSearch) params.set("search", newSearch);
    if (newLevel && newLevel !== "all") params.set("level", newLevel);
    params.set("page", "1");
    router.push(`/courses?${params.toString()}`);
  };

  const clearFilters = () => {
    setSearch("");
    router.push("/courses");
  };

  const hasFilters = searchParams.get("search") || searchParams.get("level");

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") applyFilters(search, level);
          }}
          className="pl-9"
        />
      </div>

      <div className="flex gap-2">
        <Select
          value={level}
          onValueChange={(val) => applyFilters(search, val)}
        >
          <SelectTrigger className="w-40">
            <Filter className="h-4 w-4 mr-1 text-slate-400" />
            <SelectValue placeholder="Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="icon"
          onClick={() => applyFilters(search, level)}
          title="Search"
        >
          <Search className="h-4 w-4" />
        </Button>

        {hasFilters && (
          <Button
            variant="outline"
            size="icon"
            onClick={clearFilters}
            title="Clear filters"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
