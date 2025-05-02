// src/app/admin/page.tsx
'use client';

import { StatCard } from "@/components/admin/stat-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { dashboardStats, salesData, orderStatusChartData } from "@/lib/admin-mock-data";
import { DollarSign, Package, ShoppingCart, Users, Activity } from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartBar,
  ChartBarLayer, // Renamed from Bar
  ChartPie,
  ChartPieLayer, // Renamed from Pie
  ChartXAxis,
  ChartYAxis,
  ChartCartesianGrid,
} from "@/components/ui/chart"; // Use updated imports

const chartConfig = {
  sales: {
    label: "Sales ($)",
    color: "hsl(var(--chart-1))",
  },
  // Configure colors for pie chart segments
  delivered: { label: "Delivered", color: "hsl(var(--chart-1))" },
  shipped: { label: "Shipped", color: "hsl(var(--chart-2))" },
  processing: { label: "Processing", color: "hsl(var(--chart-3))" },
  pending: { label: "Pending", color: "hsl(var(--chart-4))" },
  cancelled: { label: "Cancelled", color: "hsl(var(--chart-5))" },
};


export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 animate-fade-in">
        <StatCard
          title="Total Sales"
          value={`$${dashboardStats.totalSales.toFixed(2)}`}
          icon={DollarSign}
          description="+20.1% from last month" // Example description
        />
        <StatCard
          title="Total Orders"
          value={dashboardStats.totalOrders}
          icon={ShoppingCart}
          description="+15% from last month"
        />
        <StatCard
          title="Active Products"
          value={dashboardStats.activeProducts}
          icon={Package}
          description="+5 since last week"
        />
        <StatCard
          title="Total Customers"
          value={dashboardStats.totalCustomers}
          icon={Users}
          description="+50 since last month"
        />
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 animate-fade-in" style={{ animationDelay: '0.1s' }}>
        {/* Sales Chart */}
        <Card className="lg:col-span-4 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" /> Monthly Sales Overview
            </CardTitle>
            <CardDescription>Total sales for the last 6 months.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
             <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <ChartBar data={salesData} margin={{ left: 12, right: 12 }}>
                    <ChartCartesianGrid vertical={false} strokeDasharray="3 3" />
                    <ChartXAxis
                        dataKey="month"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tickFormatter={(value) => value.slice(0, 3)}
                    />
                    <ChartYAxis
                       tickLine={false}
                       axisLine={false}
                       tickMargin={8}
                       tickFormatter={(value) => `$${value / 1000}k`} // Format Y-axis ticks
                    />
                    <ChartTooltip
                       cursor={false}
                       content={<ChartTooltipContent hideLabel />}
                    />
                    <ChartBarLayer // Use ChartBarLayer
                        dataKey="sales"
                        fill="var(--color-sales)"
                        radius={8}
                        barSize={40} // Adjust bar size
                    />
                </ChartBar>
             </ChartContainer>
          </CardContent>
        </Card>

        {/* Order Status Chart */}
        <Card className="lg:col-span-3 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" /> Order Status Distribution
            </CardTitle>
            <CardDescription>Current breakdown of order statuses.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center [&>div]:aspect-square">
             <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[300px]">
                 <ChartPie data={orderStatusChartData}>
                     <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel indicator="dot" nameKey="status" />} // Use nameKey
                     />
                     <ChartPieLayer // Use ChartPieLayer
                       dataKey="count"
                       nameKey="status" // Ensure nameKey is set for tooltip mapping
                       cy="50%"
                       innerRadius={60}
                       outerRadius={110}
                       strokeWidth={2}
                       labelLine={false} // Hide label lines
                       label={({ percent }) => `${(percent * 100).toFixed(0)}%`} // Show percentage
                    />
                    <ChartLegend
                       content={<ChartLegendContent nameKey="status" />} // Ensure nameKey matches Pie's nameKey
                    />
                 </ChartPie>
             </ChartContainer>
          </CardContent>
        </Card>
      </div>

        {/* TODO: Add Recent Orders / Recent Activity Sections */}
       {/* <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <Card className="shadow-md">
                <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                    {/* Display a table or list of recent orders */}
                    {/* <p>Recent orders table goes here...</p> */}
                {/* </CardContent> */}
            {/* </Card> */}
       {/* </div> */}

    </div>
  );
}
