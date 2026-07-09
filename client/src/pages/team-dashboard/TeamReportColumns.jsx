import { Button } from "@/components/ui/button";
import { Eye, Unlock } from "lucide-react";
import { format } from "date-fns";
import DataTableColumnHeader from "@/components/DataTableColumnHeader";
import { Badge } from "@/components/ui/badge";

export const getTeamReportColumns = (handleView, handleUnlock) => [
    {
        accessorKey: "employee",
        accessorFn: (row) => row.userId?.fullName || "Unknown",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Employee" />,
        cell: ({ row }) => <span className="font-bold text-slate-900">{row.getValue("employee")}</span>,
    },
    {
        accessorKey: "project",
        accessorFn: (row) => row.projectId?.name || "No Project",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Project" />,
        cell: ({ row }) => <span className="text-slate-600 font-medium">{row.getValue("project")}</span>,
    },
    {
        id: "dateRange",
        accessorFn: (row) => `${row.weekStartDate} to ${row.weekEndDate}`,
        header: ({ column }) => <DataTableColumnHeader column={column} title="Week Of" />,
        cell: ({ row }) => {
            const start = row.original.weekStartDate ? format(new Date(row.original.weekStartDate), "MMM dd") : "N/A";
            const end = row.original.weekEndDate ? format(new Date(row.original.weekEndDate), "MMM dd, yyyy") : "N/A";
            return <span className="text-slate-500 font-medium">{start} - {end}</span>;
        },
    },
    {
        accessorKey: "status",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
        cell: ({ row }) => {
            const status = row.getValue("status");
            return (
                <Badge variant="outline" className={`border-0 capitalize ${
                    status === 'submitted' ? 'bg-green-100 text-green-700' : 
                    status === 'late' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                }`}>
                    {status}
                </Badge>
            );
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const report = row.original;
            return (
                <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleView(report._id)} className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg">
                        <Eye className="w-4 h-4 mr-2" /> View
                    </Button>
                    {report.status === 'submitted' && (
                        <Button variant="ghost" size="sm" onClick={() => handleUnlock(report._id)} className="text-slate-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg">
                            <Unlock className="w-4 h-4 mr-2" /> Unlock
                        </Button>
                    )}
                </div>
            );
        },
    },
];