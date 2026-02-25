import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  page: number;
  totalPages: number;
  searchParams?: Record<string, string>;
}

export function Pagination({ page, totalPages, searchParams = {} }: PaginationProps) {
  if (totalPages <= 1) return null;

  const buildHref = (p: number) => {
    const params = new URLSearchParams({ ...searchParams, page: String(p) });
    return `/courses?${params.toString()}`;
  };

  const pages: (number | "...")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push("...");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <div className="flex items-center justify-center gap-1 mt-8">
      <Button
        asChild={page > 1}
        variant="outline"
        size="sm"
        disabled={page <= 1}
      >
        {page > 1 ? (
          <Link href={buildHref(page - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </Link>
        ) : (
          <span>
            <ChevronLeft className="h-4 w-4" />
          </span>
        )}
      </Button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="px-2 text-slate-400">
            ...
          </span>
        ) : (
          <Button
            key={p}
            asChild={p !== page}
            variant={p === page ? "default" : "outline"}
            size="sm"
            className={
              p === page ? "bg-indigo-600 hover:bg-indigo-700 pointer-events-none" : ""
            }
          >
            {p !== page ? <Link href={buildHref(p)}>{p}</Link> : <span>{p}</span>}
          </Button>
        )
      )}

      <Button
        asChild={page < totalPages}
        variant="outline"
        size="sm"
        disabled={page >= totalPages}
      >
        {page < totalPages ? (
          <Link href={buildHref(page + 1)}>
            <ChevronRight className="h-4 w-4" />
          </Link>
        ) : (
          <span>
            <ChevronRight className="h-4 w-4" />
          </span>
        )}
      </Button>
    </div>
  );
}
