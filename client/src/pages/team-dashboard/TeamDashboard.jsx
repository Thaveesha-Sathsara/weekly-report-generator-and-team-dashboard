import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '@/services/axiosInstance';
import { toast } from 'sonner';
import { Filter, Users, FolderKanban, Activity, Calendar } from 'lucide-react';

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
    const [filterStartDate, setFilterStartDate] = useState('');
    const [filterEndDate, setFilterEndDate] = useState('');

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [reportsRes, projectsRes] = await Promise.all([
                    axiosInstance.get('/reports'),
                    axiosInstance.get('/projects')
                ]);
                
                const today = new Date();
                today.setHours(0, 0, 0, 0); // Normalize today to midnight for fair comparison

                // DYNAMIC LATE CALCULATION:
                // Map over reports and upgrade overdue drafts to 'late'
                const processedReports = reportsRes.data.map(report => {
                    if (report.status === 'draft' && report.weekEndDate) {
                        const endDate = new Date(report.weekEndDate);
                        if (endDate < today) {
                            return { ...report, status: 'late' };
                        }
                    }
                    return report;
                });

                setReports(processedReports);
                setProjects(projectsRes.data);

                // Extract unique employees
                const uniqueEmployees = Array.from(new Set(processedReports.map(r => r.userId?._id)))
                    .map(id => processedReports.find(r => r.userId?._id === id)?.userId)
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
            // A real app might re-fetch here, or just reload the page for simplicity
            window.location.reload(); 
        } catch (error) {
            toast.error("Failed to unlock report");
            console.error(error);
        }
    };

    // Apply ALL filters to the reports array
    const filteredReports = useMemo(() => {
        return reports.filter(report => {
            const matchEmployee = selectedEmployee ? report.userId?._id === selectedEmployee : true;
            const matchProject = selectedProject ? report.projectId?._id === selectedProject : true;
            const matchStatus = selectedStatus ? report.status === selectedStatus : true;
            
            // Date Range Logic
            let matchDate = true;
            if (filterStartDate && filterEndDate && report.weekStartDate) {
                const reportStart = new Date(report.weekStartDate);
                const queryStart = new Date(filterStartDate);
                const queryEnd = new Date(filterEndDate);
                
                // Set times to midnight to ensure accurate day comparisons
                reportStart.setHours(0,0,0,0);
                queryStart.setHours(0,0,0,0);
                queryEnd.setHours(0,0,0,0);

                matchDate = reportStart >= queryStart && reportStart <= queryEnd;
            }

            return matchEmployee && matchProject && matchStatus && matchDate;
        });
    }, [reports, selectedEmployee, selectedProject, selectedStatus, filterStartDate, filterEndDate]);

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
                {/* Fixed the padding here (p-6 pb-4 instead of py-4) to distance text from border */}
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6 pb-4">
                    <CardTitle className="text-sm font-bold text-slate-700 flex items-center gap-2 uppercase tracking-wider">
                        <Filter className="w-4 h-4 text-blue-600" /> Filter Reports
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    
                    {/* Row 1: Dropdowns */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                <Users className="w-3.5 h-3.5" /> Team Member
                            </label>
                            <select 
                                value={selectedEmployee} 
                                onChange={(e) => setSelectedEmployee(e.target.value)}
                                className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All Members</option>
                                {employees.map(emp => (
                                    <option key={emp._id} value={emp._id}>{emp.fullName}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                <FolderKanban className="w-3.5 h-3.5" /> Project
                            </label>
                            <select 
                                value={selectedProject} 
                                onChange={(e) => setSelectedProject(e.target.value)}
                                className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All Projects</option>
                                {projects.map(proj => (
                                    <option key={proj._id} value={proj._id}>{proj.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                <Activity className="w-3.5 h-3.5" /> Status
                            </label>
                            <select 
                                value={selectedStatus} 
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All Statuses</option>
                                <option value="submitted">Submitted</option>
                                <option value="draft">Pending / Draft</option>
                                <option value="late">Late</option>
                            </select>
                        </div>
                    </div>

                    {/* Row 2: Date Range */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                <Calendar className="w-3.5 h-3.5" /> Start Date (From)
                            </label>
                            <input 
                                type="date"
                                value={filterStartDate}
                                onChange={(e) => setFilterStartDate(e.target.value)}
                                className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                <Calendar className="w-3.5 h-3.5" /> End Date (To)
                            </label>
                            <div className="flex gap-2">
                                <input 
                                    type="date"
                                    value={filterEndDate}
                                    onChange={(e) => setFilterEndDate(e.target.value)}
                                    className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {/* Quick Clear Button */}
                                {(filterStartDate || filterEndDate) && (
                                    <button 
                                        onClick={() => { setFilterStartDate(''); setFilterEndDate(''); }}
                                        className="h-11 px-4 text-xs font-bold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                </CardContent>
            </Card>

            {/* The DataTable Container */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <DataTable 
                    columns={getTeamReportColumns(
                        (id) => navigate(`/my-reports/${id}/view`), 
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