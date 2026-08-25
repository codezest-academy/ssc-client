"use client";

import { useLocaleStore } from "@/store/locale";
import { Languages } from "lucide-react";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const LOCALES = [
  { value: "EN", label: "English" },
  { value: "HI", label: "हिंदी" },
  { value: "TE", label: "తెలుగు" },
] as const;

export function LocaleSwitcher() {
  const { locale, setLocale } = useLocaleStore();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="w-9 px-0">
        <Languages className="h-4 w-4 text-muted-foreground" />
        <span className="sr-only">Change language</span>
      </Button>
    );
  }

  const currentLocale = LOCALES.find((l) => l.value === locale) || LOCALES[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 px-2">
          <Languages className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">{currentLocale.label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LOCALES.map((l) => (
          <DropdownMenuItem
            key={l.value}
            onClick={() => setLocale(l.value)}
            className={`cursor-pointer ${
              locale === l.value ? "bg-accent text-accent-foreground font-semibold" : ""
            }`}
          >
            {l.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
