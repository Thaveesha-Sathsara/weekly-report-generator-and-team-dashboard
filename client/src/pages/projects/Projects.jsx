import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axiosInstance from '@/services/axiosInstance';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import DataTable from '@/components/DataTable';
import { getProjectColumns } from './ProjectColumns';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null); // Tracks if we are editing
    const { register, handleSubmit, reset, setValue } = useForm();

    const fetchProjects = async () => {
        setIsLoading(true);
        try {
            const res = await axiosInstance.get('/projects');
            setProjects(res.data);
        } catch (error) { toast.error("Failed to load projects"); }
        finally { setIsLoading(false); }
    };

    useEffect(() => { fetchProjects(); }, []);

    // When modal opens for edit, fill the form
    const openEditModal = (project) => {
        setEditingProject(project);
        setValue("name", project.name);
        setValue("description", project.description);
        setIsOpen(true);
    };

    const onSubmit = async (data) => {
        try {
            if (editingProject) {
                await axiosInstance.put(`/projects/${editingProject._id}`, data);
                toast.success("Project updated!");
            } else {
                await axiosInstance.post('/projects', data);
                toast.success("Project created!");
            }
            reset();
            setEditingProject(null);
            setIsOpen(false);
            fetchProjects();
        } catch (error) { toast.error("Operation failed"); }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this project?")) return;
        try {
            await axiosInstance.delete(`/projects/${id}`);
            toast.success("Project deleted");
            fetchProjects();
        } catch (error) { toast.error("Delete failed"); }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-900">Manage Projects</h1>
                <Dialog open={isOpen} onOpenChange={(open) => { 
                    if (!open) { setEditingProject(null); reset(); } 
                    setIsOpen(open); 
                }}>
                    <DialogTrigger asChild>
                        <Button className="rounded-xl bg-blue-600 gap-2"><Plus className="w-4" /> Add Project</Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-3xl p-8">
                        <DialogHeader>
                            <DialogTitle>{editingProject ? 'Edit Project' : 'Create New Project'}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
                            <Input placeholder="Name" className="rounded-xl" {...register("name", { required: true })} />
                            <Input placeholder="Description" className="rounded-xl" {...register("description")} />
                            <Button type="submit" className="w-full rounded-xl bg-blue-600">{editingProject ? 'Save Changes' : 'Create'}</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <DataTable 
                columns={getProjectColumns(openEditModal, handleDelete)} 
                data={projects} 
                title="Active Projects"
                isLoading={isLoading}
            />
        </div>
    );
};

export default Projects;