import { useMutation } from "@tanstack/react-query";
import { addBackgroundImageUrl, fetchImages } from "../api/api";

// console.log("fetch images:\t", fetchImages);

export function useGetPexelImages() {
  const { data, isSuccess, isError, error, mutateAsync } = useMutation({
    mutationFn: fetchImages,
    retry: false,
  });
  return { data, isSuccess, isError, error, mutateAsync };
}

//Add bgImage Url
export function useAddBgImgUrl() {
  const { data, isSuccess, isError, error, mutateAsync } = useMutation({
    mutationFn: addBackgroundImageUrl,
    retry: false,
  });
  return { data, isSuccess, isError, error, mutateAsync };
}
