export default function AddServiceLoading() {
  return (
    <div className="flex min-h-screen bg-surface text-on-surface">
      {/* Loading Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 z-50">
        <div className="p-4 space-y-4">
          <div className="h-12 bg-gray-200 rounded-lg animate-pulse" />
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 ml-64 min-h-screen flex flex-col">
        {/* Loading Top Navigation */}
        <header className="sticky top-0 z-40">
          <div className="flex justify-between items-center w-full px-8 py-4">
            <div className="w-80 h-12 bg-gray-200 rounded-full animate-pulse" />
            <div className="flex items-center gap-6">
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
              <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
            </div>
          </div>
        </header>
        
        {/* Loading Content */}
        <div className="p-8">
          <div className="mb-10 space-y-4">
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-12 w-96 bg-gray-200 rounded animate-pulse" />
          </div>
          
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-8 space-y-6">
              <div className="h-64 bg-gray-200 rounded-2xl animate-pulse" />
              <div className="h-64 bg-gray-200 rounded-2xl animate-pulse" />
            </div>
            
            <div className="col-span-12 lg:col-span-4 space-y-6">
              <div className="h-48 bg-gray-200 rounded-2xl animate-pulse" />
              <div className="h-48 bg-gray-200 rounded-2xl animate-pulse" />
              <div className="h-48 bg-gray-200 rounded-2xl animate-pulse" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}