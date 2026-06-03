"use client";

import { useEffect, useState, useCallback } from "react";

import { useParams } from "next/navigation";

import api from "@/services/api";

import AppLayout from "@/components/layout/app-layout";

import { Input } from "@/components/ui/input";
import EditLeadDialog from "@/components/leads/edit-lead-dialog";

import { getStatusColor } from "@/lib/status-color";

interface Note {
  id: string;
  content: string;
  createdAt: string;
}

interface Lead {
  id: string;
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  status: string;

  notes: Note[];
  tasks: Task[];
}

interface Task {
  id: string;

  title: string;

  completed: boolean;

  dueDate?: string;

  createdAt: string;
}

export default function LeadDetailPage() {
  const params = useParams();

  const [lead, setLead] = useState<Lead | null>(null);

  const [loading, setLoading] = useState(true);

  const [noteContent, setNoteContent] = useState("");

  const [taskTitle, setTaskTitle] = useState("");

  const [dueDate, setDueDate] = useState("");

  const [aiSummary, setAiSummary] = useState("");

  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState("");

  const [suggestionLoading, setSuggestionLoading] = useState(false);

  const generateSummary = async () => {
    if (!lead) return;

    try {
      setAiLoading(true);

      const response = await api.post(`/ai/summary/${lead.id}`);

      setAiSummary(response.data.summary);
    } catch (error: unknown) {
      console.error("AI Summary Error:", error);
    } finally {
      setAiLoading(false);
    }
  };

  const generateSuggestion = async () => {
    if (!lead) return;

    try {
      setSuggestionLoading(true);

      const response = await api.post(`/ai/followup/${lead.id}`);

      setAiSuggestion(response.data.suggestion);
    } catch (error: unknown) {
      console.error("AI Suggestion Error:", error);
    } finally {
      setSuggestionLoading(false);
    }
  };

  const fetchLead = useCallback(async () => {
    try {
      const response = await api.get(`/leads/${params.id}`);

      setLead(response.data);
    } catch {
      console.error("Failed to fetch lead");
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  const createNote = async () => {
    if (!lead || !noteContent.trim()) {
      return;
    }

    try {
      await api.post("/notes", {
        content: noteContent,
        leadId: lead.id,
      });

      setNoteContent("");

      await fetchLead();
    } catch {
      console.error("Failed to create note");
    }
  };

  const createTask = async () => {
    if (!lead || !taskTitle.trim()) {
      return;
    }

    try {
      await api.post("/tasks", {
        title: taskTitle,

        dueDate,

        leadId: lead.id,
      });

      setTaskTitle("");

      setDueDate("");

      await fetchLead();
    } catch {
      console.error("Failed to create task");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      await fetchLead();
    };

    if (params.id) {
      loadData();
    }
  }, [fetchLead, params.id]);

  if (loading) {
    return <div className="p-6">Loading lead...</div>;
  }

  if (!lead) {
    return <div className="p-6">Lead not found</div>;
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">{lead.name}</h1>

              <p className="text-gray-500 mt-1">{lead.company}</p>
            </div>

            <div className="flex items-center gap-3">
            <span
  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
    lead.status,
  )}`}
>
  {lead.status}
</span>

              <EditLeadDialog lead={lead} onUpdated={fetchLead} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-xl font-semibold mb-4">Contact Information</h2>

          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Email</p>

              <p>{lead.email}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Phone</p>

              <p>{lead.phone}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-xl font-semibold mb-4">Notes</h2>

          <div className="flex gap-3 mb-6">
            <Input
              placeholder="Write a note..."
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
            />

            <button
              onClick={createNote}
              className="bg-black text-white px-4 rounded-lg"
            >
              Add
            </button>
          </div>

          <div className="space-y-3">
            {lead.notes.map((note) => (
              <div key={note.id} className="border rounded-lg p-4">
                <p>{note.content}</p>

                <p className="text-xs text-gray-500 mt-2">
                  {new Date(note.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-xl font-semibold mb-4">Tasks</h2>

          <div className="flex gap-3 mb-6">
            <Input
              placeholder="Task title..."
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
            />

            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />

            <button
              onClick={createTask}
              className="bg-black text-white px-4 rounded-lg"
            >
              Add
            </button>
          </div>

          <div className="space-y-3">
            {lead.tasks.map((task) => {
              const isOverdue =
                task.dueDate &&
                !task.completed &&
                new Date(task.dueDate) < new Date();

              return (
                <div
                  key={task.id}
                  className={`border rounded-lg p-4 flex items-center justify-between ${
                    isOverdue ? "border-red-300 bg-red-50" : ""
                  }`}
                >
                  <div>
                    <p
                      className={`font-medium ${
                        task.completed ? "line-through text-gray-400" : ""
                      }`}
                    >
                      {task.title}
                    </p>

                    {task.dueDate && (
                      <p className="text-sm text-gray-500 mt-1">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={async (e) => {
                        try {
                          await api.put(`/tasks/${task.id}`, {
                            completed: e.target.checked,
                          });

                          await fetchLead();
                        } catch {
                          console.error("Failed to update task");
                        }
                      }}
                    />

                    <button
                      onClick={async () => {
                        try {
                          await api.delete(`/tasks/${task.id}`);

                          await fetchLead();
                        } catch {
                          console.error("Failed to delete task");
                        }
                      }}
                      className="text-red-600 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">AI Summary</h2>

            <button
              onClick={generateSummary}
              disabled={aiLoading}
              className="bg-black text-white px-4 py-2 rounded-lg disabled:opacity-50"
            >
              {aiLoading ? "Generating..." : "Generate AI Summary"}
            </button>
          </div>

          {aiSummary ? (
            <div className="border rounded-lg p-4 bg-gray-50 whitespace-pre-wrap">
              {aiSummary}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">
              No AI summary generated yet.
            </p>
          )}
        </div>

        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">AI Follow-Up Suggestions</h2>

            <button
              onClick={generateSuggestion}
              disabled={suggestionLoading}
              className="bg-black text-white px-4 py-2 rounded-lg disabled:opacity-50"
            >
              {suggestionLoading ? "Generating..." : "Generate Suggestions"}
            </button>
          </div>

          {aiSuggestion ? (
            <div className="border rounded-lg p-4 bg-gray-50 whitespace-pre-wrap">
              {aiSuggestion}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">
              No AI suggestions generated yet.
            </p>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
