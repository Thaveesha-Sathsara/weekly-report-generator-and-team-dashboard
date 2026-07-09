import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
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
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [projectToDelete, setProjectToDelete] = useState(null); 
    
    const { register, handleSubmit, reset, setValue } = useForm();

    const filteredUsers = useMemo(() => {
        return users.filter(user =>
            user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [users, searchQuery])

    const fetchData = async () => {
        setIsLoading(true);
        try {
            // Fetch both projects and the user directory
            const [projectsRes, usersRes] = await Promise.all([
                axiosInstance.get('/projects'),
                axiosInstance.get('/auth/users')
            ]);
            setProjects(projectsRes.data);
            setUsers(usersRes.data.filter(u => u.role !== 'Pending'));
        } catch (error) {
            toast.error("Failed to load data");
            console.error(error);
        }
        finally { setIsLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const openEditModal = (project) => {
        setEditingProject(project);
        setValue("name", project.name);
        setValue("description", project.description);
        setValue("teamMembers", project.teamMembers?.map(member => member._id) || []);
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
            fetchData();
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
            setProjectToDelete(null);
            fetchData();
        } catch (error) {
            toast.error("Delete failed");
            console.error(error);
        }
    };

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
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
                    if (!open) { setEditingProject(null); reset(); setSearchQuery('');  } 
                    setIsCreateOpen(open); 
                }}>
                    <DialogContent className="sm:max-w-md rounded-3xl bg-white p-8 border shadow-2xl">
                        <DialogHeader className="mb-4">
                            <DialogTitle className="text-xl font-bold text-slate-900">
                                {editingProject ? 'Edit Project' : 'Create New Project'}
                            </DialogTitle>
                            <DialogDescription className="text-slate-500">
                                {editingProject ? 'Update the details for this project below.' : 'Add a new project and assign team members.'}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 pt-2">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Project Name</label>
                                <Input placeholder="e.g. Q3 Rebrand" className="rounded-xl bg-slate-50" {...register("name", { required: true })} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Description</label>
                                <Input placeholder="Brief overview" className="rounded-xl bg-slate-50" {...register("description")} />
                            </div>
                            
                            {/* team member assign part */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Assign Team Members</label>
                                <Input
                                    placeholder="Search by name..."
                                    className="rounded-xl h-9 mb-2 text-sm bg-slate-50"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />

                                <div className="max-h-40 overflow-y-auto border rounded-xl p-3 bg-slate-50 space-y-2">
                                    {filteredUsers.map(user => (
                                        <label key={user._id} className="flex items-center space-x-3 cursor-pointer p-1 hover:bg-white rounded-lg transition-colors">
                                            <input 
                                                type="checkbox" 
                                                value={user._id} 
                                                {...register("teamMembers")} 
                                                className="w-4 h-4 text-blue-600 rounded"
                                            />
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-slate-900 leading-none">{user.fullName}</span>
                                                <span className="text-xs font-medium text-slate-500 mt-1">{user.role}</span>
                                            </div>
                                        </label>
                                    ))}
                                    {filteredUsers.length === 0 && (
                                        <p className="text-center text-xs text-slate-400 py-2">No members found.</p>
                                    )}
                                </div>
                            </div>

                            <Button type="submit" className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 font-bold mt-2 h-11">
                                {editingProject ? 'Save Changes' : 'Create Project'}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <DataTable 
                    columns={getProjectColumns(
                        (id) => navigate(`/projects/${id}/view`),
                        openEditModal, 
                        (id) => setProjectToDelete(id) 
                    )} 
                    data={projects} 
                    isLoading={isLoading}
                />
            </div>

            <ConfirmModal 
                isOpen={!!projectToDelete} 
                onClose={() => setProjectToDelete(null)}
                onConfirm={executeDelete}
                title="Delete Project?"
                description="Are you sure you want to permanently delete this project? This action cannot be undone."
                confirmText="Yes, Delete Project"
                variant="destructive"
            />
        </div>
    );
};

export default Projects;