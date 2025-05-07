import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserRegex } from "@/hooks/useUser";

// Types
import type { User } from "@/types";

export default function UserSelect({
  onUserSelect,
  onAddUserClick,
}: {
  onUserSelect: (userId: string | null) => void;
  onAddUserClick: (searchTerm: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const { data: users = [], isLoading } = useUserRegex(search);

  const handleSelect = (user: User) => {
    onUserSelect(user._id);
    setSearch(`${user.firstName} ${user.lastName}`);
    setShowDropdown(false);
  };

  return (
    <div className="relative w-full max-w-sm">
      <Input
        placeholder="Search user..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setShowDropdown(true);
        }}
        onFocus={() => {
          if (search.trim() !== "") setShowDropdown(true);
        }}
      />

      {showDropdown && (
        <div className="absolute z-10 mt-1 w-full rounded-md border bg-white shadow-lg max-h-60 overflow-auto">
          {isLoading ? (
            <div className="p-4">
              <Skeleton className="h-4 w-full" />
            </div>
          ) : users.length > 0 ? (
            users.map((user: User) => (
              <div
                key={user._id}
                onClick={() => handleSelect(user)}
                className="cursor-pointer px-4 py-2 hover:bg-muted transition-colors"
              >
                {user.firstName} {user.lastName}
              </div>
            ))
          ) : (
            <div className="px-4 py-2 text-sm text-muted-foreground space-y-2">
              <p>No user found for "{search}"</p>
              <Button
                variant="ghost"
                size="sm"
                className="px-0"
                onClick={() => onAddUserClick(search)}
              >
                ➕ Add "{search}" as new user
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
