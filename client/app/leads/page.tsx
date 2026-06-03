"use client";

import { useEffect, useState } from "react";

import api from "@/services/api";

import AppLayout from "@/components/layout/app-layout";

import { getStatusColor } from "@/lib/status-color";

import AddLeadDialog from "@/components/leads/add-lead-dialog";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

interface Lead {
  id: string;

  name: string;

  company?: string;

  email?: string;

  phone?: string;

  status: string;

  createdAt: string;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);

  const [, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("all");

  const [sortBy, setSortBy] = useState("newest");

  const [currentPage, setCurrentPage] = useState(1);

  const leadsPerPage = 5;

  const router = useRouter();

  const fetchLeads = async () => {
    try {
      const response = await api.get("/leads");

      setLeads(response.data);
    } catch {
      console.error("Failed to fetch leads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchLeads();
    };

    loadData();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const filteredLeads = leads
    .filter((lead) => {
      const matchesSearch =
        lead.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        lead.company?.toLowerCase().includes(debouncedSearch.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || lead.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }

      if (sortBy === "oldest") {
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      }

      if (sortBy === "az") {
        return a.name.localeCompare(b.name);
      }

      if (sortBy === "za") {
        return b.name.localeCompare(a.name);
      }

      return 0;
    });

  const totalPages = Math.ceil(filteredLeads.length / leadsPerPage);

  const paginatedLeads = filteredLeads.slice(
    (currentPage - 1) * leadsPerPage,

    currentPage * leadsPerPage,
  );

  return (
    <AppLayout>
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Leads</h1>

            <p className="text-gray-500 mt-1">
              Manage and track your sales leads
            </p>
          </div>

          <AddLeadDialog onLeadCreated={fetchLeads} />
        </div>

        <div className="flex gap-4 mb-6">
          <input
            type="text"
            placeholder="Search leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-lg px-4 py-2 w-full bg-white focus:ring-2 focus:ring-black/10 outline-none transition"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-lg px-4 py-2 bg-white"
          >
            <option value="all">All</option>

            <option value="new">New</option>

            <option value="contacted">Contacted</option>

            <option value="qualified">Qualified</option>

            <option value="proposal">Proposal</option>

            <option value="won">Won</option>

            <option value="lost">Lost</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border rounded-lg px-4 py-2 bg-white"
          >
            <option value="newest">Newest</option>

            <option value="oldest">Oldest</option>

            <option value="az">A-Z</option>

            <option value="za">Z-A</option>
          </select>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
          <table className="w-full">
          <thead className="bg-gray-50/80 border-b border-gray-100">
              <tr>
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Name</th>

                <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Company</th>

                <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Email</th>

                <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Phone</th>

                <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>

                <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginatedLeads.length > 0 ? (
                paginatedLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    onClick={() => {
                      router.push(`/leads/${lead.id}`);
                    }}
                    className="border-b border-gray-100 hover:bg-gray-50/70 transition-all duration-200 cursor-pointer"
                  >
                    <td className="p-4 font-semibold text-gray-900">
                      {lead.name}
                    </td>

                    <td className="p-4 text-gray-600">
                      {lead.company}
                    </td>

                    <td className="p-4 text-gray-600">
                      {lead.email}
                    </td>

                    <td className="p-4 text-gray-600">
                      {lead.phone}
                    </td>

                    <td className="p-4 text-gray-600">
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          lead.status,
                        )}`}
                      >
                        {lead.status}
                      </span>
                    </td>

                    <td className="p-4 text-gray-600">
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();

                          try {
                            await api.delete(
                              `/leads/${lead.id}`,
                            );

                            await fetchLeads();

                            toast.success(
                              "Lead deleted successfully",
                            );
                          } catch {
                            toast.error(
                              "Failed to delete lead",
                            );
                          }
                        }}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-20"
                  >
                    <div>
                      <p className="text-lg font-semibold text-gray-900">
                        No leads found
                      </p>

                      <p className="text-gray-500 mt-2">
                        Try adjusting your search or filters.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-6">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="border px-4 py-2 rounded-lg disabled:opacity-50"
          >
            Previous
          </button>

          <p className="text-sm text-gray-500">
            Page {currentPage} of {totalPages || 1}
          </p>

          <button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="border px-4 py-2 rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
