import { useState } from "react";
import Perks from "./Perks";

const NewPlace = () => {
  const [title, setTitle] = useState("");
  const [city, setCity] = useState("");
  const [photos, setPhotos] = useState("");
  const [description, setDescription] = useState("");
  const [extras, setExtras] = useState("");
  const [price, setPrice] = useState("");
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [guests, setGuests] = useState("");
  /*  const [error, setError] = useState('');

  const handleChange = (e) => {
    // Substituindo vírgula por ponto
    const inputPrice = e.target.value.replace(",", ".");
  Verifica se o valor é um número válido
      if (/^(\d+|\d+,\d+)?$/.test(inputValue)) {
          setPrice(inputPrice);
          setError(''); // Limpa a mensagem de erro se válido
      } else {
          setError('Por favor, digite um número válido.');
      }
  };
  
  };

  const handleBlur = () => {
    // Converte para float ao perder o foco
    const floatValue = parseFloat(price);
   
        Verifica se o valor é um número após a conversão
      if (!isNaN(floatValue)) {
          console.log(floatValue); // Aqui você pode usar o valor float conforme necessário
      } else {
          setError('Número inválido na conversão.');
      }
  }; */

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-6 px-8">
      <div className="flex flex-col gap-1">
        <label htmlFor="title" className="ml-2 text-2xl font-bold">
          Título
        </label>
        <input
          type="text"
          placeholder="Digite o título do seu anuncio"
          className="rounded-full border border-gray-300 px-4 py-2"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="city" className="ml-2 text-2xl font-bold">
          Cidade e País
        </label>
        <input
          type="text"
          placeholder="Digite a cidade e o país do seu anuncio"
          className="rounded-full border border-gray-300 px-4 py-2"
          id="city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="photos" className="ml-2 text-2xl font-bold">
          Fotos
        </label>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Adicione sua foto pelo link dela"
            className="grow rounded-full border border-gray-300 px-4 py-2"
            id="photos"
            value={photos}
            onChange={(e) => setPhotos(e.target.value)}
          />
          <button className="cursor-pointer rounded-full border border-gray-100 bg-gray-300 px-4 py-2 transition hover:bg-gray-200">
            Enviar foto
          </button>
        </div>

        <div className="mt-2 grid grid-cols-5 gap-4">
          <label
            htmlFor="file"
            className="flex aspect-square cursor-pointer items-center justify-center rounded-2xl border border-gray-300"
          >
            <input type="file" id="file" className="hidden" />
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

      <div className="flex flex-col gap-1">
        <label htmlFor="description" className="ml-2 text-2xl font-bold">
          Descrição
        </label>
        <textarea
          placeholder="Digite a descrição do seu anúncio do seu anuncio"
          className="h-56 resize-none rounded-2xl border border-gray-300 px-4 py-2"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1">
        <h2 className="ml-2 text-2xl font-bold">Comodidades</h2>

        <Perks />

        <label htmlFor="extras" className="ml-2 text-2xl font-bold">
          Informações extras
        </label>
        <textarea
          placeholder="Coloque aqui qualquer tipo de informação extras sobre seu anúncio do seu anuncio"
          className="h-56 resize-none rounded-2xl border border-gray-300 px-4 py-2"
          id="extras"
          value={extras}
          onChange={(e) => setExtras(e.target.value)}
        />

        <h2 className="ml-2 text-2xl font-bold">Restrições e preços</h2>

        <label htmlFor="extras" className="ml-2 text-2xl font-bold">
          Informações extras
        </label>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(225px,1fr))] gap-6">
          <div className="flex flex-col gap-2">
            <label className="ml-2 text-xl font-bold" htmlFor="price">
              Preço
            </label>
            <input
              type="number"
              // type="text"
              placeholder="500"
              className="rounded-full border border-gray-300 px-4 py-2"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              // onChange={handleChange}
              // onBlur={handleBlur} // Chamado ao perder o foco para converter
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="ml-2 text-xl font-bold" htmlFor="checkin">
              Checkin
            </label>
            <input
              type="time"
              // type="text"
              // placeholder="00:00"
              className="rounded-full border border-gray-300 px-4 py-2"
              id="checkin"
              value={checkin}
              onChange={(e) => setCheckin(e.target.value)}
            />
            <small className="ml-2">Formato: HH:MM</small>
          </div>

          <div className="flex flex-col gap-2">
            <label className="ml-2 text-xl font-bold" htmlFor="checkout">
              Checkout
            </label>
            <input
              type="time"
              // type="text"
              // placeholder="00:00"
              className="rounded-full border border-gray-300 px-4 py-2"
              id="checkout"
              value={checkout}
              onChange={(e) => setCheckout(e.target.value)}
            />
            <small className="ml-2">Formato: HH:MM</small>
          </div>

          <div className="flex flex-col gap-2">
            <label className="ml-2 text-xl font-bold" htmlFor="guests">
              Nº Convidados
            </label>
            <input
              type="number"
              placeholder="0"
              className="rounded-full border border-gray-300 px-4 py-2"
              id="guests"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
            />
          </div>
        </div>
      </div>

      <button className="bg-primary-400 hover:bg-primary-500 min-w-44 cursor-pointer rounded-full px-4 py-2 text-white transition">
        Salvar informações
      </button>
    </form>
  );
};

export default NewPlace;
