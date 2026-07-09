import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '@/services/axiosInstance';
import { toast } from 'sonner';
import { Mail, Lock, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';

const setupSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    newPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

const SetupPassword = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const form = useForm({
        resolver: zodResolver(setupSchema),
        defaultValues: { email: "", newPassword: "", confirmPassword: "" }
    });

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            await axiosInstance.post('/auth/setup-password', {
                email: data.email,
                newPassword: data.newPassword
            });
            toast.success("Password setup successful! Please login.");
            navigate('/login');
        } catch (error) {
            toast.error(error.response?.data?.message || "Password setup failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div 
            className="flex items-center justify-center min-h-screen px-4"
            style={{
                backgroundColor: '#f8fafc',
                backgroundImage: `radial-gradient(#cbd5e1 1px, transparent 1px)`,
                backgroundSize: '24px 24px'
            }}
        >
            <div className="w-full max-w-[420px] bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-slate-100 p-8 sm:p-12 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-blue-500/10 blur-3xl rounded-full pointer-events-none" />

                <div className="text-center space-y-2 mb-8 relative z-10">
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                        Activate Account
                    </h1>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed">
                        Set your new password below to activate your approved account.
                    </p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 relative z-10">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <div className="relative flex items-center">
                                            <Mail className="absolute left-4 w-5 h-5 text-slate-400" />
                                            <Input 
                                                placeholder="Registered Email" 
                                                className="pl-11 h-12 rounded-2xl border-slate-200 bg-slate-50/50 focus-visible:bg-white text-base" 
                                                {...field} 
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage className="ml-1 text-xs" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="newPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <div className="relative flex items-center">
                                            <Lock className="absolute left-4 w-5 h-5 text-slate-400" />
                                            <Input 
                                                type="password" 
                                                placeholder="New Password" 
                                                className="pl-11 h-12 rounded-2xl border-slate-200 bg-slate-50/50 focus-visible:bg-white text-base"
                                                {...field} 
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage className="ml-1 text-xs" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <div className="relative flex items-center">
                                            <Lock className="absolute left-4 w-5 h-5 text-slate-400" />
                                            <Input 
                                                type="password" 
                                                placeholder="Confirm Password" 
                                                className="pl-11 h-12 rounded-2xl border-slate-200 bg-slate-50/50 focus-visible:bg-white text-base"
                                                {...field} 
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage className="ml-1 text-xs" />
                                </FormItem>
                            )}
                        />

                        <Button 
                            type="submit" 
                            className="w-full h-12 mt-2 rounded-2xl bg-blue-600 hover:bg-blue-700 text-base font-bold shadow-lg shadow-blue-500/25 transition-all" 
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Activating..." : (
                                <span className="flex items-center gap-2">
                                    Set Password <ChevronRight className="w-5 h-5" />
                                </span>
                            )}
                        </Button>
                    </form>
                </Form>

                <div className="mt-8 text-center text-sm font-medium text-slate-500">
                    <Link to="/login" className="text-slate-500 hover:text-blue-600 font-bold transition-colors">
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SetupPassword;