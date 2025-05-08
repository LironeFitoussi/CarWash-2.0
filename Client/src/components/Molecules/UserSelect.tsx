import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserRegex } from "@/hooks/useUser";
import { useDebounce } from "@/hooks/useDebounce";

// Components
import AddUserModal from "../Organisms/AddUserModal";

// Types
import type { User } from "@/types";

export default function UserSelect({
  onUserSelect,
}: {
  onUserSelect: (userId: string | null, userFullName: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  const debouncedSearch = useDebounce(search, 300);

  const { data: users = [], isLoading } = useUserRegex(debouncedSearch);

  const handleSelect = (user: User) => {
    onUserSelect(user._id, `${user.firstName} ${user.lastName}`);
    setSearch(`${user.firstName} ${user.lastName}`);
    setShowDropdown(false);
  };

  const handleAddUser = () => {
    setShowAddUserModal(true);
  };

  const handleUserCreated = (user: User) => {
    handleSelect(user);
    setShowAddUserModal(false);
  };

  return (
    <div className="relative w-full max-w-sm">
      <Input
        placeholder="Search user..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setShowDropdown(e.target.value.trim() !== "");
        }}
        onFocus={() => {
          if (search.trim() !== "") setShowDropdown(true);
        }}
      />

      {showDropdown && debouncedSearch.trim() !== "" && (
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
              <p>No user found for "{debouncedSearch}"</p>
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-left"
                onClick={handleAddUser}
              >
                ➕ Add "{debouncedSearch}" as new user
              </Button>
            </div>
          )}
        </div>
      )}

      <AddUserModal 
        isOpen={showAddUserModal} 
        onClose={() => setShowAddUserModal(false)}
        onUserCreated={handleUserCreated}
      />
    </div>
  );
}
