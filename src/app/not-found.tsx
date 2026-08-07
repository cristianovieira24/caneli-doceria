import Link from "next/link";

export default function NotFound() {
  return (
    <div className="section flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="font-script text-4xl text-pine">ops!</p>
      <h1 className="mt-2 text-3xl sm:text-4xl">Essa página fugiu do forno</h1>
      <p className="mt-3 max-w-[45ch] text-ink-soft">
        Não encontramos o que você procurava. Que tal dar uma olhada no cardápio enquanto isso?
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/cardapio" className="rounded-full bg-pine px-7 py-3 text-sm font-medium text-cream-soft hover:bg-pine-dark">
          Ver cardápio
        </Link>
        <Link href="/" className="rounded-full border border-ink/15 px-7 py-3 text-sm font-medium text-ink hover:border-pine hover:text-pine">
          Voltar ao início
        </Link>
      </div>
    </div>
  );
}
