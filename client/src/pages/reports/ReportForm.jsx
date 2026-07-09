import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '@/services/axiosInstance';
import { toast } from 'sonner';
import { format, addDays } from 'date-fns';
import { CalendarIcon, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assumes you have Shadcn's util file

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card } from '@/components/ui/card';

const reportSchema = z.object({
    projectId: z.string().min(1, { message: "Project is required" }),
    weekStartDate: z.date({ required_error: "Start date is required" }),
    weekEndDate: z.date({ required_error: "End date is required" }),
    tasksCompleted: z.string().min(10, { message: "Provide more detail" }),
    tasksPlanned: z.string().min(10, { message: "Provide more detail" }),
    blockers: z.string().optional(),
    hoursWorked: z.string().optional(),
    notes: z.string().optional(),
});

const ReportForm = () => {
    const { id } = useParams(); // Grabs the ID from the URL if we are editing
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [projects, setProjects] = useState([]);
    
    const isEditMode = !!id;

    const form = useForm({
        resolver: zodResolver(reportSchema),
        defaultValues: {
            projectId: "", tasksCompleted: "", tasksPlanned: "", blockers: "", hoursWorked: "", notes: ""
        }
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                // fetch projects for dropdown
                const pRes = await axiosInstance.get('/projects');
                setProjects(pRes.data);

                if (isEditMode) {
                    const rRes = await axiosInstance.get(`/reports/${id}`);
                    const data = rRes.data;
                    form.reset({
                        projectId: data.projectId._id || data.projectId,
                        weekStartDate: new Date(data.weekStartDate),
                        weekEndDate: new Date(data.weekEndDate),
                        tasksCompleted: data.tasksCompleted,
                        tasksPlanned: data.tasksPlanned,
                        blockers: data.blockers || "",
                        hoursWorked: data.hoursWorked || "",
                        notes: data.notes || ""
                    });
                }
            } catch (error) {
                toast.error("Failed to load data");
                console.error(error);
            }
        };
        loadData();
    }, [id, form, isEditMode]);

    const onSubmit = async (data, status) => {
        setIsSubmitting(true);
        try {
            const payload = { ...data, status };
            if (isEditMode) {
                await axiosInstance.put(`/reports/${id}`, payload);
                toast.success(status === 'submitted' ? "Report Submitted!" : "Draft Updated!");
            } else {
                await axiosInstance.post('/reports', payload);
                toast.success(status === 'submitted' ? "Report Submitted!" : "Draft Saved!");
            }
            navigate('/my-reports');
        } catch (error) {
            toast.error("Failed to save report");
            console.error(error);
        } 
        finally { setIsSubmitting(false); }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-12">
            <div className="flex items-center gap-4 mb-6">
                <Button variant="ghost" size="icon" onClick={() => navigate('/my-reports')} className="rounded-full bg-white border border-slate-200 hover:bg-slate-100">
                    <ArrowLeft className="w-5 h-5 text-slate-600" />
                </Button>
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900">{isEditMode ? 'Edit Weekly Report' : 'Create Weekly Report'}</h1>
                    <p className="text-sm font-medium text-slate-500 mt-1">Fill out the details below to log your progress.</p>
                </div>
            </div>

            <Card className="rounded-3xl border border-slate-200 shadow-sm bg-white overflow-hidden p-8">
                <Form {...form}>
                    <form className="space-y-8">
                        {/* project and dates */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <FormField control={form.control} name="projectId" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-slate-700 font-bold uppercase text-xs tracking-wider">Project Tag</FormLabel>
                                    <select {...field} className="flex h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium outline-none">
                                        <option value="">Select a Project...</option>
                                        {projects.map(p => (<option key={p._id} value={p._id}>{p.name}</option>))}
                                    </select>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="weekStartDate" render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel className="text-slate-700 font-bold uppercase text-xs tracking-wider mb-2">Week Start</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button variant={"outline"} className={cn("h-12 w-full rounded-xl bg-slate-50 justify-start text-left font-medium", !field.value && "text-muted-foreground")}>
                                                    <CalendarIcon className="mr-3 h-4 w-4 opacity-50" />
                                                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={(date) => {
                                                    field.onChange(date);
                                                    if (date) {
                                                        form.setValue('weekEndDate', addDays(date, 6), { shouldValidate: true });
                                                    }
                                                }}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="weekEndDate" render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel className="text-slate-700 font-bold uppercase text-xs tracking-wider mb-2">Week End</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button variant={"outline"}  disabled={true} className={cn("h-12 w-full rounded-xl bg-slate-50 justify-start text-left font-medium", !field.value && "text-muted-foreground")}>
                                                    <CalendarIcon className="mr-3 h-4 w-4 opacity-50" />
                                                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar mode="single" selected={field.value}  disabled={true} onSelect={field.onChange} initialFocus />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>

                        {/* text areas */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <FormField control={form.control} name="tasksCompleted" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-slate-700 font-bold uppercase text-xs tracking-wider">Tasks Completed</FormLabel>
                                    <FormControl>
                                        <Textarea className="min-h-[120px] rounded-xl bg-slate-50 p-4 font-medium" placeholder="What did you accomplish?" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="tasksPlanned" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-slate-700 font-bold uppercase text-xs tracking-wider">Tasks Planned</FormLabel>
                                    <FormControl>
                                        <Textarea className="min-h-[120px] rounded-xl bg-slate-50 p-4 font-medium" placeholder="What is next on the agenda?" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>

                        {/* optional info */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="md:col-span-2">
                                <FormField control={form.control} name="blockers" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-700 font-bold uppercase text-xs tracking-wider">Blockers / Challenges</FormLabel>
                                        <FormControl><Input className="h-12 rounded-xl bg-slate-50 px-4 font-medium" placeholder="Any roadblocks?" {...field} /></FormControl>
                                    </FormItem>
                                )} />
                            </div>
                            <FormField control={form.control} name="hoursWorked" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-slate-700 font-bold uppercase text-xs tracking-wider">Hours Worked</FormLabel>
                                    <FormControl><Input type="number" className="h-12 rounded-xl bg-slate-50 px-4 font-medium" placeholder="e.g. 40" {...field} /></FormControl>
                                </FormItem>
                            )} />
                        </div>

                        <FormField control={form.control} name="notes" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-slate-700 font-bold uppercase text-xs tracking-wider">Notes / Links</FormLabel>
                                <FormControl><Input className="h-12 rounded-xl bg-slate-50 px-4 font-medium" placeholder="Figma links, Jira tickets, PRs..." {...field} /></FormControl>
                            </FormItem>
                        )} />

                        {/* btns */}
                        <div className="flex justify-start gap-4 pt-6 mt-8 border-t border-slate-100">
                            <Button type="button" className="h-12 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 font-bold shadow-lg shadow-blue-500/20" disabled={isSubmitting} onClick={form.handleSubmit((data) => onSubmit(data, 'submitted'))}>
                                Submit Final Report
                            </Button>
                            <Button type="button" variant="secondary" className="h-12 px-8 rounded-xl font-bold bg-slate-100 hover:bg-slate-200 text-slate-700" disabled={isSubmitting} onClick={form.handleSubmit((data) => onSubmit(data, 'draft'))}>
                                Save as Draft
                            </Button>
                        </div>
                    </form>
                </Form>
            </Card>
        </div>
    );
};

export default ReportForm;