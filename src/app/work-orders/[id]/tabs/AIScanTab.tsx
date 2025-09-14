import React, { useRef, useState } from "react";

interface ImageFile {
  url: string;
  file: File;
}

export default function AIScanTab() {
  const MAXIMUM_IMAGES = 12;
  const [images, setImages] = useState<ImageFile[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFilesChange = (files: FileList | null) => {
    if (!files) return;
    var allowed = MAXIMUM_IMAGES - images.length;
    var newImages: ImageFile[] = [];
    for (var i = 0; i < files.length && newImages.length < allowed; i++) {
      if (files[i].type.startsWith("image/")) {
        newImages.push({
          file: files[i],
          url: URL.createObjectURL(files[i])
        });
      }
    }
    setImages(function (prev) {
      var all = prev.concat(newImages);
      if (all.length > MAXIMUM_IMAGES) {
        all = all.slice(0, MAXIMUM_IMAGES);
      }
      return all;
    });
  };

  const handleDropAction = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFilesChange(e.dataTransfer.files);
  };

  const handleUploadClick = () => {
    inputRef.current?.click();
  };

  const handleRemoveImage = (idx: number) => {
    setImages((prev) => {
      URL.revokeObjectURL(prev[idx].url); // Before we remove the image, we need to release the URL object
      return prev.filter((imageFile, imageIndex) => imageIndex !== idx);
    });
  };

  return (
    <div className="flex flex-col h-full" style={{ height: "100%" }}>
      <div className="flex flex-col flex-grow" style={{ flexBasis: "90%" }}>
        <div
          className="flex-grow rounded-lg border border-dashed flex flex-col items-center justify-center p-4 overflow-auto"
          style={{
            minHeight: 0,
            background: "#f0f6ff",
            borderColor: "#b3d4fc",
            borderWidth: 2,
            borderStyle: "dashed",
          }}
          onDrop={handleDropAction}
          onDragOver={(e) => e.preventDefault()}
        >
          <div
            className="w-full"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gridTemplateRows: "repeat(3, minmax(0, 1fr))",
              gap: "2rem",
              height: "384px",
              alignItems: "center",
              justifyItems: "center",
            }}
          >
            {images.length === 0 ? (
              <div className="col-span-4 row-span-3 flex flex-col items-center justify-center w-full h-full">
                <span
                  className="text-[#222e50] text-2xl font-bold text-center mb-2"
                  style={{ fontFamily: 'inherit', letterSpacing: 0 }}
                >
                  Drag Image Here
                </span>
                <span
                  className="text-[#222e50] text-lg font-bold text-center"
                  style={{ fontFamily: 'inherit', letterSpacing: 0 }}
                >
                  Maximum: {MAXIMUM_IMAGES} images
                </span>
              </div>
            ) : (
              images.map((img, idx) => (
                <div
                  key={idx}
                  className="w-full bg-white rounded-2xl shadow-lg flex items-center justify-center overflow-hidden relative"
                  style={{ aspectRatio: "1 / 1", maxHeight: "128px", border: '2px solid #e3eafc' }}
                >
                  <img src={img.url} alt={`img-${idx}`} className="object-cover w-full h-full" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-2 right-2 bg-white bg-opacity-90 rounded-full p-1.5 hover:bg-red-500 hover:text-white text-gray-700 shadow-lg"
                    style={{ zIndex: 2, lineHeight: 1, fontSize: "1.25rem" }}
                    aria-label="Remove image"
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFilesChange(e.target.files)}
            disabled={images.length >= MAXIMUM_IMAGES}
          />
        </div>
        <div className="flex items-center py-2 w-full" style={{ flexBasis: "10%" }}>
          <div className="flex-1" />
          <button
            className="px-6 py-2 bg-[#1769ff] text-white rounded-xl text-lg font-semibold hover:bg-[#0046b8] transition-colors duration-150 mx-4"
            onClick={handleUploadClick}
            disabled={images.length >= MAXIMUM_IMAGES}
            style={{ minWidth: 160 }}
          >
            Upload Images
          </button>
          <div className="flex-1" />
          <button
            className="px-6 py-2 bg-[#1769ff] text-white rounded-xl text-lg font-semibold hover:bg-[#0046b8] transition-colors duration-150 mx-4"
            style={{ minWidth: 160 }}
          >
            Use Scanner
          </button>
          <div className="flex-1" />
        </div>
      </div>
      <div className="flex items-center justify-center py-4" style={{ flexBasis: "10%" }}>
        <button
          className={`px-8 py-3 rounded-2xl text-xl font-bold transition-colors duration-150 ${images.length === 0
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-[#1769ff] text-white hover:bg-[#0046b8]"}`}
          style={{ minWidth: 260 }}
          disabled={images.length === 0}
        >
          Start Detection
        </button>
      </div>
    </div>
  );
}