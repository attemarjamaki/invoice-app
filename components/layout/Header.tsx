import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  OrganizationSwitcher,
} from "@clerk/nextjs";
import Link from "next/link";

export default function Header() {
  return (
    <header className="mt-8 mb-12">
      <div className="container max-w-5xl flex justify-between items-center gap-4 mx-auto px-4">
        <div className="flex items-center gap-2">
          <p className="text-xl font-semibold">
            <Link href={"/"}>Invoice App</Link>
          </p>
          <SignedIn>
            <span className="text-xl text-neutral-300 ml-2">/</span>
            <OrganizationSwitcher afterCreateOrganizationUrl="/dashboard" />
          </SignedIn>
        </div>

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
