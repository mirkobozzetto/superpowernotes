import Link from "next/link";

export default function VerifyRequestPage() {
  return (
    <div className="flex flex-col justify-center items-center bg-gradient-to-b from-blue-50 to-white p-4 pt-16">
      <div className="space-y-8 bg-white shadow-xl p-6 sm:p-8 md:p-10 rounded-lg w-9/10 text-center">
        <Link
          href="/"
          className="bg-clip-text bg-gradient-to-r from-blue-950 to-blue-500 mb-4 font-extrabold text-3xl text-center text-transparent sm:text-xl md:text-5xl lg:text-7xl"
        >
          Super Power Notes
        </Link>
        <h2 className="font-bold text-gray-800 text-lg sm:text-3xl md:text-4xl lg:text-5xl">
          Votre lien magique est en route !
        </h2>
        <p className="text-gray-600 text-sm sm:text-xl md:text-xl">
          Nous avons envoyé un email avec un lien de connexion spécial à votre adresse.
        </p>
        <p className="text-gray-500 text-sm sm:text-base md:text-lg">
          Ouvrez votre boîte de réception et cliquez sur le lien pour accéder à vos super notes !
        </p>
        <div className="space-y-4 mt-8">
          <p className="text-gray-400 text-xs md:text-lg">
            Vous n&apos;avez pas reçu l&apos;email ?
          </p>
          <p className="text-gray-400 text-lg md:text-lg">Pas de panique !</p>
          <ul className="text-gray-500 md:text-sm sm:text-md list-disc list-inside">
            <li className="text-xs sm:text-sm md:text-base list-none">
              Vérifiez votre dossier spam ou promotions
            </li>
            <li className="text-xs sm:text-sm md:text-base list-none">
              Assurez-vous que l&apos;adresse email est correcte
            </li>
            <li className="text-xs sm:text-sm md:text-base list-none">
              Patientez un peu, parfois les emails prennent leur temps
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
