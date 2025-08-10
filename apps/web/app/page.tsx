import { Button } from "@repo/ui/components/button";

export default function Home() {
  const items = new Array(1000).fill(0).map((_, index) => index);

  return (
    <div className="flex h-screen items-center justify-center">
      <Button variant="default">Click Me</Button>
      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <div key={item}>{item}</div>
        ))}
      </div>
    </div>
  );
}
