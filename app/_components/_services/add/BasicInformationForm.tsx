"use client";

export function BasicInformationForm() {
  return (
    <div className="bg-surface-container-lowest rounded-full p-8 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
          <span className="material-symbols-outlined text-orange-600">edit_note</span>
        </div>
        <h3 className="text-xl font-bold text-stone-900">Basic Information</h3>
      </div>
      
      {/* Form Fields */}
      <div className="space-y-6">
        {/* Title and Category Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest ml-1">
              Title
            </label>
            <input 
              type="text" 
              className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-orange-600 transition-all text-stone-900" 
              placeholder="e.g. Premium Structural Consulting" 
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest ml-1">
              Category
            </label>
            <select className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-orange-600 transition-all text-stone-900">
              <option>Architecture</option>
              <option>Structural Engineering</option>
              <option>Interior Design</option>
              <option>Urban Planning</option>
            </select>
          </div>
        </div>
        
        {/* Short Description */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest ml-1">
            Short Description
          </label>
          <input 
            type="text" 
            className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-orange-600 transition-all text-stone-900" 
            placeholder="One-sentence hook for the service" 
          />
        </div>
        
        {/* Long Description */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest ml-1">
            Long Description
          </label>
          <textarea 
            className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-orange-600 transition-all text-stone-900 custom-scrollbar" 
            placeholder="Detail the full scope of work and deliverables..." 
            rows={5}
          />
        </div>
      </div>
    </div>
  );
}