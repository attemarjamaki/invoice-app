import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { Customers, Invoices } from "@/db/schema";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CreditCard, CircleCheck } from "lucide-react";
import { createPayment, updateStatusAction } from "@/app/actions";
import Stripe from "stripe";

const stripe = new Stripe(String(process.env.STRIPE_API_SECRET));

interface InvoicePageProps {
  params: { invoiceId: string };
  searchParams: { status: string; session_id: string };
}

export default async function InvoicePage({
  params,
  searchParams,
}: InvoicePageProps) {
  const invoiceId = Number.parseInt(params.invoiceId);

  const sessionId = searchParams.session_id;
  const isSuccess = sessionId && searchParams.status === "success";
  const isCanceled = searchParams.status === "canceled";
  let isError = isSuccess && !sessionId;

  if (isNaN(invoiceId)) {
    throw new Error("Invalid Invoice ID");
  }

  if (isSuccess) {
    const { payment_status } = await stripe.checkout.sessions.retrieve(
      sessionId
    );

    if (payment_status !== "paid") {
      isError = true;
    } else {
      const formData = new FormData();
      formData.append("id", String(invoiceId));
      formData.append("status", "paid");
      await updateStatusAction(formData);
    }
  }

  const [result] = await db
    .select({
      id: Invoices.id,
      status: Invoices.status,
      createTs: Invoices.createTs,
      description: Invoices.description,
      value: Invoices.value,
      name: Customers.name,
    })
    .from(Invoices)
    .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
    .where(eq(Invoices.id, invoiceId))
    .limit(1);

  if (!result) {
    notFound();
  }

  const invoice = {
    ...result,
    customer: {
      name: result.name,
    },
  };

  return (
    <main className="container max-w-5xl mx-auto py-12 px-4">
      {isError && (
        <p className="bg-red-100 text-sm text-red-800 text-center px-3 py-2 rounded-lg mb-6">
          Something went wrong, please try again!
        </p>
      )}
      {isCanceled && (
        <p className="bg-yellow-100 text-sm text-yellow-800 text-center px-3 py-2 rounded-lg mb-6">
          Payment was canceled, please try again.
        </p>
      )}
      <div className="grid grid-cols-2">
        <div>
          <div className="flex items-center justify-between mb-8">
            <h1 className="flex items-center gap-4 text-3xl font-semibold">
              Invoice {invoiceId}{" "}
              <Badge
                className={cn(
                  "capitalize",
                  invoice.status === "open" && "bg-blue-500",
                  invoice.status === "paid" && "bg-green-500",
                  invoice.status === "void" && "bg-orange-500",
                  invoice.status === "uncollectible" && "bg-red-500"
                )}
              >
                {invoice.status}
              </Badge>
            </h1>
          </div>
          <p className="text-3xl mb-3">${(invoice.value / 100).toFixed(2)}</p>

          <p className="text-lg mb-8">{invoice.description}</p>
        </div>
        <div>
          <h2 className="font-semibold text-xl mb-4">Manage Invoice</h2>
          {invoice.status === "open" ? (
            <form action={createPayment}>
              <input type="hidden" name="id" value={invoice.id} />
              <Button className="font-semibold bg-green-700">
                <CreditCard />
                Pay Invoice
              </Button>
            </form>
          ) : (
            <p className="flex items-center gap-1 text-xl">
              <CircleCheck className="text-green-600" /> Invoice paid
            </p>
          )}
        </div>
      </div>

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
      </ul>
    </main>
  );
}
