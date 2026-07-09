import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '@/services/axiosInstance';
import { toast } from 'sonner';
import { Filter, Users, FolderKanban, Activity } from 'lucide-react';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import DataTable from '@/components/DataTable';
import { getTeamReportColumns } from './TeamReportColumns';

const TeamDashboard = () => {
    const navigate = useNavigate();
    const [reports, setReports] = useState([]);
    const [projects, setProjects] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Filter States
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [selectedProject, setSelectedProject] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // We fetch reports and projects. 
                // We'll extract unique employees directly from the reports to populate that filter.
                const [reportsRes, projectsRes] = await Promise.all([
                    axiosInstance.get('/reports'),
                    axiosInstance.get('/projects')
                ]);
                
                const allReports = reportsRes.data;
                setReports(allReports);
                setProjects(projectsRes.data);

                // Extract unique employees from the reports array
                const uniqueEmployees = Array.from(new Set(allReports.map(r => r.userId?._id)))
                    .map(id => allReports.find(r => r.userId?._id === id)?.userId)
                    .filter(Boolean);
                setEmployees(uniqueEmployees);

            } catch (error) {
                toast.error("Failed to fetch dashboard data");
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const handleUnlock = async (id) => {
        if (!window.confirm("Unlock this report and send it back to the employee as a draft?")) return;
        try {
            await axiosInstance.put(`/reports/${id}/unlock`);
            toast.success("Report unlocked successfully");
            // Refresh the data
            const res = await axiosInstance.get('/reports');
            setReports(res.data);
        } catch (error) {
            toast.error("Failed to unlock report");
            console.error(error);
        }
    };

    // Apply the filters to the reports array
    const filteredReports = useMemo(() => {
        return reports.filter(report => {
            const matchEmployee = selectedEmployee ? report.userId?._id === selectedEmployee : true;
            const matchProject = selectedProject ? report.projectId?._id === selectedProject : true;
            const matchStatus = selectedStatus ? report.status === selectedStatus : true;
            return matchEmployee && matchProject && matchStatus;
        });
    }, [reports, selectedEmployee, selectedProject, selectedStatus]);

    return (
        <div className="max-w-7xl mx-auto space-y-6 pb-12">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900">Team Dashboard</h1>
                    <p className="text-sm font-medium text-slate-500 mt-1">Review and manage weekly submissions.</p>
                </div>
            </div>

            {/* Quick Filter Bar */}
            <Card className="rounded-3xl border border-slate-200 shadow-sm bg-white overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4">
                    <CardTitle className="text-sm font-bold text-slate-700 flex items-center gap-2 uppercase tracking-wider">
                        <Filter className="w-4 h-4 text-blue-600" /> Filter Reports
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        
                        {/* Employee Filter */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                <Users className="w-3.5 h-3.5" /> Team Member
                            </label>
                            <select 
                                value={selectedEmployee} 
                                onChange={(e) => setSelectedEmployee(e.target.value)}
                                className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                <option value="">All Members</option>
                                {employees.map(emp => (
                                    <option key={emp._id} value={emp._id}>{emp.fullName}</option>
                                ))}
                            </select>
                        </div>

                        {/* Project Filter */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                <FolderKanban className="w-3.5 h-3.5" /> Project
                            </label>
                            <select 
                                value={selectedProject} 
                                onChange={(e) => setSelectedProject(e.target.value)}
                                className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                <option value="">All Projects</option>
                                {projects.map(proj => (
                                    <option key={proj._id} value={proj._id}>{proj.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Status Filter */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                <Activity className="w-3.5 h-3.5" /> Status
                            </label>
                            <select 
                                value={selectedStatus} 
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                <option value="">All Statuses</option>
                                <option value="submitted">Submitted</option>
                                <option value="draft">Draft (Pending)</option>
                                <option value="late">Late</option>
                            </select>
                        </div>

                    </div>
                </CardContent>
            </Card>

            {/* The DataTable Container */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <DataTable 
                    columns={getTeamReportColumns(
                        (id) => navigate(`/my-reports/${id}/view`), // Reuse the same view we built earlier!
                        handleUnlock
                    )} 
                    data={filteredReports} 
                    title="Report Submissions"
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
};

export default TeamDashboard;