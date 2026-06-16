import * as React from "react";
import { cn } from "@/lib/utils";

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement> & { className?: string }) {
  return (
    <label className={cn("block text-sm font-medium text-zinc-700", className)} {...props} />
  );
}

export default Label;
