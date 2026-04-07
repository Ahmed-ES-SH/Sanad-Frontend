"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  getAdminProjects,
  deleteProject,
  togglePublishStatus,
  toggleFeatureStatus,
} from "@/app/actions/portfolioActions";
import type { Project } from "@/app/types/project";
import TopNavBar from "@/app/_components/_dashboard/DashboardPage/TopNavBar";
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiEyeOff, FiStar, FiLoader } from "react-icons/fi";

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const limit = 10;

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getAdminProjects({ page, limit });
      setProjects(result.data);
      setTotalPages(result.meta.totalPages);
      setTotal(result.meta.total);
    } catch {
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;

    setDeletingId(id);
    try {
      const result = await deleteProject(id);
      if (result.success) {
        toast.success(result.message);
        setProjects((prev) => prev.filter((p) => p.id !== id));
        setTotal((t) => t - 1);
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Failed to delete project");
    } finally {
      setDeletingId(null);
    }
  };

  const handleTogglePublish = async (id: string) => {
    setActionLoading(id);
    try {
      const result = await togglePublishStatus(id);
      if (result.success) {
        toast.success(result.message);
        setProjects((prev) =>
          prev.map((p) =>
            p.id === id ? { ...p, isPublished: !p.isPublished } : p
          )
        );
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Failed to toggle publish status");
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleFeature = async (id: string) => {
    setActionLoading(id);
    try {
      const result = await toggleFeatureStatus(id);
      if (result.success) {
        toast.success(result.message);
        setProjects((prev) =>
          prev.map((p) =>
            p.id === id ? { ...p, isFeatured: !p.isFeatured } : p
          )
        );
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Failed to toggle feature status");
    } finally {
      setActionLoading(null);
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/en/dashboard/projects/${id}/edit`);
  };

  const handleCreate = () => {
    router.push(`/en/dashboard/projects/add`);
  };

  if (loading) {
    return (
      <>
        <TopNavBar />
        <main className="flex-1 overflow-y-auto p-6 md:p-8 flex items-center justify-center min-h-[60vh]">
          <FiLoader className="animate-spin text-stone-400" size={32} />
        </main>
      </>
    );
  }

  return (
    <>
      <TopNavBar />
      <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-stone-900">
              Portfolio Projects
            </h2>
            <p className="text-stone-500 mt-1 text-lg">
              {total} project{total !== 1 ? "s" : ""} — manage your portfolio
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleCreate}
              className="bg-gradient-to-br from-orange-500 to-amber-500 text-white font-bold py-2.5 px-5 rounded-md flex items-center gap-2 shadow-sm hover:shadow-lg hover:shadow-orange-500/20 active:scale-95 transition-all"
            >
              <FiPlus size={18} />
              Add New Project
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-lg font-medium text-stone-500 mb-2">
                No projects yet
              </p>
              <p className="text-sm text-stone-400 mb-6">
                Create your first project to start building your portfolio
              </p>
              <button
                onClick={handleCreate}
                className="bg-orange-500 text-white font-medium py-2 px-6 rounded-md hover:bg-orange-600 transition-colors flex items-center gap-2"
              >
                <FiPlus size={16} />
                Create Project
              </button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-stone-50 text-stone-500">
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">
                        Featured
                      </th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-50">
                    {projects.map((project) => (
                      <tr
                        key={project.id}
                        className="hover:bg-stone-50/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-bold text-stone-900 truncate max-w-xs">
                              {project.title}
                            </p>
                            <p className="text-xs text-stone-400 truncate max-w-xs">
                              {project.shortDescription}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-stone-100 text-stone-700">
                            {project.category?.name || "—"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                              project.isPublished
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {project.isPublished ? "Published" : "Draft"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleToggleFeature(project.id)}
                            disabled={actionLoading === project.id}
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                              project.isFeatured
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-stone-100 text-stone-500 hover:bg-yellow-50"
                            } disabled:opacity-50`}
                          >
                            <FiStar
                              size={12}
                              className={
                                project.isFeatured ? "fill-yellow-600" : ""
                              }
                            />
                            {project.isFeatured ? "Yes" : "No"}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-sm text-stone-500">
                          {new Date(project.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-1">
                            {/* Toggle publish */}
                            <button
                              onClick={() => handleTogglePublish(project.id)}
                              disabled={actionLoading === project.id}
                              title={
                                project.isPublished
                                  ? "Unpublish"
                                  : "Publish"
                              }
                              className="p-2 rounded-md text-stone-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors disabled:opacity-50"
                            >
                              {project.isPublished ? (
                                <FiEye size={16} />
                              ) : (
                                <FiEyeOff size={16} />
                              )}
                            </button>

                            {/* Edit */}
                            <button
                              onClick={() => handleEdit(project.id)}
                              title="Edit"
                              className="p-2 rounded-md text-stone-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            >
                              <FiEdit2 size={16} />
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() =>
                                handleDelete(project.id, project.title)
                              }
                              disabled={deletingId === project.id}
                              title="Delete"
                              className="p-2 rounded-md text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                            >
                              <FiTrash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 bg-stone-50 flex items-center justify-between">
                  <p className="text-xs font-medium text-stone-500">
                    Page {page} of {totalPages} ({total} total)
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-3 py-1.5 rounded bg-white text-xs font-bold border border-stone-200 text-stone-700 hover:bg-stone-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    {Array.from({ length: Math.min(totalPages, 5) }).map(
                      (_, i) => {
                        const pageNum = i + 1;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setPage(pageNum)}
                            className={`px-3 py-1.5 rounded text-xs font-bold border transition-colors ${
                              pageNum === page
                                ? "bg-orange-500 text-white border-orange-500"
                                : "bg-white border-stone-200 text-stone-700 hover:bg-stone-100"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      }
                    )}
                    <button
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={page === totalPages}
                      className="px-3 py-1.5 rounded bg-white text-xs font-bold border border-stone-200 text-stone-700 hover:bg-stone-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
}
