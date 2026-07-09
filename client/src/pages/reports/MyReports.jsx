import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '@/services/axiosInstance';
import { toast } from 'sonner';
import { Plus, CheckCircle, Clock, Eye, Edit } from 'lucide-react';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const MyReports = () => {
    const [myReports, setMyReports] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const res = await axiosInstance.get('/reports/me');
                setMyReports(res.data);
            } catch (error) {
                toast.error("Failed to load report history");
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchReports();
    }, []);

    const formatDate = (isoString) => {
        if (!isoString) return "N/A";
        return format(new Date(isoString), "MMM dd, yyyy");
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-extrabold text-slate-900">My Weekly Reports</h1>
                <Button onClick={() => navigate('/my-reports/create')} className="rounded-xl bg-blue-600 hover:bg-blue-700 gap-2 font-bold h-11 px-6 shadow-md shadow-blue-500/20">
                    <Plus className="w-5 h-5" /> Create New Report
                </Button>
            </div>

            <Card className="rounded-3xl border border-slate-200 shadow-sm bg-white overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-5">
                    <CardTitle className="text-lg text-slate-800">Report History</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="p-12 text-center text-slate-500 font-medium">Loading your history...</div>
                    ) : myReports.length === 0 ? (
                        <div className="p-12 text-center text-slate-500 font-medium">You haven't saved any reports yet.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100 uppercase tracking-wider text-[11px]">
                                    <tr>
                                        <th className="px-6 py-4">Date Range</th>
                                        <th className="px-6 py-4">Project</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Submitted On</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {myReports.map((report) => (
                                        <tr key={report._id} className="hover:bg-slate-50/80 transition-colors group">
                                            <td className="px-6 py-4 font-semibold text-slate-900 whitespace-nowrap">
                                                {formatDate(report.weekStartDate)} <span className="text-slate-400 font-normal mx-2">to</span> {formatDate(report.weekEndDate)}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-slate-700">
                                                {report.projectId?.name || <span className="text-slate-400 italic">Unknown</span>}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
                                                    report.status === 'submitted' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                                }`}>
                                                    {report.status === 'submitted' ? <CheckCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                                                    {report.status === 'submitted' ? 'Submitted' : 'Draft'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-500 font-medium whitespace-nowrap">
                                                {report.submittedAt ? formatDate(report.submittedAt) : '-'}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    {report.status === 'draft' ? (
                                                        <Button size="sm" variant="outline" className="rounded-lg text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300" onClick={() => navigate(`/my-reports/${report._id}/edit`)}>
                                                            <Edit className="w-4 h-4 mr-2" /> Edit Draft
                                                        </Button>
                                                    ) : (
                                                        <Button size="sm" variant="ghost" className="rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50" onClick={() => navigate(`/my-reports/${report._id}/view`)}>
                                                            <Eye className="w-4 h-4 mr-2" /> View
                                                        </Button>
                                                    )}
                                                </div>
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

export default MyReports;