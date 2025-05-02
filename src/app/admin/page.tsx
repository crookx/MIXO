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
import { motion } from "framer-motion"; // Import motion

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
    <motion.div // Wrap entire page content in motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-6"
    >
      <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>

      {/* Stat Cards */}
      <motion.div // Add motion to the stats grid
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.05 } } // Stagger children animation
        }}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        {[
          { title: "Total Sales", value: `$${dashboardStats.totalSales.toFixed(2)}`, icon: DollarSign, description: "+20.1% from last month" },
          { title: "Total Orders", value: dashboardStats.totalOrders, icon: ShoppingCart, description: "+15% from last month" },
          { title: "Active Products", value: dashboardStats.activeProducts, icon: Package, description: "+5 since last week" },
          { title: "Total Customers", value: dashboardStats.totalCustomers, icon: Users, description: "+50 since last month" }
        ].map((stat, index) => (
          <motion.div // Add motion to each stat card
            key={stat.title}
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: { opacity: 1, y: 0 }
            }}
          >
            <StatCard
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              description={stat.description}
              className="card-glow" // Added glow effect
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Section */}
      <motion.div // Add motion to the charts grid
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }} // Delay chart animation slightly
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-7"
      >
        {/* Sales Chart */}
        <Card className="lg:col-span-4 shadow-md card-glow"> {/* Added glow */}
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" /> Monthly Sales Overview
            </CardTitle>
            <CardDescription>Total sales for the last 6 months.</CardDescription>
          </CardHeader>
          <CardContent className="pl-0 pr-2 sm:pl-2"> {/* Adjust padding for responsiveness */}
             <ChartContainer config={chartConfig} className="h-[250px] sm:h-[300px] w-full"> {/* Adjust height */}
                <ChartBar data={salesData} margin={{ left: 0, right: 0, top: 5, bottom: 0 }}> {/* Adjust margins */}
                    <ChartCartesianGrid vertical={false} strokeDasharray="3 3" />
                    <ChartXAxis
                        dataKey="month"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tickFormatter={(value) => value.slice(0, 3)}
                        fontSize={12} // Ensure font size is appropriate
                    />
                    <ChartYAxis
                       tickLine={false}
                       axisLine={false}
                       tickMargin={8}
                       tickFormatter={(value) => `$${value / 1000}k`} // Format Y-axis ticks
                       fontSize={12} // Ensure font size is appropriate
                       width={40} // Adjust width for Y-axis labels
                    />
                    <ChartTooltip
                       cursor={false}
                       content={<ChartTooltipContent hideLabel />}
                    />
                    <ChartBarLayer // Use ChartBarLayer
                        dataKey="sales"
                        fill="var(--color-sales)"
                        radius={5} // Slightly smaller radius
                        barSize={30} // Adjust bar size
                    />
                </ChartBar>
             </ChartContainer>
          </CardContent>
        </Card>

        {/* Order Status Chart */}
        <Card className="lg:col-span-3 shadow-md card-glow"> {/* Added glow */}
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" /> Order Status Distribution
            </CardTitle>
            <CardDescription>Current breakdown of order statuses.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center [&>div]:aspect-square">
             <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px] sm:max-h-[300px]"> {/* Adjust height */}
                 <ChartPie data={orderStatusChartData}>
                     <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel indicator="dot" nameKey="status" />} // Use nameKey
                     />
                     <ChartPieLayer // Use ChartPieLayer
                       dataKey="count"
                       nameKey="status" // Ensure nameKey is set for tooltip mapping
                       cy="50%"
                       innerRadius={50} // Adjust radius
                       outerRadius={90} // Adjust radius
                       strokeWidth={2}
                       labelLine={false} // Hide label lines
                       label={({ percent }) => `${(percent * 100).toFixed(0)}%`} // Show percentage
                       labelPosition="inside" // Place label inside for smaller screens
                       className="text-xs fill-background stroke-background" // Style label
                    />
                    <ChartLegend
                       content={<ChartLegendContent nameKey="status" className="text-xs flex-wrap justify-center gap-x-4 gap-y-1 mt-4" />} // Ensure nameKey matches, adjust styling
                    />
                 </ChartPie>
             </ChartContainer>
          </CardContent>
        </Card>
      </motion.div>

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

    </motion.div>
  );
}
