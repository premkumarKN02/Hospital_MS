import React, { useState, useMemo } from 'react';
import {
  Button, Input, Badge, Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
  Modal, EmptyState, Skeleton
} from './ui-primitives';
import {
  Search, Plus, Download, Filter, Trash2, Edit2, Eye, MoreHorizontal,
  ArrowUpDown, CheckSquare, Square, AlertTriangle
} from 'lucide-react';

export interface CrudRecord {
  id: string;
  title: string;
  code: string;
  status: 'active' | 'pending' | 'archived';
  category: string;
  createdAt: string;
  [key: string]: any;
}

export interface CrudModuleProps {
  entityName: string; // e.g. "Patient", "Invoice", "Lead"
  entityPlural: string; // e.g. "Patients", "Invoices", "Leads"
  initialData: CrudRecord[];
  onSave: (record: Partial<CrudRecord>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  isLoading?: boolean;
}

export function CrudModuleTemplate({
  entityName,
  entityPlural,
  initialData,
  onSave,
  onDelete,
  isLoading = false,
}: CrudModuleProps) {
  const [data, setData] = useState<CrudRecord[]>(initialData);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortField, setSortField] = useState<string>('createdAt');
  const [sortAsc, setSortAsc] = useState(false);

  // Modal dialog states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<CrudRecord | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [detailRecord, setDetailRecord] = useState<CrudRecord | null>(null);

  // Form field state
  const [formData, setFormData] = useState({ title: '', code: '', category: 'General', status: 'active' as const });

  // Filter & Sort Logic
  const filteredData = useMemo(() => {
    return data
      .filter((item) => {
        const matchesSearch =
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.code.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        const valA = a[sortField] || '';
        const valB = b[sortField] || '';
        if (valA < valB) return sortAsc ? -1 : 1;
        if (valA > valB) return sortAsc ? 1 : -1;
        return 0;
      });
  }, [data, searchQuery, statusFilter, sortField, sortAsc]);

  // Bulk Selection Handlers
  const handleSelectAll = () => {
    if (selectedIds.length === filteredData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredData.map((d) => d.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Open Edit Form
  const handleOpenEdit = (record: CrudRecord) => {
    setEditingRecord(record);
    setFormData({
      title: record.title,
      code: record.code,
      category: record.category,
      status: record.status,
    });
    setIsFormOpen(true);
  };

  // Open Create Form
  const handleOpenCreate = () => {
    setEditingRecord(null);
    setFormData({ title: '', code: '', category: 'General', status: 'active' });
    setIsFormOpen(true);
  };

  // Submit Form Handler
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({
      ...(editingRecord ? { id: editingRecord.id } : { id: `REC-${Date.now()}` }),
      ...formData,
      createdAt: editingRecord ? editingRecord.createdAt : new Date().toISOString().split('T')[0],
    });
    setIsFormOpen(false);
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (deletingId) {
      await onDelete(deletingId);
      setData((prev) => prev.filter((d) => d.id !== deletingId));
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* 1. Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">{entityPlural}</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage, filter, and audit your organization&apos;s {entityPlural.toLowerCase()} records.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Export CSV
          </Button>
          <Button variant="primary" size="sm" onClick={handleOpenCreate}>
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Add {entityName}
          </Button>
        </div>
      </div>

      {/* 2. Filters & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-card p-3 rounded-lg border border-border">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
          <input
            type="text"
            placeholder={`Search ${entityPlural.toLowerCase()} by code or name...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-3 rounded-md border border-input bg-background text-xs focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 px-3 rounded-md border border-input bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* 3. Bulk Action Banner */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between px-4 py-2.5 rounded-md bg-primary/10 border border-primary/20 text-xs text-foreground animate-in fade-in">
          <span className="font-semibold">{selectedIds.length} records selected</span>
          <div className="flex items-center gap-2">
            <Button variant="danger" size="sm" onClick={() => setSelectedIds([])}>
              <Trash2 className="w-3.5 h-3.5 mr-1" />
              Batch Delete
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setSelectedIds([])}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* 4. Data Table */}
      {isLoading ? (
        <div className="space-y-2 p-4 border border-border rounded-md bg-card">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : filteredData.length === 0 ? (
        <EmptyState
          title={`No ${entityPlural.toLowerCase()} found`}
          description={
            searchQuery
              ? `No entries matched your search query "${searchQuery}". Try clearing filters.`
              : `You haven't registered any ${entityPlural.toLowerCase()} yet.`
          }
          action={
            <Button variant="primary" size="sm" onClick={handleOpenCreate}>
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              Add First {entityName}
            </Button>
          }
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <button onClick={handleSelectAll} className="flex items-center text-muted-foreground hover:text-foreground">
                  {selectedIds.length === filteredData.length ? <CheckSquare className="w-4 h-4 text-primary" /> : <Square className="w-4 h-4" />}
                </button>
              </TableHead>
              <TableHead onClick={() => { setSortField('code'); setSortAsc(!sortAsc); }} className="cursor-pointer">
                <span className="inline-flex items-center gap-1">Identifier <ArrowUpDown className="w-3 h-3" /></span>
              </TableHead>
              <TableHead onClick={() => { setSortField('title'); setSortAsc(!sortAsc); }} className="cursor-pointer">
                <span className="inline-flex items-center gap-1">Title / Name <ArrowUpDown className="w-3 h-3" /></span>
              </TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <button onClick={() => handleToggleSelect(row.id)} className="flex items-center text-muted-foreground hover:text-foreground">
                    {selectedIds.includes(row.id) ? <CheckSquare className="w-4 h-4 text-primary" /> : <Square className="w-4 h-4" />}
                  </button>
                </TableCell>
                <TableCell className="font-mono text-xs font-semibold">{row.code}</TableCell>
                <TableCell className="font-medium">{row.title}</TableCell>
                <TableCell>{row.category}</TableCell>
                <TableCell>
                  <Badge variant={row.status === 'active' ? 'success' : row.status === 'pending' ? 'warning' : 'secondary'}>
                    {row.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-xs">{row.createdAt}</TableCell>
                <TableCell className="text-right">
                  <div className="inline-flex items-center gap-1">
                    <Button variant="ghost" size="icon" onClick={() => setDetailRecord(row)} aria-label="View Details">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(row)} aria-label="Edit Record">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeletingId(row.id)} aria-label="Delete Record">
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* 5. Create / Edit Record Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingRecord ? `Edit ${entityName}` : `Create New ${entityName}`}
        description="Provide required entity details below. Fields with * are mandatory."
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <Input
            label="Record Name / Title"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder={`e.g. John Doe / General Admission`}
          />
          <Input
            label="System Code / Reference ID"
            required
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            placeholder="e.g. ENT-94821"
          />
          <div className="space-y-1.5 text-left">
            <label className="block text-sm font-medium text-foreground">Operational Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingRecord ? 'Save Changes' : `Create ${entityName}`}
            </Button>
          </div>
        </form>
      </Modal>

      {/* 6. Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deletingId)}
        onClose={() => setDeletingId(null)}
        title="Confirm Deletion"
        description="Are you sure you want to permanently delete this record? This action cannot be reversed."
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setDeletingId(null)}>Cancel</Button>
            <Button variant="danger" size="sm" onClick={handleConfirmDelete}>Yes, Delete</Button>
          </>
        }
      >
        <div className="flex items-center gap-3 p-3 rounded-md bg-destructive/10 text-destructive text-xs">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>Deleting this record will archive any linked transactions and remove it from active reports.</span>
        </div>
      </Modal>

      {/* 7. Detail View Modal */}
      <Modal
        isOpen={Boolean(detailRecord)}
        onClose={() => setDetailRecord(null)}
        title={`${entityName} Specifications`}
        description={`Record identifier: ${detailRecord?.code || ''}`}
        footer={<Button variant="outline" size="sm" onClick={() => setDetailRecord(null)}>Close</Button>}
      >
        {detailRecord && (
          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-2 p-3 bg-muted/40 rounded-md">
              <div>
                <span className="text-muted-foreground block">Title:</span>
                <span className="font-semibold text-foreground">{detailRecord.title}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Code:</span>
                <span className="font-mono font-semibold text-foreground">{detailRecord.code}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Status:</span>
                <Badge variant={detailRecord.status === 'active' ? 'success' : 'warning'}>{detailRecord.status}</Badge>
              </div>
              <div>
                <span className="text-muted-foreground block">Created:</span>
                <span className="text-foreground">{detailRecord.createdAt}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
