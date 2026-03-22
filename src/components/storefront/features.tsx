import { Leaf, ShieldHalf, Truck } from "lucide-react";

export function Features() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 lg:px-12 mx-auto max-w-7xl w-full py-16">
      <div className="flex flex-col items-center text-center space-y-6 p-10 bg-white/40 backdrop-blur-xl rounded-3xl ring-1 ring-black/5 transition-all hover:-translate-y-1 duration-300">
        <div className="p-4 rounded-2xl bg-primary/10 text-primary">
          <Leaf className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-black text-[#173b27] tracking-tight">
          100% Organic
        </h3>
        <p className="text-[#173b27]/70 max-w-xs text-sm leading-relaxed font-medium">
          Sourced directly from certified organic farms, ensuring maximum purity
          and potency.
        </p>
      </div>
      <div className="flex flex-col items-center text-center space-y-6 p-10 bg-white/40 backdrop-blur-xl rounded-3xl ring-1 ring-black/5 transition-all hover:-translate-y-1 duration-300">
        <div className="p-4 rounded-2xl bg-primary/10 text-primary">
          <ShieldHalf className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-black text-[#173b27] tracking-tight">
          Lab tested
        </h3>
        <p className="text-[#173b27]/70 max-w-xs text-sm leading-relaxed font-medium">
          Every batch is rigorously third-party tested for quality, safety, and
          effectiveness.
        </p>
      </div>
      <div className="flex flex-col items-center text-center space-y-6 p-10 bg-white/40 backdrop-blur-xl rounded-3xl ring-1 ring-black/5 transition-all hover:-translate-y-1 duration-300">
        <div className="p-4 rounded-2xl bg-primary/10 text-primary">
          <Truck className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-black text-[#173b27] tracking-tight">
          Free shipping
        </h3>
        <p className="text-[#173b27]/70 max-w-xs text-sm leading-relaxed font-medium">
          Enjoy free, carbon-neutral shipping on all orders over $50 worldwide.
        </p>
      </div>
    </div>
  );
}
