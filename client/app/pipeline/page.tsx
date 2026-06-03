"use client";

import {
  useEffect,
  useState,
} from "react";

import AppLayout from "@/components/layout/app-layout";

import api from "@/services/api";

import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";

import { getStatusColor } from "@/lib/status-color";

interface Lead {
  id: string;

  name: string;

  company?: string;

  status: string;
}

export default function PipelinePage() {
  const [leads, setLeads] =
    useState<Lead[]>([]);

  const [loading, setLoading] =
    useState(true);

  const fetchLeads = async () => {
    try {
      const response =
        await api.get("/leads");

      setLeads(response.data);
    } catch {
      console.error(
        "Failed to fetch leads",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const groupedLeads = {
    new: leads.filter(
      (lead) =>
        lead.status === "new",
    ),
  
    contacted: leads.filter(
      (lead) =>
        lead.status ===
        "contacted",
    ),
  
    qualified: leads.filter(
      (lead) =>
        lead.status ===
        "qualified",
    ),
  
    proposal: leads.filter(
      (lead) =>
        lead.status ===
        "proposal",
    ),
  
    won: leads.filter(
      (lead) =>
        lead.status === "won",
    ),
  
    lost: leads.filter(
      (lead) =>
        lead.status === "lost",
    ),
  };

  const onDragEnd = async (
    result: any,
  ) => {
    if (!result.destination) {
      return;
    }

    const leadId =
      result.draggableId;

    const newStatus =
      result.destination
        .droppableId;

    const updatedLeads =
      leads.map((lead) =>
        lead.id === leadId
          ? {
              ...lead,

              status: newStatus,
            }
          : lead,
      );

    setLeads(updatedLeads);

    try {
      await api.put(
        `/leads/${leadId}`,
        {
          status: newStatus,
        },
      );
    } catch {
      console.error(
        "Failed to update lead status",
      );

      fetchLeads();
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="space-y-6 animate-pulse">
          <div className="h-12 bg-gray-200 rounded-2xl w-72"></div>
  
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-[500px] bg-gray-200 rounded-3xl"
              />
            ))}
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          Sales Pipeline
        </h1>

        <p className="text-gray-500 mt-2">
          Track lead progress across your sales workflow.
        </p>
      </div>

        <DragDropContext
          onDragEnd={onDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-6">
            {Object.entries(
              groupedLeads,
            ).map(
              ([status, leads]) => (
                <Droppable
                  droppableId={
                    status
                  }
                  key={status}
                >
                  {(provided) => (
                    <div
                      ref={
                        provided.innerRef
                      }
                      {...provided.droppableProps}
                      className="bg-white rounded-3xl border border-gray-100 p-5 min-h-[500px] shadow-sm"
                    >
                      <div className="flex items-center justify-between mb-5">
                        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                          {status}
                        </h2>

                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                          {leads.length}
                        </span>
                      </div>

                      <div className="space-y-4">
                        {leads.map(
                          (
                            lead,
                            index,
                          ) => (
                            <Draggable
                              key={
                                lead.id
                              }
                              draggableId={
                                lead.id
                              }
                              index={
                                index
                              }
                            >
                              {(
                                provided,
                              ) => (
                                <div
  ref={provided.innerRef}
  {...provided.draggableProps}
  {...provided.dragHandleProps}
  className="bg-gray-50 rounded-2xl border border-gray-100 p-4 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.01] transition-all duration-300 cursor-grab active:cursor-grabbing active:scale-[0.99]"
>
  <div className="flex items-start justify-between">
    <div>
      <p className="font-semibold">
        {lead.name}
      </p>

      <p className="text-sm text-gray-500 mt-1">
        {lead.company}
      </p>
    </div>

    <span
  className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(
    lead.status,
  )}`}
>
  {lead.status}
</span>
  </div>
</div>
                              )}
                            </Draggable>
                          ),
                        )}

                        {
                          provided.placeholder
                        }
                      </div>
                    </div>     
                  )}
                </Droppable>
              ),
            )}
          </div>
        </DragDropContext>
      </div>
    </AppLayout>
  );
} 