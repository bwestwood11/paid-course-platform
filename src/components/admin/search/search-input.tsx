"use client";

import * as React from "react";
import {
  CommandDialog,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
  CommandEmpty,
} from "@/components/ui/command";
import {
  UserPlus,
  Users,
  User,
  ListChecks,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { CommandLoading } from "cmdk";
import { SearchProviderType } from "@/lib/search/types";
import { api } from "@/trpc/react";
import { Input } from "@/components/ui/input";

const pages = [
{
  label: "Create New Course",
  href: "/admin/courses/new",
  icon: <UserPlus className="h-4 w-4" />,
},
{
  label: "Your Courses",
  href: "/admin/courses",
  icon: <Users className="h-4 w-4" />,
}
] satisfies { label: string; href: string; icon: React.ReactNode }[];

const useCommandShortcut = (shortcutKey: string) => {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (
        (e.metaKey || e.ctrlKey) &&
        e.key.toLowerCase() === shortcutKey.toLowerCase()
      ) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [shortcutKey]);

  return { open, setOpen };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

const getIconFromType = (type: SearchProviderType) => {
  switch (type) {
    case SearchProviderType.CHAPTER:
      return <User className="h-4 w-4" />;
    case SearchProviderType.COURSE:
      return <ListChecks className="h-4 w-4" />;
    default:
      return <User className="h-4 w-4" />;
  }
};

// You need to include this!

export function SearchInput() {
  const { open, setOpen } = useCommandShortcut("k");
  const [searchQuery, setSearchQuery] = React.useState("");

  const { data, refetch, isFetching } = api.courses.getSearchResult.useQuery(
    { query: searchQuery },
    { enabled: false },
  );

  const debouncedSearch = React.useMemo(
    () =>
      debounce((query: string) => {
        if (query.trim()) {
          refetch().catch((error) => {
            console.error(error);
          });
        }
      }, 500),
    [refetch],
  );

  function onSearch(value: string) {
    setSearchQuery(value);
    debouncedSearch(value);
  }

  return (
    <>
      <div className="relative w-full max-w-[400px]">
        <Input
          placeholder="Search..."
          className="rounded-full pl-6 pr-8"
          onFocus={() => setOpen(true)}
        />
        <kbd className="pointer-events-none absolute right-4 top-1/2 flex -translate-y-1/2 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </div>
      <CommandDialog
        className="w-full max-w-[90vw] md:max-w-[60vw] xl:max-w-[800px]"
        filter={(value, search) => {
          if (value.startsWith("::")) {
            return 1;
          }

          return value.toLowerCase().includes(search.toLowerCase()) ? 1 : 0;
        }}
        open={open}
        onOpenChange={setOpen}
      >
        <CommandInput
          value={searchQuery}
          onValueChange={onSearch}
          className="py-6"
          placeholder="Type a command or search..."
        />

        <CommandList>
          {data?.map((group) => (
            <CommandGroup key={group.type} heading={group.label}>
              {group.results.map((result) => (
                <SearchCommandItem
                  key={`${group.type} ${result.title} ${result.id}`}
                  icon={getIconFromType(group.type)}
                  label={result.title}
                  id={result.id}
                  value={`:${group.type} ${result.title} ${result.id}`}
                  href={result.url ?? "/"}
                  subtitle={result.description}
                  onOpenChange={setOpen}
                />
              ))}
            </CommandGroup>
          ))}

          <CommandGroup heading="Pages">
            {pages.map((page) => (
              <SearchCommandItem
                key={`page ${page.label}`}
                icon={page.icon}
                label={page.label}
                href={page.href}
                onOpenChange={setOpen}
              />
            ))}
          </CommandGroup>

          {isFetching && data?.length === 0 ? (
            <CommandLoading className="flex items-center justify-center py-4 text-sm text-muted-foreground">
              Finding results...
            </CommandLoading>
          ) : null}

          {/* {!isFetching && data?.length === 0 && ( */}
          <CommandEmpty className="flex items-center justify-center py-4 text-sm text-muted-foreground">
            No results found.
          </CommandEmpty>
          {/* // )} */}
        </CommandList>
      </CommandDialog>
    </>
  );
}

type SearchCommandItemProps = {
  icon: React.ReactNode;
  label: string;
  href: string;
  shortcut?: string;
  id?: string;
  subtitle?: string;
  onOpenChange?: (open: boolean) => void;
} & React.ComponentPropsWithoutRef<typeof CommandItem>;

const SearchCommandItem = React.memo(
  ({
    icon,
    label,
    href,
    shortcut,
    onOpenChange,
    id,
    subtitle,
    ...props
  }: SearchCommandItemProps) => {
    const router = useRouter();

    const handleSelect = React.useCallback(() => {
      router.push(href);
      onOpenChange?.(false);
    }, [href, onOpenChange, router]);

    return (
      <CommandItem
        {...props}
        aria-label={`Navigate to ${label}`}
        className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none cursor-pointer"
        onSelect={handleSelect}
      >
        <div className="rounded-md bg-muted p-1.5">{icon}</div>
        <div className="flex flex-col">
          <div>
            <span>{label}</span>
            <span className="sr-only text-xs">{id}</span>
          </div>
          {subtitle && (
            <span className="text-xs text-muted-foreground">
              {subtitle.length > 100
                ? subtitle.slice(0, 100) + "..."
                : subtitle}
            </span>
          )}
        </div>
        {shortcut && <CommandShortcut>{shortcut}</CommandShortcut>}
      </CommandItem>
    );
  },
);
SearchCommandItem.displayName = "SearchCommandItem";
