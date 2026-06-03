"use client";

import {
  useEffect,
  useState,
} from "react";

import { useAuth } from "@/context/auth-context";

import api from "@/services/api";

interface Lead {
  id: string;

  name: string;

  company?: string;
}

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const [search, setSearch] =
    useState("");

  const [results, setResults] =
    useState<Lead[]>([]);

  const { user, logout } = useAuth();

  useEffect(() => {
    const fetchResults =
      async () => {
        if (!search.trim()) {
          setResults([]);
  
          return;
        }
  
        try {
          const response =
            await api.get(
              `/leads?search=${search}`,
            );
  
          setResults(response.data);
        } catch {
          console.error(
            "Search failed",
          );
        }
      };
  
    const timeout = setTimeout(
      fetchResults,
      300,
    );
  
    return () =>
      clearTimeout(timeout);
  }, [search]);

  return (
    <header className="h-16 bg-white border-b border-gray-100 px-8 flex items-center justify-between shadow-sm">
      <div>
        <h1 className="text-lg font-semibold text-gray-900">
          CRM Dashboard
        </h1>
      </div>

      <div className="flex items-center gap-4 relative">
      <div className="relative">
  <input
    type="text"
    placeholder="Search leads..."
    value={search}
    onChange={(e) =>
      setSearch(e.target.value)
    }
    className="w-72 bg-gray-50 border border-gray-100 rounded-2xl px-4 py-2 outline-none focus:ring-2 focus:ring-black/10 transition"
  />

  {results.length > 0 && (
    <div className="absolute top-14 left-0 w-full bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden z-50">
      {results.map((lead) => (
        <a
          key={lead.id}
          href={`/leads/${lead.id}`}
          className="block px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
        >
          <p className="font-medium text-gray-900">
            {lead.name}
          </p>

          <p className="text-sm text-gray-500 mt-1">
            {lead.company}
          </p>
        </a>
      ))}
    </div>
  )}
</div>

        <button
          onClick={() => setOpen(!open)}
          className="w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-700 font-medium hover:bg-gray-50 transition-colors"
        >
          {user?.name?.charAt(0) || "U"}
        </button>

        {open && (
          <div className="absolute right-0 top-14 w-64 bg-white border border-gray-100 rounded-3xl shadow-xl p-5 z-50">
            <div className="mb-4">
              <p className="font-semibold text-gray-900">
                {user?.name}
              </p>

              <p className="text-sm text-gray-500 mt-1">
                {user?.email}
              </p>
            </div>

            <button
              onClick={logout}
              className="w-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors rounded-2xl py-2 text-sm font-medium"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}