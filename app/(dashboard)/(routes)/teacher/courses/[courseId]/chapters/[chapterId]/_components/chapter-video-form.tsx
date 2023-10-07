"use client";

import { FileUpload } from "@/components/file-upload";
import { Button } from "@/components/ui/button";

import MuxPlayer from '@mux/mux-player-react';

import { Chapter, Course, MuxData } from "@prisma/client";
import axios from "axios";
import { ImageIcon, Pencil, PlusCircle, Video } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import * as z from "zod";

interface ChapterVideoFormProps {
  initialData: Chapter & { muxData?: MuxData | null };
  courseId: string;
  chapterId: string;
}

const FormSchema = z.object({
  videoUrl: z.string().min(1),
});

export const ChapterVideoForm = ({
  initialData,
  courseId,
  chapterId,
}: ChapterVideoFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const toggleEditing = () => setIsEditing((prev) => !prev);

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
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
        Course Video
        <Button onClick={toggleEditing} variant="ghost">
          {isEditing && <>Cancel</>}
          {!isEditing && !initialData.videoUrl && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a Video
            </>
          )}

          {!isEditing && initialData.videoUrl && (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!initialData.videoUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <Video className="h-10 w-10  text-slate-500 " />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            <MuxPlayer playbackId={initialData?.muxData?.playbackId || ""}/>
          </div>
        ))}

      {isEditing && (
        <div>
          <FileUpload
            endpoint="courseVideo"
            onChange={(url) => {
              if (url) {
                onSubmit({ videoUrl : url });
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            Upload this chapter&apos;s video
          </div>
        </div>
      )}

      {initialData.videoUrl && !isEditing && (
        <div className="text-xs text-muted-foreground mt-2">Video take a minutes to upload</div>
      )}

    

    
      
    </div>
  );
};
