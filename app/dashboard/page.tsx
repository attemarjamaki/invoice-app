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

export default function Dashboard() {
  return (
    <main className="flex flex-col justify-center text-center gap-6 max-w-5xl mx-auto py-12">
      <div className="flex justify-between">
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
          <TableRow>
            <TableCell className="text-left font-medium">
              <span className="font-semibold">02/14/2025</span>
            </TableCell>
            <TableCell className="text-left">
              <span className="font-semibold">Michael Scott</span>
            </TableCell>
            <TableCell className="text-left">
              <span>michael.scott@dundermifflin.com</span>
            </TableCell>
            <TableCell className="text-center">
              <Badge>Open</Badge>
            </TableCell>
            <TableCell className="text-right">
              <span className="font-semibold">$250.00</span>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </main>
  );
}
