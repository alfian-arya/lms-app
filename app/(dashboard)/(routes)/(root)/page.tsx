import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <div className="p-6">
      <div>Hello World!</div>
      <p className="text-3xl font-medium text-sky-700">Hello World</p>
      <Button variant="outline">Click me!</Button>
    </div>
  );
}
