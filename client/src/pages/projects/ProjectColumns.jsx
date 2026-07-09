import { Button } from "@/components/ui/button";
import { Edit2, Trash2, Eye } from "lucide-react";
import DataTableColumnHeader from "@/components/DataTableColumnHeader";

export const getProjectColumns = (handleView, handleEdit, handleDelete) => [
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Project Name" />,
    cell: ({ row }) => <span className="font-semibold text-slate-900">{row.getValue("name")}</span>,
  },
  {
    accessorKey: "description",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Description" />,
    cell: ({ row }) => <span className="text-slate-500">{row.getValue("description") || "-"}</span>,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const project = row.original;
      return (
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => handleView(project._id)} className="text-blue-600 hover:text-blue-800 hover:bg-blue-50">
            <Eye className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleEdit(project)} className="text-slate-500 hover:text-blue-600">
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleDelete(project._id)} className="text-slate-500 hover:text-red-600">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      );
    },
  },
];