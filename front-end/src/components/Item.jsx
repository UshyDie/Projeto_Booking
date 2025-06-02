import img from "../assets/img/a90731aa-9a50-413d-bb4f-40cc4e869366-1741466753784.jpg";
const Item = () => {
  return (
    <a href="/" className="flex flex-col gap-2">
      <img
        src={img}
        alt="Imagem da acomodação"
        className="aspect-square rounded-2xl object-cover"
      />

      <div>
        <h3 className="text-xl font-semibold">Cabo Frio,Rio de Janeiro</h3>
        <p className="truncate text-gray-600">
          Relaxe com sua família nessa acomodação espaçosa e aconchegante.
          Condomínio com piscina, sala de jogos,churrasqueira,garagem e portaria
          24h. AP com ar-condicionado,Wi-Fi e uma estrutura completa para o seu
          conforto. Localizado em uma área nobre próximo ao Centro e ao lado do
          Extra Supermercado e com rico comércio ao redor. A poucos minutos das
          belas praias da região,incluindo Búzios e Arraial do Cabo.
        </p>
      </div>

      <p>
        <span className="font-semibold">R$ 550</span> por noite
      </p>
    </a>
  );
};

export default Item;
