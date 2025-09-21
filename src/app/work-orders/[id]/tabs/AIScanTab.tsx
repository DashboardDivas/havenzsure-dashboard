import React, { useRef, useState } from "react";

type ImageFile = {
  file: File;
  url: string;
};

export default function AIScanTab() {
  const MAXIMUM_IMAGES = 12;
  const [images, setImages] = useState<ImageFile[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFilesChange = (files: FileList | null) => {
    if (files == null || files.length === 0) return;
    const allowed = MAXIMUM_IMAGES - images.length;
    const newImages: ImageFile[] = [];
    for (let i = 0; i < files.length; i++) {
      if (newImages.length >= allowed) break;
      const imgFile = files[i];
      const myImgFile: ImageFile = {
        file: imgFile,
        url: URL.createObjectURL(imgFile),
      };
      newImages.push(myImgFile);
    }
    setImages((prev) => prev.concat(newImages));
  };

  const handleDropAction = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (loading) return;
    handleFilesChange(e.dataTransfer.files);
  };

  const handleUploadClick = () => {
    if (loading) return;
    inputRef.current?.click();
  };

  const handleRemoveImage = (idxToBeDeleted: number) => {
    URL.revokeObjectURL(images[idxToBeDeleted].url);
    setImages((prev) => prev.filter((_, i) => i !== idxToBeDeleted));
  };

  const handleStartOrCancel = () => {
    if (loading) {
      setLoading(false);
      return;
    }
    setLoading(true);
  };

  return (
    <div className="flex flex-col h-full" style={{ height: "100%" }}>
      <div className="flex flex-col flex-grow relative" style={{ flexBasis: "90%" }}>
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
          aria-busy={loading}
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
              filter: loading ? "blur(2px)" : "none",
              pointerEvents: loading ? "none" : "auto",
            }}
          >
            {images.length === 0 ? (
              <div className="col-span-4 row-span-3 flex flex-col items-center justify-center w-full h-full">
                <span
                  className="text-[#222e50] text-2xl font-bold text-center mb-2"
                  style={{ fontFamily: "inherit", letterSpacing: 0 }}
                >
                  Drag Image Here
                </span>
                <span
                  className="text-[#222e50] text-lg font-bold text-center"
                  style={{ fontFamily: "inherit", letterSpacing: 0 }}
                >
                  Maximum: {MAXIMUM_IMAGES} images
                </span>
              </div>
            ) : (
              images.map((img, idx) => (
                <div
                  key={idx}
                  className="w-full bg-white rounded-2xl shadow-lg flex items-center justify-center overflow-hidden relative"
                  style={{ maxHeight: "128px", border: "2px solid #e3eafc" }}
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
                    disabled={loading}
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>

            {loading && (
            <div
              className="absolute inset-0 flex flex-col items-center justify-center"
              style={{
              background: "rgba(255,255,255,0.65)",
              pointerEvents: "auto",
              }}
            >
              <div
              className="animate-spin rounded-full"
              style={{
                height: "128px",
                width: "128px",
                border: "10px solid #cfe0ff",
                borderTopColor: "#1769ff",
              }}
              aria-label="Loading"
              role="status"
              />
              <div className="mt-4 text-[#222e50] text-lg font-semibold" aria-live="polite">
              Loading...
              </div>
            </div>
            )}

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFilesChange(e.target.files)}
            disabled={images.length >= MAXIMUM_IMAGES || loading}
          />
        </div>
        <div className="flex items-center py-2 w-full" style={{ flexBasis: "10%" }}>
          <div className="flex-1" />
          <button
            className="px-6 py-2 bg-[#1769ff] text-white rounded-xl text-lg font-semibold hover:bg-[#0046b8]"
            onClick={handleUploadClick}
            disabled={images.length >= MAXIMUM_IMAGES || loading}
            style={{ minWidth: 160 }}
          >
            Upload Images
          </button>
          <div className="flex-1" />
          <button
            className="px-6 py-2 bg-[#1769ff] text-white rounded-xl text-lg font-semibold hover:bg-[#0046b8]"
            style={{ minWidth: 160 }}
            disabled={loading}
          >
            Use Scanner
          </button>
          <div className="flex-1" />
        </div>
      </div>
      <div className="flex items-center justify-center py-4" style={{ flexBasis: "10%" }}>
        <button
          className={`px-8 py-3 rounded-2xl text-xl font-bold ${loading
            ? "bg-[#1769ff] text-white hover:bg-[#0046b8]"
            : images.length === 0
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-[#1769ff] text-white hover:bg-[#0046b8]"
            }`}
          style={{ minWidth: 260 }}
          onClick={handleStartOrCancel}
          disabled={!loading && images.length === 0}
        >
          {loading ? "Cancel Detection" : "Start Detection"}
        </button>
      </div>
    </div>
  );
}