"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown, ChevronUp, MoreHorizontal, Search } from "lucide-react";
import { useEffect, useState } from "react";

interface Column {
  key: string;
  label: string;
  render?: (item: unknown) => React.ReactNode;
}

interface Action {
  label: string;
  icon?: React.ReactNode;
  onClick: (item: unknown) => void;
  className?: string;
}

interface BaseItem {
  id: string | number;
  order: number | null;
  [key: string]: unknown;
}

interface AdminTableProps {
  items: BaseItem[];
  columns: Column[];
  actions: Action[];
  title: string;
  icon: React.ReactNode;
  searchPlaceholder: string;
  onCreateClick: () => void;
  createButtonLabel: string;
  createButtonIcon: React.ReactNode;
  onMoveItem: (updatedItems: BaseItem[]) => void;
  onToggleActive?: (id: string | number, value: boolean) => void;
}

export function AdminTable({
  items,
  columns,
  actions,
  title,
  icon,
  searchPlaceholder,
  onCreateClick,
  createButtonLabel,
  createButtonIcon,
  onMoveItem,
  onToggleActive,
}: AdminTableProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [localItems, setLocalItems] = useState(items);

  useEffect(() => {
    setLocalItems(items);
  }, [items]);

  const filteredItems = localItems.filter((item) =>
    Object.values(item).some(
      (value) =>
        value && value.toString().toLowerCase().includes(search.toLowerCase())
    )
  );

  const paginatedItems = filteredItems.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const totalPages = Math.ceil(filteredItems.length / pageSize);

  const handleMoveItem = (id: string | number, direction: "up" | "down") => {
    const sortedItems = [...localItems].sort(
      (a, b) => (a.order ?? 0) - (b.order ?? 0)
    );
    const currentIndex = sortedItems.findIndex((item) => item.id === id);
    if (
      (direction === "up" && currentIndex === 0) ||
      (direction === "down" && currentIndex === sortedItems.length - 1)
    ) {
      return;
    }
    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    const currentOrder = sortedItems[currentIndex].order;
    sortedItems[currentIndex].order = sortedItems[newIndex].order;
    sortedItems[newIndex].order = currentOrder;
    setLocalItems(sortedItems);
    onMoveItem(sortedItems);
  };

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:mb-8">
        <div className="flex items-center gap-3">
          {icon}
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            {title}
          </h1>
        </div>
        {onCreateClick && createButtonLabel !== "" && (
          <Button
            onClick={onCreateClick}
            className="w-full sm:w-auto flex items-center justify-center gap-2"
          >
            {createButtonIcon}
            {createButtonLabel}
          </Button>
        )}
      </div>

      <Card className="p-3 sm:p-6">
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row justify-between gap-3">
          <div className="relative w-full sm:w-1/3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
          <div className="flex justify-end gap-2">
            {[20, 50, 100].map((size) => (
              <Button
                key={size}
                onClick={() => setPageSize(size)}
                variant={pageSize === size ? "default" : "outline"}
                size="sm"
                className="px-2 sm:px-4"
              >
                {size}
              </Button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto -mx-3 sm:mx-0">
          <div className="min-w-full inline-block align-middle">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    {columns.map((column) => (
                      <TableHead key={column.key} className="font-semibold">
                        {column.label}
                      </TableHead>
                    ))}
                    {actions.length > 0 && (
                      <TableHead className="w-[100px]">Actions</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedItems.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length + 1}
                        className="text-center py-8 text-muted-foreground"
                      >
                        Aucun élément trouvé
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedItems.map((item) => (
                      <TableRow
                        key={`${JSON.stringify(item)}`}
                        className="hover:bg-muted/50 transition-colors"
                      >
                        {columns.map((column) => (
                          <TableCell key={column.key}>
                            {column.key === "order" ? (
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={() => handleMoveItem(item.id, "up")}
                                  disabled={
                                    localItems.findIndex(
                                      (it) => it.id === item.id
                                    ) === 0
                                  }
                                >
                                  <ChevronUp className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={() =>
                                    handleMoveItem(item.id, "down")
                                  }
                                  disabled={
                                    localItems.findIndex(
                                      (it) => it.id === item.id
                                    ) ===
                                    localItems.length - 1
                                  }
                                >
                                  <ChevronDown className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : column.key === "active" && onToggleActive ? (
                              <Switch
                                checked={Boolean(item[column.key])}
                                onCheckedChange={(checked) =>
                                  onToggleActive(item.id, checked)
                                }
                              />
                            ) : column.render ? (
                              column.render(item)
                            ) : typeof item[column.key] === "boolean" ? (
                              item[column.key] ? (
                                "Oui"
                              ) : (
                                "Non"
                              )
                            ) : /^#(?:[0-9a-fA-F]{3}){1,2}$/.test(
                                String(item[column.key])
                              ) ? (
                              <span
                                style={{
                                  backgroundColor: String(item[column.key]),
                                }}
                                className="inline-block w-4 h-4 rounded-sm"
                                title={String(item[column.key])}
                              ></span>
                            ) : (
                              String(item[column.key] ?? "")
                            )}
                          </TableCell>
                        ))}
                        {actions.length > 0 && (
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {actions.map((action, index) => (
                                  <DropdownMenuItem
                                    key={index}
                                    onClick={() => action.onClick(item)}
                                    className={`flex items-center gap-2 cursor-pointer ${action.className}`}
                                  >
                                    {action.icon}
                                    {action.label}
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        )}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-col-reverse sm:flex-row justify-between items-center gap-3">
          <div className="flex gap-2 w-full sm:w-auto justify-center sm:justify-start">
            <Button
              onClick={() => setPage(page > 1 ? page - 1 : 1)}
              disabled={page === 1}
              variant="outline"
              size="sm"
              className="w-full sm:w-auto"
            >
              Précédent
            </Button>
            <Button
              onClick={() => setPage(page + 1)}
              disabled={page >= totalPages}
              variant="outline"
              size="sm"
              className="w-full sm:w-auto"
            >
              Suivant
            </Button>
          </div>
          <div className="text-sm text-muted-foreground text-center sm:text-left">
            Page {page} sur {totalPages} • {filteredItems.length} éléments
          </div>
        </div>
      </Card>
    </div>
  );
}
