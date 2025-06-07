import React from "react";
import axios from "axios";
// import imageLink from "C:\\Users\\diefe\\OneDrive\\Documentos\\Fullstack\\HTML-CSS-Javascript\\Aulas_ReactJS\\ReactJS\\Projeto_Booking\\back-end/tmp/1749217166813.jpg"; // Importando uma imagem de exemplo

const PhotoUploader = ({ photosLink, setPhotosLink, photos, setPhotos }) => {
  const uploadByLink = async (e) => {
    e.preventDefault();

    if (photosLink) {
      try {
        const { data: filename } = await axios.post("/places/upload/link", {
          link: photosLink,
        });

        setPhotos((prevValue) => {
          return [...prevValue, filename];
        });
        alert("Foto enviada com sucesso!");
      } catch (error) {
        alert("Erro no upload por link", JSON.stringify(error));
      }
    } else {
      alert("Por favor, insira um link de foto válido.");
    }
  };

  const uploadPhoto = async (e) => {
    const { files } = e.target;
    const filesArray = [...files];

    const formData = new FormData();

    filesArray.forEach((file) => formData.append("files", file));

    try {
      const { data: urlArray } = await axios.post("/places/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Upload realizado com sucesso.", urlArray);
      setPhotos((prevValue) => [...prevValue, ...urlArray]);
    } catch (error) {
      alert("Erro no upload", JSON.stringify(error));
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="photos" className="ml-2 text-2xl font-bold">
        Fotos
      </label>

      {/* uploadByLink */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Adicione sua foto pelo link dela"
          className="grow rounded-full border border-gray-300 px-4 py-2"
          id="photosLink"
          value={photosLink}
          onChange={(e) => setPhotosLink(e.target.value)}
        />
        <button
          onClick={uploadByLink}
          className="cursor-pointer rounded-full border border-gray-100 bg-gray-300 px-4 py-2 transition hover:bg-gray-200"
        >
          Enviar foto
        </button>
      </div>

      <div className="mt-2 grid grid-cols-5 gap-4">
        {photos.map((photo) => (
          <img
            className="aspect-square rounded-2xl object-cover"
            src={`${photo}`}
            alt="Imagens da Acomodação"
            key={photo}
          />
        ))}

        {/* uplaodByFile */}
        <label
          htmlFor="file"
          className="flex aspect-square cursor-pointer items-center justify-center rounded-2xl border border-gray-300"
        >
          <input
            type="file"
            id="file"
            className="hidden"
            multiple
            accept="image/*"
            onChange={uploadPhoto}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
            />
          </svg>
          Upload
        </label>
      </div>
    </div>
  );
};

export default PhotoUploader;
