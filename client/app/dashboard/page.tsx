"use client";

import {
  useEffect,
  useState,
} from "react";

import AppLayout from "@/components/layout/app-layout";

import api from "@/services/api";

import { getStatusColor } from "@/lib/status-color";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
  } from "recharts";

interface Lead {
    id: string;
  
    name: string;
  
    company?: string;
  
    status: string;
  }
  
  interface DashboardTask {
    id: string;
  
    title: string;
  
    completed: boolean;
  
    dueDate?: string;
  
    lead: {
      name: string;
    };
  }

  interface Stats {
    totalLeads: number;
  
    activeLeads: number;
  
    newLeads: number;
  
    contactedLeads: number;
  
    qualifiedLeads: number;
  
    proposalLeads: number;
  
    wonLeads: number;
  
    lostLeads: number;
  
    recentLeads: Lead[];

    overdueTasks: number;

    recentTasks: DashboardTask[];
  }

export default function DashboardPage() {
  const [stats, setStats] =
    useState<Stats | null>(null);
  
    const chartData = [
        {
          stage: "New",
          value:
            stats?.newLeads || 0,
        },
      
        {
          stage: "Contacted",
          value:
            stats?.contactedLeads ||
            0,
        },
      
        {
          stage: "Qualified",
          value:
            stats?.qualifiedLeads ||
            0,
        },
      
        {
          stage: "Proposal",
          value:
            stats?.proposalLeads ||
            0,
        },
      
        {
          stage: "Won",
          value:
            stats?.wonLeads || 0,
        },
      
        {
          stage: "Lost",
          value:
            stats?.lostLeads || 0,
        },
      ];

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const fetchStats =
      async () => {
        try {
          const response =
            await api.get(
              "/dashboard/stats",
            );

          setStats(response.data);
        } catch {
          console.error(
            "Failed to fetch dashboard stats",
          );
        } finally {
          setLoading(false);
        }
      };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <AppLayout>
        <div className="space-y-6 animate-pulse">
          <div className="h-12 bg-gray-200 rounded-2xl w-64"></div>
  
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-36 bg-gray-200 rounded-3xl"
              />
            ))}
          </div>
  
          <div className="h-[350px] bg-gray-200 rounded-3xl"></div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          Overview of your CRM activity and sales performance.
        </p>
      </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
  <DashboardCard
    title="Total Leads"
    value={stats?.totalLeads || 0}
  />

  <DashboardCard
    title="Active Leads"
    value={stats?.activeLeads || 0}
  />

  <DashboardCard
    title="Won Deals"
    value={stats?.wonLeads || 0}
  />

  <DashboardCard
    title="Lost Deals"
    value={stats?.lostLeads || 0}
  />

  <DashboardCard
    title="New"
    value={stats?.newLeads || 0}
  />

  <DashboardCard
    title="Contacted"
    value={
      stats?.contactedLeads || 0
    }
  />

  <DashboardCard
    title="Qualified"
    value={
      stats?.qualifiedLeads || 0
    }
  />

  <DashboardCard
    title="Proposal"
    value={
      stats?.proposalLeads || 0
    }
  />

<DashboardCard
  title="Overdue Tasks"
  value={
    stats?.overdueTasks || 0
  }
/>
</div>

<div className="bg-white rounded-3xl border border-gray-100 p-6 mt-8 shadow-sm">
  <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-6">
    Pipeline Analytics
  </h2>

  <div className="h-[350px]">
    <ResponsiveContainer
      width="100%"
      height="100%"
    >
      <BarChart data={chartData}>
        <XAxis dataKey="stage" />

        <YAxis />

        <Tooltip />

        <Bar
          dataKey="value"
          radius={[8, 8, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  </div>
</div>

<div className="bg-white rounded-3xl border border-gray-100 p-6 mt-8 shadow-sm">
  <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-6">
    Recent Tasks
  </h2>

  <div className="space-y-4">
    {stats?.recentTasks?.map(
      (task) => {
        const isOverdue =
          task.dueDate &&
          !task.completed &&
          new Date(
            task.dueDate,
          ) < new Date();

        return (
          <div
            key={task.id}
            className={`flex items-center justify-between border border-gray-100 rounded-2xl p-4 transition-all duration-200 hover:shadow-sm ${
              isOverdue
                ? "border-red-300 bg-red-50"
                : ""
            }`}
          >
            <div>
              <p className="font-semibold text-gray-900">
                {task.title}
              </p>

              <p className="text-sm text-gray-500 mt-1">
                Lead:{" "}
                {task.lead.name}
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm">
                {task.completed
                  ? "Completed"
                  : "Pending"}
              </p>

              {task.dueDate && (
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(
                    task.dueDate,
                  ).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        );
      },
    )}
  </div>
</div>

<div className="bg-white rounded-3xl border border-gray-100 p-6 mt-8 shadow-sm">
  <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-6">
    Recent Leads
  </h2>

  <div className="space-y-4">
    {stats?.recentLeads?.map((lead) => (
      <div
        key={lead.id}
        className="flex items-center justify-between border-b border-gray-100 py-4 last:border-b-0"
      >
        <div>
          <p className="font-semibold text-gray-900">
            {lead.name}
          </p>

          <p className="text-sm text-gray-500 mt-1">
            {lead.company}
          </p>
        </div>

        <span
  className={`text-sm px-3 py-1 rounded-full font-medium ${getStatusColor(
    lead.status,
  )}`}
>
  {lead.status}
</span>
      </div>
    ))}
  </div>
</div>
      </div>
    </AppLayout>
  );
}

function DashboardCard({
    title,
    value,
  }: {
    title: string;
  
    value: number;
  }) {
    return (
      <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300">
        <p className="text-gray-400 text-xs font-semibold uppercase tracking-[0.2em]">
          {title}
        </p>
  
        <h2 className="text-5xl font-bold mt-4 tracking-tight text-[#111827]">
          {value}
        </h2>
      </div>
    );
  }