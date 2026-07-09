import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link } from 'react-router-dom';
import axiosInstance from '@/services/axiosInstance';
import { toast } from 'sonner';
import { User, Mail, ChevronRight, CheckCircle2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';

const registerSchema = z.object({
    fullName: z.string().min(2, { message: "Full name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
});

const Register = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const form = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: { fullName: "", email: "" },
    });

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            await axiosInstance.post('/auth/register', data);
            toast.success("Registration submitted!");
            setIsSubmitted(true);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to submit registration");
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

                {isSubmitted ? (
                    <div className="text-center space-y-6 relative z-10 py-4">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle2 className="w-10 h-10 text-green-600" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-extrabold text-slate-900">Request Sent</h2>
                            <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                Your account request is with the managers. You will be notified once approved.
                            </p>
                        </div>
                        <Link to="/login">
                            <Button className="w-full h-12 rounded-2xl bg-slate-900 hover:bg-slate-800 text-base font-bold">
                                Return to Sign In
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="text-center space-y-2 mb-8 relative z-10">
                            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Create Account</h1>
                            <p className="text-sm text-slate-500 font-medium">Join the Sisenco portal today.</p>
                        </div>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 relative z-10">
                                <FormField
                                    control={form.control}
                                    name="fullName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <div className="relative flex items-center">
                                                    <User className="absolute left-4 w-5 h-5 text-slate-400" />
                                                    <Input placeholder="Full Name" className="pl-11 h-12 rounded-2xl border-slate-200 bg-slate-50/50 focus-visible:bg-white focus-visible:ring-blue-500 text-base" {...field} />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="ml-1" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <div className="relative flex items-center">
                                                    <Mail className="absolute left-4 w-5 h-5 text-slate-400" />
                                                    <Input placeholder="Email Address" className="pl-11 h-12 rounded-2xl border-slate-200 bg-slate-50/50 focus-visible:bg-white focus-visible:ring-blue-500 text-base" {...field} />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="ml-1" />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 text-base font-bold shadow-lg shadow-blue-500/25 transition-all mt-4" disabled={isSubmitting}>
                                    {isSubmitting ? "Submitting..." : (
                                        <span className="flex items-center gap-2">
                                            Register Account <ChevronRight className="w-5 h-5" />
                                        </span>
                                    )}
                                </Button>
                            </form>
                        </Form>

                        <div className="mt-8 text-center text-sm font-medium text-slate-500">
                            Already have an account?{" "}
                            <Link to="/login" className="text-blue-600 font-bold hover:underline">
                                Sign in
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Register;