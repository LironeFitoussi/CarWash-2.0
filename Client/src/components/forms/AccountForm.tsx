import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { useCreateAccount } from "@/hooks/useAccounts";
import type { CreateAccount } from "@/types";
import { toast } from "sonner";

const accountSchema = z.object({
  name: z.string().min(1, "Account name is required").max(50, "Name is too long"),
  description: z.string().optional(),
  type: z.enum(["bank", "credit_card", "cash", "investment", "savings", "loan", "other"]),
  currency: z.string().min(1, "Currency is required"),
  initialBalance: z.number(),
  color: z.string().min(1, "Color is required"),
  accountNumber: z.string().optional(),
  bankName: z.string().optional(),
  includeInNetWorth: z.boolean(),
});

type AccountFormData = z.infer<typeof accountSchema>;

interface AccountFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const accountTypes = [
  { value: "bank", label: "Bank Account" },
  { value: "credit_card", label: "Credit Card" },
  { value: "cash", label: "Cash" },
  { value: "investment", label: "Investment" },
  { value: "savings", label: "Savings" },
  { value: "loan", label: "Loan" },
  { value: "other", label: "Other" },
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

export default function AccountForm({ onSuccess, onCancel }: AccountFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createAccount = useCreateAccount();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      currency: "ILS",
      initialBalance: 0,
      color: predefinedColors[0],
      includeInNetWorth: true,
    },
  });

  const selectedType = watch("type");
  const selectedColor = watch("color");
  const includeInNetWorth = watch("includeInNetWorth");

  const onSubmit = async (data: AccountFormData) => {
    setIsSubmitting(true);
    
    const accountData: CreateAccount = {
      name: data.name,
      description: data.description || "",
      type: data.type,
      currency: data.currency,
      initialBalance: data.initialBalance,
      color: data.color,
      accountNumber: data.accountNumber || "",
      bankName: data.bankName || "",
      includeInNetWorth: data.includeInNetWorth,
    };

    try {
      await createAccount.mutateAsync(accountData);
      toast.success("Account created successfully!");
      reset();
      onSuccess?.();
    } catch {
      toast.error("Failed to create account");
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
        {/* Basic Account Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Account Name */}
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Account Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Enter account name..."
              className={`${errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}`}
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Account Type */}
          <div className="space-y-2">
            <Label htmlFor="type" className="text-sm font-medium">
              Account Type <span className="text-red-500">*</span>
            </Label>
            <Select
              value={selectedType}
              onValueChange={(value) => setValue("type", value as AccountFormData["type"])}
            >
              <SelectTrigger className={`${errors.type ? "border-red-500 focus:ring-red-500" : ""}`}>
                <SelectValue placeholder="Select account type" />
              </SelectTrigger>
              <SelectContent>
                {accountTypes.map((type) => (
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

          {/* Initial Balance */}
          <div className="space-y-2">
            <Label htmlFor="initialBalance" className="text-sm font-medium">
              Initial Balance (₪)
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                ₪
              </span>
              <Input
                id="initialBalance"
                type="number"
                step="0.01"
                {...register("initialBalance", { valueAsNumber: true })}
                placeholder="0.00"
                className={`pl-8 ${errors.initialBalance ? "border-red-500 focus-visible:ring-red-500" : ""}`}
              />
            </div>
            {errors.initialBalance && (
              <p className="text-sm text-red-500 mt-1">{errors.initialBalance.message}</p>
            )}
          </div>
        </div>

        <div className="border-t border-gray-200"></div>

        {/* Additional Details */}
        <div className="space-y-4">
          {/* Color Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Account Color</Label>
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
          </div>

          {/* Bank Details (if bank or credit card) */}
          {(selectedType === "bank" || selectedType === "credit_card") && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bankName" className="text-sm font-medium text-gray-600">
                  Bank Name
                </Label>
                <Input
                  id="bankName"
                  {...register("bankName")}
                  placeholder="Enter bank name..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accountNumber" className="text-sm font-medium text-gray-600">
                  Account Number
                </Label>
                <Input
                  id="accountNumber"
                  {...register("accountNumber")}
                  placeholder="Enter account number..."
                />
              </div>
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-gray-600">
              Description
            </Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Account description (optional)..."
              rows={3}
              className="resize-none"
            />
          </div>

          {/* Include in Net Worth */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="includeInNetWorth"
              checked={includeInNetWorth}
              onCheckedChange={(checked) => setValue("includeInNetWorth", checked as boolean)}
            />
            <Label htmlFor="includeInNetWorth" className="text-sm font-medium text-gray-600">
              Include in net worth calculation
            </Label>
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
            className="flex-1 bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating...
              </div>
            ) : (
              "Create Account"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
} 