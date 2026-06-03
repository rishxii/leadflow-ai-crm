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

export default function AddLeadDialog({
  onLeadCreated,
}: {
  onLeadCreated: () => void;
}) {
  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
  });

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      alert("Lead name is required");

      return;
    }
    try {
      await api.post("/leads", formData);

      onLeadCreated();

      setOpen(false);

      setFormData({
        name: "",
        company: "",
        email: "",
        phone: "",
      });
    } catch {
      console.error("Failed to create lead");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="bg-black text-white px-4 py-2 rounded-lg">
        Add Lead
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Lead</DialogTitle>
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

          <Button className="w-full" onClick={handleSubmit}>
            Create Lead
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
