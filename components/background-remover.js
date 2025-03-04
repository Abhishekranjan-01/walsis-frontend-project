"use client";
import { useState, useRef } from "react";
import { Upload, ImageIcon, CheckCircle } from "lucide-react";
import ImagePreview from "./image-preview";
import { addBackgroundImageUrl, removeBg } from "@/api/api";
import Compressor from "compressorjs";
import ImageEditingOptions from "./ImageEditingOptions";

export default function BackgroundRemover() {
  const [originalImage, setOriginalImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const urlInputRef = useRef(null);
  const [imageState, setImageState] = useState(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0]; // Get the selected file
    if (file) {
      localStorage.removeItem("image_url");
      setIsProcessing(true);
      // Compress the uploaded image
      new Compressor(file, {
        quality: 0.75,
        maxWidth: 800,
        maxHeight: 600,
        resize: true,
        async success(result) {
          try {
            // Convert the compressed image to a base64 string and store it
            const reader = new FileReader();
            reader.onloadend = async function () {
              const base64CompressedImage = reader.result; // Base64 string of compressed image

              // Store the compressed image in localStorage
              localStorage.setItem("originalImage", base64CompressedImage);

              // Set the compressed image as the preview
              setOriginalImage(base64CompressedImage); // Use the compressed image as the original image

              // Now, make the API call to process the image
              const resultBlob = await removeBg({
                blob: result,
                image_url: null,
              });

              // Convert the resultBlob to base64 and store it as processedImage
              const resultReader = new FileReader();
              resultReader.onloadend = function () {
                const base64ProcessedImage = resultReader.result;

                // Store the processed image in localStorage
                localStorage.setItem("processedImage", base64ProcessedImage);

                // Set the processed image as the preview
                // const outputImage = document.getElementById("PROCESSED_IMAGE");
                // outputImage.src = base64ProcessedImage; // Show processed image in preview
                setProcessedImage(base64ProcessedImage); // Optionally update state
                setIsProcessing(false);
              };

              resultReader.readAsDataURL(resultBlob); // Read the result blob from the API
            };

            reader.readAsDataURL(result); // Read the compressed image as base64
          } catch (error) {
            console.log("Error compressing and processing image:", error);
          }
        },
        error(err) {
          console.error("Compression error:", err);
        },
      });
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      const file = event.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        setOriginalImage(e.target.result);
        processImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleUrlSubmit = async () => {
    const url = urlInputRef.current.value;
    if (url) {
      setError(null);
      setOriginalImage(url);
      localStorage.setItem("originalImage", url);
      localStorage.setItem("image_url", url);
      processImage(url);
      const resultBlob = await removeBg({ blob: null, image_url: url });
      // Convert the resultBlob to base64 and store it as processedImage
      const resultReader = new FileReader();
      resultReader.onloadend = function () {
        const base64ProcessedImage = resultReader.result;

        // Store the processed image in localStorage
        localStorage.setItem("processedImage", base64ProcessedImage);

        // Set the processed image as the preview
        // const outputImage = document.getElementById("PROCESSED_IMAGE");
        // outputImage.src = base64ProcessedImage; // Show processed image in preview
        setProcessedImage(base64ProcessedImage); // Optionally update state
        setIsProcessing(false);
      };

      resultReader.readAsDataURL(resultBlob); // Read the result blob from the API
    }

    // reader.readAsDataURL(result); // Read the compressed image as base64
  };

  const processImage = async (imageData) => {
    setIsProcessing(true);
    setProcessedImage(null);

    try {
      // In a real application, you would call an API here
      // For this demo, we'll simulate processing with a timeout
      // and use a placeholder transparent background image

      await new Promise((resolve) => setTimeout(resolve, 2000));

      // This is a simplified simulation - in a real app you would
      // call a background removal API like remove.bg or use a library

      // For demo purposes, we're just using the same image
      // In a real app, this would be the processed image from the API
      setProcessedImage(imageData);
    } catch (err) {
      setError("Failed to process image. Please try again.");
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTryAgain = () => {
    setOriginalImage(null);
    setProcessedImage(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (urlInputRef.current) {
      urlInputRef.current.value = "";
    }
  };

  const handleDownload = () => {
    if (processedImage) {
      const link = document.createElement("a");
      link.href = processedImage;
      link.download = "removed-background.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-4 text-center">
        Remove Image Background
      </h1>
      <div className="text-center mb-8">
        <span className="text-gray-700">100% Automatically and </span>
        <span className="bg-yellow-200 px-2 py-1 rounded text-yellow-800 font-medium">
          Free
        </span>
      </div>

      {!originalImage ? (
        <div
          className="w-full max-w-md bg-white rounded-lg shadow-md p-8 mb-8"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 mb-4 hover:border-blue-500 transition-colors">
            <Upload className="w-12 h-12 text-gray-400 mb-4" />
            <button
              onClick={() => fileInputRef.current.click()}
              className="bg-blue-600 text-white font-medium py-2 px-6 rounded-md mb-4 hover:bg-blue-700 transition-colors"
            >
              Upload Image
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />
            <p className="text-gray-500 text-center">or drop a file,</p>
            <div className="flex items-center mt-4 w-full">
              <input
                type="text"
                ref={urlInputRef}
                placeholder="paste image URL"
                className="flex-1 border border-gray-300 rounded-l-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleUrlSubmit}
                className="bg-gray-200 text-gray-700 py-2 px-3 rounded-r-md text-sm hover:bg-gray-300 transition-colors"
              >
                Go
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-4xl">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex flex-col  sm:flex-row-reverse gap-8 ">
              <ImageEditingOptions
                setProcessedImage={setProcessedImage}
                setIsProcessing={setIsProcessing}
              />

              <ImagePreview
                image={processedImage || originalImage}
                title={processedImage ? "Processed Image" : "Original Image"}
                isLoading={isProcessing}
                error={error}
              />

              {/* <ImagePreview
              imageData
              image={processedImage}
              title="Processed Image"
              isLoading={isProcessing}
              error={error}
            /> */}
            </div>
            {processImage && (
              <button
                onClick={(e) => {
                  if (imageState === "PROCESSED" || imageState === null) {
                    setImageState("ORIGINAL");
                    setProcessedImage(localStorage.getItem("OriginalImage"));
                  } else if (imageState === "ORIGINAL") {
                    setImageState("PROCESSED");
                    setProcessedImage(localStorage.getItem("processedImage"));
                  }
                }}
                className="bg-sky-700 text-white p-1 rounded-md h-fit w-fit"
              >
                {imageState !== "ORIGINAL" ? "View Original" : "View Processed"}
              </button>
            )}
          </div>

          <div className="flex justify-center gap-4 mx-auto">
            <button
              onClick={handleTryAgain}
              className="bg-gray-200 text-gray-700 font-medium py-2 px-6 rounded-md hover:bg-gray-300 transition-colors w-fit"
            >
              Try Another Image
            </button>

            {processedImage && !error && (
              <button
                onClick={handleDownload}
                className="bg-green-600 text-white font-medium py-2 px-6 rounded-md hover:bg-green-700 transition-colors w-fit"
              >
                Download Result
              </button>
            )}
          </div>
        </div>
      )}

      <div className="mt-16 max-w-2xl text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          How It Works
        </h2>
        <p className="text-gray-600 mb-8">
          Our AI-powered background remover automatically detects the foreground
          from any image and removes the background instantly. Perfect for
          product photos, portraits, or any image where you need a clean,
          transparent background.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-medium text-gray-800 mb-2">1. Upload Image</h3>
            <p className="text-gray-600 text-sm">
              Upload any image from your device or paste a URL.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-medium text-gray-800 mb-2">
              2. Automatic Processing
            </h3>
            <p className="text-gray-600 text-sm">
              Our AI automatically detects and removes the background.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-medium text-gray-800 mb-2">
              3. Download Result
            </h3>
            <p className="text-gray-600 text-sm">
              Get your image with a transparent background in seconds.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
