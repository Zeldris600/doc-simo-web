import { Leaf, ShieldHalf, Truck } from "lucide-react";

export function Features() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 lg:px-12 mx-auto max-w-7xl w-full py-16">
      <div className="flex flex-col items-center text-center space-y-6 p-10 bg-white rounded-xl transition-all">
        <div className="p-4 rounded-lg bg-[#f2c94c]/5 text-[#f2c94c]">
          <Leaf className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-black tracking-tight">
          100% Organic
        </h3>
        <p className="text-gray-500 max-w-xs text-sm leading-relaxed font-medium">
          Sourced directly from certified organic farms, ensuring maximum purity
          and potency.
        </p>
      </div>
      <div className="flex flex-col items-center text-center space-y-6 p-10 bg-white rounded-xl transition-all">
        <div className="p-4 rounded-lg bg-[#f2c94c]/5 text-[#f2c94c]">
          <ShieldHalf className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-black tracking-tight">
          Lab tested
        </h3>
        <p className="text-gray-500 max-w-xs text-sm leading-relaxed font-medium">
          Every batch is rigorously third-party tested for quality, safety, and
          effectiveness.
        </p>
      </div>
      <div className="flex flex-col items-center text-center space-y-6 p-10 bg-white rounded-xl transition-all">
        <div className="p-4 rounded-lg bg-[#f2c94c]/5 text-[#f2c94c]">
          <Truck className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-black tracking-tight">
          Free shipping
        </h3>
        <p className="text-gray-500 max-w-xs text-sm leading-relaxed font-medium">
          Enjoy free, carbon-neutral shipping on all orders over $50 worldwide.
        </p>
      </div>
    </div>
  );
}
