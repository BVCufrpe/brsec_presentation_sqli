import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default async function HomePage() {
  // Fetch data directly from the NestJS backend
  const res = await fetch("http://localhost:3001/courses", { cache: "no-store" });
  const json = await res.json();
  const featuredCourses = json.success ? json.data.slice(0, 5) : [];

  return (
    <div className="flex flex-col items-center w-full">
      <section className="w-full bg-zinc-100 py-24 text-center px-4">
        <h1 className="text-5xl font-extrabold text-zinc-900 mb-6">
          Welcome to PwnAcademy
        </h1>
        <p className="text-xl text-zinc-600 mb-8 max-w-2xl mx-auto">
          The premiere platform for learning computer science concepts, data structures, and advanced cybersecurity techniques.
        </p>
        <Link href="/courses">
          <Button size="lg" className="text-lg px-8">
            Browse All Courses
          </Button>
        </Link>
      </section>

      <section className="w-full max-w-5xl py-20 px-12">
        <h2 className="text-3xl font-bold text-center mb-12 text-zinc-800">
          Featured Courses
        </h2>
        <Carousel opts={{ align: "start", loop: true }} className="w-full">
          <CarouselContent>
            {featuredCourses.map((course: any) => (
              <CarouselItem key={course.uuid} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <Link href="/courses">
                    <Card className="shadow-sm hover:shadow-lg transition cursor-pointer border-zinc-200 hover:border-blue-300">
                      <CardContent className="flex flex-col items-center justify-center p-6 h-64 text-center gap-4">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-2 transition-transform hover:scale-110">
                          <span className="text-blue-600 font-bold">CS</span>
                        </div>
                        <h3 className="font-semibold text-lg text-zinc-800">{course.name}</h3>
                        <p className="text-xl font-bold text-zinc-700">
                          {course.isFree ? "FREE" : `$${course.price}`}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </section>
    </div>
  );
}
