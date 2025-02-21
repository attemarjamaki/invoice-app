"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formAction } from "@/app/actions";
import { SyntheticEvent, useState } from "react";
import SubmitButton from "@/components/SubmitButton";
import Form from "next/form";

export default function Page() {
  const [state, setState] = useState("ready");

  async function handleOnSubmit(e: SyntheticEvent) {
    if (state === "pending") {
      e.preventDefault();
      return;
    }
    setState("pending");
  }

  return (
    <main className="container max-w-5xl mx-auto py-12">
      <div className="flex justify-between">
        <h1 className="text-3xl font-semibold mb-6">Create Invoice</h1>
      </div>

      <Form
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
      </Form>
    </main>
  );
}
