import { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '@/context/AuthContext';
import { Mail, Lock, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from '@/components/ui/form';

const loginSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const Login = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: "" },
    });

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        const success = await login(data.email, data.password);
        setIsSubmitting(false);
        if (success) navigate("/dashboard");
    };

    return (
        /* The custom dotted background with a soft blue gradient */
        <div 
            className="flex items-center justify-center min-h-screen px-4"
            style={{
                backgroundColor: '#f8fafc',
                backgroundImage: `radial-gradient(#cbd5e1 1px, transparent 1px)`,
                backgroundSize: '24px 24px'
            }}
        >
            {/* The heavily styled Card container */}
            <div className="w-full max-w-[420px] bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-slate-100 p-8 sm:p-12 relative overflow-hidden">
                
                {/* Subtle background glow effect for that modern feel */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-blue-500/10 blur-3xl rounded-full pointer-events-none" />

                <div className="text-center space-y-2 mb-8 relative z-10">
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                        Welcome Back
                    </h1>
                    <p className="text-sm text-slate-500 font-medium">
                        Log in to manage your tasks.
                    </p>
                </div>

                <div className="relative flex items-center justify-center mb-8">
                    <div className="absolute w-full border-t border-slate-100"></div>
                    <span className="relative bg-white px-4 text-xs font-bold text-slate-300 uppercase tracking-wider">
                        OR
                    </span>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 relative z-10">
                        
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <div className="relative flex items-center">
                                            <Mail className="absolute left-4 w-5 h-5 text-slate-400" />
                                            <Input 
                                                placeholder="Email Address" 
                                                className="pl-11 h-12 rounded-2xl border-slate-200 bg-slate-50/50 focus-visible:bg-white focus-visible:ring-blue-500 text-base" 
                                                {...field} 
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage className="ml-1" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <div className="relative flex items-center">
                                            <Lock className="absolute left-4 w-5 h-5 text-slate-400" />
                                            <Input 
                                                type="password" 
                                                placeholder="Password" 
                                                className="pl-11 h-12 rounded-2xl border-slate-200 bg-slate-50/50 focus-visible:bg-white focus-visible:ring-blue-500 text-base"
                                                {...field} 
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage className="ml-1" />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end pt-1">
                            <a href="#" className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors">
                                Forgot Password?
                            </a>
                        </div>

                        <Button 
                            type="submit" 
                            className="w-full h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 text-base font-bold shadow-lg shadow-blue-500/25 transition-all mt-4" 
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                "Verifying..."
                            ) : (
                                <span className="flex items-center gap-2">
                                    Log In <ChevronRight className="w-5 h-5" />
                                </span>
                            )}
                        </Button>
                    </form>
                </Form>

                <div className="mt-8 text-center text-sm font-medium text-slate-500">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-blue-600 font-bold hover:underline">
                        Sign up
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;