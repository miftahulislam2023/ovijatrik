"use client";

import { useCallback, useId, useMemo, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";

import "tinymce/tinymce";
import "tinymce/models/dom/model";
import "tinymce/themes/silver";
import "tinymce/icons/default";
import "tinymce/skins/ui/oxide/skin.min.css";
import "tinymce/skins/content/default/content.min.css";

import "tinymce/plugins/advlist";
import "tinymce/plugins/autolink";
import "tinymce/plugins/link";
import "tinymce/plugins/image";
import "tinymce/plugins/lists";
import "tinymce/plugins/charmap";
import "tinymce/plugins/preview";
import "tinymce/plugins/anchor";
import "tinymce/plugins/searchreplace";
import "tinymce/plugins/visualblocks";
import "tinymce/plugins/code";
import "tinymce/plugins/fullscreen";
import "tinymce/plugins/insertdatetime";
import "tinymce/plugins/media";
import "tinymce/plugins/table";
import "tinymce/plugins/help";
import "tinymce/plugins/help/js/i18n/keynav/en";
import "tinymce/plugins/wordcount";

type RichTextEditorFieldProps = {
  name: string;
  label: string;
  initialValue?: string;
  placeholder?: string;
  minHeight?: number;
  uploadInlineImage: (file: File) => Promise<string>;
};

export function RichTextEditorField({
  name,
  label,
  initialValue = "",
  placeholder,
  minHeight = 320,
  uploadInlineImage,
}: RichTextEditorFieldProps) {
  const [content, setContent] = useState(initialValue);
  const inputId = useId();

  const uploadEditorImage = useCallback(
    async (
      blobInfo: { blob: () => Blob; filename: () => string },
      progress: (percent: number) => void,
    ): Promise<string> => {
      const file = new File([blobInfo.blob()], blobInfo.filename(), {
        type: blobInfo.blob().type || "image/png",
      });

      const location = await uploadInlineImage(file);
      if (!location) {
        throw new Error("Image URL was not returned by upload action");
      }

      progress(100);
      return location;
    },
    [uploadInlineImage],
  );

  const editorInit = useMemo(
    () => ({
      menubar: false,
      min_height: minHeight,
      branding: false,
      statusbar: false,
      placeholder,
      skin: false,
      content_css: false,
      automatic_uploads: true,
      images_upload_handler: uploadEditorImage,
      file_picker_types: "image",
      plugins: [
        "advlist",
        "autolink",
        "link",
        "image",
        "lists",
        "charmap",
        "preview",
        "anchor",
        "searchreplace",
        "visualblocks",
        "code",
        "fullscreen",
        "insertdatetime",
        "media",
        "table",
        "help",
        "wordcount",
      ],
      toolbar:
        "undo redo | formatselect | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | removeformat code",
      content_style:
        "body { font-family: Georgia, 'Times New Roman', serif; font-size: 16px; line-height: 1.7; }",
    }),
    [minHeight, placeholder, uploadEditorImage],
  );

  return (
    <div className="space-y-2">
      <label
        htmlFor={inputId}
        className="text-sm font-semibold text-slate-600 dark:text-slate-300"
      >
        {label}
      </label>
      <Editor
        id={inputId}
        licenseKey="gpl"
        value={content}
        init={editorInit}
        onEditorChange={setContent}
      />
      <input type="hidden" name={name} value={content} />
    </div>
  );
}
