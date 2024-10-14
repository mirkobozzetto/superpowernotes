import React from "react";
import { FaSmileWink } from "react-icons/fa";
import AuthButton from "../auth/AuthButton";

interface DemoLimitModalProps {
  isOpen: boolean;
}

export const DemoLimitModal: React.FC<DemoLimitModalProps> = ({ isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="top-[-10vh] z-50 fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 backdrop-blur-[2px]">
      <div className="bg-white shadow-lg m-4 p-6 rounded-lg w-full max-w-sm">
        <div className="text-center">
          <FaSmileWink className="inline-block mb-4 text-4xl text-blue-500 animate-bounce" />
          <h2 className="bg-clip-text bg-gradient-to-r from-blue-950 to-blue-500 mb-2 font-bold text-2xl text-transparent">
            Félicitations !
          </h2>
          <p className="bg-clip-text bg-gradient-to-r from-blue-950 to-blue-500 mb-4 text-transparent">
            Vous avez exploré toutes les possibilités de la démo.
          </p>
          <p className="bg-clip-text bg-gradient-to-r from-blue-950 to-blue-500 mb-6 text-transparent">
            Prêt à libérer tout le potentiel de vos notes vocales ?
          </p>
          <AuthButton
            useCustomStyles
            className="bg-gradient-to-r from-blue-950 to-blue-500 px-6 py-3 rounded-full font-bold text-white transform transition duration-300 ease-in-out hover:scale-105"
          >
            Inscrivez-vous maintenant !
          </AuthButton>
        </div>
      </div>
    </div>
  );
};
