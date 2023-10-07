"use client";

import { Editor } from "@/components/editor";
import { Preview } from "@/components/preview";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Chapter, Course } from "@prisma/client";
import axios from "axios";
import { Check, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { set, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

interface ChapterAccessFormProps {
  initialData: Chapter;
  courseId: string;
  chapterId: string;
}

const FormSchema = z.object({
  isFree: z.boolean().default(false),
});

export const ChapterAccessForm = ({
  initialData,
  courseId,
  chapterId,
}: ChapterAccessFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const toggleEditing = () => setIsEditing((prev) => !prev);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      isFree: Boolean(initialData.isFree),
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {
      await axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}`,
        values
      );
      toast.success("Chapter updated");
      toggleEditing();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course Access Settings
        <Button onClick={toggleEditing} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit Access
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <div
          className={cn(
            "text-sm mt-2",
            !initialData.isFree && "text-slate-500 italic"
          )}
        >
          {initialData.isFree ? (
            <>This chapter is free</>
          ) : (
            <>This chapter is not free</>
          )}
        </div>
      )}

      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="isFree"
              render={({ field }: any) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormDescription>
                      Centang ini jika chapter ini gratis
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
