import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, description, confirmText = "Confirm", variant = "default" }) => {
    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent className="rounded-3xl border-slate-200 shadow-2xl bg-white p-8">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl font-bold text-slate-900">{title}</AlertDialogTitle>
                    <AlertDialogDescription className="text-slate-500 font-medium">
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-6">
                    <AlertDialogCancel 
                        onClick={onClose} 
                        className="rounded-xl font-bold border-slate-200 text-slate-600 hover:bg-slate-100 h-11 px-6"
                    >
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction 
                        onClick={onConfirm} 
                        className={`rounded-xl font-bold h-11 px-6 ${
                            variant === 'destructive' 
                            ? 'bg-red-600 text-white hover:bg-red-700' 
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                    >
                        {confirmText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default ConfirmModal;