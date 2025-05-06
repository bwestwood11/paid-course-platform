"use client";

import * as React from "react";
import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
} from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { Input } from "../ui/input";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { DialogTitle } from "../ui/dialog";
import { api } from "@/trpc/react";

export function AdminSearchCommand() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const searchQuery = api.courses.search.useQuery(
    { query: query },
    {
      enabled: open && query.length > 2,
      refetchOnWindowFocus: false,
    },
  );
  console.log("searchQuery", searchQuery.data);

  return (
    <>
      <div className="relative flex items-center">
        <Input placeholder="Search..." onFocus={() => setOpen(true)} />
        <p className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">⌘</span>J
          </kbd>
        </p>
      </div>
      <CommandDialog  open={open} onOpenChange={setOpen}>
        <VisuallyHidden>
          <DialogTitle>Search</DialogTitle>
        </VisuallyHidden>
        <CommandInput
          placeholder="Type a command or search..."
          value={query}
          onValueChange={(e) => setQuery(e)}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Results">
            {searchQuery.data?.map((item) => (
              <CommandItem
              keywords={[`:ch ${item.title} ${item.id}`]}
                key={`:ch ${item.title} ${item.id}`}
                onSelect={() => setOpen(false)}
              >
                {item.title}
                <span className="sr-only">
                    {item.id}
                </span>

                {/* <CommandShortcut>⌘{item.id}</CommandShortcut> */}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Suggestions">
            <CommandItem>
              <Calendar />
              <span>Calendar</span>
            </CommandItem>
            <CommandItem>
              <Smile />
              <span>Search Emoji</span>
            </CommandItem>
            <CommandItem>
              <Calculator />
              <span>Calculator</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem>
              <User />
              <span>Profile</span>
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <CreditCard />
              <span>Billing</span>
              <CommandShortcut>⌘B</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <Settings />
              <span>Settings</span>
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
