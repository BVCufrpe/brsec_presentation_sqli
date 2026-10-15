"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CoursesPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);

  const fetchCourses = async () => {
    const res = await fetch("http://localhost:3001/courses");
    const json = await res.json();
    if (json.success) setCourses(json.data);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDelete = async (uuid: string) => {
    if (!confirm("Are you sure you want to delete this course?")) return;
    await fetch(`http://localhost:3001/courses/${uuid}`, { method: "DELETE" });
    fetchCourses(); // Refresh list
  };

  const handleEdit = async (course: any) => {
    const newPrice = prompt(`Enter new price for ${course.name}:`, course.price);
    if (newPrice !== null && !isNaN(Number(newPrice))) {
      await fetch(`http://localhost:3001/courses/${course.uuid}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: course.name,
          description: course.description,
          price: Number(newPrice),
        }),
      });
      fetchCourses(); // Refresh list
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto w-full">
      <h1 className="text-3xl font-bold mb-8 text-zinc-800">Available Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card key={course.uuid} className="flex flex-col">
          <div className="h-40 bg-zinc-200 rounded-t-lg flex items-center justify-center p-4">
          {/* Using a standard img tag for SVGs keeps styling simple */}
            <img src={course.img_uri} alt={course.name} className="h-full object-contain drop-shadow-md" />
          </div>
            <CardHeader>
              <CardTitle>{course.name}</CardTitle>
              <CardDescription>{course.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-2xl font-bold">
                {course.isFree ? "FREE" : `$${course.price}`}
              </p>
            </CardContent>
            <CardFooter className="flex justify-between gap-2 flex-wrap">
              <Button className="w-full" variant={course.isFree ? "outline" : "default"}>
                {course.isFree ? "Start Now" : "Purchase"}
              </Button>

              {/* ADMIN CONTROLS */}
              {user?.isAdmin && (
                <div className="flex gap-2 w-full mt-2">
                  <Button onClick={() => handleEdit(course)} variant="secondary" className="w-full text-blue-600">
                    Edit Price
                  </Button>
                  <Button onClick={() => handleDelete(course.uuid)} variant="destructive" className="w-full">
                    Delete
                  </Button>
                </div>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
