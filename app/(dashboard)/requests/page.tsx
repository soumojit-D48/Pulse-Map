


// app/(dashboard)/requests/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Filter, Trash2, Edit } from 'lucide-react';
import BloodGroupBadge from '@/components/dashboard/BloodGroupBadge';
import UrgencyBadge from '@/components/dashboard/UrgencyBadge';
import EditRequestDialog from '@/components/requests/EditRequestDialog';
import DeleteRequestDialog from '@/components/requests/DeleteRequestDialog';

interface Request {
  id: string;
  patientName: string;
  bloodGroup: string;
  urgency: string;
  unitsNeeded: number;
  hospitalName?: string | null;
  patientLocationName: string;
  contactPhone: string;
  status: string;
  createdAt: string;
  patientLatitude?: number;
  patientLongitude?: number;
  notes?: string | null;
  responses: {
    id: string;
    donor: {
      id: string;
      name: string;
      phone: string;
      bloodGroup: string;
    };
  }[];
}

export default function RequestsPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'FULFILLED' | 'CANCELLED'>('ALL');
  
  // Edit dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  
  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteRequestId, setDeleteRequestId] = useState<string | null>(null);
  const [deletePatientName, setDeletePatientName] = useState<string>('');

  useEffect(() => {
    fetchRequests();
  }, [filter]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const url = filter === 'ALL' ? '/api/requests' : `/api/requests?status=${filter}`;
      const response = await fetch(url);
      const data = await response.json();
      setRequests(data.requests || []);
    } catch (error) {
      console.error('Failed to fetch requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (request: Request) => {
    setSelectedRequest(request);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (request: Request) => {
    setDeleteRequestId(request.id);
    setDeletePatientName(request.patientName);
    setDeleteDialogOpen(true);
  };

  const handleEditSuccess = () => {
    fetchRequests(); // Refresh the list
  };

  const handleDeleteSuccess = () => {
    fetchRequests(); // Refresh the list
  };

  const getStatusBadge = (status: string) => {
    const config = {
      ACTIVE: 'bg-green-100 text-green-800 border-green-200',
      FULFILLED: 'bg-blue-100 text-blue-800 border-blue-200',
      CANCELLED: 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return config[status as keyof typeof config] || config.ACTIVE;
  };

  const getTimeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Requests</h1>
          <p className="text-muted-foreground mt-2">
            Manage your blood donation requests
          </p>
        </div>
        <Link
          href="/requests/new"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary-dark transition shadow-glow"
        >
          <Plus size={20} />
          Create Request
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-lg shadow-soft p-4">
        <div className="flex items-center gap-3 flex-wrap">
          <Filter size={20} className="text-muted-foreground" />
          <button
            onClick={() => setFilter('ALL')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'ALL'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('ACTIVE')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'ACTIVE'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('FULFILLED')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'FULFILLED'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            Fulfilled
          </button>
          <button
            onClick={() => setFilter('CANCELLED')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'CANCELLED'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            Cancelled
          </button>
        </div>
      </div>

      {/* Requests List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground mt-4">Loading requests...</p>
        </div>
      ) : requests.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {requests.map((request) => (
            <div
              key={request.id}
              className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <BloodGroupBadge bloodGroup={request.bloodGroup} size="lg" />
                  <div>
                    <h3 className="font-semibold text-card-foreground text-lg">
                      {request.patientName}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {request.unitsNeeded} {request.unitsNeeded === 1 ? 'unit' : 'units'} needed
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <UrgencyBadge urgency={request.urgency} size="sm" />
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadge(
                      request.status
                    )}`}
                  >
                    {request.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {request.hospitalName && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>🏥</span>
                    <span>{request.hospitalName}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>📍</span>
                  <span className="truncate">{request.patientLocationName}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>📞</span>
                  <span>{request.contactPhone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>🕒</span>
                  <span>{getTimeAgo(request.createdAt)}</span>
                </div>
              </div>

              {/* Responses */}
              <div className="border-t border-border pt-4">
                {request.responses.length > 0 ? (
                  <div>
                    <p className="text-sm font-medium text-card-foreground mb-3">
                      {request.responses.length}{' '}
                      {request.responses.length === 1 ? 'donor has' : 'donors have'} responded
                    </p>
                    <div className="space-y-2">
                      {request.responses.map((response) => (
                        <div
                          key={response.id}
                          className="flex items-center justify-between bg-muted/30 rounded-lg p-3"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                              <span className="text-primary font-semibold">
                                {response.donor.name.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-card-foreground">{response.donor.name}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <BloodGroupBadge bloodGroup={response.donor.bloodGroup} size="sm" />
                                <span className="text-sm text-muted-foreground">
                                  {response.donor.phone}
                                </span>
                              </div>
                            </div>
                          </div>
                          <a
                            href={`tel:${response.donor.phone}`}
                            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary-dark transition"
                          >
                            Call
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No donors have responded yet</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                <Link
                  href={`/requests/${request.id}`}
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground text-center rounded-lg font-medium hover:bg-primary-dark transition"
                >
                  View Details
                </Link>
                
                {request.status === 'ACTIVE' && (
                  <>
                    <button
                      onClick={() => handleEditClick(request)}
                      className="px-4 py-2 bg-muted text-card-foreground rounded-lg font-medium hover:bg-muted/80 transition inline-flex items-center gap-2"
                    >
                      <Edit size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(request)}
                      className="px-4 py-2 border border-destructive text-destructive rounded-lg font-medium hover:bg-destructive/10 transition inline-flex items-center gap-2"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-card rounded-lg shadow-soft">
          <div className="w-16 h-16 bg-muted rounded-full mx-auto flex items-center justify-center mb-4">
            <span className="text-3xl">📋</span>
          </div>
          <p className="text-card-foreground font-medium">No requests found</p>
          <p className="text-sm text-muted-foreground mt-1">
            {filter === 'ALL'
              ? "You haven't created any requests yet"
              : `No ${filter.toLowerCase()} requests`}
          </p>
          <Link
            href="/requests/new"
            className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary-dark transition"
          >
            <Plus size={20} />
            Create Your First Request
          </Link>
        </div>
      )}

      {/* Edit Dialog */}
      <EditRequestDialog
        request={selectedRequest}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSuccess={handleEditSuccess}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteRequestDialog
        requestId={deleteRequestId}
        patientName={deletePatientName}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  );
}