import { notFound } from "next/navigation";

import { eq, and, isNull } from "drizzle-orm";

import { db } from "@/db";
import { Customers, Invoices } from "@/db/schema";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { Button } from "@/components/ui/button";
import { ChevronDown, CreditCard, Ellipsis, Trash2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { AVAILABLE_STATUSES } from "@/data/invoices";
import { updateStatusAction, deleteInvoiceAction } from "@/app/actions";
import Link from "next/link";

export default async function InvoicePage({
  params,
}: {
  params: { invoiceId: string };
}) {
  const { userId, orgId } = await auth();

  if (!userId) {
    return;
  }

  const invoiceId = parseInt(params.invoiceId);

  if (isNaN(invoiceId)) {
    throw new Error("Invalid Invoice ID");
  }

  let result;

  if (orgId) {
    [result] = await db
      .select()
      .from(Invoices)
      .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
      .where(
        and(eq(Invoices.id, invoiceId), eq(Invoices.organizationId, orgId))
      )
      .limit(1);
  } else {
    [result] = await db
      .select()
      .from(Invoices)
      .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
      .where(
        and(
          eq(Invoices.id, invoiceId),
          eq(Invoices.userId, userId),
          isNull(Invoices.organizationId)
        )
      )
      .limit(1);
  }

  if (!result) {
    notFound();
  }

  const invoice = {
    ...result.invoices,
    customer: result.customers,
  };

  return (
    <main className="container max-w-5xl mx-auto py-12 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="flex items-center gap-4 text-3xl font-semibold">
          Invoice {invoiceId}{" "}
          <Badge
            className={cn(
              "capitalize",
              invoice.status === "open" && "bg-blue-500",
              invoice.status === "paid" && "bg-green-500",
              invoice.status === "void" && "bg-orange-500",
              invoice.status === "ucollectible" && "bg-red-500"
            )}
          >
            {invoice.status}
          </Badge>
        </h1>
        <div className="flex gap-2 items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Status
                <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {AVAILABLE_STATUSES.map((status) => (
                <DropdownMenuItem key={status.id}>
                  <form action={updateStatusAction} className="w-full">
                    <input type="hidden" name="id" value={invoiceId} />
                    <input type="hidden" name="status" value={status.id} />
                    <button className="w-full text-left">{status.label}</button>
                  </form>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Dialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <span className="sr-only" />
                  <Ellipsis />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <DialogTrigger asChild>
                    <button className="flex items-center gap-2 w-full">
                      <Trash2 />
                      Delete
                    </button>
                  </DialogTrigger>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link
                    href={`/invoices/${invoice.id}/payment`}
                    className="flex items-center gap-2 w-full"
                  >
                    <CreditCard />
                    Payment
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DialogContent>
              <DialogHeader className="flex flex-col items-center text-center gap-4">
                <DialogTitle>Delete Invoice?</DialogTitle>
                <DialogDescription className="text-center">
                  This action cannot be undone. This will permanently delete
                  your invoice and remove the invoice from our servers.
                </DialogDescription>
                <DialogFooter>
                  <form action={deleteInvoiceAction} className="w-full">
                    <input type="hidden" name="id" value={invoiceId} />
                    <input type="hidden" name="status" />
                    <Button
                      variant="destructive"
                      className="flex items-center gap-2 w-full "
                    >
                      <Trash2 />
                      Delete Invoice
                    </Button>
                  </form>
                </DialogFooter>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <p className="text-3xl mb-3">${(invoice.value / 100).toFixed(2)}</p>

      <p className="text-lg mb-8">{invoice.description}</p>

      <h2 className="font-bold text-lg mb-4">Billing Details</h2>

      <ul className="grid gap-2">
        <li className="flex gap-4">
          <strong className="block w-28 flex-shrink-0 font-medium text-sm">
            Invoice ID
          </strong>
          <span>{invoiceId}</span>
        </li>
        <li className="flex gap-4">
          <strong className="block w-28 flex-shrink-0 font-medium text-sm">
            Invoice Date
          </strong>
          <span>{new Date(invoice.createTs).toLocaleDateString()}</span>
        </li>
        <li className="flex gap-4">
          <strong className="block w-28 flex-shrink-0 font-medium text-sm">
            Billing Name
          </strong>
          <span>{invoice.customer.name}</span>
        </li>
        <li className="flex gap-4">
          <strong className="block w-28 flex-shrink-0 font-medium text-sm">
            Billing Email
          </strong>
          <span>{invoice.customer.email}</span>
        </li>
      </ul>
    </main>
  );
}
