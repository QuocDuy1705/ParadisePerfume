import React, { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";

const RichTextEditor = ({ value, onChange, height = 400 }) => {
  const editorRef = useRef(null);

  return (
    <Editor
      apiKey="ojpl2oqz1ru701p0n5hubkpa4z72gr8mzu509j157uzautf8"
      onInit={(evt, editor) => (editorRef.current = editor)}
      value={value}
      onEditorChange={onChange}
      init={{
        height: height,
        menubar: true,
        plugins: [
          "advlist",
          "autolink",
          "lists",
          "link",
          "image",
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
          "code",
          "help",
          "wordcount",
        ],
        toolbar:
          "undo redo | blocks | " +
          "bold italic forecolor | alignleft aligncenter " +
          "alignright alignjustify | bullist numlist outdent indent | " +
          "removeformat | link image | code | help",
        content_style: `
          body { 
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; 
            font-size: 14px;
            line-height: 1.6;
            color: #333;
          }
          h1, h2, h3, h4, h5, h6 {
            font-weight: 500;
            letter-spacing: 1px;
            text-transform: uppercase;
            margin: 30px 0 15px;
          }
          h2 {
            font-size: 24px;
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
          }
          p {
            margin-bottom: 15px;
          }
          ul, ol {
            margin: 15px 0;
            padding-left: 30px;
          }
          li {
            margin-bottom: 10px;
          }
          blockquote {
            margin: 20px 0;
            padding: 15px 25px;
            background: #fafafa;
            border-left: 4px solid #000;
            font-style: italic;
          }
          img {
            max-width: 100%;
            height: auto;
            margin: 20px 0;
          }
          a {
            color: #000;
            text-decoration: underline;
            font-weight: 500;
          }
        `,
        // Image upload handler
        images_upload_handler: (blobInfo, progress) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(blobInfo.blob());
            reader.onloadend = () => {
              resolve(reader.result);
            };
            reader.onerror = () => {
              reject("Image upload failed");
            };
          }),
        // Paste as plain text
        paste_as_text: false,
        // Smart paste
        smart_paste: true,
        // Auto resize
        autoresize_bottom_margin: 50,
        // Remove branding
        branding: false,
        // Promotion
        promotion: false,
      }}
    />
  );
};

export default RichTextEditor;
