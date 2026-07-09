import { useState, useEffect, useMemo } from 'react';
import axiosInstance from '@/services/axiosInstance';
import { toast } from 'sonner';
import { format, formatDistanceToNow } from 'date-fns';
import { 
    CheckCircle, AlertTriangle, FileText, Activity, Clock 
} from 'lucide-react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, PieChart, Pie, Cell
} from 'recharts';

import { Card } from '@/components/ui/card';

const DashboardOverview = () => {
    const [reports, setReports] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const res = await axiosInstance.get('/reports');
                setReports(res.data);
            } catch (error) {
                toast.error("Failed to load dashboard data");
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchReports();
    }, []);

    const { kpis, trendData, projectData, complianceData, recentActivity } = useMemo(() => {
        if (!reports.length) return { kpis: {}, trendData: [], projectData: [], complianceData: [], recentActivity: [] };

        // calculate KPIs
        const totalSubmissions = reports.filter(r => r.status === 'submitted').length;
        const complianceRate = Math.round((totalSubmissions / reports.length) * 100) || 0;
        const openBlockers = reports.filter(r => r.blockers && r.blockers.trim() !== '').length;

        const trendMap = {};
        reports.forEach(r => {
            if (!r.weekStartDate) return;
            const dateStr = format(new Date(r.weekStartDate), 'MMM dd');
            trendMap[dateStr] = (trendMap[dateStr] || 0) + 1;
        });
        const trend = Object.keys(trendMap).slice(-7).map(date => ({
            name: date,
            reports: trendMap[date]
        }));

        const projMap = {};
        reports.forEach(r => {
            const projName = r.projectId?.name || 'Unknown Project';
            projMap[projName] = (projMap[projName] || 0) + 1;
        });
        const projData = Object.keys(projMap).map(name => ({
            name: name,
            reports: projMap[name]
        }));

        // 4pie chart
        let sub = 0, drft = 0, lt = 0;
        reports.forEach(r => {
            if (r.status === 'submitted') sub++;
            else if (r.status === 'late') lt++;
            else drft++;
        });
        const compData = [
            { name: 'Submitted', value: sub, color: '#16a34a' },
            { name: 'Pending Drafts', value: drft, color: '#eab308' },
            { name: 'Late', value: lt, color: '#dc2626' },
        ];

        // recent activity feed
        const activity = reports.slice(0, 5).map(r => ({
            id: r._id,
            user: r.userId?.fullName || 'Unknown User',
            action: r.status === 'submitted' ? 'submitted a report for' : 'updated a draft for',
            project: r.projectId?.name || 'Unknown Project',
            time: formatDistanceToNow(new Date(r.updatedAt || r.createdAt), { addSuffix: true }),
            status: r.status === 'submitted' ? 'success' : (r.blockers ? 'warning' : 'neutral')
        }));

        return {
            kpis: { totalSubmissions, complianceRate, openBlockers },
            trendData: trend,
            projectData: projData,
            complianceData: compData,
            recentActivity: activity
        };
    }, [reports]);

    if (isLoading) {
        return <div className="flex h-[50vh] items-center justify-center text-slate-500 font-medium">Aggregating real-time data...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6 pb-12">
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-slate-900">Dashboard Overview</h1>
                <p className="text-sm font-medium text-slate-500 mt-1">Real-time metrics and team performance.</p>
            </div>

            {/* Top KPI Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="rounded-3xl border border-blue-200 shadow-sm bg-white p-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Total Submissions</p>
                            <h3 className="text-4xl font-black text-slate-900">{kpis.totalSubmissions || 0}</h3>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-2xl">
                            <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </Card>

                <Card className="rounded-3xl border border-slate-200 shadow-sm bg-white p-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Compliance Rate</p>
                            <h3 className="text-4xl font-black text-slate-900">{kpis.complianceRate || 0}%</h3>
                        </div>
                        <div className="p-3 bg-green-50 rounded-2xl">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </Card>

                <Card className="rounded-3xl border border-slate-200 shadow-sm bg-white p-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Reports with Blockers</p>
                            <h3 className="text-4xl font-black text-slate-900">{kpis.openBlockers || 0}</h3>
                        </div>
                        <div className="p-3 bg-red-50 rounded-2xl">
                            <AlertTriangle className="w-6 h-6 text-red-600" />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Middle Row: Big Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Trend Chart */}
                <Card className="rounded-3xl border border-slate-200 shadow-sm bg-white p-6">
                    <div className="mb-6 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-blue-600" />
                        <h3 className="text-lg font-bold text-slate-800">Weekly Report Volume</h3>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={trendData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}} dx={-10} allowDecimals={false} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                                />
                                <Line type="monotone" dataKey="reports" name="Reports Filed" stroke="#2563eb" strokeWidth={4} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 8, stroke: '#2563eb', strokeWidth: 2, fill: '#fff' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Bar Chart */}
                <Card className="rounded-3xl border border-slate-200 shadow-sm bg-white p-6">
                    <div className="mb-6 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <h3 className="text-lg font-bold text-slate-800">Workload by Project</h3>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={projectData} barSize={40}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}} dx={-10} allowDecimals={false} />
                                <Tooltip 
                                    cursor={{fill: '#f1f5f9'}}
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="reports" name="Active Reports" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            {/* Bottom Row: Compliance & Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Donut Chart */}
                <Card className="col-span-1 rounded-3xl border border-slate-200 shadow-sm bg-white p-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">Submission Status</h3>
                    <div className="h-[250px] w-full flex flex-col items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={complianceData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                                    {complianceData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="w-full mt-4 space-y-2">
                            {complianceData.map((item) => (
                                <div key={item.name} className="flex justify-between items-center text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                        <span className="font-medium text-slate-600">{item.name}</span>
                                    </div>
                                    <span className="font-bold text-slate-900">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>

                {/* Activity Feed */}
                <Card className="col-span-1 lg:col-span-2 rounded-3xl border border-slate-200 shadow-sm bg-white p-6 flex flex-col">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">Recent Team Activity</h3>
                    <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                        {recentActivity.length === 0 ? (
                            <div className="text-center text-slate-500 font-medium py-10">No recent activity found.</div>
                        ) : (
                            recentActivity.map((activity) => (
                                <div key={activity.id} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                    <div className={`p-2 rounded-full ${
                                        activity.status === 'success' ? 'bg-green-100 text-green-600' :
                                        activity.status === 'warning' ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-600'
                                    }`}>
                                        {activity.status === 'success' ? <CheckCircle className="w-4 h-4" /> :
                                         activity.status === 'warning' ? <AlertTriangle className="w-4 h-4" /> : 
                                         <Clock className="w-4 h-4" />}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-slate-700 font-medium leading-relaxed">
                                            <span className="font-bold text-slate-900">{activity.user}</span> {activity.action} <span className="font-bold text-slate-900">{activity.project}</span>
                                        </p>
                                        <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">{activity.time}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default DashboardOverview;