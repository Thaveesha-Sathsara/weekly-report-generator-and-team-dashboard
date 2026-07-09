import { Eye, Unlock, Trash2, MoreHorizontal } from "lucide-react";
import { format } from "date-fns";
import DataTableColumnHeader from "@/components/DataTableColumnHeader";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export const getTeamReportColumns = (handleView, handleUnlock, handleDelete) => [
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
                <Badge variant="outline" className={`border-0 capitalize font-bold ${
                    status === 'submitted' ? 'text-green-700' : 
                    status === 'late' ? 'text-red-700' : 'text-orange-700'
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
                <div className="flex items-center justify-end gap-1">
                    
                    <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleView(report._id)}
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
                            
                            <DropdownMenuItem onClick={() => handleView(report._id)} className="cursor-pointer font-medium">
                                <Eye className="w-4 h-4 mr-2 text-slate-600" /> View Details
                            </DropdownMenuItem>
                            
                            {(report.status === 'submitted' || report.status === 'late') && (
                            <DropdownMenuItem onClick={() => handleUnlock(report._id)} className="cursor-pointer font-medium">
                                <Unlock className="w-4 h-4 mr-2 text-orange-600" /> Unlock to Draft
                            </DropdownMenuItem>
                            )}
                            
                            <DropdownMenuItem onClick={() => handleDelete(report._id)} className="cursor-pointer font-medium text-red-600 focus:text-red-700 focus:bg-red-50">
                                <Trash2 className="w-4 h-4 mr-2" /> Delete Report
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                </div>
            );
        },
    },
];