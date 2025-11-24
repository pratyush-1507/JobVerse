"use client";

import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  value: string;
  onChange: (url: string, publicId: string) => void;
  onRemove: () => void;
  disabled?: boolean;
}

const ImageUpload = ({
  value,
  onChange,
  onRemove,
  disabled,
}: ImageUploadProps) => {
  const handleUpload = (result: any) => {
    if (result.event === "success") {
      onChange(result.info.secure_url, result.info.public_id);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {value ? (
        <div className="relative w-48 h-48">
          <Image
            fill
            className="object-cover rounded-md"
            src={value}
            alt="Uploaded Image"
          />
          <Button
            type="button"
            variant="destructive"
            onClick={onRemove}
            className="mt-2"
          >
            Remove
          </Button>
        </div>
      ) : (
        <CldUploadWidget
          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!}
          onUpload={handleUpload}
        >
          {({ open }) => (
            <Button type="button" onClick={() => open?.()}>
              Upload Logo
            </Button>
          )}
        </CldUploadWidget>
      )}
    </div>
  );
};

export default ImageUpload;
