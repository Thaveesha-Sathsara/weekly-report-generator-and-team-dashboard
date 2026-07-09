import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react";

const Toaster = ({ ...props }) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      position="bottom-right"
      icons={{
        success: <CircleCheckIcon className="w-5 h-5 text-green-600" />,
        info: <InfoIcon className="w-5 h-5 text-blue-600" />,
        warning: <TriangleAlertIcon className="w-5 h-5 text-orange-600" />,
        error: <OctagonXIcon className="w-5 h-5 text-red-600" />,
        loading: <Loader2Icon className="w-5 h-5 animate-spin text-slate-600" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-slate-900 group-[.toaster]:border-slate-200 group-[.toaster]:shadow-xl font-medium rounded-2xl p-4 border",
          description: "group-[.toast]:text-slate-500 text-sm",
          actionButton:
            "group-[.toast]:bg-slate-900 group-[.toast]:text-slate-50 rounded-xl font-bold",
          cancelButton:
            "group-[.toast]:bg-slate-100 group-[.toast]:text-slate-500 rounded-xl font-bold",
          success: "group-[.toaster]:border-green-200 group-[.toaster]:bg-green-50/50",
          error: "group-[.toaster]:border-red-200 group-[.toaster]:bg-red-50/50",
          warning: "group-[.toaster]:border-orange-200 group-[.toaster]:bg-orange-50/50",
          info: "group-[.toaster]:border-blue-200 group-[.toaster]:bg-blue-50/50",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };