import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Loader2, Plus } from "lucide-react";
import { useCategories } from "@/hooks/useCategories";
import { useAccounts } from "@/hooks/useAccounts";
import { useCreateTransaction } from "@/hooks/useTransactions";
import AccountModal from "@/components/modals/AccountModal";
import type { CreateTransaction } from "@/types";
import { toast } from "sonner";

const transactionSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  description: z.string().optional(),
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  type: z.enum(["income", "expense"]),
  category: z.string().min(1, "Category is required"),
  account: z.string().min(1, "Account is required"),
  date: z.string().min(1, "Date is required"),
  notes: z.string().optional(),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

interface TransactionFormProps {
  type: "income" | "expense";
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function TransactionForm({ type, onSuccess, onCancel }: TransactionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

  // Fetch categories and accounts
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: accounts, isLoading: accountsLoading } = useAccounts();

  // Filter categories by type
  const filteredCategories = categories?.filter(
    (category) => category.type === type || category.type === "both"
  ) || [];

  const createTransaction = useCreateTransaction();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type,
      date: new Date().toISOString().split('T')[0], // Today's date
      amount: 0,
    },
  });

  const selectedCategory = watch("category");
  const selectedAccount = watch("account");

  const onSubmit = async (data: TransactionFormData) => {
    setIsSubmitting(true);
    
    const transactionData: CreateTransaction = {
      title: data.title,
      description: data.description || "",
      amount: data.amount,
      type: data.type,
      category: data.category,
      account: data.account,
      date: data.date,
      notes: data.notes || "",
    };

    try {
      await createTransaction.mutateAsync(transactionData);
      toast.success(`${type === "income" ? "Income" : "Expense"} added successfully!`);
      reset();
      onSuccess?.();
    } catch {
      toast.error(`Failed to add ${type}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    reset();
    onCancel?.();
  };

  const isLoading = categoriesLoading || accountsLoading;

  return (
    <div className="bg-white p-1">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Main Transaction Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Title */}
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Transaction Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              {...register("title")}
              placeholder={`Enter ${type} title...`}
              className={`${errors.title ? "border-red-500 focus-visible:ring-red-500" : ""}`}
            />
            {errors.title && (
              <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
            )}
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-medium">
              Amount (₪) <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                ₪
              </span>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                {...register("amount", { valueAsNumber: true })}
                placeholder="0.00"
                className={`pl-8 ${errors.amount ? "border-red-500 focus-visible:ring-red-500" : ""}`}
              />
            </div>
            {errors.amount && (
              <p className="text-sm text-red-500 mt-1">{errors.amount.message}</p>
            )}
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date" className="text-sm font-medium">
              Date <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="date"
                type="date"
                {...register("date")}
                className={`${errors.date ? "border-red-500 focus-visible:ring-red-500" : ""}`}
              />
              <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
            {errors.date && (
              <p className="text-sm text-red-500 mt-1">{errors.date.message}</p>
            )}
          </div>
        </div>

        <div className="border-t border-gray-200"></div>

        {/* Category and Account Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-medium">
              Category <span className="text-red-500">*</span>
            </Label>
            <Select
              value={selectedCategory}
              onValueChange={(value) => setValue("category", value)}
              disabled={isLoading}
            >
              <SelectTrigger className={`${errors.category ? "border-red-500 focus:ring-red-500" : ""}`}>
                <SelectValue placeholder={isLoading ? "Loading..." : "Select category"} />
              </SelectTrigger>
              <SelectContent>
                {isLoading ? (
                  <SelectItem value="loading" disabled>
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading categories...
                    </div>
                  </SelectItem>
                ) : filteredCategories.length > 0 ? (
                  filteredCategories.map((category) => (
                    <SelectItem key={category._id} value={category._id}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full border border-gray-200" 
                          style={{ backgroundColor: category.color }}
                        />
                        <span>{category.name}</span>
                      </div>
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-categories" disabled>
                    No {type} categories available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-red-500 mt-1">{errors.category.message}</p>
            )}
          </div>

          {/* Account */}
          <div className="space-y-2">
            <Label htmlFor="account" className="text-sm font-medium">
              Account <span className="text-red-500">*</span>
            </Label>
            <Select
              value={selectedAccount}
              onValueChange={(value) => setValue("account", value)}
              disabled={isLoading}
            >
              <SelectTrigger className={`${errors.account ? "border-red-500 focus:ring-red-500" : ""}`}>
                <SelectValue placeholder={isLoading ? "Loading..." : "Select account"} />
              </SelectTrigger>
              <SelectContent>
                {isLoading ? (
                  <SelectItem value="loading" disabled>
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading accounts...
                    </div>
                  </SelectItem>
                ) : accounts && accounts.length > 0 ? (
                  accounts.map((account) => (
                    <SelectItem key={account._id} value={account._id}>
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full border border-gray-200" 
                            style={{ backgroundColor: account.color }}
                          />
                          <span>{account.name}</span>
                        </div>
                        <span className="text-sm text-gray-500 ml-2">
                          ₪{account.currentBalance.toLocaleString()}
                        </span>
                      </div>
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-accounts" disabled>
                    No accounts available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            {errors.account && (
              <p className="text-sm text-red-500 mt-1">{errors.account.message}</p>
            )}
            
            {/* Show create account button if no accounts exist */}
            {!isLoading && (!accounts || accounts.length === 0) && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAccountModalOpen(true)}
                className="w-full mt-2 border-dashed border-gray-300 text-gray-600 hover:border-blue-400 hover:text-blue-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Account
              </Button>
            )}
          </div>
        </div>

        <div className="border-t border-gray-200"></div>

        {/* Optional Details */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700">Additional Details (Optional)</h3>
          
          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-gray-600">
              Description
            </Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder={`Describe this ${type} transaction...`}
              rows={3}
              className="resize-none"
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium text-gray-600">
              Notes
            </Label>
            <Textarea
              id="notes"
              {...register("notes")}
              placeholder="Any additional notes..."
              rows={2}
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
            disabled={isSubmitting || isLoading || !accounts || accounts.length === 0}
            className={`flex-1 ${
              type === "income" 
                ? "bg-green-600 hover:bg-green-700 focus:ring-green-500" 
                : "bg-red-600 hover:bg-red-700 focus:ring-red-500"
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Adding...
              </div>
            ) : (
              `Add ${type === "income" ? "Income" : "Expense"}`
            )}
          </Button>
        </div>
        
        {/* Account Modal */}
        <AccountModal 
          isOpen={isAccountModalOpen} 
          onClose={() => setIsAccountModalOpen(false)} 
        />
      </form>
    </div>
  );
} 