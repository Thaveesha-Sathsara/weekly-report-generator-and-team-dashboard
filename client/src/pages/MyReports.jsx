import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axiosInstance from '@/services/axiosInstance';
import { toast } from 'sonner';
import { FileText, CheckCircle, Clock } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const reportSchema = z.object({
    projectId: z.string().min(1, { message: "Project selection is required" }),
    weekStartDate: z.string().min(1, { message: "Start date is required" }),
    weekEndDate: z.string().min(1, { message: "End date is required" }),
    tasksCompleted: z.string().min(10, { message: "Please provide more detail on completed tasks" }),
    tasksPlanned: z.string().min(10, { message: "Please detail your planned tasks" }),
    blockers: z.string().optional(),
    hoursWorked: z.string().optional(),
    notes: z.string().optional(),
});

const MyReports = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [projects, setProjects] = useState([]);
    const [myReports, setMyReports] = useState([]);
    const [isLoadingReports, setIsLoadingReports] = useState(true);

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: zodResolver(reportSchema),
        defaultValues: {
            projectId: "", weekStartDate: "", weekEndDate: "",
            tasksCompleted: "", tasksPlanned: "", blockers: "", hoursWorked: "", notes: ""
        }
    });

    const fetchDashboardData = async () => {
        try {
            // Fetch projects for the dropdown AND user's report history simultaneously
            const [projectsRes, reportsRes] = await Promise.all([
                axiosInstance.get('/projects'),
                axiosInstance.get('/reports/me')
            ]);
            setProjects(projectsRes.data);
            setMyReports(reportsRes.data);
        } catch (error) {
            toast.error("Failed to load dashboard data");
        } finally {
            setIsLoadingReports(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const onSubmit = async (data, status) => {
        setIsSubmitting(true);
        try {
            const payload = { ...data, status };
            await axiosInstance.post('/reports', payload);
            toast.success(status === 'submitted' ? "Report Submitted!" : "Draft Saved!");
            reset();
            fetchDashboardData(); // Refresh the table instantly!
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to save report");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-12">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Weekly Reports</h1>
            
            {/* 1. The Submission Form */}
            <Card className="shadow-sm border-slate-200">
                <CardHeader className="bg-slate-50 border-b border-slate-100">
                    <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-600" />
                        Create New Report
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <form className="space-y-6">
                        {/* Top Row: Dates & Project */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Project Tag</label>
                                <select 
                                    {...register("projectId")}
                                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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

                        {/* Middle Row: The Meat of the Report */}
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

                        {/* Bottom Row: Optional Info & Blockers */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium">Blockers / Challenges</label>
                                <Input placeholder="Any roadblocks?" {...register("blockers")} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Hours Worked (Optional)</label>
                                <Input type="number" placeholder="e.g. 40" {...register("hoursWorked")} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Notes / Links</label>
                            <Input placeholder="Figma links, PRs, etc." {...register("notes")} />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-4 pt-4 border-t border-slate-100">
                            <Button 
                                type="button" 
                                variant="outline" 
                                disabled={isSubmitting}
                                onClick={handleSubmit((data) => onSubmit(data, 'draft'))}
                            >
                                Save Draft
                            </Button>
                            <Button 
                                type="button" 
                                disabled={isSubmitting}
                                onClick={handleSubmit((data) => onSubmit(data, 'submitted'))}
                            >
                                Submit Final Report
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* 2. The Report History Table */}
            <Card className="shadow-sm border-slate-200">
                <CardHeader className="bg-slate-50 border-b border-slate-100">
                    <CardTitle className="text-lg text-slate-800">Report History</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {isLoadingReports ? (
                        <div className="p-8 text-center text-slate-500">Loading your history...</div>
                    ) : myReports.length === 0 ? (
                        <div className="p-8 text-center text-slate-500">You haven't saved any reports yet.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-3">Date Range</th>
                                        <th className="px-6 py-3">Project</th>
                                        <th className="px-6 py-3">Status</th>
                                        <th className="px-6 py-3">Submitted On</th>
                                        <th className="px-6 py-3 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {myReports.map((report) => (
                                        <tr key={report._id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-slate-900">
                                                {report.weekStartDate} <span className="text-slate-400 font-normal mx-1">to</span> {report.weekEndDate}
                                            </td>
                                            <td className="px-6 py-4">
                                                {report.projectId?.name || <span className="text-slate-400 italic">Unknown Project</span>}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                                                    report.status === 'submitted' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                                }`}>
                                                    {report.status === 'submitted' ? <CheckCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                                                    {report.status === 'submitted' ? 'Submitted' : 'Draft'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-500">
                                                {report.submittedAt ? new Date(report.submittedAt).toLocaleDateString() : '-'}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Button size="sm" variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                                    {report.status === 'draft' ? 'Edit Draft' : 'View'}
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default MyReports;