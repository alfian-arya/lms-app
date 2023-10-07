"use client";

import { FileUpload } from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Attachment, Course } from "@prisma/client";
// import { TooltipProvider } from "@radix-ui/react-tooltip";
import axios from "axios";
import {
  Eye,
  File,
  ImageIcon,
  Loader,
  Loader2,
  Pencil,
  PlusCircle,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import * as z from "zod";

interface AttachmentFormProps {
  initialData: Course & { attachments: Attachment[] };
  courseId: string;
}

const FormSchema = z.object({
  url: z.string().min(1),
});

export const AttachmentForm = ({
  initialData,
  courseId,
}: AttachmentFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  const toggleEditing = () => setIsEditing((prev) => !prev);

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/attachments`, values);
      toast.success("Course updated");
      toggleEditing();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  const onDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
      toast.success("Attachment deleted");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setDeletingId(null);
    }
  };

  const onView = async (id: string, url: string) => {
    try {
      await axios.get(`/api/courses/${courseId}/attachments/${id}`)
      window.open(url, "_blank");
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course Attachments
        <Button onClick={toggleEditing} variant="ghost">
          {isEditing && <>Cancel</>}
          {!isEditing && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add an File
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <>
          {initialData.attachments.length === 0 && (
            <p className="text-sm mt-2 text-slate-500 italic">
              No Attachments Yet
            </p>
          )}

          {initialData.attachments.length > 0 && (
            <div className="space-y-2">
              {initialData.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md"
                >
                  <File className="h-4 w-4 mr-2 flex-shrink-0" />
                  <p className="text-xs line-clamp-1">{attachment.name}</p>
                  {deletingId === attachment.id && (
                    <div>
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  )}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        {deletingId !== attachment.id && (
                          <button
                            className="ml-auto hover:opacity-75 transition"
                            onClick={() => onView(attachment.id, attachment.url)}
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        )}

                        <TooltipContent>
                          <p>View</p>
                        </TooltipContent>
                      </TooltipTrigger>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        {deletingId !== attachment.id && (
                          <button
                            className="ml-auto hover:opacity-75 transition"
                            onClick={() => onDelete(attachment.id)}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}

                        <TooltipContent>
                          <p>Delete Attachments</p>
                        </TooltipContent>
                      </TooltipTrigger>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {isEditing && (
        <div>
          <FileUpload
            endpoint="courseAttachment"
            onChange={(url) => {
              if (url) {
                onSubmit({ url: url });
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            Add a resources for your students to download
          </div>
        </div>
      )}
    </div>
  );
};
