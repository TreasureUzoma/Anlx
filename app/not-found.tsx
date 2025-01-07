import Link from "next/link";
import Image from "next/image";

const notFound = () => {
  return (
    <main>
      <div className="fixed top-0 left-0 right-0 z-50 py-4 md:py-[0.6rem] bg-bright dark:bg-black border-b border-neutral-200 dark:border-neutral-900 px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center justify-center gap-1">
          <Image
            src="https://analytixapp.vercel.app/logo/white.png"
            width={23}
            height={23}
            alt="Analytix Logo"
            className="hidden dark:inline-block"
          />
          <Image
            src="https://analytixapp.vercel.app/logo/black.png"
            width={23}
            height={23}
            alt="Analytix Logo"
            className="dark:hidden"
          />
          <span className="font-bold text-[22px] text-black dark:text-white">
            Analytix
          </span>
        </Link>
      </div>
      <div className="grid place-items-center min-h-screen">
        <div className="flex-col flex max-w-md px-4 gap-3">
          <h1 className="font-bold text-4xl tracking-[-1px]">
            Something&apos;s wrong here.
          </h1>
          <p className="text-sm font-medium">
            This is a <b>404</b> error, which means you&apos;ve clicked on a
            wrong or bad URL. Maybe what you are looking for can be found at{" "}
            <Link href="/" className="underline hover:text-[#4f1787]">
              analytix.dev
            </Link>
            <br />
            PS: Analytix shortened links are case sensitive.
          </p>
        </div>
      </div>
    </main>
  );
}

export default notFound