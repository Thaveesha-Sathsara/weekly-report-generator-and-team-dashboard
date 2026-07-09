import { Button } from "@/components/ui/button";
import { UserCheck, ShieldCheck } from "lucide-react";
import DataTableColumnHeader from "@/components/DataTableColumnHeader";
import { Badge } from "@/components/ui/badge";

export const getMemberColumns = (handleApprove) => [
    {
        accessorKey: "fullName",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
        cell: ({ row }) => <span className="font-bold text-slate-900">{row.getValue("fullName")}</span>,
    },
    {
        accessorKey: "email",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Email Address" />,
        cell: ({ row }) => <span className="text-slate-500 font-medium">{row.getValue("email")}</span>,
    },
    {
        accessorKey: "role",
        header: ({ column }) => <DataTableColumnHeader column={column} title="System Role" />,
        cell: ({ row }) => {
            const role = row.getValue("role");
            return (
                <Badge variant="outline" className={`border-0 ${
                    role === 'Manager' ? 'text-purple-700' : 
                    'text-blue-700'
                }`}>
                    {role}
                </Badge>
            );
        },
    },
    {
        accessorKey: "accountStatus",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
        cell: ({ row }) => {
            const status = row.getValue("accountStatus");
            return (
                <Badge variant="outline" className={`border-0 ${
                    status === 'Active' ? 'text-green-700' : 
                    status === 'Approved' ? 'text-yellow-700' : 
                    'text-slate-700'
                }`}>
                    {status}
                </Badge>
            );
        }
    },
    {
        id: "actions",
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => {
            const user = row.original;
            
            if (user.accountStatus !== 'Pending') {
                 return <div className="text-right text-slate-400 text-xs font-medium">Action Complete</div>;
            }

            return (
                <div className="flex justify-end gap-2">
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleApprove(user, 'Team Member')} 
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg"
                    >
                        <UserCheck className="w-4 h-4 mr-2" /> Member
                    </Button>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleApprove(user, 'Manager')} 
                        className="text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-lg"
                    >
                        <ShieldCheck className="w-4 h-4 mr-2" /> Manager
                    </Button>
                </div>
            );
        },
    },
];