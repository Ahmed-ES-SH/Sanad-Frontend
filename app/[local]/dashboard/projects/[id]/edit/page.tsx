"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import {
  getAdminProjects,
  updateProject,
} from "@/app/actions/portfolioActions";
import type { Project } from "@/app/types/project";
import { FiChevronRight, FiAlertCircle, FiLoader } from "react-icons/fi";
import BasicInfoSection from "@/app/_components/_dashboard/ProjectsPage/_editProject/BasicInfoSection";
import TechnicalDetailsSection from "@/app/_components/_dashboard/ProjectsPage/_editProject/TechnicalDetailsSection";
import MediaSection from "@/app/_components/_dashboard/ProjectsPage/_editProject/MediaSection";

export interface FieldErrors {
  title?: string;
  shortDesc?: string;
  longDesc?: string;
  liveUrl?: string;
  repoUrl?: string;
  coverImage?: string;
  newImage?: string;
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

  // Media states
  const [coverImage, setCoverImage] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [newImage, setNewImage] = useState("");

  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [errors, setErrors] = useState<FieldErrors>({});
  const [openSections, setOpenSections] = useState<Set<string>>(
    new Set(["basic"]),
  );
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
        setCoverImage(found.coverImageUrl || "");
        setImages(found.images || []);
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

  const removeImage = (url: string) => {
    setImages(images.filter((img) => img !== url));
  };

  const addImage = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newImage.trim()) {
      e.preventDefault();
      const err = validateField("newImage", newImage.trim());
      if (err) {
        setErrors((prev) => ({ ...prev, newImage: err }));
        setTouched((prev) => new Set(prev).add("newImage"));
        return;
      }
      if (!images.includes(newImage.trim())) {
        setImages([...images, newImage.trim()]);
      }
      setNewImage("");
      setErrors((prev) => ({ ...prev, newImage: undefined }));
      setTouched((prev) => {
        const next = new Set(prev);
        next.delete("newImage");
        return next;
      });
    }
  };

  const markTouched = (field: string) => {
    setTouched((prev) => new Set(prev).add(field));
  };

  const validateField = (name: string, value: string) => {
    switch (name) {
      case "title":
        return value.trim().length === 0
          ? "Project title is required"
          : undefined;
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
      case "repoUrl":
      case "coverImage":
      case "newImage":
        return value.length > 0 && !/^https?:\/\/.+/.test(value)
          ? "Please enter a valid URL starting with http:// or https://"
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
    const coverErr = validateField("coverImage", coverImage);
    if (coverErr) allErrors.coverImage = coverErr;
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
    setTouched(
      new Set([
        "title",
        "shortDesc",
        "longDesc",
        "liveUrl",
        "repoUrl",
        "coverImage",
      ]),
    );
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
      if (allErrors.coverImage) {
        setOpenSections((prev) => new Set(prev).add("media"));
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
        coverImageUrl: coverImage.trim() || undefined,
        images: images.filter(Boolean),
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
        <main className="flex-1 overflow-y-auto p-6 md:p-8 flex items-center justify-center min-h-[60vh]">
          <FiLoader className="animate-spin text-stone-400" size={32} />
        </main>
      </>
    );
  }

  if (!project) {
    return (
      <>
        <main className="flex-1 overflow-y-auto p-6 md:p-8 flex items-center justify-center min-h-[60vh]">
          <p className="text-lg text-stone-500">Project not found</p>
        </main>
      </>
    );
  }

  return (
    <>
      <main className="flex-1 overflow-y-auto">
        <div className="rtl:ml-0 pt-12 pb-12 px-8">
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
            <div
              className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8"
              role="alert"
            >
              <div className="flex items-start gap-3">
                <FiAlertCircle
                  className="text-red-500 shrink-0 mt-0.5"
                  size={20}
                />
                <div>
                  <h4 className="text-sm font-bold text-red-800">
                    {submitErrors.length}{" "}
                    {submitErrors.length === 1 ? "issue" : "issues"} need to be
                    fixed
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
            <BasicInfoSection
              title={title}
              setTitle={setTitle}
              shortDesc={shortDesc}
              setShortDesc={setShortDesc}
              longDesc={longDesc}
              setLongDesc={setLongDesc}
              touched={touched}
              errors={errors}
              handleFieldChange={handleFieldChange}
              markTouched={markTouched}
              isOpen={openSections.has("basic")}
              toggleSection={() => toggleSection("basic")}
            />

            <MediaSection
              coverImage={coverImage}
              setCoverImage={setCoverImage}
              images={images}
              setImages={setImages}
              newImage={newImage}
              setNewImage={setNewImage}
              addImage={addImage}
              removeImage={removeImage}
              touched={touched}
              errors={errors}
              handleFieldChange={handleFieldChange}
              markTouched={markTouched}
              isOpen={openSections.has("media")}
              toggleSection={() => toggleSection("media")}
            />

            <TechnicalDetailsSection
              techStack={techStack}
              setTechStack={setTechStack}
              newTech={newTech}
              setNewTech={setNewTech}
              addTech={addTech}
              removeTech={removeTech}
              liveUrl={liveUrl}
              setLiveUrl={setLiveUrl}
              repoUrl={repoUrl}
              setRepoUrl={setRepoUrl}
              touched={touched}
              errors={errors}
              handleFieldChange={handleFieldChange}
              markTouched={markTouched}
              isOpen={openSections.has("technical")}
              toggleSection={() => toggleSection("technical")}
            />
          </form>
        </div>
      </main>
    </>
  );
}
