export default function CartSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Cart Items Skeleton */}
      <div className="lg:col-span-2">
        <div className="h-10 w-48 bg-gray-200 rounded-lg animate-pulse mb-6" />
        
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="grid grid-cols-12 gap-6">
                {/* Image skeleton */}
                <div className="col-span-2">
                  <div className="w-full aspect-square bg-gray-200 rounded-lg animate-pulse" />
                </div>
                
                {/* Content skeleton */}
                <div className="col-span-5 space-y-3">
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
                  <div className="h-5 bg-gray-200 rounded animate-pulse w-1/4" />
                </div>
                
                {/* Quantity skeleton */}
                <div className="col-span-2">
                  <div className="h-10 bg-gray-200 rounded-lg animate-pulse" />
                </div>
                
                {/* Price skeleton */}
                <div className="col-span-3 space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-20 ml-auto" />
                  <div className="h-8 bg-gray-200 rounded animate-pulse w-24 ml-auto" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Skeleton */}
      <div className="lg:col-span-1">
        <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-24">
          <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4 mb-6" />
          
          <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
            <div className="flex justify-between">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4" />
            </div>
            <div className="flex justify-between">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4" />
            </div>
          </div>
          
          <div className="flex justify-between mb-6">
            <div className="h-6 bg-gray-200 rounded animate-pulse w-1/3" />
            <div className="h-8 bg-gray-200 rounded animate-pulse w-1/3" />
          </div>
          
          <div className="h-12 bg-gray-200 rounded-lg animate-pulse" />
        </div>
      </div>
    </div>
  );
}