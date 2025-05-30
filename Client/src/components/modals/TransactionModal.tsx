import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import TransactionForm from "@/components/forms/TransactionForm";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "income" | "expense";
}

export default function TransactionModal({ isOpen, onClose, type }: TransactionModalProps) {
  const handleSuccess = () => {
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto bg-white shadow-xl rounded-xl">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              type === "income" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
            }`}>
              <span className="text-lg font-semibold">
                {type === "income" ? "+" : "-"}
              </span>
            </div>
            Add New {type === "income" ? "Income" : "Expense"}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Fill in the details below to add a new {type} transaction to your account.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-2">
          <TransactionForm
            type={type}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
} 