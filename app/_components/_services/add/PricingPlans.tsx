export function PricingPlans() {
  return (
    <div className="bg-surface-container-lowest rounded-full p-6 shadow-sm border border-stone-100 opacity-80 grayscale-[0.4]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-stone-900">Pricing & Plans</h3>
        <span className="material-symbols-outlined text-stone-400 text-sm">lock</span>
      </div>
      
      {/* Pricing Plans */}
      <div className="space-y-3">
        {/* Starter Plan */}
        <div className="p-3 bg-stone-50 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center">
              <span className="material-symbols-outlined text-[16px] text-stone-500">bolt</span>
            </div>
            <div>
              <p className="text-xs font-bold text-stone-800">Starter</p>
              <p className="text-[10px] text-stone-500">$49/mo</p>
            </div>
          </div>
          <div className="w-4 h-4 rounded-full border-2 border-stone-300"></div>
        </div>
        
        {/* Professional Plan (Selected) */}
        <div className="p-3 bg-orange-50/50 rounded-xl flex items-center justify-between border border-orange-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-[16px] text-orange-600">star</span>
            </div>
            <div>
              <p className="text-xs font-bold text-orange-900">Professional</p>
              <p className="text-[10px] text-orange-600">$149/mo</p>
            </div>
          </div>
          <div className="w-4 h-4 rounded-full bg-orange-500 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
          </div>
        </div>
        
        {/* Enterprise Plan */}
        <div className="p-3 bg-stone-50 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center">
              <span className="material-symbols-outlined text-[16px] text-stone-500">corporate_fare</span>
            </div>
            <div>
              <p className="text-xs font-bold text-stone-800">Enterprise</p>
              <p className="text-[10px] text-stone-500">Custom</p>
            </div>
          </div>
          <div className="w-4 h-4 rounded-full border-2 border-stone-300"></div>
        </div>
      </div>
    </div>
  );
}