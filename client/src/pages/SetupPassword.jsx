import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '@/services/axiosInstance';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription,
    CardFooter
} from '@/components/ui/card';

const setupSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Password do not match",
    path: ["confirmPassword"],
});

const SetupPassword = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(setupSchema),
        defaultValues: { email: "", password: "", confirmPassword: "" }
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
        <div className="flex items-center justify-center min-h-screen bg-blue-50 px-4">
            <Card className="w-full max-w-md shadow-lg border-blue-200">
                <CardHeader className="space-y-1">
                    <CardTitle className="space-y-1">Activate Account</CardTitle>
                    <CardDescription>
                        If your manager has approved your request, set your password here.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">Registered Email</label>
                            <Input
                                {...register("email")}
                                placeholder="name@email.com"
                                className={errors.email ? "border-red-500" : ""}
                            />
                            {errors.email && <p className="text-sm font-medium text-red-500">{errors.email.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">New Password</label>
                            <Input
                                type="password"
                                {...register("password")}
                                placeholder="••••••••"
                                className={errors.password ? "border-red-500" : ""}
                            />
                            {errors.password && <p className="text-sm font-medium text-red-500">{errors.password.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">Confirm Password</label>
                            <Input
                                type="password"
                                {...register("confirmPassword")}
                                placeholder="••••••••"
                                className={errors.confirmPassword ? "border-red-500" : ""}
                            />
                            {errors.confirmPassword && <p className="text-sm font-medium text-red-500">{errors.confirmPassword.message}</p>}
                        </div>

                        <Button type="submit" className="w-full mt-4" disabled={isSubmitting}>
                            {isSubmitting ? "Activating..." : "Set Password & Activate"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center border-t border-blue-100 pt-4">
                    <div className="text-sm text-blue-500">
                        <Link to="/login" className="text-blue-600 hover:underline font-medium">
                            Back to Login
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}
