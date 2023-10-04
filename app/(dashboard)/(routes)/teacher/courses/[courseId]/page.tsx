import { IconBadge } from "@/components/icon-badge";
import { db } from "@/lib/db";
import {
  File,
  LayoutDashboard,
  ListChecks,
  LucideAirplay,
  LucideCheck,
} from "lucide-react";
import { redirect } from "next/navigation";
import { TitleForm } from "./_components/title-form";
import { DescriptionForm } from "./_components/description-form";
import { ImageForm } from "./_components/image-form";
import { CategoryForm } from "./_components/category-form";
import { PriceForm } from "./_components/price-form";
import { AttachmentForm } from "./_components/attachment-form";

const CourseIdPage = async ({
  params,
}: {
  params: {
    courseId: string;
  };
}) => {
  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
    },
    include: {
      attachments: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  // console.log(categories)

  if (!course) {
    return redirect("/");
  }

  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.price,
    course.categoryId,
  ];

  const totalfields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completiontext = `${completedFields} of ${totalfields} fields completed`;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2 ">
          <h1 className="text-2xl font-medium">Course Setup</h1>
          <span className="text-sm text-slate-700">{completiontext}</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div>
          <div className="flex items-center gap-x-2">
            <IconBadge icon={LayoutDashboard} variant="success" />
            <h2 className="text-xl">Customize your course</h2>
          </div>

          <TitleForm initialData={course} courseId={course.id} />
          <DescriptionForm initialData={course} courseId={course.id} />
          <ImageForm initialData={course} courseId={course.id} />
          <CategoryForm
            initialData={course}
            courseId={course.id}
            options={categories.map((category) => ({
              label: category.name,
              value: category.id,
            }))}
          />
        </div>
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={ListChecks} />
              <h2 className="text-xl">Course Chapters</h2>
            </div>
            <div className="pt-2">TODO: Chapters</div>
          </div>
          <div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={LucideCheck} />
                <h2 className="text-xl">Course Price</h2>
              </div>
              <div className="pt-2">TODO: Preview</div>
              <PriceForm initialData={course} courseId={course.id} />
            </div>
          </div>
          <div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={File} />
                <h2 className="text-xl">Course Attachments</h2>
              </div>
              <AttachmentForm initialData={course} courseId={course.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseIdPage;
