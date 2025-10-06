"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import {
  Box,
  Typography,
  ImageList,
  ImageListItem,
  IconButton,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Close";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { AppButton } from "@/components/ui/Buttons";
import { LoadingOverlay } from "@/components/ui/LoadingOverlay";

type ImageFile = {
  file: File;
  url: string;
};

export default function AIScanTab() {
  const MAXIMUM_IMAGES = 12;
  const [images, setImages] = useState<ImageFile[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const theme = useTheme();

  const handleFilesChange = (files: FileList | null) => {
    if (!files?.length) return;
    const allowed = MAXIMUM_IMAGES - images.length;
    const newImages: ImageFile[] = [];

    for (let i = 0; i < files.length && newImages.length < allowed; i++) {
      const imgFile = files[i];
      newImages.push({
        file: imgFile,
        url: URL.createObjectURL(imgFile),
      });
    }
    setImages((prev) => prev.concat(newImages));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (loading) return;
    handleFilesChange(e.dataTransfer.files);
  };

  const handleUploadClick = () => {
    if (!loading) inputRef.current?.click();
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
    setTimeout(() => setLoading(false), 3000);
  };

  return (
    <Box display="flex" flexDirection="column" height="100%" p={3}>
      {/* Drop Zone */}
      <Box
        flexGrow={1}
        position="relative"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        border={`2px dashed ${theme.palette.divider}`}
        borderRadius={3}
        bgcolor={theme.palette.background.paper}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        sx={{ p: 3, overflowY: "auto" }}
      >
        {/* ✅ Reusable Loading Overlay */}
        {loading && <LoadingOverlay message="Scanning..." />}

        {/* ✅ Content (blur when loading) */}
        <Box
          sx={{
            filter: loading ? "blur(2px)" : "none",
            pointerEvents: loading ? "none" : "auto",
            transition: "filter 0.3s ease-in-out",
            width: "100%",
          }}
        >
          {images.length === 0 ? (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
              p={5}
            >
              <AddPhotoAlternateIcon
                sx={{ fontSize: 80, color: theme.palette.text.secondary, mb: 2 }}
              />
              <Typography variant="h6" fontWeight={600}>
                Drag & Drop Images Here
              </Typography>
              <Typography variant="body2" color="text.secondary">
                or click below to upload (max {MAXIMUM_IMAGES} images)
              </Typography>
            </Box>
          ) : (
            <ImageList
              cols={4}
              gap={16}
              sx={{
                width: "100%",
                maxHeight: 400,
                overflowY: "auto",
                "&::-webkit-scrollbar": { display: "none" },
              }}
            >
              {images.map((img, idx) => (
                <ImageListItem
                  key={idx}
                  sx={{
                    position: "relative",
                    borderRadius: 2,
                    overflow: "hidden",
                    boxShadow: 1,
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Image
                    src={img.url}
                    alt={`uploaded-${idx}`}
                    width={500}
                    height={500}
                    style={{ objectFit: "cover", width: "100%", height: "100%" }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveImage(idx)}
                    sx={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      backgroundColor: "rgba(255,255,255,0.9)",
                      "&:hover": { backgroundColor: "rgba(255,255,255,1)" },
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </ImageListItem>
              ))}
            </ImageList>
          )}
        </Box>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFilesChange(e.target.files)}
          disabled={images.length >= MAXIMUM_IMAGES || loading}
        />
      </Box>

      {/* Buttons */}
      <Box display="flex" justifyContent="center" alignItems="center" gap={2} mt={3}>
        <AppButton
          variant="contained"
          onClick={handleUploadClick}
          disabled={loading || images.length >= MAXIMUM_IMAGES}
        >
          Upload Images
        </AppButton>

        <AppButton variant="contained" disabled={loading}>
          Use Scanner
        </AppButton>
      </Box>

      <Box display="flex" justifyContent="center" mt={4}>
        <AppButton
          variant="contained"
          color="primary"
          onClick={handleStartOrCancel}
          disabled={!loading && images.length === 0}
          sx={{ minWidth: 260, py: 2, fontSize: "1.1rem", fontWeight: 700 }}
        >
          {loading ? "Cancel Detection" : "Start Detection"}
        </AppButton>
      </Box>
    </Box>
  );
}
