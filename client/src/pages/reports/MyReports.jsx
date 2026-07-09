import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '@/services/axiosInstance';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import DataTable from '@/components/DataTable';
import { getMyReportColumns } from './ReportColumns';
import ConfirmModal from '@/components/ConfirmModal';

const MyReports = () => {
    const [myReports, setMyReports] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [reportToDelete, setReportToDelete] = useState(null);
    const navigate = useNavigate();

    const fetchReports = async () => {
        setIsLoading(true);
        try {
            const res = await axiosInstance.get('/reports/me');
            
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const processedReports = res.data.map(report => {
                if (report.weekEndDate) {
                    const endDate = new Date(report.weekEndDate);
                    endDate.setHours(0,0,0,0);
                    
                    if (report.status === 'draft' && today > endDate) {
                        return { ...report, status: 'late' };
                    }
                    
                    if (report.status === 'submitted' && report.submittedAt) {
                        const submitDate = new Date(report.submittedAt);
                        submitDate.setHours(0,0,0,0);
                        if (submitDate > endDate) {
                            return { ...report, status: 'late' };
                        }
                    }
                }
                return report;
            });
            setMyReports(processedReports);

        } catch (error) {
            toast.error("Failed to load report history");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const executeDelete = async () => {
        if (!reportToDelete) return;
        try {
            await axiosInstance.delete(`/reports/${reportToDelete}`);
            toast.success("Draft deleted successfully");
            setMyReports(myReports.filter(r => r._id !== reportToDelete));
            setReportToDelete(null);
        } catch (error) {
            toast.error("Failed to delete draft");
            console.error(error);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-12">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900">My Weekly Reports</h1>
                    <p className="text-sm font-medium text-slate-500 mt-1">Manage and track your personal submissions.</p>
                </div>
                <Button onClick={() => navigate('/my-reports/create')} className="rounded-xl bg-blue-600 hover:bg-blue-700 gap-2 font-bold h-11 px-6 shadow-md shadow-blue-500/20">
                    <Plus className="w-5 h-5" /> Create New Report
                </Button>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <DataTable 
                    columns={getMyReportColumns(navigate, (id) => setReportToDelete(id))} 
                    data={myReports} 
                    title="Report History"
                    isLoading={isLoading}
                />
            </div>

            <ConfirmModal 
                isOpen={!!reportToDelete} 
                onClose={() => setReportToDelete(null)}
                onConfirm={executeDelete}
                title="Delete Draft?"
                description="Are you sure you want to permanently delete this draft? This action cannot be undone."
                confirmText="Yes, Delete"
                variant="destructive"
            />
        </div>
    );
};

export default MyReports;