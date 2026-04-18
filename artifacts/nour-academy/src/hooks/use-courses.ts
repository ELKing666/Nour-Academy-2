import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface CourseStat { value: string; label: string; }
export interface CourseTopic { num: string; title: string; desc: string; tags: string[]; }

export interface Course {
  id: string;
  title: string;
  description: string;
  price: string;
  duration: string;
  image_url: string;
  icon: string;
  category: "adults" | "kids";
  is_featured: boolean;
  sort_order: number;
  badge: string | null;
  stats: CourseStat[] | null;
  topics: CourseTopic[] | null;
  for_whom: string[] | null;
  created_at: string;
  updated_at: string;
}

export type CourseInput = Omit<Course, "created_at" | "updated_at">;

function getBase() {
  return import.meta.env.BASE_URL.replace(/\/$/, "");
}

async function fetchCourses(): Promise<Course[]> {
  const res = await fetch(`${getBase()}/api/courses`);
  if (!res.ok) throw new Error("fetch failed");
  return res.json();
}

async function fetchCourse(id: string): Promise<Course> {
  const res = await fetch(`${getBase()}/api/courses/${id}`);
  if (!res.ok) throw new Error("not found");
  return res.json();
}

export function useCourses() {
  return useQuery<Course[]>({
    queryKey: ["courses"],
    queryFn: fetchCourses,
    staleTime: 2 * 60 * 1000,
  });
}

export function useCourse(id: string) {
  return useQuery<Course>({
    queryKey: ["courses", id],
    queryFn: () => fetchCourse(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
  });
}

export function useCreateCourse() {
  const queryClient = useQueryClient();
  return useMutation<Course, Error, { password: string; course: CourseInput }>({
    mutationFn: async ({ password, course }) => {
      const res = await fetch(`${getBase()}/api/admin/courses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${password}`,
        },
        body: JSON.stringify(course),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error || "فشل الإنشاء");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
}

export function useUpdateCourse() {
  const queryClient = useQueryClient();
  return useMutation<Course, Error, { password: string; id: string; course: Partial<CourseInput> }>({
    mutationFn: async ({ password, id, course }) => {
      const res = await fetch(`${getBase()}/api/admin/courses/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${password}`,
        },
        body: JSON.stringify(course),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error || "فشل التحديث");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
}

export function useDeleteCourse() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { password: string; id: string }>({
    mutationFn: async ({ password, id }) => {
      const res = await fetch(`${getBase()}/api/admin/courses/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${password}` },
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error || "فشل الحذف");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
}
