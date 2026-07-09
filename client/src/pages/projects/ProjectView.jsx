import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '@/services/axiosInstance';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ArrowLeft, Users, Calendar, FolderKanban } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const ProjectView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const res = await axiosInstance.get(`/projects/${id}`);
                setProject(res.data);
            } catch (error) {
                toast.error("Failed to load project details");
                navigate('/projects'); 
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProject();
    }, [id, navigate]);

    if (isLoading) return <div className="flex h-[50vh] items-center justify-center text-slate-500 font-medium">Loading project...</div>;
    if (!project) return null;

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-12">
            <div className="flex items-center gap-4 mb-8">
                <Button variant="ghost" size="icon" onClick={() => navigate('/projects')} className="rounded-full bg-white border border-gray-200 hover:bg-slate-100">
                    <ArrowLeft className="w-5 h-5 text-slate-600" />
                </Button>
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900">Project Details</h1>
                    <p className="text-sm font-medium text-slate-500 mt-1">Overview and team assignment.</p>
                </div>
            </div>

            <Card className="rounded-3xl border border-gray-200 shadow-xl shadow-slate-200/40 bg-white overflow-hidden p-8 sm:p-12">
                
                {/* Project Header Info */}
                <div className="flex items-start justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                            <FolderKanban className="w-6 h-6 text-blue-600" /> {project.name}
                        </h2>
                        <p className="text-slate-600 mt-4 text-base leading-relaxed font-medium max-w-2xl">
                            {project.description || "No description provided."}
                        </p>
                    </div>
                </div>

                <Separator className="bg-slate-100 mb-8" />

                {/* meta info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 p-6 bg-slate-50 rounded-2xl border border-gray-100">
                    <div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5" /> Created On
                        </p>
                        <p className="font-bold text-slate-900 text-base">
                            {format(new Date(project.createdAt), "MMMM dd, yyyy")}
                        </p>
                    </div>
                    <div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                            <Users className="w-3.5 h-3.5" /> Total Team Size
                        </p>
                        <p className="font-bold text-slate-900 text-base">
                            {project.teamMembers?.length || 0} Members
                        </p>
                    </div>
                </div>

                {/* assined team members */}
                <section>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 mb-6">
                        <Users className="w-5 h-5 text-blue-600" /> Assigned Roster
                    </h3>
                    
                    {project.teamMembers && project.teamMembers.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {project.teamMembers.map(member => (
                                <div key={member._id} className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 bg-white shadow-sm">
                                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200">
                                        {member.fullName.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 leading-none">{member.fullName}</p>
                                        <p className="text-xs font-medium text-slate-500 mt-1">{member.role}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center border border-dashed border-gray-200 rounded-2xl bg-slate-50">
                            <p className="text-sm font-medium text-slate-500">No team members have been assigned to this project yet.</p>
                        </div>
                    )}
                </section>
            </Card>
        </div>
    );
};

export default ProjectView;