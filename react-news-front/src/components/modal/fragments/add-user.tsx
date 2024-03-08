import React, { useState } from "react";
import { postUser } from "../../../api/users/post-users";
import { User } from "../../../api/users/types/user";
import Modal from "../modal";

export interface AddUserProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AddUser(props: AddUserProps) {
  const { isOpen, setIsOpen } = props;
  const [codRec, setCodRec] = useState("");
  const [dataHora, setDataHora] = useState("");
  const [email, setEmail] = useState("");
  const [gerouCert, setGerouCert] = useState<number>(0);
  const [nome, setNome] = useState("");
  const [recaptcha, setRecaptcha] = useState("");
  const [subscribed, setSubscribed] = useState<number>(0);

  const handleOnSubmit = () => {
    async function setUser() {
      const payload: User = {
        cod_rec: codRec,
        data_hora: dataHora,
        email: email,
        gerou_cert: gerouCert,
        id: 0,
        nome: nome,
        recaptcha: recaptcha,
        subscribed: subscribed,
      };
      await postUser(payload);
      setIsOpen(false);
    }
    setUser();
  };

  return (
    <Modal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Add User"
      handleSubmit={handleOnSubmit}
      isDisabled={!(nome && email)} // Ajuste conforme os campos obrigatórios
    >
      {/* Children agora está entre as tags de abertura e fechamento de Modal */}
      <div className="mt-2">
        <form className="bg-white rounded pt-2 pb-1">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Código de Recuperação
              </label>
              <input
                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="codRec"
                type="text"
                placeholder="Código de Recuperação"
                onChange={(e) => setCodRec(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Data e Hora
              </label>
              <input
                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="dataHora"
                type="text"
                placeholder="YYYY-MM-DDTHH:MM:SS"
                onChange={(e) => setDataHora(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Email
              </label>
              <input
                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Gerou Certificado (0 ou 1)
              </label>
              <input
                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="gerouCert"
                type="number"
                placeholder="0 ou 1"
                onChange={(e) => setGerouCert(parseInt(e.target.value))}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Nome
              </label>
              <input
                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="nome"
                type="text"
                placeholder="Nome"
                onChange={(e) => setNome(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Recaptcha
              </label>
              <input
                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="recaptcha"
                type="text"
                placeholder="Recaptcha"
                onChange={(e) => setRecaptcha(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Inscrito (0 ou 1)
              </label>
              <input
                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="subscribed"
                type="number"
                placeholder="0 ou 1"
                onChange={(e) => setSubscribed(parseInt(e.target.value))}
              />
            </div>
          </form>
        </div>
        </Modal>
  );
}
