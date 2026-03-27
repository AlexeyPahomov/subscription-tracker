import { Button } from '@heroui/react';

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans bg-black gap-10">
      <span className="text-3xl">Subscription tracker</span>
      <Button className="bg-purple-500 hover:bg-purple-400 transition-colors duration-200">
        Click me
      </Button>
    </div>
  );
}
