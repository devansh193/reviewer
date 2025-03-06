"use client";

import { cn } from "@/lib/utils";
import { Loader2Icon, UserIcon } from "lucide-react";
import React, { useState, useRef } from "react";
import { generateS3Url, uploadFileToS3 } from "@/lib/upload.utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { trpc } from "@/trpc/client";
import { toast } from "sonner";

type ImageUploaderProps = {
  value?: string | null;
  onChange?: (path: string | undefined) => void;
  className?: string;
};

export function ImageUploader({
  value,
  onChange,
  className,
}: ImageUploaderProps) {
  const [currentImage, setCurrentImage] = useState<string | undefined>(
    value || undefined
  );
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = trpc.s3.getPreSignedUrl.useMutation();

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    setLoading(true);
    const selectedFile = e.target.files[0];
    try {
      const { preSignedUrl, path } = await uploadMutation.mutateAsync({
        mimeType: selectedFile.type,
        fileName: selectedFile.name,
      });

      if (!preSignedUrl || !path) {
        toast.error("Failed to get pre-signed URL");
        setLoading(false);
        return;
      }
      await uploadFileToS3({ file: selectedFile, preSignedUrl });

      const imageUrl = generateS3Url(path);
      setCurrentImage(imageUrl);
      onChange?.(path);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      toast.error(`Upload failed. Please try again.${error}`);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("relative h-40 w-40", className)}>
      <Avatar className="h-full w-full">
        <AvatarImage src={currentImage} className="object-cover" />
        <AvatarFallback className="bg-secondary">
          <UserIcon className="h-16 w-16" />
        </AvatarFallback>
      </Avatar>

      <Input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={handleChange}
        accept=".pdf,.doc,.docx,.jpg,.jpeg"
        disabled={loading}
      />

      <Button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={loading}
      >
        {loading ? <Loader2Icon className="animate-spin" /> : "Upload Image"}
      </Button>
    </div>
  );
}
