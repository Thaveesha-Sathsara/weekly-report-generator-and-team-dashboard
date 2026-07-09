import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '@/services/axiosInstance';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { 
    ArrowLeft, Calendar, Clock, CheckCircle, 
    Briefcase, AlertTriangle, Link as LinkIcon, FileText 
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const ReportView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [report, setReport] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const res = await axiosInstance.get(`/reports/${id}`);
                
                let processedReport = res.data;
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                if (processedReport.weekEndDate) {
                    const endDate = new Date(processedReport.weekEndDate);
                    endDate.setHours(0,0,0,0);
                    
                    if (processedReport.status === 'draft' && today > endDate) {
                        processedReport.status = 'late';
                    }
                    
                    if (processedReport.status === 'submitted' && processedReport.submittedAt) {
                        const submitDate = new Date(processedReport.submittedAt);
                        submitDate.setHours(0,0,0,0);
                        if (submitDate > endDate) {
                            processedReport.status = 'late';
                        }
                    }
                }

                setReport(processedReport);
            } catch (error) {
                toast.error("Failed to load report details");
                navigate('/my-reports');
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchReport();
    }, [id, navigate]);

    const formatDate = (isoString) => {
        if (!isoString) return "N/A";
        return format(new Date(isoString), "MMMM dd, yyyy");
    };

    if (isLoading) {
        return <div className="flex h-[50vh] items-center justify-center text-slate-500 font-medium">Loading report...</div>;
    }

    if (!report) return null;

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-12">
            {/* header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/my-reports')} className="rounded-full bg-white border border-gray-200 hover:bg-slate-100">
                        <ArrowLeft className="w-5 h-5 text-slate-600" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900">Weekly Report</h1>
                        <p className="text-sm font-medium text-slate-500 mt-1">
                            Submitted on {report.submittedAt ? formatDate(report.submittedAt) : 'Not submitted yet'}
                        </p>
                    </div>
                </div>
                
                <Badge variant="outline" className={`px-4 py-1.5 text-sm font-bold border-0 ${
                    report.status === 'submitted' ? 'text-green-700' : report.status === 'late' ? 'text-red-700' : 'text-orange-700'
                }`}>
                    {report.status === 'submitted' ? (
                        <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Submitted</span>
                    ) : report.status === 'late' ? (
                        <span className="flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Late</span>
                    ) : (
                        <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> Draft</span>
                    )}
                </Badge>
            </div>

            {/* main document */}
            <Card className="rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/40 bg-white overflow-hidden p-8 sm:p-12">
                
                {/* meta info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                            <Briefcase className="w-3.5 h-3.5" /> Project
                        </p>
                        <p className="font-bold text-slate-900 text-lg">{report.projectId?.name || "Unknown Project"}</p>
                    </div>
                    <div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5" /> Date Range
                        </p>
                        <p className="font-bold text-slate-900 text-sm">
                            {formatDate(report.weekStartDate)} <br />
                            <span className="text-slate-400 font-medium">to</span> {formatDate(report.weekEndDate)}
                        </p>
                    </div>
                    <div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5" /> Hours Logged
                        </p>
                        <p className="font-bold text-slate-900 text-lg">
                            {report.hoursWorked ? `${report.hoursWorked} hrs` : "Not specified"}
                        </p>
                    </div>
                </div>

                {/* info of the report */}
                <div className="space-y-10">
                    <section>
                        <h3 className="text-sm font-bold text-black-600 uppercase tracking-wider flex items-center gap-2 mb-4">
                            Tasks Completed
                        </h3>
                        <p className="text-slate-700 whitespace-pre-wrap leading-relaxed font-medium">
                            {report.tasksCompleted}
                        </p>
                    </section>

                    <Separator className="bg-slate-100" />

                    <section>
                        <h3 className="text-sm font-bold text-black-600 uppercase tracking-wider flex items-center gap-2 mb-4">
                            Tasks Planned for Next Week
                        </h3>
                        <p className="text-slate-700 whitespace-pre-wrap leading-relaxed font-medium">
                            {report.tasksPlanned}
                        </p>
                    </section>

                    <Separator className="bg-slate-100" />

                    {/* bottom of grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <section className="bg-slate-50 p-6 rounded-2xl border border-red-100">
                            <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2 mb-3">
                                <AlertTriangle className="w-4 h-4" /> Blockers & Challenges
                            </h3>
                            <p className="text-slate-700 font-medium text-sm">
                                {report.blockers || "No blockers reported for this week."}
                            </p>
                        </section>

                        <section className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                            <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2 mb-3">
                                <LinkIcon className="w-4 h-4" /> Notes & Links
                            </h3>
                            <p className="text-slate-700 font-medium text-sm break-words">
                                {report.notes || "No additional notes or links provided."}
                            </p>
                        </section>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default ReportView;