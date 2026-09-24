"use client";
import { useRef, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from 'next/image';

export default function CoursesPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [category, setCategory] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const debounceTimer = useRef<ReturnType <typeof setTimeout> | null>(null);

  const fetchCourses = async (query: string ) => {
    setIsLoading(true);
    const url = query 
      ?`http://localhost:3001/courses?category=${query}` :"http://localhost:3001/courses";  
    try{
      const res = await fetch(url);
      const json = await res.json();
      if (json.success){
        setCourses(json.data)
      }
      else setCourses([]);
    }
    catch(error){
      setCourses([]);
    }
    finally{
      setIsLoading(false);
    }
  }

useEffect(() => {console.log(courses)}, [courses]);
  useEffect(() => {
    fetchCourses('');
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCategory(value);

    if (debounceTimer.current){
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      fetchCourses(value);
    }, 500);
  }

  const handleDelete = async (uuid: string) => {
    if (!confirm("Are you sure you want to delete this course?")) return;
    await fetch(`http://localhost:3001/courses/${uuid}`, { method: "DELETE" });
    fetchCourses(category); // Refresh list
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {

    if (e.key === 'Enter') {
      if (debounceTimer.current){
        clearTimeout(debounceTimer.current);
      }     
      fetchCourses(category);
    }
  }

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
      fetchCourses(category); // Refresh list
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto w-full">
      <h1 className="text-3xl font-bold mb-8 text-zinc-800">Available Courses</h1>
      <div className="flex items-center pb-6 gap-3 w-full">
        <Input 
          type="text"
          placeholder="Search for courses..."
          value={category}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
        />

      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {isLoading && (
          <div className="col-span-full text-center py-12 text-zinc-400 animate-pulse">
            Loading...
          </div>
        )}

        {!isLoading && courses.map((course) => (
          <Card key={course.uuid} className="flex flex-col">
            <Image src={course.thumb_url} alt={course.name} width={400} height={225} className="w-full h-40 object-cover"/>
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
