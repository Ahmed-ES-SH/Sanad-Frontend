"use client";

export function ServiceIdentity() {
  return (
    <div className="bg-surface-container-lowest rounded-full p-6 shadow-sm border border-stone-100">
      <h3 className="text-lg font-bold text-stone-900 mb-6">Service Identity</h3>
      
      <div className="space-y-6">
        {/* Icon Upload */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest">
            Icon
          </label>
          <div className="relative group cursor-pointer h-24 w-24 bg-stone-50 rounded-2xl border-2 border-dashed border-stone-200 flex flex-col items-center justify-center hover:border-orange-400 hover:bg-orange-50/30 transition-all overflow-hidden">
            <span className="material-symbols-outlined text-stone-300 group-hover:text-orange-500 transition-colors">
              add_photo_alternate
            </span>
            <p className="text-[10px] font-bold text-stone-400 group-hover:text-orange-600 mt-1">
              PNG/SVG
            </p>
          </div>
        </div>
        
        {/* Cover Image Upload */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest">
            Cover Image
          </label>
          <div className="relative h-40 w-full bg-stone-50 rounded-2xl border-2 border-dashed border-stone-200 overflow-hidden group cursor-pointer transition-all hover:border-orange-400">
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-900/0 group-hover:bg-stone-900/5 transition-all">
              <span className="material-symbols-outlined text-stone-300 group-hover:text-orange-500">
                cloud_upload
              </span>
              <p className="text-[10px] font-bold text-stone-400 group-hover:text-orange-600 mt-2">
                Upload 1920x1080px
              </p>
            </div>
            <img 
              alt="Structural Blueprint" 
              className="w-full h-full object-cover opacity-20"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAX2a3H7A3T0aSzXUcBl9OuRkns6-1RnAC7NvvwgdMS9SK0tauxWzNKOXA6oj6DG2ozyomTUcmETUe7cHIxeZKgUE3OWfsCb8xIZNspi-nNk-nh1yDKtLlofTL8QoIvTmHXrDPDOlGU97qYjFlqO4HDM8-w2s-CAbvORw3CyJCn9MIWa84Vz6RQAq-BeI7JicN35Wwa5z6FDzBiQpDYkpS8ddgPKMIK1RQ3b2Lr8Be5FuRowEAVysOeO_KMmFbTgaTUQ_TKapJgZ3HZ"
            />
          </div>
        </div>
      </div>
    </div>
  );
}