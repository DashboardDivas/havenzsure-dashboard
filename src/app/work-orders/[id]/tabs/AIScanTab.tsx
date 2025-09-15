import React, { useRef, useState } from "react";

type ImageFile = {
  file: File;
  url: string;
};

export default function AIScanTab() {
  const MAXIMUM_IMAGES = 12;
  const [images, setImages] = useState<ImageFile[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFilesChange = (files: FileList | null) => {
    if (files == null || files.length == 0) return;
    const allowed = MAXIMUM_IMAGES - images.length;
    const newImages: ImageFile[] = [];
    for (let i = 0; i < files.length; i++) {
      if (newImages.length >= allowed) break;
      const imgFile = files[i];
      const myImgFile: ImageFile = {
        file: imgFile,
        url: URL.createObjectURL(imgFile)
      }
      newImages.push(myImgFile);
    }
    setImages((prev) => {
      let all = prev.concat(newImages);
      return all;
    });
  };

  const handleDropAction = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFilesChange(e.dataTransfer.files);
  };

  const handleUploadClick = () => {
    const inputComponent = inputRef.current;
    if (inputComponent != null) {
      inputComponent.click();
    }
  };

  const handleRemoveImage = (idxToBeDeleted: number) => {
    URL.revokeObjectURL(images[idxToBeDeleted].url); // Before we remove the image, we need to release the URL object
    function filterLogic(imageFileItem: ImageFile, imageIdx: number) {
      return imageIdx != idxToBeDeleted;
    }
    const filteredImages = images.filter(filterLogic);
    setImages(filteredImages);
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
              gap: "32px",
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
                  style={{ maxHeight: "128px", border: '2px solid #e3eafc' }}
                >
                  <img src={img.url} alt={`img-${idx}`} className="object-cover w-full h-full" />
                    <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    style={{
                      position: "absolute",
                      top: "3px",
                      right: "3px",
                      background: "#fff",
                      borderRadius: "9999px",
                      padding: "4px",
                      lineHeight: 1,
                      fontSize: "16px",
                    }}
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
            className="px-6 py-2 bg-[#1769ff] text-white rounded-xl text-lg font-semibold hover:bg-[#0046b8]"
            onClick={handleUploadClick}
            disabled={images.length >= MAXIMUM_IMAGES}
            style={{ minWidth: 160 }}
          >
            Upload Images
          </button>
          <div className="flex-1" />
          <button
            className="px-6 py-2 bg-[#1769ff] text-white rounded-xl text-lg font-semibold hover:bg-[#0046b8]"
            style={{ minWidth: 160 }}
          >
            Use Scanner
          </button>
          <div className="flex-1" />
        </div>
      </div>
      <div className="flex items-center justify-center py-4" style={{ flexBasis: "10%" }}>
        <button
          className={`px-8 py-3 rounded-2xl text-xl font-bold ${images.length === 0
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