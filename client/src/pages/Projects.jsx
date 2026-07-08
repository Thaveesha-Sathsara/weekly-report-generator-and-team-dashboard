import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axiosInstance from '@/services/axiosInstance';
import { toast } from 'sonner';
import { FolderPlus, FolderKanban } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from '@/components/ui/card';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    
    const fetchProjects = async () => {
        try {
            const res = await axiosInstance.get('/projects');
            setProjects(res.data);
        } catch (error) {
            toast.error("Failed to fetch projects");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const onSubmit = async (data) => {
        if (!data.name.trim()) return toast.error("Project name cannot be empty");

        setIsSubmitting(true);
        try {
            await axiosInstance.post('/projects', data);
            toast.success("Project created successfully!");
            reset();
            fetchProjects();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create project");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold tracking-tight text-blue-900">Manage Projects</h1>

            {/* create project form */}
            <Card className="shadow-sm border-blue-200">
                <CardHeader className="bg-blue-50 border-b border-blue-100">
                    <CardTitle className="text-lg text-blue-800 flex items-center gap-2">
                        <FolderPlus className="w-5 h-5" />
                        Create New Project
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <form onSubmit={handleSubmit(onSubmit)} className="flex items-end gap-4">
                        <div className="flex-1 space-y-2">
                            <label className="text-s, font-medium">Project Name</label>
                            <Input
                                placeholder="e.g. Q3 Marketing Campaign"
                                {...register("name", { required: true })}
                            />
                        </div>
                        <div className="flex-1 space-y-2">
                            <label className="text-sm font-medium">Description (Optional)</label>
                            <Input
                                placeholder="Brief overview of the project"
                                {...register("description")}
                            />
                        </div>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Saving..." : "Add Project"}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Active project list */}
            <Card className="shadow-sm border-blue-200">
                <CardHeader className="bg-blue-50 border-b border-blue-100">
                    <CardTitle className="text-lg text-blue-800 flex items-center gap-2">
                        <FolderKanban className="w-5 h-5" />
                        Active Projects ({projects.length})
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="p-6 text-center text-blue-500">Loading projects...</div>
                    ) : projects.length === 0 ? (
                        <div className="p-6 text-center text-blue-500">No active projects found.</div>
                    ) : (
                        <div className="divide-y divide-blue-100">
                            {projects.map((project) => (
                                <div key={project._id} className="flex flex-col p-4 hover:bg-blue-50 transition-colors">
                                    <span className="font-semibold text-blue-900">{project.name}</span>
                                    {project.description && (
                                        <span className="text-sm text-blue-500 mt-1">{project.description}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default Projects;