
export default function ProductCard({ product, onAddToCart, money }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative overflow-hidden bg-slate-100">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-56 w-full object-cover transition duration-300 group-hover:scale-105"
        />

        {product.tag && (
          <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-800 shadow-sm">
            {product.tag}
          </span>
        )}
      </div>

      <div className="p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {product.category}
        </p>

        <h3 className="mt-2 min-h-12 font-bold leading-6">
          {product.name}
        </h3>

        <div className="mt-3 flex items-center gap-2">
          <span className="text-lg font-black">
            {money(product.price)}
          </span>

          <span className="text-sm text-slate-400 line-through">
            {money(product.oldPrice)}
          </span>
        </div>

        <button
          onClick={() => onAddToCart(product)}
          className="mt-4 w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Add to Cart
        </button>
      </div>
    </article>
  );
}
