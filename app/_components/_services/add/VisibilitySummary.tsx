export function VisibilitySummary() {
  return (
    <div className="bg-gradient-to-br from-stone-900 to-stone-800 rounded-full p-6 text-white">
      <h4 className="text-sm font-bold uppercase tracking-widest text-stone-400 mb-4">
        Current Visibility
      </h4>
      
      {/* Status */}
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center">
          <span className="material-symbols-outlined text-white">visibility_off</span>
        </div>
        <div>
          <p className="text-sm font-bold text-white">Private Draft</p>
          <p className="text-xs text-stone-400">Visible only to admins</p>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="h-1.5 w-full bg-stone-700 rounded-full overflow-hidden">
        <div className="h-full w-1/3 bg-orange-500 rounded-full"></div>
      </div>
      
      {/* Progress Text */}
      <p className="text-[10px] font-bold text-stone-500 mt-2 uppercase tracking-tighter">
        Setup Progress: 35%
      </p>
    </div>
  );
}