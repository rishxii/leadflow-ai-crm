"use client";

import { useState } from "react";

import api from "@/services/api";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Lead {
  id: string;

  name: string;

  company?: string;

  email?: string;

  phone?: string;

  status: string;
}

export default function EditLeadDialog({
  lead,
  onUpdated,
}: {
  lead: Lead;

  onUpdated: () => void;
}) {
  const [open, setOpen] =
    useState(false);

  const [formData, setFormData] =
    useState({
      name: lead.name,

      company: lead.company || "",

      email: lead.email || "",

      phone: lead.phone || "",

      status: lead.status,
    });

  const handleUpdate =
    async () => {
      if (!formData.name.trim()) {
        alert("Lead name is required");

        return;
      }

      try {
        await api.put(
          `/leads/${lead.id}`,
          formData,
        );

        onUpdated();

        setOpen(false);
      } catch {
        console.error(
          "Failed to update lead",
        );
      }
    };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition">
        Edit Lead
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Edit Lead
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <Input
            placeholder="Name"
            value={formData.name}
            onChange={(e) =>
              setFormData({
                ...formData,

                name: e.target.value,
              })
            }
          />

          <Input
            placeholder="Company"
            value={formData.company}
            onChange={(e) =>
              setFormData({
                ...formData,

                company: e.target.value,
              })
            }
          />

          <Input
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({
                ...formData,

                email: e.target.value,
              })
            }
          />

          <Input
            placeholder="Phone"
            value={formData.phone}
            onChange={(e) =>
              setFormData({
                ...formData,

                phone: e.target.value,
              })
            }
          />

          <select
            value={formData.status}
            onChange={(e) =>
              setFormData({
                ...formData,

                status:
                  e.target.value,
              })
            }
            className="w-full border rounded-lg px-4 py-3 bg-white"
          >
            <option value="new">
  New
</option>

<option value="contacted">
  Contacted
</option>

<option value="qualified">
  Qualified
</option>

<option value="proposal">
  Proposal
</option>

<option value="won">
  Won
</option>

<option value="lost">
  Lost
</option>
          </select>

          <Button
            className="w-full"
            onClick={handleUpdate}
          >
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}