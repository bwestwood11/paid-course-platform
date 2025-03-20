"use client";
import React, { useState } from "react";
import { Input } from "./input";
import { Button } from "./button";
import { Badge } from "./badge";
import { XIcon } from "lucide-react";

type Props = {
  value: string[];
  onChange: (value: string[]) => void;
};

const TagsInput = ({ value, onChange }: Props) => {
  const [tags, setTags] = useState<string[]>(value);
  const [inputValue, setInputValue] = useState<string>("");

  const handleAddTag = (tag: string) => {
    if (tag.trim() !== "" && !tags.includes(tag)) {
      const newTags = [...tags, tag];
      setTags(newTags);
      onChange?.(newTags);
    }
    setInputValue("");
  };

  const handleRemoveTag = (index: number) => {
    const newTags = tags.filter((_, i) => i !== index);
    setTags(newTags);
    onChange?.(newTags);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddTag(inputValue);
    } else if (e.key === "Backspace" && inputValue === "" && tags.length > 0) {
      handleRemoveTag(tags.length - 1);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a tag and press Enter"
          className="flex-1 py-6 text-base"
        />
        <Button
          type="button"
          onClick={() => handleAddTag(inputValue)}
          variant="secondary"
          className="w-full sm:w-auto py-6"
        >
          Add Tag
        </Button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <Badge key={tag} variant="secondary" className="px-3 py-1.5 text-sm">
            {tag}
            <XIcon
              className="ml-2 h-3.5 w-3.5 cursor-pointer"
              onClick={() => handleRemoveTag(index)}
            />
          </Badge>
        ))}
        {tags.length === 0 && (
          <p className="text-sm text-muted-foreground">No tags added yet</p>
        )}
      </div>
    </>
  );
};

export default TagsInput;
