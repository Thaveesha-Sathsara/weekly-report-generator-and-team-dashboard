import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '@/services/axiosInstance';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import DataTable from '@/components/DataTable';
import { getMyReportColumns } from './ReportColumns';

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

            {/* table */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <DataTable 
                    columns={getMyReportColumns(navigate)} 
                    data={myReports} 
                    title="Report History"
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
};

export default MyReports;