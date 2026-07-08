import { useState, useEffect } from 'react';
import axiosInstance from '@/services/axiosInstance';
import { toast } from 'sonner';
import { CheckCircle } from 'lucide-react';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const TeamDashboard = () => {
    const [pendingUsers, setPendingUsers] = useState([]);
    const [reports, setReports] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [usersRes, reportsRes] = await Promise.all([
                axiosInstance.get('/auth/pending-users'),
                axiosInstance.get('/reports'),
            ]);
            setPendingUsers(usersRes.data);
            setReports(reportsRes.data);
        } catch (error) {
            toast.error("Failed to fetch dashboard data");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleApprove = async (userId, role) => {
        try {
            await axiosInstance.post(`/auth/approve/${userId}`, { assignedRole: role });
            toast.success("User approved!");
            fetchData();
        } catch (error) {
            toast.error("Failed to approve user");
            console.error(error);
        }
    };

    if (isLoading) {
        return (
            <div className="p-8 text-center text-blue-500">Loading Dashboard Data...</div>
        )
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold tracking-tight text-blue-900">Manager Dashboard</h1>

            {/* pending approvals section */}
            <Card className="shadow-sm border-blue-200">
                <CardHeader className="bg-blue-50 border-b border-blue-100">
                    <CardTitle className="text-lg text-blue-800 flex items-center gap-2">
                        <CheckCircle className="w-5 h-w5">
                            Pending Account Apporvals ({pendingUsers.length})
                        </CheckCircle>
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {pendingUsers.length === 0 ? (
                        <div className="p-6 text-center text-slate-500">No pending requests.</div>
                    ) : (
                        <div className="divide-y divide-blue-100">
                            {pendingUsers.map(user => (
                                <div key={user._id} className="flex items-center justify-between p-4 hover:bg-blue-50">
                                    <div>
                                        <p className="font-medium text-blue-900">{user.fullName}</p>
                                        <p className="text-sm text-blue-500">{user.email}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Button size="sm" onClick={() => handleApprove(user._id, 'Team Member')}>
                                            Approve as Member
                                        </Button>
                                        <Button size="sm" variant="outline" onClick={() => handleApprove(user._id, 'Manager')}>
                                            Make Manager
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* team report section */}
            <Card className="shadow-sm border-blue-200">
                <CardHeader className="bg-blue-50 border-b border-blue-100">
                    <CardTitle className="text-lg text-blue-800">Recent Team Reports</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {reports.length === 0 ? (
                        <div className="p-6 text-center text-blue-500">No reports submitted yet.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="ng-blue-50 text-blue-500 font-medium border-b border-blue-200">
                                    <tr>
                                        <th className="px-4 py-3">Employee</th>
                                        <th className="px-4 py-3">Project</th>
                                        <th className="px-4 py-3">Date Range</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-blue-100">
                                    {reports.map(report => (
                                        <tr key={report._id} className="hover:bg-blue-50 transition-colors">
                                            <td className="px-4 py-4 font-medium">{report.userId?.fullName} || 'Unknow'</td>
                                            <td className="px-4 py-4">{report.projectId?.name} || 'No Project'</td>
                                            <td className="px-4 py-4 text-blue-500">{report.weekStartDate} to {report.weekEndDate}</td>
                                            <td className="px-4 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${report.status === 'submitted' ? 'bg-green-100 text-green-700' :
                                                    report.status === 'draft' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-redr-100 text-red-700'
                                                    }`}>
                                                    {report.status.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-right">
                                                <Button size="sm" variant="ghost" className="text-blue-600">
                                                    View Details
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default TeamDashboard;