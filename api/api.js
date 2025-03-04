// For removing background
export async function removeBg({ blob = null, image_url = null }) {
  const formData = new FormData();
  formData.append("size", "auto");
  if (blob) {
    formData.append("image_file", blob);
  }
  if (image_url) {
    formData.append("image_url", image_url);
  }
  // Send the selected file as blob

  const response = await fetch("https://api.remove.bg/v1.0/removebg", {
    method: "POST",
    headers: {
      "X-Api-Key": `${String(process.env.NEXT_PUBLIC_BG_REMOVE_API)}`, // Replace with your actual API key
    },
    body: formData,
  });

  if (response.ok) {
    return await response.blob(); // Return the response as a Blob for frontend
  } else {
    alert(`${response.status}: ${response.statusText}`);
  }
}

// For getting images from pexels

export async function fetchImages(queryParams) {
  console.log("queryParams:\t", queryParams);

  const res = await fetch(
    `https://api.pexels.com/v1/search/?page=${queryParams.page}&per_page=${
      queryParams.per_page
    }&orientation=${"landscape"}&query=${queryParams.query}`,
    {
      headers: {
        Authorization: process.env.NEXT_PUBLIC_PEXELS_IMAGE_API,
      },
    }
  );
  const data = await res?.json();
  console.log("data fetch images:\t", data);

  if (!res.ok) {
    alert("No Result Found !");
    return null;
  }
  if (data?.photos?.length && data?.photos?.length <= 1) {
    alert("No Result Found !");
    return null;
  }

  return data;
}

//For sending imageUrl
export async function addBackgroundImageUrl({
  bg_image_file = null,
  bgImageUrl = null,
  image_file_b64,
  bg_color = null,
  image_url = null,
}) {
  const formData = new FormData();
  formData.append("size", "auto");
  console.log("Inside api 2:\t", image_file_b64);
  if (bg_color) {
    formData.append("bg_color", bg_color);
  }
  if (bgImageUrl) {
    formData.append("bg_image_url", bgImageUrl);
  }
  if (image_file_b64) {
    formData.append("image_file_b64", image_file_b64);
  }
  if (image_url) {
    formData.append("image_url", image_url);
  }
  if (bg_image_file) {
    formData.append("bg_image_file", bg_image_file);
  }
  // Send the selected file as blob

  const response = await fetch("https://api.remove.bg/v1.0/removebg", {
    method: "POST",
    headers: {
      "X-Api-Key": `${String(process.env.NEXT_PUBLIC_BG_REMOVE_API)}`, // Replace with your actual API key
    },
    body: formData,
  });

  if (response.ok) {
    return await response.blob(); // Return the response as a Blob for frontend
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
}
