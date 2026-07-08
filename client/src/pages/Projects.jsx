import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axiosInstance from '@/services/axiosInstance';
import { toast } from 'sonner';
import { FolderPlus, FolderKanban, Trash2, Edit2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, handleSubmit, reset } = useForm();

    const fetchProjects = async () => {
        try {
            const res = await axiosInstance.get('/projects');
            setProjects(res.data);
        } catch (error) {
            toast.error("Failed to load projects");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    // Create Project
    const onSubmit = async (data) => {
        if (!data.name.trim()) return toast.error("Project name is required");
        
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

    // Update Project
    const handleEdit = async (project) => {
        const newName = window.prompt("Enter new project name:", project.name);
        if (!newName || newName === project.name) return; // Cancelled or unchanged

        try {
            await axiosInstance.put(`/projects/${project._id}`, { name: newName });
            toast.success("Project updated successfully");
            fetchProjects();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update project");
        }
    };

    // Delete Project
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to permanently delete this project?")) return;
        
        try {
            await axiosInstance.delete(`/projects/${id}`);
            toast.success("Project deleted successfully");
            fetchProjects();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete project");
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Manage Projects</h1>
            
            {/* Create Project Form */}
            <Card className="shadow-sm border-slate-200">
                <CardHeader className="bg-slate-50 border-b border-slate-100">
                    <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
                        <FolderPlus className="w-5 h-5 text-blue-600" />
                        Create New Project
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <form onSubmit={handleSubmit(onSubmit)} className="flex items-end gap-4">
                        <div className="flex-1 space-y-2">
                            <label className="text-sm font-medium">Project Name</label>
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

            {/* Active Projects List */}
            <Card className="shadow-sm border-slate-200">
                <CardHeader className="bg-slate-50 border-b border-slate-100">
                    <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
                        <FolderKanban className="w-5 h-5 text-slate-600" />
                        Active Projects ({projects.length})
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="p-6 text-center text-slate-500">Loading projects...</div>
                    ) : projects.length === 0 ? (
                        <div className="p-6 text-center text-slate-500">No active projects found.</div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {projects.map((project) => (
                                <div key={project._id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-slate-900">{project.name}</span>
                                        {project.description && (
                                            <span className="text-sm text-slate-500 mt-1">{project.description}</span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            className="text-slate-500 hover:text-blue-600"
                                            onClick={() => handleEdit(project)}
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </Button>
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            className="text-slate-500 hover:text-red-600"
                                            onClick={() => handleDelete(project._id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
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