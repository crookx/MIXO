// src/app/admin/settings/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion"; // Import motion

export default function AdminSettingsPage() {
  return (
    <motion.div // Wrap entire page content in motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-6"
    >
      <h1 className="text-2xl md:text-3xl font-bold">Settings</h1>

      {/* Changed to flex-col for better stacking on mobile */}
      <div className="flex flex-col gap-6">
        {/* General Settings Card */}
        <Card className="shadow-sm card-glow">
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>Manage basic store settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="store-name">Store Name</Label>
              <Input id="store-name" defaultValue="ChronoThreads" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="support-email">Support Email</Label>
              <Input id="support-email" type="email" defaultValue="support@chronothreads.xyz" />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 sm:space-x-2 pt-2">
               <Label htmlFor="maintenance-mode" className="flex flex-col space-y-1 flex-grow">
                   <span>Maintenance Mode</span>
                   <span className="font-normal leading-snug text-muted-foreground">
                     Temporarily disable storefront access for updates.
                   </span>
                </Label>
               <Switch id="maintenance-mode" aria-label="Maintenance mode" className="flex-shrink-0" />
            </div>
            <Button className="mt-4 btn-animated">Save General Settings</Button>
          </CardContent>
        </Card>

        {/* Shipping Settings Card */}
        <Card className="shadow-sm card-glow">
          <CardHeader>
            <CardTitle>Shipping Settings</CardTitle>
            <CardDescription>Configure shipping zones and rates.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="space-y-1">
              <Label htmlFor="free-shipping-threshold">Free Shipping Threshold ($)</Label>
              <Input id="free-shipping-threshold" type="number" defaultValue="50" />
            </div>
             <div className="space-y-1">
              <Label htmlFor="flat-rate-shipping">Flat Rate Shipping Cost ($)</Label>
              <Input id="flat-rate-shipping" type="number" defaultValue="15" />
            </div>
            {/* Add more complex shipping options here */}
             <p className="text-sm text-muted-foreground pt-2">More shipping configurations coming soon...</p>
            <Button className="mt-4 btn-animated">Save Shipping Settings</Button>
          </CardContent>
        </Card>

         {/* Payment Settings Card (Placeholder) */}
         <Card className="shadow-sm card-glow"> {/* No md:col-span-2 needed in flex-col */}
             <CardHeader>
                <CardTitle>Payment Gateways</CardTitle>
                <CardDescription>Connect and manage payment providers.</CardDescription>
             </CardHeader>
             <CardContent>
                <p className="text-muted-foreground">Payment gateway integrations (Stripe, PayPal, etc.) will be configured here.</p>
                 {/* Placeholder for adding/configuring gateways */}
             </CardContent>
         </Card>

      </div>
    </motion.div>
  );
}
