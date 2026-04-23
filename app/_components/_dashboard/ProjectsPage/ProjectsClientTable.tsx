"use client";

import React, { useState, useEffect } from "react";
import { Project, PaginationMeta } from "@/app/types/project";
import { Category } from "@/app/types/blog";
import { useAppQuery } from "@/lib/hooks/useAppQuery";
import { PORTFOLIO_ENDPOINTS } from "@/app/constants/endpoints";
import ProjectsFilterBar from "./ProjectsFilterBar";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiEdit,
  FiTrash2,
  FiExternalLink,
  FiImage,
  FiPlus,
} from "react-icons/fi";
import { FaStar, FaRegStar } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { instance } from "@/lib/axios";

export interface ProjectsClientTableProps {
  initialProjects: Project[];
  initialMeta: PaginationMeta;
  categories: Category[];
}

export default function ProjectsClientTable({
  initialProjects,
  initialMeta,
  categories,
}: ProjectsClientTableProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [meta, setMeta] = useState<PaginationMeta>(initialMeta);

  const [page, setPage] = useState(initialMeta.page || 1);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [selectedCategory, debouncedSearchQuery]);

  const params = new URLSearchParams();
  params.set("page", page.toString());
  params.set("limit", "20"); // Ensure limit matches initial payload from page.tsx
  if (selectedCategory) params.set("categoryId", selectedCategory);
  if (debouncedSearchQuery) params.set("search", debouncedSearchQuery);

  const endpoint = `${PORTFOLIO_ENDPOINTS.ADMIN_LIST}?${params.toString()}`;

  const { data, isFetching } = useAppQuery<{
    data: Project[];
    meta: PaginationMeta;
  }>({
    queryKey: ["admin_projects", page, selectedCategory, debouncedSearchQuery],
    endpoint,
    config: { credentials: "include" },
    options: {
      ...(page === 1 && selectedCategory === "" && debouncedSearchQuery === ""
        ? {
            initialData: { data: initialProjects, meta: initialMeta },
          }
        : {}),
    },
  });

  useEffect(() => {
    if (data) {
      setProjects(data.data);
      setMeta(data.meta);
    }
  }, [data]);

  const isLoading = isFetching;

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= meta.totalPages) {
      setPage(newPage);
    }
  };

  const openDeleteModal = (project: Project) => {
    setProjectToDelete(project);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setProjectToDelete(null);
  };

  const confirmDelete = async () => {
    if (!projectToDelete) return;
    setIsDeleting(true);
    try {
      await instance.delete(
        `${PORTFOLIO_ENDPOINTS.ADMIN_LIST}/${projectToDelete.id}`,
      );
      // Remove from UI immediately
      setProjects((prev) => prev.filter((p) => p.id !== projectToDelete.id));
      setMeta((prev) => ({ ...prev, total: prev.total - 1 }));
      closeDeleteModal();
    } catch (error) {
      console.error("Failed to delete project:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className=" w-fit ml-auto">
        <Link
          href="/dashboard/addproject"
          className="flex items-center justify-center gap-2 px-6 py-2 rounded-lg text-white font-medium text-sm shadow-button transition-transform hover:scale-[1.02] active:scale-[0.98]"
          style={{ background: "var(--gradient-primary)" }}
        >
          <FiPlus className="w-4 h-4" />
          <span>New Project</span>
        </Link>
      </div>
      <ProjectsFilterBar
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={(val) => {
          setSelectedCategory(val);
          setPage(1);
        }}
        searchQuery={searchQuery}
        onSearchChange={(val) => {
          setSearchQuery(val);
          setPage(1);
        }}
      />

      <div className="surface-card rounded-xl shadow-surface-md border border-[var(--surface-card-border)] overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-start border-collapse">
            <thead>
              <tr className="bg-[var(--surface-50)] border-b border-[var(--surface-card-border)]">
                <th className="font-plus-jakarta text-xs font-semibold text-stone-500 uppercase tracking-wider py-4 px-6 text-start">
                  Project
                </th>
                <th className="font-plus-jakarta text-xs font-semibold text-stone-500 uppercase tracking-wider py-4 px-6 text-start">
                  Category
                </th>
                <th className="font-plus-jakarta text-xs font-semibold text-stone-500 uppercase tracking-wider py-4 px-6 text-start">
                  Status
                </th>
                <th className="font-plus-jakarta text-xs font-semibold text-stone-500 uppercase tracking-wider py-4 px-6 text-start">
                  Featured
                </th>
                <th className="font-plus-jakarta text-xs font-semibold text-stone-500 uppercase tracking-wider py-4 px-6 text-end">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--surface-card-border)]">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={`skeleton-${idx}`} className="bg-white">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4 animate-pulse">
                        <div className="w-12 h-12 rounded-lg bg-stone-200 flex-shrink-0"></div>
                        <div className="space-y-2 flex-1">
                          <div className="h-4 bg-stone-200 rounded w-32"></div>
                          <div className="h-3 bg-stone-100 rounded w-48"></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="w-24 h-6 bg-stone-200 rounded-full animate-pulse"></div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="w-20 h-6 bg-stone-200 rounded-full animate-pulse"></div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="w-8 h-8 bg-stone-200 rounded-md animate-pulse"></div>
                    </td>
                    <td className="py-4 px-6 text-end">
                      <div className="flex items-center justify-end gap-2 animate-pulse">
                        <div className="w-8 h-8 bg-stone-200 rounded-lg"></div>
                        <div className="w-8 h-8 bg-stone-200 rounded-lg"></div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : projects.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-12 text-center text-stone-500 font-inter"
                  >
                    No projects found matching your criteria.
                  </td>
                </tr>
              ) : (
                projects.map((project, index) => (
                  <motion.tr
                    key={project.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="hover:bg-stone-50/80 transition-colors group bg-white"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-stone-100 border border-[var(--surface-card-border)] flex-shrink-0 flex items-center justify-center shadow-surface-sm">
                          {project.coverImageUrl ? (
                            <Image
                              src={project.coverImageUrl}
                              alt={project.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <FiImage className="w-5 h-5 text-stone-400" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-plus-jakarta font-semibold text-stone-900 group-hover:text-[var(--primary)] transition-colors">
                            {project.title}
                          </h3>
                          <p className="font-inter text-xs text-stone-500 truncate max-w-[250px]">
                            {project.shortDescription}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--surface-50)] text-stone-700 font-inter border border-[var(--surface-card-border)]">
                        {project.category?.name || "Uncategorized"}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium font-inter border ${project.isPublished ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-stone-50 text-stone-600 border-stone-200"}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${project.isPublished ? "bg-emerald-500" : "bg-stone-400"}`}
                        ></span>
                        {project.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <button
                        className={`p-1.5 rounded-md transition-colors ${project.isFeatured ? "text-amber-500 bg-amber-50" : "text-stone-400 hover:text-amber-500 hover:bg-stone-50"}`}
                        title={project.isFeatured ? "Featured" : "Not Featured"}
                      >
                        {project.isFeatured ? (
                          <FaStar className="w-5 h-5" />
                        ) : (
                          <FaRegStar className="w-5 h-5" />
                        )}
                      </button>
                    </td>
                    <td className="py-4 px-6 text-end">
                      <div className="flex items-center justify-end gap-2">
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 text-stone-400 hover:text-[var(--primary)] hover:bg-orange-50 rounded-lg transition-colors"
                            title="View Live Site"
                          >
                            <FiExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        <Link
                          href={`/dashboard/projects/${project.id}/edit`}
                          className="p-2 text-stone-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Edit Project"
                        >
                          <FiEdit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => openDeleteModal(project)}
                          className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Project"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="border-t border-[var(--surface-card-border)] bg-[var(--surface-50)] py-4 px-6 flex items-center justify-between">
          <p className="font-inter text-sm text-stone-500">
            Showing{" "}
            <span className="font-medium text-stone-900">
              {projects.length}
            </span>{" "}
            of <span className="font-medium text-stone-900">{meta.total}</span>{" "}
            results
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1 || isLoading}
              className="px-3 py-1.5 rounded-lg border border-[var(--surface-card-border)] bg-white text-sm font-medium text-stone-700 hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-inter shadow-surface-sm"
            >
              Previous
            </button>
            <div className="flex items-center gap-1 hidden sm:flex">
              {Array.from({ length: Math.min(5, meta.totalPages) }).map(
                (_, i) => {
                  let pageNum = page - 2 + i;
                  if (page <= 2) pageNum = i + 1;
                  else if (page >= meta.totalPages - 1)
                    pageNum = meta.totalPages - 4 + i;

                  if (pageNum > 0 && pageNum <= meta.totalPages) {
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors font-inter flex items-center justify-center ${page === pageNum ? "bg-[var(--primary)] text-white shadow-button" : "text-stone-600 hover:bg-white border border-transparent hover:border-[var(--surface-card-border)]"}`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                  return null;
                },
              )}
            </div>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={
                page === meta.totalPages || isLoading || meta.totalPages === 0
              }
              className="px-3 py-1.5 rounded-lg border border-[var(--surface-card-border)] bg-white text-sm font-medium text-stone-700 hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-inter shadow-surface-sm"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteModalOpen && projectToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col"
            >
              <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
                <h4 className="font-bold text-red-600 flex items-center gap-2">
                  <FiTrash2 size={18} /> Confirm Deletion
                </h4>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-stone-600 text-sm leading-relaxed">
                  Are you sure you want to delete the project{" "}
                  <strong>{projectToDelete.title}</strong>? This action cannot
                  be undone and will permanently remove the project and its
                  media from the system.
                </p>
              </div>
              <div className="px-6 py-4 bg-stone-50 border-t border-stone-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeDeleteModal}
                  disabled={isDeleting}
                  className="px-4 py-2 rounded-lg text-sm font-bold text-stone-600 hover:bg-stone-200 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 rounded-lg text-sm font-bold bg-red-600 text-white hover:bg-red-700 transition-colors shadow-md shadow-red-600/25 flex items-center gap-2 disabled:opacity-50"
                >
                  {isDeleting ? "Deleting..." : "Delete Project"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
