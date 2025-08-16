"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { cn } from "@/lib/utils/utils";

type TagItem = {
  id: string;
  label: string;
  icon?: string; // can be emoji or image URI
};

type TagSelectorProps = {
  tags: TagItem[];
  selectedTags?: string[];
  onChange?: (selected: string[]) => void;
  multiSelect?: boolean;
  removable?: boolean;
  containerClassName?: string;
  tagClassName?: string;
  selectedTagClassName?: string;
  label?: string;
  labelClassName?: string;
  contentClassName?: string;
  variant?: "default" | "pills" | "badges";
  size?: "sm" | "default" | "lg";
};

const TagSelector: React.FC<TagSelectorProps> = ({
  tags,
  selectedTags = [],
  onChange,
  multiSelect = true,
  removable = false,
  containerClassName,
  tagClassName,
  selectedTagClassName,
  label,
  labelClassName,
  contentClassName,
  variant = "default",
  size = "default",
}) => {
  const [selected, setSelected] = useState<string[]>(selectedTags);

  useEffect(() => {
    setSelected(selectedTags);
  }, [selectedTags]);

  const toggleSelect = (id: string) => {
    let updated: string[] = [];

    if (multiSelect) {
      if (selected.includes(id)) {
        updated = selected.filter((tagId) => tagId !== id);
      } else {
        updated = [...selected, id];
      }
    } else {
      updated = selected.includes(id) ? [] : [id];
    }

    setSelected(updated);
    onChange?.(updated);
  };

  const handleRemove = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = selected.filter((tagId) => tagId !== id);
    setSelected(updated);
    onChange?.(updated);
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "text-xs px-2 py-1 h-6";
      case "lg":
        return "text-base px-4 py-3 h-11";
      default:
        return "text-sm px-3 py-2 h-8";
    }
  };

  const getVariantClasses = (isSelected: boolean) => {
    switch (variant) {
      case "pills":
        return isSelected
          ? "bg-primary text-primary-foreground border-primary shadow-sm"
          : "bg-secondary text-secondary-foreground border-secondary hover:bg-secondary/80";
      case "badges":
        return isSelected
          ? "bg-primary text-primary-foreground"
          : "bg-muted text-muted-foreground hover:bg-muted/80";
      default:
        return isSelected
          ? "bg-primary text-primary-foreground border-primary shadow-md"
          : "bg-background text-foreground border-input hover:bg-accent hover:text-accent-foreground";
    }
  };

  const renderIcon = (icon: string) => {
    if (icon.startsWith("http")) {
      return (
        <img
          src={icon}
          alt=""
          className={cn(
            "rounded-full object-cover mr-2",
            size === "sm" ? "w-3 h-3" : size === "lg" ? "w-5 h-5" : "w-4 h-4"
          )}
        />
      );
    } else {
      return (
        <span
          className={cn(
            "mr-2",
            size === "sm" ? "text-xs" : size === "lg" ? "text-lg" : "text-sm"
          )}
        >
          {icon}
        </span>
      );
    }
  };

  const TagComponent = variant === "badges" ? Badge : Button;

  return (
    <div className={cn("py-2.5", containerClassName)}>
      {label && (
        <label
          className={cn(
            "text-sm font-medium mb-1.5 block transition-colors",
            selected.length > 0 ? "text-primary" : "text-foreground",
            labelClassName
          )}
        >
          {label}
        </label>
      )}

      <div
        className={cn(
          "flex items-center gap-2 overflow-x-auto scrollbar-hide px-4",
          "scroll-smooth snap-x snap-mandatory",
          contentClassName
        )}
      >
        {tags.map((item) => {
          const isSelected = selected.includes(item.id);

          if (variant === "badges") {
            return (
              <Badge
                key={item.id}
                onClick={() => toggleSelect(item.id)}
                variant={isSelected ? "default" : "secondary"}
                className={cn(
                  "cursor-pointer select-none transition-all duration-200 snap-start",
                  "hover:scale-105 active:scale-95",
                  "flex items-center gap-1.5 whitespace-nowrap",
                  getSizeClasses(),
                  getVariantClasses(isSelected),
                  tagClassName,
                  isSelected && selectedTagClassName
                )}
              >
                {item.icon && renderIcon(item.icon)}
                {item.label}
                {removable && isSelected && (
                  <button
                    onClick={(e) => handleRemove(item.id, e)}
                    className="ml-1 hover:bg-primary-foreground/20 rounded-full p-0.5 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </Badge>
            );
          }

          return (
            <Button
              key={item.id}
              onClick={() => toggleSelect(item.id)}
              variant={isSelected ? "default" : "outline"}
              size={size}
              className={cn(
                "cursor-pointer select-none transition-all duration-200 snap-start",
                "hover:scale-105 active:scale-95",
                "flex items-center gap-1.5 whitespace-nowrap rounded-full",
                variant === "pills" && "border-2",
                getVariantClasses(isSelected),
                tagClassName,
                isSelected && selectedTagClassName
              )}
            >
              {item.icon && renderIcon(item.icon)}
              {item.label}
              {removable && isSelected && (
                <button
                  onClick={(e) => handleRemove(item.id, e)}
                  className="ml-1 hover:bg-primary-foreground/20 rounded-full p-0.5 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </Button>
          );
        })}
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default TagSelector;
