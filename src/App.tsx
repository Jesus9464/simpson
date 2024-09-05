import axios from "axios";
import * as Yup from "yup";
import Slider from "react-slick";
import { useFormik } from "formik";
import { FaEye } from "react-icons/fa";
import React, { useState } from "react";

import { simpsonUrl } from "./common/axios";

//types
import { ResponseUrl } from "./common/types";

//movks
import { dataMocks } from "./common/mocks";

//styles
import "./App.css";

function App() {
  const [data, setData] = useState<ResponseUrl[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedCharacter, setSelectedCharacter] =
    useState<ResponseUrl | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formik = useFormik({
    initialValues: {
      age: "",
    },
    validationSchema: Yup.object({
      age: Yup.number()
        .required("Age is required")
        .min(1, "Age must be greater than 0"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await axios.post(
          "'https://testfrontend.co/v1/testsimpsons",
          {
            name: selectedCharacter?.character,
            quote: selectedCharacter?.quote,
            age: values.age,
          }
        );
        alert("Data submitted successfully: " + JSON.stringify(response.data));
      } catch (error) {
        alert("Error submitting the data");
      }
      closeModal();
    },
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await simpsonUrl.get("/quotes?count=15&character=ho");
      setData(response.data);
    } catch (error) {
      setData(dataMocks as ResponseUrl[]);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (!data.length) {
      fetchData();
    }
  }, [data]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-2xl font-bold">Loading...</h1>
      </div>
    );
  }

  const openModal = (character: ResponseUrl) => {
    setSelectedCharacter(character);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="App">
      <header className="App-header">
        {/* Carrusel */}
        <div className="w-full my-8">
          <Slider {...settings}>
            {data.map((character) => (
              <div key={character.quote} className="px-4">
                <img
                  src={character.image}
                  alt={character.character}
                  className="h-48 w-48 object-cover mx-auto rounded-lg"
                />
                <h1 className="text-center mt-4 text-xl font-semibold">
                  {character.character}
                </h1>
                <button
                  onClick={() => openModal(character)}
                  className="text-blue-600 hover:text-blue-800 mt-2"
                >
                  <FaEye className="inline w-5 h-5" />
                </button>
              </div>
            ))}
          </Slider>
        </div>

        {/* Table under the carousel */}
        <div className="w-full px-4">
          <table className="min-w-full table-auto bg-white shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2">Character</th>
                <th className="px-4 py-2">Quote</th>
                <th className="px-4 py-2">Details</th>
              </tr>
            </thead>
            <tbody>
              {data.map((character) => (
                <tr key={character.quote} className="border-t">
                  <td className="px-4 py-2 text-center">
                    {character.character}
                  </td>
                  <td className="px-4 py-2 text-center">{character.quote}</td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => openModal(character)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FaEye className="inline w-5 h-5" /> {/* Ícono del ojo */}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </header>

      {/* Modal details */}
      {isModalOpen && selectedCharacter && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4">
              {selectedCharacter.character}
            </h2>
            <img
              src={selectedCharacter.image}
              alt={selectedCharacter.character}
              className="w-full h-48 object-cover mb-4 rounded-lg"
            />
            <p>{selectedCharacter.quote}</p>

            {/* Formulario con Formik */}
            <form onSubmit={formik.handleSubmit}>
              <label htmlFor="age" className="block mb-2 text-gray-700">
                Age:
              </label>
              <input
                id="age"
                name="age"
                type="number"
                onChange={formik.handleChange}
                value={formik.values.age}
                className="border border-gray-300 rounded-md w-full px-3 py-2 mb-4"
              />
              {formik.touched.age && formik.errors.age ? (
                <div className="text-red-500 mb-4">{formik.errors.age}</div>
              ) : null}

              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full"
              >
                Submit
              </button>
            </form>

            <button
              onClick={closeModal}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
