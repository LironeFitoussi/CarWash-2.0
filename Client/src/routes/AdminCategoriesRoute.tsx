import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { useCategories, useDeleteCategory } from "@/hooks/useCategories";
import CategoryForm from "@/components/forms/CategoryForm";
import { toast } from "sonner";
import type { Category } from "@/types";

export default function AdminCategoriesRoute() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<string | null>(null);

  const { data: categories, isLoading } = useCategories();
  const deleteCategory = useDeleteCategory();

  const handleDeleteCategory = async (id: string) => {
    setDeletingCategory(id);
    try {
      await deleteCategory.mutateAsync(id);
      toast.success("Category deleted successfully!");
    } catch {
      toast.error("Failed to delete category");
    } finally {
      setDeletingCategory(null);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "income":
        return "bg-green-100 text-green-800";
      case "expense":
        return "bg-red-100 text-red-800";
      case "both":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "income":
        return "Income";
      case "expense":
        return "Expense";
      case "both":
        return "Both";
      default:
        return type;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories Management</h1>
          <p className="text-gray-600">Manage income and expense categories for your application.</p>
        </div>
        <Button 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories && categories.length > 0 ? (
          categories.map((category) => (
            <Card key={category._id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded-full border border-gray-200" 
                      style={{ backgroundColor: category.color }}
                    />
                    <span>{category.icon && `${category.icon} `}{category.name}</span>
                  </CardTitle>
                  <Badge className={getTypeColor(category.type)}>
                    {getTypeLabel(category.type)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {category.description && (
                  <p className="text-sm text-gray-600">{category.description}</p>
                )}
                
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingCategory(category)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteCategory(category._id)}
                    disabled={deletingCategory === category._id}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    {deletingCategory === category._id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
            <p className="text-gray-600 mb-4">Get started by creating your first category.</p>
            <Button 
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Category
            </Button>
          </div>
        )}
      </div>

      {/* Create Category Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto bg-white shadow-xl rounded-xl">
          <DialogHeader className="pb-4">
            <DialogTitle className="flex items-center gap-3 text-xl">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-green-100 text-green-600">
                <Plus className="h-5 w-5" />
              </div>
              Create New Category
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Add a new category for organizing your income and expense transactions.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-2">
            <CategoryForm
              onSuccess={() => setIsCreateModalOpen(false)}
              onCancel={() => setIsCreateModalOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Category Modal */}
      {editingCategory && (
        <Dialog open={!!editingCategory} onOpenChange={() => setEditingCategory(null)}>
          <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto bg-white shadow-xl rounded-xl">
            <DialogHeader className="pb-4">
              <DialogTitle className="flex items-center gap-3 text-xl">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-100 text-blue-600">
                  <Edit className="h-5 w-5" />
                </div>
                Edit Category
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Update the details of the "{editingCategory.name}" category.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-2">
              {/* TODO: Create CategoryEditForm component */}
              <div className="text-center py-8 text-gray-500">
                Edit functionality coming soon...
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
} 