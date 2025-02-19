"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formAction } from "@/app/actions";
import { SyntheticEvent, useState, startTransition } from "react";
import SubmitButton from "@/components/SubmitButton";

export default function Page() {
  const [state, setState] = useState("ready");
  async function handleOnSubmit(e: SyntheticEvent) {
    e.preventDefault();
    if (state === "pending") return;
    setState("pending");
    const target = e.target as HTMLFormElement;
    startTransition(async () => {
      const formData = new FormData(target);
      await formAction(formData);
      console.log("hey");
    });
  }
  return (
    <main className="flex flex-col justify-center gap-6 max-w-5xl mx-auto py-12 px-2">
      <div className="flex justify-between">
        <h1 className="text-3xl font-semibold">Create Invoice</h1>
      </div>

      <form
        action={formAction}
        onSubmit={handleOnSubmit}
        className="grid gap-4 max-w-sm"
      >
        <div>
          <Label htmlFor="name" className="block font-semibold text-sm mb-2">
            Billing Name
          </Label>
          <Input id="name" name="name" type="text" />
        </div>
        <div>
          <Label htmlFor="email" className="block font-semibold text-sm mb-2">
            Billing Email
          </Label>
          <Input id="email" name="email" type="email" />
        </div>
        <div>
          <Label htmlFor="value" className="block font-semibold text-sm mb-2">
            Value
          </Label>
          <Input id="value" name="value" type="text" />
        </div>
        <div>
          <Label
            htmlFor="description"
            className="block font-semibold text-sm mb-2"
          >
            Description
          </Label>
          <Textarea id="description" name="description" />
        </div>
        <div>
          <SubmitButton />
        </div>
      </form>
    </main>
  );
}
