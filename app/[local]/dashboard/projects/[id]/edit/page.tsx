"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import {
  getAdminProjects,
  updateProject,
} from "@/app/actions/portfolioActions";
import type { Project } from "@/app/types/project";
import TopNavBar from "@/app/_components/_dashboard/DashboardPage/TopNavBar";
import {
  FiInfo,
  FiImage,
  FiCode,
  FiUploadCloud,
  FiPlus,
  FiX,
  FiLink,
  FiTerminal,
  FiChevronRight,
  FiChevronDown,
  FiChevronUp,
  FiCheckCircle,
  FiAlertCircle,
  FiLoader,
} from "react-icons/fi";

interface FieldErrors {
  title?: string;
  shortDesc?: string;
  longDesc?: string;
  liveUrl?: string;
  repoUrl?: string;
}

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [longDesc, setLongDesc] = useState("");
  const [techStack, setTechStack] = useState<string[]>([]);
  const [liveUrl, setLiveUrl] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [newTech, setNewTech] = useState("");
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [errors, setErrors] = useState<FieldErrors>({});
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(["basic"]));
  const [submitErrors, setSubmitErrors] = useState<string[]>([]);

  useEffect(() => {
    async function fetchProject() {
      try {
        setLoading(true);
        const result = await getAdminProjects({ page: 1, limit: 100 });
        const found = result.data.find((p) => p.id === projectId);
        if (!found) {
          toast.error("Project not found");
          router.push("/en/dashboard/projects");
          return;
        }
        setProject(found);
        setTitle(found.title);
        setShortDesc(found.shortDescription);
        setLongDesc(found.longDescription || "");
        setTechStack(found.techStack || []);
        setLiveUrl(found.liveUrl || "");
        setRepoUrl(found.repoUrl || "");
      } catch {
        toast.error("Failed to load project");
        router.push("/en/dashboard/projects");
      } finally {
        setLoading(false);
      }
    }

    fetchProject();
  }, [projectId, router]);

  const removeTech = (tech: string) => {
    setTechStack(techStack.filter((t) => t !== tech));
  };

  const addTech = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newTech.trim()) {
      e.preventDefault();
      if (!techStack.includes(newTech.trim())) {
        setTechStack([...techStack, newTech.trim()]);
      }
      setNewTech("");
    }
  };

  const markTouched = (field: string) => {
    setTouched((prev) => new Set(prev).add(field));
  };

  const validateField = (name: string, value: string) => {
    switch (name) {
      case "title":
        return value.trim().length === 0 ? "Project title is required" : undefined;
      case "shortDesc":
        return value.trim().length === 0
          ? "A short description is required"
          : value.length > 150
          ? `Short description must be under 150 characters (currently ${value.length})`
          : undefined;
      case "longDesc":
        return value.trim().length < 20 && value.trim().length > 0
          ? "Description is too short — add at least 20 characters"
          : undefined;
      case "liveUrl":
        return value.length > 0 && !/^https?:\/\/.+/.test(value)
          ? "Please enter a valid URL starting with http:// or https://"
          : undefined;
      case "repoUrl":
        return value.length > 0 && !/^https?:\/\/.+/.test(value)
          ? "Please enter a valid URL"
          : undefined;
      default:
        return undefined;
    }
  };

  const handleFieldChange = (name: string, value: string) => {
    if (touched.has(name)) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const validateAll = (): FieldErrors => {
    const allErrors: FieldErrors = {};
    const titleErr = validateField("title", title);
    if (titleErr) allErrors.title = titleErr;
    const descErr = validateField("shortDesc", shortDesc);
    if (descErr) allErrors.shortDesc = descErr;
    const longErr = validateField("longDesc", longDesc);
    if (longErr) allErrors.longDesc = longErr;
    const liveErr = validateField("liveUrl", liveUrl);
    if (liveErr) allErrors.liveUrl = liveErr;
    const repoErr = validateField("repoUrl", repoUrl);
    if (repoErr) allErrors.repoUrl = repoErr;
    return allErrors;
  };

  const toggleSection = (section: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) next.delete(section);
      else next.add(section);
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(new Set(["title", "shortDesc", "longDesc", "liveUrl", "repoUrl"]));
    const allErrors = validateAll();
    setErrors(allErrors);

    const errorMessages = Object.entries(allErrors)
      .filter(([, msg]) => msg !== undefined)
      .map(([field, msg]) => `${field}: ${msg}`);

    if (errorMessages.length > 0) {
      setSubmitErrors(errorMessages);
      if (allErrors.title || allErrors.shortDesc || allErrors.longDesc) {
        setOpenSections((prev) => new Set(prev).add("basic"));
      }
      if (allErrors.liveUrl || allErrors.repoUrl) {
        setOpenSections((prev) => new Set(prev).add("technical"));
      }
      return;
    }

    setSubmitErrors([]);
    setSubmitting(true);

    try {
      const result = await updateProject(projectId, {
        title: title.trim(),
        shortDescription: shortDesc.trim(),
        longDescription: longDesc.trim() || undefined,
        techStack: techStack.length > 0 ? techStack : undefined,
        liveUrl: liveUrl.trim() || undefined,
        repoUrl: repoUrl.trim() || undefined,
      });

      if (result.success) {
        toast.success(result.message);
        router.push("/en/dashboard/projects");
      } else {
        toast.error(result.message);
        setSubmitErrors([result.message]);
      }
    } catch {
      toast.error("Failed to update project");
      setSubmitErrors(["An unexpected error occurred. Please try again."]);
    } finally {
      setSubmitting(false);
    }
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

  if (!project) {
    return (
      <>
        <TopNavBar />
        <main className="flex-1 overflow-y-auto p-6 md:p-8 flex items-center justify-center min-h-[60vh]">
          <p className="text-lg text-stone-500">Project not found</p>
        </main>
      </>
    );
  }

  return (
    <>
      <TopNavBar />
      <main className="flex-1 overflow-y-auto">
        <div className="ml-64 rtl:mr-64 rtl:ml-0 pt-24 pb-12 px-8">
          {/* Header */}
          <div className="flex justify-between items-end mb-8">
            <div>
              <nav className="flex gap-2 text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                <span>Projects</span>
                <FiChevronRight className="text-sm" />
                <span className="text-orange-500">Edit Project</span>
              </nav>
              <h2 className="text-3xl font-extrabold text-stone-800 tracking-tight">
                Edit: {project.title}
              </h2>
            </div>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-8 py-3 rounded-xl font-bold text-sm bg-orange-500 text-white shadow-md shadow-orange-500/25 hover:bg-orange-600 active:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {submitting && <FiLoader className="animate-spin" size={16} />}
              Save Changes
            </button>
          </div>

          {/* Error Summary */}
          {submitErrors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8" role="alert">
              <div className="flex items-start gap-3">
                <FiAlertCircle className="text-red-500 shrink-0 mt-0.5" size={20} />
                <div>
                  <h4 className="text-sm font-bold text-red-800">
                    {submitErrors.length} {submitErrors.length === 1 ? "issue" : "issues"} need to be fixed
                  </h4>
                  <ul className="mt-2 text-xs text-red-700 space-y-1">
                    {submitErrors.map((err) => (
                      <li key={err}>• {err}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8" noValidate>
            {/* Basic Info */}
            <section className="bg-white rounded-xl border border-stone-200/50 overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection("basic")}
                className="w-full flex items-center justify-between p-8 text-left hover:bg-stone-50/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
                    <FiInfo size={20} />
                  </div>
                  <h3 className="text-xl font-bold">Basic Information</h3>
                </div>
                {openSections.has("basic") ? (
                  <FiChevronUp size={20} className="text-stone-400 shrink-0" />
                ) : (
                  <FiChevronDown size={20} className="text-stone-400 shrink-0" />
                )}
              </button>
              {openSections.has("basic") && (
                <div className="px-8 pb-8 space-y-6">
                  {/* Title */}
                  <div className="grid gap-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-stone-500">
                      Project Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => { setTitle(e.target.value); handleFieldChange("title", e.target.value); }}
                      onBlur={() => markTouched("title")}
                      className={`w-full bg-stone-50 border-none rounded-lg p-4 focus:ring-2 focus:ring-orange-500/50 text-stone-800 placeholder:text-stone-400 ${
                        touched.has("title") && errors.title ? "ring-2 ring-red-400/40" : ""
                      }`}
                      placeholder="e.g. Modern E-commerce Platform"
                    />
                    {touched.has("title") && errors.title && (
                      <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                        <FiAlertCircle size={12} /> {errors.title}
                      </p>
                    )}
                  </div>

                  {/* Short Description */}
                  <div className="grid gap-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-stone-500">
                      Short Description <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={shortDesc}
                      onChange={(e) => { setShortDesc(e.target.value); handleFieldChange("shortDesc", e.target.value); }}
                      onBlur={() => markTouched("shortDesc")}
                      maxLength={150}
                      className={`w-full bg-stone-50 border-none rounded-lg p-4 focus:ring-2 focus:ring-orange-500/50 text-stone-800 placeholder:text-stone-400 ${
                        touched.has("shortDesc") && errors.shortDesc ? "ring-2 ring-red-400/40" : ""
                      }`}
                      placeholder="Brief summary for list views (max 150 characters)"
                    />
                    <div className="flex justify-between items-center">
                      {touched.has("shortDesc") && errors.shortDesc ? (
                        <p className="text-xs text-red-500 flex items-center gap-1">
                          <FiAlertCircle size={12} /> {errors.shortDesc}
                        </p>
                      ) : <span />}
                      <span className={`text-[11px] ${shortDesc.length > 140 ? "text-amber-500 font-bold" : "text-stone-400"}`}>
                        {shortDesc.length}/150
                      </span>
                    </div>
                  </div>

                  {/* Long Description */}
                  <div className="grid gap-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-stone-400">
                      Long Description
                    </label>
                    <textarea
                      value={longDesc}
                      onChange={(e) => { setLongDesc(e.target.value); handleFieldChange("longDesc", e.target.value); }}
                      onBlur={() => markTouched("longDesc")}
                      className="w-full bg-stone-50 border-none rounded-lg p-4 focus:ring-2 focus:ring-orange-500/50 text-stone-800 placeholder:text-stone-400 min-h-[200px] resize-none"
                      placeholder="Describe the project scope, challenges, and solutions in detail..."
                    />
                    {touched.has("longDesc") && errors.longDesc && (
                      <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                        <FiAlertCircle size={12} /> {errors.longDesc}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </section>

            {/* Technical Details */}
            <section className="bg-white rounded-xl border border-stone-200/50 overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection("technical")}
                className="w-full flex items-center justify-between p-8 text-left hover:bg-stone-50/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
                    <FiCode size={20} />
                  </div>
                  <h3 className="text-xl font-bold">Technical Details</h3>
                </div>
                {openSections.has("technical") ? (
                  <FiChevronUp size={20} className="text-stone-400 shrink-0" />
                ) : (
                  <FiChevronDown size={20} className="text-stone-400 shrink-0" />
                )}
              </button>
              {openSections.has("technical") && (
                <div className="px-8 pb-8 space-y-6">
                  {/* Tech Stack */}
                  <div className="grid gap-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-stone-500">
                      Tech Stack
                    </label>
                    <div className="w-full bg-stone-50 border-none rounded-lg p-4 flex flex-wrap gap-2 focus-within:ring-2 focus-within:ring-orange-500/50">
                      {techStack.length === 0 && (
                        <span className="text-stone-400 text-sm">
                          No technologies added yet. Type one below and press Enter.
                        </span>
                      )}
                      {techStack.map((tech) => (
                        <span
                          key={tech}
                          className="bg-orange-100 text-orange-800 text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 uppercase tracking-tighter"
                        >
                          {tech}
                          <button
                            type="button"
                            onClick={() => removeTech(tech)}
                            className="hover:text-red-600 transition-colors"
                          >
                            <FiX size={12} />
                          </button>
                        </span>
                      ))}
                      <input
                        type="text"
                        value={newTech}
                        onChange={(e) => setNewTech(e.target.value)}
                        onKeyDown={addTech}
                        className="bg-transparent border-none focus:ring-0 text-sm p-0 flex-1 min-w-[120px] placeholder:text-stone-400"
                        placeholder="Add technology..."
                      />
                    </div>
                  </div>

                  {/* URLs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="grid gap-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-stone-400">
                        Live URL
                      </label>
                      <div className={`flex items-center bg-stone-50 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-orange-500/50 ${
                        touched.has("liveUrl") && errors.liveUrl ? "ring-2 ring-red-400/40" : ""
                      }`}>
                        <FiLink className="ml-4 text-stone-400" size={16} />
                        <input
                          type="url"
                          value={liveUrl}
                          onChange={(e) => { setLiveUrl(e.target.value); handleFieldChange("liveUrl", e.target.value); }}
                          onBlur={() => markTouched("liveUrl")}
                          className="w-full bg-transparent border-none p-4 text-sm focus:ring-0 placeholder:text-stone-400"
                          placeholder="https://project.com"
                        />
                      </div>
                      {touched.has("liveUrl") && errors.liveUrl && (
                        <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                          <FiAlertCircle size={12} /> {errors.liveUrl}
                        </p>
                      )}
                    </div>

                    <div className="grid gap-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-stone-400">
                        Repository URL
                      </label>
                      <div className={`flex items-center bg-stone-50 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-orange-500/50 ${
                        touched.has("repoUrl") && errors.repoUrl ? "ring-2 ring-red-400/40" : ""
                      }`}>
                        <FiTerminal className="ml-4 text-stone-400" size={16} />
                        <input
                          type="url"
                          value={repoUrl}
                          onChange={(e) => { setRepoUrl(e.target.value); handleFieldChange("repoUrl", e.target.value); }}
                          onBlur={() => markTouched("repoUrl")}
                          className="w-full bg-transparent border-none p-4 text-sm focus:ring-0 placeholder:text-stone-400"
                          placeholder="https://github.com/..."
                        />
                      </div>
                      {touched.has("repoUrl") && errors.repoUrl && (
                        <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                          <FiAlertCircle size={12} /> {errors.repoUrl}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </section>
          </form>
        </div>
      </main>
    </>
  );
}
