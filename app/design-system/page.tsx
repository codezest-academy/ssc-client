import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        <header className="flex justify-between items-center border-b pb-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Design System</h1>
            <p className="text-muted-foreground mt-2">A showcase of UI components used in the client project.</p>
          </div>
        </header>

        {/* Colors & Typography */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold border-b pb-2">Typography & Colors</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold">Heading 1</h1>
              <h2 className="text-3xl font-semibold">Heading 2</h2>
              <h3 className="text-2xl font-semibold">Heading 3</h3>
              <h4 className="text-xl font-semibold">Heading 4</h4>
              <p className="text-base">Regular paragraph text. The quick brown fox jumps over the lazy dog.</p>
              <p className="text-sm text-muted-foreground">Muted smaller text for descriptions.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-primary text-primary-foreground p-4 rounded-md flex items-center justify-center font-medium">Primary</div>
              <div className="bg-secondary text-secondary-foreground p-4 rounded-md flex items-center justify-center font-medium">Secondary</div>
              <div className="bg-destructive text-destructive-foreground p-4 rounded-md flex items-center justify-center font-medium">Destructive</div>
              <div className="bg-muted text-muted-foreground p-4 rounded-md flex items-center justify-center font-medium">Muted</div>
              <div className="bg-accent text-accent-foreground p-4 rounded-md flex items-center justify-center font-medium">Accent</div>
              <div className="bg-card text-card-foreground p-4 rounded-md border flex items-center justify-center font-medium">Card</div>
            </div>
          </div>
        </section>

        {/* Buttons */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold border-b pb-2">Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="default">Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
            <Button disabled>Disabled</Button>
          </div>
        </section>

        {/* Form Elements */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold border-b pb-2">Form Elements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4 max-w-sm">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input type="email" id="email" placeholder="Email address" />
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" />
                <Label htmlFor="terms">Accept terms and conditions</Label>
              </div>
            </div>
          </div>
        </section>

        {/* Components */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold border-b pb-2">Components (Cards)</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Card Description goes here.</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Content of the card is placed here. It can have text, images, or other components.</p>
              </CardContent>
              <CardFooter>
                <Button>Action</Button>
              </CardFooter>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}
