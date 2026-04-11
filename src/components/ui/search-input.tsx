import * as React from "react";
import { Search } from "@/lib/icons";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type SearchInputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
 ({ className, ...props }, ref) => {
 return (
 <div className="relative flex-1">
 <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
 <Input
 {...props}
 ref={ref}
 className={cn(
 "pl-9 rounded bg-transparent border-gray-100 focus-visible:border-black focus-visible:ring-0 focus-visible:ring-offset-0 h-10",
 className,
 )}
 />
 </div>
 );
 },
);

SearchInput.displayName = "SearchInput";
