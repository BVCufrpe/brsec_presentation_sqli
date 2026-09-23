import Link from "next/link";
import Image from "next/image";
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
      <section className="relative overflow-hidden w-full bg-gradient-to-b from-slate-950 via-indigo-600 to-slate-50 py-24 text-center px-4">

        <div className="absolute pointer-events-none inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
        <div className="relative z=10">
          <h1 
            className="text-6xl md:text-8xl font-black text-white mb-6 tracking-widest uppercase"
            style={{ fontFamily: 'var(--font-orbitron)' }}
          >
            Welcome
          </h1>

          <p 
            className="text-xl md:text-2xl text-slate-200 mb-10 max-w-2xl mx-auto"
            style={{ fontFamily: 'var(--font-chakra)' }}
          >
            This is a SQL Injection sandbox, good luck and have fun!
          </p>

          <Link href="/courses">
            <Button size="lg" className="text-lg px-8 cursor-pointer" style={{fontFamily: 'var(--font-chakra'}}>
              Browse All Courses
            </Button>
          </Link>
        </div>
      </section>

      <section className="w-full max-w-5xl py-20 px-12">
        <h2 className="text-3xl font-bold text-center mb-12 text-zinc-800" style={{fontFamily: 'var(--font-orbitron)'}}>
          Featured Courses
        </h2>
        <Carousel opts={{ align: "start", loop: true }} className="w-full">
          <CarouselContent>
            {featuredCourses.map((course: any) => (
              <CarouselItem key={course.uuid} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <Link href="/courses">
                    <Card className="shadow-sm hover:shadow-lg transition cursor-pointer border-zinc-200 hover:border-blue-300">
                      <CardContent className="flex flex-col items-center justify-center px-6 h-64 text-center gap-4">
                        <div className="w-45 h-30 bg-blue-100 rounded-full flex items-center justify-center transition-transform hover:scale-110">
                          <Image
                            src={course.thumb_url}
                            alt={course.name}
                            width={1000}
                            height={500}
                            className="w-full h-30 border rounded object-cover"
                          />
                        </div>
                        <h3 className="font-semibold text-lg text-zinc-800" style={{fontFamily: 'var(--font-orbitron)'}}>{course.name}</h3>
                        <p className="text-xl font-bold text-zinc-700" style={{fontFamily: 'var(--font-chakra)'}}>
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
