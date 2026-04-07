export function ServiceConfiguration() {
  return (
    <div className="bg-surface-container-low rounded-full p-8 opacity-75 grayscale-[0.2]">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-stone-200 flex items-center justify-center">
            <span className="material-symbols-outlined text-stone-600">settings_input_component</span>
          </div>
          <h3 className="text-xl font-bold text-stone-900">Service Configuration</h3>
        </div>
        <span className="text-[10px] font-bold bg-stone-200 text-stone-600 px-2 py-1 rounded uppercase tracking-wider">
          Locked
        </span>
      </div>
      
      {/* Configuration Options */}
      <div className="grid grid-cols-3 gap-4">
        {/* Auto-Approval */}
        <div className="bg-white/50 p-4 rounded-xl border border-dashed border-stone-300">
          <div className="w-2 h-2 rounded-full bg-green-500 mb-2"></div>
          <p className="text-xs font-bold text-stone-800">Auto-Approval</p>
          <p className="text-[10px] text-stone-500 mt-1">Enabled for verified clients</p>
        </div>
        
        {/* SLA Tracking */}
        <div className="bg-white/50 p-4 rounded-xl border border-dashed border-stone-300">
          <div className="w-2 h-2 rounded-full bg-orange-500 mb-2"></div>
          <p className="text-xs font-bold text-stone-800">SLA Tracking</p>
          <p className="text-[10px] text-stone-500 mt-1">Standard 48-hour response</p>
        </div>
        
        {/* Team Assignment */}
        <div className="bg-white/50 p-4 rounded-xl border border-dashed border-stone-300">
          <div className="w-2 h-2 rounded-full bg-blue-500 mb-2"></div>
          <p className="text-xs font-bold text-stone-800">Team Assignment</p>
          <p className="text-[10px] text-stone-500 mt-1">Round-robin distribution</p>
        </div>
      </div>
    </div>
  );
}