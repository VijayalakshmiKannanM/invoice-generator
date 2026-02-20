import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { FileText, Users, DollarSign, Clock } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';

async function getDashboardData(userId: string) {
  const [invoiceCount, customerCount, invoices] = await Promise.all([
    prisma.invoice.count({ where: { userId } }),
    prisma.customer.count({ where: { userId } }),
    prisma.invoice.findMany({
      where: { userId },
      select: { total: true, status: true },
    }),
  ]);

  const totalRevenue = invoices
    .filter((inv) => inv.status === 'PAID')
    .reduce((sum, inv) => sum + inv.total, 0);

  const pendingAmount = invoices
    .filter((inv) => inv.status === 'SENT' || inv.status === 'OVERDUE')
    .reduce((sum, inv) => sum + inv.total, 0);

  return { invoiceCount, customerCount, totalRevenue, pendingAmount };
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return null;
  }

  const { invoiceCount, customerCount, totalRevenue, pendingAmount } =
    await getDashboardData(userId);

  const stats = [
    {
      name: 'Total Invoices',
      value: invoiceCount.toString(),
      icon: FileText,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
    },
    {
      name: 'Customers',
      value: customerCount.toString(),
      icon: Users,
      color: 'text-green-600',
      bg: 'bg-green-100',
    },
    {
      name: 'Total Revenue',
      value: formatCurrency(totalRevenue),
      icon: DollarSign,
      color: 'text-purple-600',
      bg: 'bg-purple-100',
    },
    {
      name: 'Pending',
      value: formatCurrency(pendingAmount),
      icon: Clock,
      color: 'text-orange-600',
      bg: 'bg-orange-100',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-500">Overview of your invoicing activity</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                {stat.name}
              </CardTitle>
              <div className={`p-2 rounded-full ${stat.bg}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link
              href="/dashboard/invoices/new"
              className="flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
            >
              <FileText className="h-5 w-5 text-blue-600 mr-3" />
              <span className="font-medium text-blue-900">Create New Invoice</span>
            </Link>
            <Link
              href="/dashboard/customers"
              className="flex items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition"
            >
              <Users className="h-5 w-5 text-green-600 mr-3" />
              <span className="font-medium text-green-900">Manage Customers</span>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-600">
            <ol className="list-decimal list-inside space-y-2">
              <li>Add your first customer</li>
              <li>Create an invoice with line items</li>
              <li>Download as PDF and send to your client</li>
              <li>Track payment status</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
