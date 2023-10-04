"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Course } from "@prisma/client";
import axios from "axios";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { set, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

interface PriceFormProps {
  initialData: Course;
  courseId: string;
}

const FormSchema = z.object({
  price: z.coerce.number(),
});

export const PriceForm = ({ initialData, courseId }: PriceFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const toggleEditing = () => setIsEditing((prev) => !prev);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      price: initialData.price || undefined,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values);
      toast.success("Course updated");
      toggleEditing();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course Price
        <Button onClick={toggleEditing} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <p
          className={cn(
            "text-sm mt-2",
            !initialData.price && "text-slate-500 italic"
          )}
        >
          {initialData.price ? formatPrice(initialData.price) : "Not Price"}
        </p>
      )}

      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="price"
              render={({ field }: any) => (
                <FormItem>
                  <FormControl> 
                    <Input
                      type="number"
                      step="1000"
                      disabled={isSubmitting}
                      placeholder="atur harga course kamu "
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
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
