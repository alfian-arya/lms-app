import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();


//handel auth
// const handleAuth = () => {
//   const { userId } = auth();
//   if (!userId) throw new Error("Not logged in");
//   return { userId };
// };


// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  courseImage: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  }).onUploadComplete(() => {}),

  courseAttachment: f([
    "text",
    "image",
    "video",
    "audio",
    "pdf",
  ]).onUploadComplete(() => {}),

  courseVideo: f({video: { maxFileSize: "4GB", maxFileCount: 1 }}).onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
