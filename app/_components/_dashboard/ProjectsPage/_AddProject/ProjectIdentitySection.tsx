"use client";

import { FiImage, FiUploadCloud, FiPlus } from "react-icons/fi";

interface ProjectIdentitySectionProps {
  t: Record<string, any>;
  open: boolean;
  toggleSection: (section: string) => void;
}

export default function ProjectIdentitySection({
  t,
  open,
  toggleSection,
}: ProjectIdentitySectionProps) {
  return (
    <section className="bg-white rounded-xl border border-stone-200/50 overflow-hidden">
      <button
        type="button"
        onClick={() => toggleSection("identity")}
        className="w-full flex items-center justify-between p-8 text-left hover:bg-stone-50/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
            <FiImage size={20} />
          </div>
          <h3 className="text-xl font-bold">
            {t?.projectIdentity?.title || "Project Identity"}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {!open && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
              Cover, gallery
            </span>
          )}
          {open ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-stone-400 shrink-0"><path d="m18 15-6-6-6 6"/></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-stone-400 shrink-0"><path d="m6 9 6 6 6-6"/></svg>
          )}
        </div>
      </button>
      {open && (
        <div className="px-8 pb-8">
          <div className="grid gap-8">
            {/* Cover Image */}
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-3 block">
                {t?.projectIdentity?.coverImage || "Cover Image"}
              </label>
              <div className="border-2 border-dashed border-stone-300 rounded-xl p-8 text-center bg-stone-50 hover:bg-orange-50/30 transition-colors cursor-pointer group">
                <FiUploadCloud
                  size={40}
                  className="mx-auto text-stone-400 mb-2 group-hover:text-orange-500 transition-colors"
                />
                <p className="text-sm font-semibold">
                  {t?.projectIdentity?.dropText || "Drop your cover image here, or "}
                  <span className="text-orange-500">
                    {t?.projectIdentity?.browseText || "browse"}
                  </span>
                </p>
                <p className="text-xs text-stone-500 mt-1">
                  {t?.projectIdentity?.recommendedSize ||
                    "Recommended: 1600x900px, PNG or JPG"}
                </p>
              </div>
            </div>

            {/* Gallery Upload */}
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-3 block">
                {t?.projectIdentity?.galleryUpload || "Gallery Upload"}
              </label>
              <div className="grid grid-cols-4 gap-4">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="aspect-square bg-stone-50 border-2 border-dashed border-stone-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-orange-500 hover:bg-orange-50/30 transition-colors"
                  >
                    <FiPlus size={20} className="text-stone-400" />
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-stone-400 mt-2">
                {t?.projectIdentity?.galleryHelp || "Add up to 8 screenshots to showcase your project. PNG or JPG, max 5MB each."}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
