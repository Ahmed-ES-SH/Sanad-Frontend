export function HeaderSection() {
  return (
    <div className="mb-10">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-stone-400 uppercase tracking-widest mb-2">
        <span>Services</span>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="text-orange-600">Add New Service</span>
      </nav>
      
      {/* Header Content */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-extrabold text-stone-900 tracking-tight">Create Service</h2>
          <p className="text-stone-500 mt-1 font-medium">Define a new architectural service offering for the portal.</p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-3">
          <button className="px-6 py-2.5 text-sm font-bold text-stone-600 bg-surface-container-high rounded-xl hover:bg-stone-200 transition-colors">
            Save Draft
          </button>
          <button className="px-8 py-2.5 text-sm font-bold text-white bg-gradient-to-br from-[#f97316] to-[#f59e0b] rounded-xl shadow-lg shadow-orange-200 hover:opacity-90 transition-all">
            Publish Service
          </button>
        </div>
      </div>
    </div>
  );
}