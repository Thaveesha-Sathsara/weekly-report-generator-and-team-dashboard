import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axiosInstance from '@/services/axiosInstance';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import DataTable from '@/components/DataTable';
import { getProjectColumns } from './ProjectColumns';
import ConfirmModal from '@/components/ConfirmModal';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [projectToDelete, setProjectToDelete] = useState(null);
    
    const { register, handleSubmit, reset, setValue } = useForm();

    const fetchProjects = async () => {
        setIsLoading(true);
        try {
            const res = await axiosInstance.get('/projects');
            setProjects(res.data);
        } catch (error) {
            toast.error("Failed to load projects");
            console.error(error);
        }
        finally { setIsLoading(false); }
    };

    useEffect(() => { fetchProjects(); }, []);

    const openEditModal = (project) => {
        setEditingProject(project);
        setValue("name", project.name);
        setValue("description", project.description);
        setIsCreateOpen(true);
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
            setIsCreateOpen(false);
            fetchProjects();
        } catch (error) {
            toast.error("Operation failed");
            console.error(error);
        }
    };

    const executeDelete = async () => {
        if (!projectToDelete) return;
        try {
            await axiosInstance.delete(`/projects/${projectToDelete}`);
            toast.success("Project deleted successfully");
            setProjectToDelete(null); // Close the confirm modal
            fetchProjects();
        } catch (error) {
            toast.error("Delete failed");
            console.error(error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-900">Manage Projects</h1>
                
                <Button 
                    className="rounded-xl bg-blue-600 hover:bg-blue-700 gap-2" 
                    onClick={() => {
                        reset();
                        setEditingProject(null);
                        setIsCreateOpen(true);
                    }}
                >
                    <Plus className="w-4 h-4" /> Add Project
                </Button>

                <Dialog open={isCreateOpen} onOpenChange={(open) => { 
                    if (!open) { setEditingProject(null); reset(); } 
                    setIsCreateOpen(open); 
                }}>
                    <DialogContent className="sm:max-w-md rounded-3xl bg-white p-8 border border-slate-200 shadow-2xl">
                        <DialogHeader className="mb-4">
                            <DialogTitle className="text-xl font-bold text-slate-900">
                                {editingProject ? 'Edit Project' : 'Create New Project'}
                            </DialogTitle>
                            <DialogDescription className="text-slate-500">
                                {editingProject ? 'Update the details for this project below.' : 'Add a new project to the portal.'}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Project Name</label>
                                <Input placeholder="e.g. Q3 Rebrand" className="rounded-xl bg-slate-50" {...register("name", { required: true })} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Description</label>
                                <Input placeholder="Brief overview" className="rounded-xl bg-slate-50" {...register("description")} />
                            </div>
                            <Button type="submit" className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 font-bold">
                                {editingProject ? 'Save Changes' : 'Create Project'}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* datatable container */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <DataTable 
                    columns={getProjectColumns(
                        openEditModal, 
                        (id) => setProjectToDelete(id)
                    )} 
                    data={projects} 
                    title="Active Projects"
                    isLoading={isLoading}
                />
            </div>

            <ConfirmModal 
                isOpen={!!projectToDelete} 
                onClose={() => setProjectToDelete(null)}
                onConfirm={executeDelete}
                title="Delete Project?"
                description="Are you sure you want to permanently delete this project? This action cannot be undone and will remove it from all associated weekly reports."
                confirmText="Yes, Delete Project"
                variant="destructive"
            />
        </div>
    );
};

export default Projects;