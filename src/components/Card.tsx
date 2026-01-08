import { type HTMLAttributes, forwardRef } from "react";
import { cn } from "@/utils";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "hoverable";
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg border border-border bg-surface text-text-main shadow-sm",
          variant === "hoverable" &&
            "hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing",
          className
        )}
        {...props}
      />
    );
  }
);

Card.displayName = "Card";
