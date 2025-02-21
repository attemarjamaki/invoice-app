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
import { Invoices } from "@/db/schema";
import { cn } from "@/lib/utils";

export default async function Dashboard() {
  const results = await db.select().from(Invoices);
  console.log("results", results);
  return (
    <main className="container max-w-5xl h-full mx-auto py-12">
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
            <TableHead>Email</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-right">Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.map((result) => {
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
                    Michael Scott
                  </Link>
                </TableCell>
                <TableCell className="text-left">
                  <Link href={`invoices/${result.id}`} className="p-4 block">
                    michael.scott@dundermifflin.com
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
