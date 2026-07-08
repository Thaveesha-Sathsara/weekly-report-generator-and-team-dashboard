import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axiosInstance from '@/services/axiosInstance';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Card, 
    CardHeader,
    CardTitle,
    CardContent,
} from '@/components/ui/card';

const reportSchema = z.object({
    projectId: z.string().min(1, { message: "Project selection is required" }),
    weekStartDate: z.string().min(1, { message: "Start date is required" }),
    weekEndDate: z.string().min(1, { message: "End date is required" }),
    tasksCompleted: z.string().min(10, { message: "Please provide more details on completed tasks" }),
    tasksPlanned: z.string().min(10, { message: "Please detail your planned tasks" }),
    blockers: z.string().optional(),
    hoursWorked: z.string().optional(),
    notes: z.string().optional(),
});

const MyReport = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [projects, setProjects] = useState([]);

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: zodResolver(reportSchema),
        defaultValues: {
            projectId: "", weekStartDate: "", weekEndDate: "",
            tasksCompleted: "", tasksPlanned: "", blockers: "", hoursWorked: "", notes: ""
        }
    });

    // fetch projects
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await axiosInstance.get('/projects');
                setProjects(res.data);
            } catch (error) {
                toast.error("Failed to load projects")
                console.error(error);
            }
        };
        fetchProjects();
    }, []);

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            const payload = { ...data, status };

            await axiosInstance.post('/post', payload);
            toast.success(status === 'submitted' ? "Report Submitted" : "Draft Saved");
            reset();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to submit report");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">My Weeky Reports</h1>

            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle>Create New Report</CardTitle>
                </CardHeader>
                <CardContent>
                    <form className="space-y-6">

                        {/* dates and project */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Project Tag</label>
                                <select
                                    {...register("projectId")}
                                    className="flex h-10 w-full rounded-md border border-blue-200 bg-white px-3 py-2 text-sm"
                                >
                                    <option value="">Select Project...</option>
                                    {projects.map(p => (
                                        <option key={p._id} value={p._id}>{p.name}</option>
                                    ))}
                                </select>
                                {errors.projectId && <p className="text-xs text-red-500">{errors.projectId.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Week Start</label>
                                <Input type="date" {...register("weekStartDate")} />
                                {errors.weekStartDate && <p className="text-xs text-red-500">{errors.weekStartDate.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Week End</label>
                                <Input type="date" {...register("weekEndDate")} />
                                {errors.weekEndDate && <p className="text-xs text-red-500">{errors.weekEndDate.message}</p>}
                            </div>
                        </div>

                        {/* report content */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Tasks Completed</label>
                                <Textarea rows={4} placeholder="What did you finish this week?" {...register("tasksCompleted")} />
                                {errors.tasksCompleted && <p className="text-xs text-red-500">{errors.tasksCompleted.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Tasks Planned for Next Week</label>
                                <Textarea rows={4} placeholder="What is on the agenda?" {...register("tasksPlanned")} />
                                {errors.tasksPlanned && <p className="text-xs text-red-500">{errors.tasksPlanned.message}</p>}
                            </div>
                        </div>

                        {/* optional info and blockers */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium">Blockers / Challenges (Optional)</label>
                                <Input placeholder="Any issues?" {...register("blockers")} />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Hours Worked (Optional)</label>
                                <Input type="number" placeholder="e.g. 40" {...register("hoursWorked")} />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Additional Notes (Optional)</label>
                                <Input placeholder="Figama links, PRs, etc." {...register("notes")} />
                            </div>

                            <div className="flex justify-end gap-4 pt-4 border-t border-blue-100">
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={isSubmitting}
                                    onClick={handleSubmit((data) => onSubmit(data, 'draft'))}
                                >
                                    Save Draft
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    onClick={handleSubmit((data) => onSubmit(data, 'submitted'))}
                                
                                >
                                    Submit Final Report
                                </Button>
                            </div>

                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default MyReport;