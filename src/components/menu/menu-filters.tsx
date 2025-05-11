'use client';

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export function MenuFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  
  const debouncedSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("q", term);
    } else {
      params.delete("q");
    }
    router.replace(`?${params.toString()}`, { scroll: false });
  }, 300);

  const handleSort = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("sort", value);
    } else {
      params.delete("sort");
    }
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  // Sync URL search param with input state
  useEffect(() => {
    setSearch(searchParams.get("q") ?? "");
  }, [searchParams]);

  return (
    <div className="flex gap-2">
      <div className="relative w-80">
        <Input 
          placeholder="Pesquisar" 
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            debouncedSearch(e.target.value);
          }}
        />
        <SearchIcon className="size-4 absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
      </div>
      <Select
        value={searchParams.get("sort") ?? ""}
        onValueChange={handleSort}
      >
        <SelectTrigger>
          <SelectValue placeholder="Ordenar por" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="default">Relevância</SelectItem>
          <SelectItem value="name_asc">Nome (A-Z)</SelectItem>
          <SelectItem value="name_desc">Nome (Z-A)</SelectItem>
          <SelectItem value="price_asc">Menor Preço</SelectItem>
          <SelectItem value="price_desc">Maior Preço</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
} 