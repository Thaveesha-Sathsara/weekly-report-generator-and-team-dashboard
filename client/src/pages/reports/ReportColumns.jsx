import { CheckCircle, Clock, Eye, Edit, MoreHorizontal, Trash2, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import DataTableColumnHeader from "@/components/DataTableColumnHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button"; // Make sure Button is imported!
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from 'sonner';

export const getMyReportColumns = (navigate, handleDelete) => [
    {
        id: "dateRange",
        accessorFn: (row) => `${row.weekStartDate} to ${row.weekEndDate}`,
        header: ({ column }) => <DataTableColumnHeader column={column} title="Date Range" />,
        cell: ({ row }) => {
            const start = row.original.weekStartDate ? format(new Date(row.original.weekStartDate), "MMM dd, yyyy") : "N/A";
            const end = row.original.weekEndDate ? format(new Date(row.original.weekEndDate), "MMM dd, yyyy") : "N/A";
            return <span className="font-semibold text-slate-900">{start} <span className="text-slate-400 font-normal mx-1">to</span> {end}</span>;
        },
    },
    {
        accessorKey: "project",
        accessorFn: (row) => row.projectId?.name || "Unknown",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Project" />,
        cell: ({ row }) => <span className="font-medium text-slate-700">{row.getValue("project")}</span>,
    },
    {
        accessorKey: "status",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
        cell: ({ row }) => {
            const status = row.getValue("status") || "draft";
            const isUnsubmittedLate = status === 'late' && !row.original.submittedAt;
            return (
                <Badge variant="outline" className={`px-3 py-1.5 border-0 font-bold capitalize ${
                    status === 'submitted' ? 'text-green-700' : 
                    status === 'late' ? 'text-red-700' : 'text-orange-700'
                }`}>
                    <span className="flex items-center gap-1.5">
                        {status === 'submitted' ? <CheckCircle className="w-3.5 h-3.5" /> : 
                         status === 'late' ? <AlertTriangle className="w-3.5 h-3.5" /> : 
                         <Clock className="w-3.5 h-3.5" />}
                        
                        {isUnsubmittedLate ? 'Late (Draft)' : status}
                    </span>
                </Badge>
            );
        },
    },
    {
        accessorKey: "submittedAt",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Submitted On" />,
        cell: ({ row }) => {
            const date = row.getValue("submittedAt");
            return <span className="text-slate-500 font-medium">
                {date ? format(new Date(date), "MMM dd, yyyy") : '-'}
            </span>;
        },
    },
    {
        id: "actions",
        header: () => <div className="text-right font-medium">Actions</div>,
        cell: ({ row }) => {
            const report = row.original;
            
            const attemptDelete = () => {
                if (report.status === 'submitted' || (report.status === 'late' && report.submittedAt)) {
                    toast.error("Already submitted. You cannot delete this report.");
                    return;
                }
                handleDelete(report._id);
            };

            const canEdit = report.status === 'draft' || (report.status === 'late' && !report.submittedAt);

            return (
                <div className="flex items-center justify-end gap-1">
                    
                    <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => navigate(`/my-reports/${report._id}/view`)} 
                        className="h-8 w-8 p-0 text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        title="View Report"
                    >
                        <Eye className="w-4 h-4" />
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-slate-100 outline-none transition-colors">
                            <MoreHorizontal className="h-4 w-4 text-slate-500" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl border-slate-200 bg-white">
                            
                            <DropdownMenuItem onClick={() => navigate(`/my-reports/${report._id}/view`)} className="cursor-pointer font-medium">
                                <Eye className="w-4 h-4 mr-2 text-slate-600" /> View Details
                            </DropdownMenuItem>
                            
                            {canEdit && (
                                <DropdownMenuItem onClick={() => navigate(`/my-reports/${report._id}/edit`)} className="cursor-pointer font-medium">
                                    <Edit className="w-4 h-4 mr-2 text-blue-600" /> Edit Draft
                                </DropdownMenuItem>
                            )}
                            
                            <DropdownMenuItem onClick={attemptDelete} className="cursor-pointer font-medium text-red-600 focus:text-red-700 focus:bg-red-50">
                                <Trash2 className="w-4 h-4 mr-2" /> Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                </div>
            );
        },
    },
];