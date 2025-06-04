import { Link, useParams } from "react-router-dom";
import AccProfile from "../components/AccProfile";
import AccPlaces from "../components/AccPlaces";

const Account = () => {
  const { subpage } = useParams();

  const buttonClass = (button) => {
    let finalClass =
      "hover:bg-primary-400 w-full cursor-pointer rounded-full px-4 py-2 transition hover:text-white";
    if (button === subpage) finalClass += " bg-primary-400 text-white";
    return finalClass;
  };

  return (
    <section className="flex flex-col items-center gap-4 p-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4">
        <div className="flex gap-2">
          <Link to="/account/profile" className={buttonClass("profile")}>
            Perfil
          </Link>
          <Link to="/account/bookings" className={buttonClass("bookings")}>
            Reservas
          </Link>
          <Link to="/account/places" className={buttonClass("places")}>
            Acomodações
          </Link>
        </div>
      </div>

      {subpage === "profile" && <AccProfile />}
      {subpage === "bookings" && <h2>Reservas</h2>}
      {subpage === "places" && <AccPlaces />}
    </section>
  );
};

export default Account;
