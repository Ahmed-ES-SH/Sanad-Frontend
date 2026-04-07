export default function AvatarUpload() {
  return (
    <div className="flex items-center gap-6 p-4 bg-stone-50 rounded-xl">
      <div className="w-20 h-20 rounded-full bg-stone-100 flex items-center justify-center overflow-hidden border-2 border-white shrink-0">
        <svg className="w-10 h-10 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
      </div>
      <div className="space-y-2">
        <p className="text-sm font-semibold">Profile Photo</p>
        <p className="text-xs text-stone-500">PNG or JPG, max 2MB. Recommendation: 400x400px.</p>
        <div className="flex gap-3">
          <button type="button" className="px-4 py-1.5 bg-white text-stone-800 text-xs font-bold rounded-md shadow-sm border border-stone-200 hover:bg-stone-50 transition-colors">Upload Avatar</button>
          <button type="button" className="px-4 py-1.5 text-red-600 text-xs font-bold rounded-md hover:bg-red-50 transition-colors">Remove</button>
        </div>
      </div>
    </div>
  );
}
