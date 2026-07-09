import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, Eye, Edit } from "lucide-react";
import { format } from "date-fns";
import DataTableColumnHeader from "@/components/DataTableColumnHeader";
import { Badge } from "@/components/ui/badge";

export const getMyReportColumns = (navigate) => [
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
            const status = row.getValue("status");
            return (
                <Badge variant="outline" className={`px-3 py-1.5 border-0 font-bold ${
                    status === 'submitted' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                }`}>
                    <span className="flex items-center gap-1.5">
                        {status === 'submitted' ? <CheckCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                        {status === 'submitted' ? 'Submitted' : 'Draft'}
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
            return (
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
            );
        },
    },
];