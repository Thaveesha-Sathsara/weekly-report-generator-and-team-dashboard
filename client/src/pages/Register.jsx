import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link } from 'react-router-dom';
import axiosInstance from '@/services/axiosInstance';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from '@/components/ui/card';

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
            toast.success("Registration submitted successfully!");
            setIsSubmitted(true);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to submit registration");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-zinc-950 px-4">
                <Card className="w-full max-w-md text-center py-8 shadow-lg border-slate-200 dark:border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-2xl text-green-600 dark:text-green-500">Registration Received</CardTitle>
                        <CardDescription className="mt-4 text-base">
                            Your account request has been sent to the system managers. 
                            Once approved, you will be able to set up your password.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter className="flex justify-center mt-6">
                        <Link to="/login">
                            <Button variant="outline" className="w-full">Return to Sign In</Button>
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-zinc-950 px-4">
            <Card className="w-full max-w-md shadow-lg border-slate-200 dark:border-zinc-800">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold tracking-tight">Register</CardTitle>
                    <CardDescription>
                        Enter your details to request access to the Sisenco portal.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="fullName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Full Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="John Doe" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="name@sisencodigital.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
                                {isSubmitting ? "Submitting..." : "Submit Registration"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                        Already have an account?{" "}
                        <Link to="/login" className="text-blue-600 hover:underline font-medium dark:text-blue-400">
                            Sign in
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Register;