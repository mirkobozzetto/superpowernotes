import React from "react";
import { FaSmileWink } from "react-icons/fa";
import AuthButton from "../auth/AuthButton";

interface DemoLimitModalProps {
  isOpen: boolean;
}

export const DemoLimitModal: React.FC<DemoLimitModalProps> = ({ isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="top-[-10vh] z-50 fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-gradient-to-r from-blue-950 to-blue-500 shadow-lg m-4 p-6 rounded-lg w-full max-w-sm">
        <div className="text-center text-white">
          <FaSmileWink className="inline-block mb-4 text-4xl animate-bounce" />
          <h2 className="mb-2 font-bold text-2xl">Félicitations !</h2>
          <p className="mb-4">Vous avez exploré toutes les possibilités de la démo.</p>
          <p className="mb-6">Prêt à libérer tout le potentiel de vos notes vocales ?</p>
          <AuthButton
            useCustomStyles
            className="bg-white px-6 py-3 rounded-full font-bold text-blue-500 transform transition duration-300 ease-in-out hover:scale-105"
          >
            Inscrivez-vous maintenant !
          </AuthButton>
        </div>
      </div>
    </div>
  );
};
