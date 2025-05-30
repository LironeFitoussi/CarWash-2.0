import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useCreateCategory } from "@/hooks/useCategories";
import type { CreateCategory } from "@/types";
import { toast } from "sonner";

const categorySchema = z.object({
  name: z.string().min(1, "Category name is required").max(50, "Name is too long"),
  description: z.string().optional(),
  type: z.enum(["income", "expense", "both"]),
  color: z.string().min(1, "Color is required"),
  icon: z.string().optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const categoryTypes = [
  { value: "income", label: "Income" },
  { value: "expense", label: "Expense" },
  { value: "both", label: "Both Income & Expense" },
];

const predefinedColors = [
  "#3B82F6", // Blue
  "#10B981", // Green
  "#F59E0B", // Yellow
  "#EF4444", // Red
  "#8B5CF6", // Purple
  "#06B6D4", // Cyan
  "#EC4899", // Pink
  "#84CC16", // Lime
  "#F97316", // Orange
  "#6B7280", // Gray
];

export default function CategoryForm({ onSuccess, onCancel }: CategoryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createCategory = useCreateCategory();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      color: predefinedColors[0],
    },
  });

  const selectedType = watch("type");
  const selectedColor = watch("color");

  const onSubmit = async (data: CategoryFormData) => {
    setIsSubmitting(true);
    
    const categoryData: CreateCategory = {
      name: data.name,
      description: data.description || "",
      type: data.type,
      color: data.color,
      icon: data.icon || "",
    };

    try {
      await createCategory.mutateAsync(categoryData);
      toast.success("Category created successfully!");
      reset();
      onSuccess?.();
    } catch {
      toast.error("Failed to create category");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    reset();
    onCancel?.();
  };

  return (
    <div className="bg-white p-1">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Category Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Category Name */}
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Category Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Enter category name..."
              className={`${errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}`}
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Category Type */}
          <div className="space-y-2">
            <Label htmlFor="type" className="text-sm font-medium">
              Category Type <span className="text-red-500">*</span>
            </Label>
            <Select
              value={selectedType}
              onValueChange={(value) => setValue("type", value as CategoryFormData["type"])}
            >
              <SelectTrigger className={`${errors.type ? "border-red-500 focus:ring-red-500" : ""}`}>
                <SelectValue placeholder="Select category type" />
              </SelectTrigger>
              <SelectContent>
                {categoryTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-sm text-red-500 mt-1">{errors.type.message}</p>
            )}
          </div>

          {/* Icon (optional) */}
          <div className="space-y-2">
            <Label htmlFor="icon" className="text-sm font-medium text-gray-600">
              Icon (Optional)
            </Label>
            <Input
              id="icon"
              {...register("icon")}
              placeholder="e.g., 🏠, 🍔, 💰"
            />
          </div>
        </div>

        <div className="border-t border-gray-200"></div>

        {/* Additional Details */}
        <div className="space-y-4">
          {/* Color Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Category Color <span className="text-red-500">*</span></Label>
            <div className="flex flex-wrap gap-2">
              {predefinedColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setValue("color", color)}
                  className={`w-8 h-8 rounded-full border-2 ${
                    selectedColor === color ? "border-gray-400" : "border-gray-200"
                  } hover:border-gray-400 transition-colors`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            {errors.color && (
              <p className="text-sm text-red-500 mt-1">{errors.color.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-gray-600">
              Description
            </Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Category description (optional)..."
              rows={3}
              className="resize-none"
            />
          </div>
        </div>

        <div className="border-t border-gray-200"></div>

        {/* Form Actions */}
        <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-green-600 hover:bg-green-700 focus:ring-green-500"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating...
              </div>
            ) : (
              "Create Category"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
} 