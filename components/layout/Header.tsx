import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";

export default function Header() {
  return (
    <header className="mt-8 mb-12">
      <div className="container max-w-5xl flex justify-between items-center gap-4  mx-auto">
        <p className="text-xl font-semibold">
          <Link href={"/"}>Invoice App</Link>
        </p>
        <div>
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
