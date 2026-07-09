import PropTypes from "prop-types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SlidersHorizontal } from "lucide-react";

const DataTableViewOptions = ({ table }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="ml-auto hidden h-8 lg:flex items-center justify-center rounded-md border border-slate-200 bg-white px-3 text-sm font-medium shadow-sm hover:bg-slate-100 transition-colors">
          <div className="flex items-center">
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            View
          </div>
        </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea>
          <div className="max-h-48">
            {table
              .getAllColumns()
              .filter(
                (column) =>
                  typeof column.accessorFn !== "undefined" &&
                  column.getCanHide()
              )
              .map((column) => {
                const header =
                  typeof column.columnDef.header === "function"
                    ? column.columnDef.header({ column })
                    : column.columnDef.header;

                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {/* Fix: safely render string or element */}
                    {typeof header === "string"
                      ? header
                      : header?.props?.title || "Unnamed"}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </div>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

DataTableViewOptions.propTypes = {
  table: PropTypes.any,
};

export default DataTableViewOptions;
