"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type LifeVaultDocument = {
  id: string;
  title: string;
  description: string | null;
  category: string;
  fileName: string;
  originalName: string;
  mimeType: string;
  fileSize: number;
  filePath: string;
  createdAt: string;
};

const categories = [
  "Documents",
  "Receipts",
  "Photos",
  "Certificates",
  "Invoices",
  "Other",
];

export default function LifeVaultManager() {
  const [documents, setDocuments] = useState<LifeVaultDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(categories[0]);

  const jwt = useMemo(() => {
    if (typeof window === "undefined") {
      return null;
    }
    return window.localStorage.getItem("jwt");
  }, []);

  useEffect(() => {
    loadDocuments();
  }, [jwt]);

  const filteredDocuments = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return documents;
    }

    return documents.filter((document) => {
      return [
        document.title,
        document.originalName,
        document.description,
        document.category,
      ]
        .filter(Boolean)
        .some((value) => value?.toLowerCase().includes(query));
    });
  }, [documents, search]);

  async function loadDocuments() {
    if (!jwt) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:4000/api/life-vault", {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      if (response.status === 401) {
        window.localStorage.removeItem("jwt");
        window.localStorage.removeItem("user");
        window.location.href = "/login";
        return;
      }

      if (!response.ok) {
        const result = await response.json().catch(() => null);
        setError(result?.message || result?.error || "Failed to load documents.");
        return;
      }

      const result = await response.json();
      setDocuments(result?.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load documents.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!jwt || !selectedFile) {
      setError("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    formData.append("category", category);

    setUploading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:4000/api/life-vault", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const result = await response.json().catch(() => null);
        setError(result?.message || result?.error || "Failed to upload file.");
        return;
      }

      setSelectedFile(null);
      setTitle("");
      setDescription("");
      setCategory(categories[0]);
      await loadDocuments();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload file.");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this document?")) {
      return;
    }

    if (!jwt) {
      window.location.href = "/login";
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/api/life-vault/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      if (!response.ok) {
        const result = await response.json().catch(() => null);
        setError(result?.message || result?.error || "Failed to delete document.");
        return;
      }

      await loadDocuments();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete document.");
    }
  }

  const formatFileSize = (size: number) => {
    if (size < 1024) {
      return `${size} B`;
    }
    if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    }
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Title</Label>
              <Input value={title} onChange={(event) => setTitle(event.target.value)} />
            </div>
            <div>
              <Label>Category</Label>
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="flex h-10 w-full rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-sm"
              >
                {categories.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <Label>Description</Label>
            <Input value={description} onChange={(event) => setDescription(event.target.value)} />
          </div>

          <div>
            <Label>File</Label>
            <Input
              type="file"
              onChange={(event) => setSelectedFile(event.target.files?.[0] || null)}
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex flex-wrap gap-2">
            <Button type="submit" disabled={uploading}>
              {uploading ? "Uploading..." : "Upload document"}
            </Button>
          </div>
        </form>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold">Documents</h3>
        </div>
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search documents"
          className="max-w-sm"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {loading ? (
          <div className="col-span-full rounded-3xl border border-zinc-200 bg-white p-6 text-center text-zinc-500">
            Loading documents...
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="col-span-full rounded-3xl border border-zinc-200 bg-white p-6 text-center text-zinc-500">
            No documents yet.
          </div>
        ) : (
          filteredDocuments.map((document) => (
            <div key={document.id} className="rounded-3xl border border-zinc-200 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-zinc-500">{document.category}</p>
                  <h3 className="mt-1 text-xl font-semibold">{document.title}</h3>
                </div>
                <Button type="button" variant="destructive" size="sm" onClick={() => handleDelete(document.id)}>
                  Delete
                </Button>
              </div>

              <p className="mt-2 text-sm text-zinc-500">{document.description || "No description"}</p>

              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-zinc-500">
                <span>{document.originalName}</span>
                <span>{formatFileSize(document.fileSize)}</span>
                <span>{new Date(document.createdAt).toLocaleDateString()}</span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Button type="button" variant="outline" size="sm" asChild>
                  <a href={`http://localhost:4000${document.filePath}`} target="_blank" rel="noreferrer">
                    Open
                  </a>
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
