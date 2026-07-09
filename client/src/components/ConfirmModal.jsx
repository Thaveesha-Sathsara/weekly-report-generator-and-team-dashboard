import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const ConfirmModal = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title, 
    description, 
    confirmText = "Confirm", 
    variant = "destructive",
    isLoading = false 
}) => {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md rounded-3xl bg-white p-8 border border-slate-200 shadow-2xl">
                <DialogHeader className="mb-2">
                    <DialogTitle className="text-xl font-bold text-slate-900">{title}</DialogTitle>
                    <DialogDescription className="text-slate-500 mt-2 leading-relaxed">
                        {description}
                    </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end gap-3 mt-6">
                    <Button 
                        variant="outline" 
                        onClick={onClose} 
                        disabled={isLoading} 
                        className="rounded-xl"
                    >
                        Cancel
                    </Button>
                    <Button 
                        variant={variant} 
                        onClick={onConfirm} 
                        disabled={isLoading} 
                        className="rounded-xl"
                    >
                        {isLoading ? "Processing..." : confirmText}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ConfirmModal;