"use client";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import { useState, useRef } from "react";
import { useGetPexelImages } from "../../hooks/apiHooks";
import { FaArrowRight } from "react-icons/fa";
import { useAddBgImgUrl } from "../../hooks/apiHooks";
import { addBackgroundImageUrl } from "@/api/api";
import { CiSquarePlus } from "react-icons/ci";

const bgColors = [
  "#7ed6df",
  "#f9ca24",
  "#f0932b",
  "#eb4d4b",
  "#6ab04c",
  "#e056fd",
  "#686de0",
  "#95afc0",
  "#ff5252",
  "#cd6133",
  "#33d9b2",
  "#218c74",
  "#ffb142",
  "#2c2c54",
  "#d1ccc0",
];

export default function BgOptionsModal({
  open,
  setOpen,
  setProcessedImage,
  setIsProcessing,
}) {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(15);
  const [bgType, setBgType] = useState("IMAGE");
  const [bgColor, setBgColor] = useState(null);
  const [imageBorder, setImageBorder] = useState(false);
  const { data, error, isError, isSuccess, mutateAsync } = useGetPexelImages();
  const fileInputRef = useRef(null);
  const handleImageChange = async (event) => {
    // localStorage.removeItem("image_url");
    const file = event.target.files[0];
    if (file) {
      setIsProcessing(true);
      try {
        const options = {
          image_file_b64: localStorage.getItem("originalImage"),
          bg_color: null,
          bg_image_file: file,
          bgImageUrl: null,
        };
        if (localStorage.getItem("image_url")) {
          options.image_url = localStorage.getItem("image_url");
          options.image_file_b64 = null;
        }
        const resultBlob = await addBackgroundImageUrl(options);

        // Ensure the result is a valid Blob
        if (resultBlob instanceof Blob) {
          // Convert the Blob (result from API) into Base64 and store it in localStorage
          const resultReader = new FileReader();
          resultReader.onloadend = function () {
            const base64ResultString = resultReader.result;

            // Store the processed image in localStorage
            localStorage.setItem("processedImage", base64ResultString);

            // Set the processed image as the preview
            setProcessedImage(base64ResultString);
            setIsProcessing(false);
          };

          // Read the Blob result from the API as a Base64 string
          resultReader.readAsDataURL(resultBlob);
        } else {
          alert("Invalid Blob response from API");
        }
      } catch (error) {
        alert("Error from API:", error);
        setIsProcessing(false);
      }
    }
  };

  const triggerImageInput = () => {
    fileInputRef.current.click();
  };

  const {
    data: proceesedImage,
    error: proceesedImageError,
    mutateAsync: addBgImgUrlMutateAsync,
  } = useAddBgImgUrl();
  return (
    <Modal
      open={open}
      onClose={() => {
        setOpen(false);
      }}
      center
      classNames={{
        modal: "rounded-lg w-[300px] max-h-[300px] p-4 ",
      }}
    >
      <div className="flex flex-row gap-4 justify-evenly">
        <button
          className={` ${
            bgType === "COLOR" ? "bg-gray-800 text-white" : ""
          } rounded-md bg-gray-200 p-1 font-semibold min-w-[100px]`}
          onClick={(e) => setBgType("COLOR")}
        >
          Color
        </button>
        <button
          className={` ${
            bgType === "IMAGE" ? "bg-gray-900 text-white" : ""
          } rounded-md bg-gray-200 p-1 font-semibold min-w-[100px]`}
          onClick={(e) => setBgType("IMAGE")}
        >
          Image
        </button>
      </div>
      {bgType === "IMAGE" ? (
        <>
          {" "}
          <form
            id="pexel-form"
            className="flex flex-col gap-4 mt-4 sm:mt-8"
            onSubmit={(e) => {
              e.preventDefault();
              console.log("search images form submitted");
              const formData = new FormData(e.target);
              //   formData.append("page", page);
              //   formData.append("per_page", perPage);
              formData.get("query");
              const api_params = {
                query: formData.get("search-query"),
                page: page,
                per_page: perPage,
              };
              mutateAsync(api_params);
            }}
          >
            <div className="relative">
              <input
                id="pexel-query"
                name="search-query"
                type="text"
                placeholder="Search image"
                className="outline-none border rounded-md border-gray-500 h-[30px] sm:min-w-[220px] shadow-lg"
              />
              <button
                type="submit"
                className="bg-gray-800 border absolute right-0 h-[30px] rounded-md top-0"
              >
                <FaArrowRight className="w-[35px] h-[25px]  text-gray-200 " />
              </button>
            </div>
          </form>
          <div className="flex items-center justify-center cursor-pointer p-6 border border-dashed border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
            {/* Clickable icon to trigger file input */}
            <CiSquarePlus
              className="text-5xl text-gray-900"
              onClick={triggerImageInput}
            />

            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
          </div>
          {data && isSuccess && (
            <section className="flex flex-row justify-evenly flex-wrap gap-2 w-full mt-5 ">
              {data?.photos?.map((photo, i) => (
                <div
                  key={`${i + "image"}`}
                  className={`${
                    imageBorder == i ? " border-4 border-gray-900 " : ""
                  } w-fit rounded-md `}
                  onClick={async (e) => {
                    setImageBorder(i);
                    setIsProcessing(true);
                    try {
                      // Call remove.bg API to remove the background
                      const options = {
                        bg_image_file: null,
                        bgImageUrl: photo.src.original,
                        bg_color: null,
                        image_file_b64: localStorage.getItem("originalImage"),
                      };
                      if (localStorage.getItem("image_url")) {
                        options.image_url = localStorage.getItem("image_url");
                        options.image_file_b64 = null;
                        options.bg_image_file = null;
                      }
                      const resultBlob = await addBackgroundImageUrl(options);

                      // Convert the Blob (result from API) into Base64 and store it in localStorage
                      const resultReader = new FileReader();
                      resultReader.onloadend = function () {
                        const base64ResultString = resultReader.result;
                        // Store the processed image in localStorage
                        localStorage.setItem(
                          "processedImage",
                          base64ResultString
                        );

                        // Set the processed image as the preview
                        setProcessedImage(base64ResultString);
                        setIsProcessing(false);
                        // const outputImage =
                        //   document.getElementById("ORIGINAL_IMAGE");
                        // outputImage.src = base64ResultString; // Show processed image in preview
                      };

                      // Read the Blob result from the API as a Base64 string
                      resultReader.readAsDataURL(resultBlob);
                    } catch (error) {
                      console.log("error from api:\t", error);
                    }
                  }}
                >
                  <img
                    src={photo.src.original}
                    className="object-cover max-w-[70px] max-h-[50px] "
                  />
                </div>
              ))}
            </section>
          )}
        </>
      ) : (
        <section className="mt-4 flex flex-wrap flex-row justify-between gap-2">
          {bgColors.map((color, i) => (
            <div
              key={`${i}BG_COLOR`}
              onClick={async (e) => {
                setBgColor(color);
                setIsProcessing(true);
                try {
                  // Call remove.bg API to remove the background
                  console.log(
                    "image_file_b64 ON SELECTING COLOR:\t",
                    localStorage.getItem("originalImage")
                  );
                  const options = {
                    bg_image_file: null,
                    bgImageUrl: null,
                    image_file_b64: localStorage.getItem("originalImage"),
                    bg_color: color,
                  };
                  if (localStorage.getItem("image_url")) {
                    options.image_file_b64 = null;
                    options.image_url = localStorage.getItem("image_url");
                  }
                  const resultBlob = await addBackgroundImageUrl(options);

                  // Convert the Blob (result from API) into Base64 and store it in localStorage
                  const resultReader = new FileReader();
                  resultReader.onloadend = function () {
                    const base64ResultString = resultReader.result;
                    // Store the processed image in localStorage
                    localStorage.setItem("processedImage", base64ResultString);

                    // Set the processed image as the preview
                    setProcessedImage(base64ResultString);
                    setIsProcessing(false);
                    // const outputImage =
                    //   document.getElementById("ORIGINAL_IMAGE");
                    // outputImage.src = base64ResultString; // Show processed image in preview
                  };

                  // Read the Blob result from the API as a Base64 string
                  resultReader.readAsDataURL(resultBlob);
                } catch (error) {
                  console.log("error from api:\t", error);
                }
              }}
              className={`${
                bgColor === color ? "border-4 border-black" : ""
              } bg-[${String(color)}] min-w-[70px] min-h-[70px]`}
              style={{ backgroundColor: String(color) }}
            ></div>
          ))}
        </section>
      )}
    </Modal>
  );
}
