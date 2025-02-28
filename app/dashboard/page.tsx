import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import Link from "next/link";
import { db } from "@/db";
import { Invoices, Customers } from "@/db/schema";
import { cn } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { and, eq, isNull } from "drizzle-orm";

export default async function Dashboard() {
  const { userId, orgId } = await auth();

  if (!userId) {
    return;
  }

  let results;

  if (orgId) {
    results = await db
      .select()
      .from(Invoices)
      .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
      .where(eq(Invoices.organizationId, orgId));
  } else {
    results = await db
      .select()
      .from(Invoices)
      .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
      .where(and(eq(Invoices.userId, userId), isNull(Invoices.organizationId)));
  }

  const invoices = results?.map(({ invoices, customers }) => {
    return {
      ...invoices,
      customer: customers,
    };
  });

  return (
    <main className="container max-w-5xl h-full mx-auto py-12 px-4">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-semibold">Invoices</h1>
        <p>
          <Button variant="ghost" asChild>
            <Link href="/invoices/new">
              <CirclePlus className="w-4 h-4" />
              Create Invoice
            </Link>
          </Button>
        </p>
      </div>

      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Date</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead className="hidden md:flex items-center">Email</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-right">Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((result) => {
            return (
              <TableRow key={result.id}>
                <TableCell className="text-left font-medium">
                  <Link
                    href={`invoices/${result.id}`}
                    className="font-semibold p-4 block"
                  >
                    {new Date(result.createTs).toLocaleDateString()}
                  </Link>
                </TableCell>
                <TableCell className="text-left">
                  <Link
                    href={`invoices/${result.id}`}
                    className="font-semibold p-4 block"
                  >
                    {result.customer.name}
                  </Link>
                </TableCell>
                <TableCell className="hidden md:flex items-centerS text-left">
                  <Link href={`invoices/${result.id}`} className="p-4 block">
                    {result.customer.email}
                  </Link>
                </TableCell>
                <TableCell className="text-center">
                  <Link href={`invoices/${result.id}`} className="p-4 block">
                    <Badge
                      className={cn(
                        "capitalize",
                        result.status === "open" && "bg-blue-500",
                        result.status === "paid" && "bg-green-500",
                        result.status === "void" && "bg-orange-500",
                        result.status === "ucollectible" && "bg-red-500"
                      )}
                    >
                      {result.status}
                    </Badge>
                  </Link>
                </TableCell>
                <TableCell className="text-right">
                  <Link
                    href={`invoices/${result.id}`}
                    className="font-semibold p-4 block"
                  >
                    ${(result.value / 100).toFixed(2)}
                  </Link>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </main>
  );
}
