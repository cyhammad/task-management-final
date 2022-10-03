import { PencilIcon, PlusIcon } from "@heroicons/react/24/outline";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { db, storage } from "../firebase";

function EditCategoryModal({id}) {
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const filePickerRef = useRef(null);
  const categoryNameRef = useRef(null);

  const addImageToCategory = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }
    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent.target.result);
    };
  };
  const editCategory = async () => {
    if (loading) return;

    setLoading(true);

    updateDoc(doc(db, "categories", id), {
        name: categoryNameRef.current.value,
        updatedBy: user.displayName,
        updatedAt: serverTimestamp(),
    });
    const imageRef = ref(storage, `categories/${id}/image`);
    await uploadString(imageRef, selectedFile, "data_url").then(
      async (snapshot) => {
        const downloadURL = await getDownloadURL(imageRef);
        await updateDoc(doc(db, "categories", id), {
          image: downloadURL,
        });
      }
    );
    setShowModal(false);
    setLoading(false);
    setSelectedFile(null);
  }
  return (
    <>
      <button
        className="flex items-center space-x-1 text-xs pt-1 text-gray-500 hover:text-black"
        onClick={() => setShowModal(true)}
      >
        <PencilIcon className="w-4 h-4" />
        <span className="pt-[1px] underline">Edit</span>
      </button>
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-4xl lg:min-w-[600px]">
              {/*content*/}
              <div className="border-0 rounded-xl shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex justify-between border-b border-solid">
                  <div className="flex items-start justify-between py-6 pl-10 border-b border-solid border-slate-200 rounded-t grow">
                    <h3 className="text-xl font-semibold pt-1">Add Category</h3>
                  </div>
                  <button
                    className="w-4 h-4 bg-slate-700 flex justify-center items-center text-white rounded-full text-[9px] m-2"
                    onClick={() => setShowModal(false)}
                  >
                    x
                  </button>
                </div>
                {/*body*/}
                <div className="flex justify-center items-center pt-8">
                  {selectedFile ? (
                    <Image
                      className="cursor-pointer rounded-lg"
                      src={selectedFile}
                      height={100}
                      width={100}
                      alt="selected image"
                    />
                  ) : (
                    <div className="bg-blue-50 p-8 flex justify-center items-center rounded-xl">
                      <div
                        onClick={() => filePickerRef.current.click()}
                        className="bg-[#004064] flex justify-center items-center text-white px-2 py-2 rounded-lg cursor-pointer"
                      >
                        <PlusIcon className="h-6 w-6" />
                      </div>
                    </div>
                  )}
                </div>
                <input
                  ref={filePickerRef}
                  onChange={addImageToCategory}
                  type="file"
                  hidden
                />
                <div className="flex flex-col items-center  justify-center pt-3">
                  <p className="font-medium">Upload Icon</p>
                  <p className="text-xs text-gray-500">Upload 1:1 ratio icon</p>
                </div>
                {/*footer*/}
                <div className="flex flex-col justify-center items-center space-y-5 mt-10 mb-10 px-10">
                  <input
                    ref={categoryNameRef}
                    type="text"
                    name="categoryName"
                    id="categoryName"
                    className="rounded-md border-2 border-slate-500 text-slate-800 w-48 p-3 text-xs"
                    placeholder="Category's Name"
                  />
                  <button
                    className="bg-[#004064] rounded-md text-white w-48 py-3 text-xs"
                    onClick={editCategory}
                    disabled={!selectedFile}
                  >
                    {loading ? "Updating Category..." : "Update Category"}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
}

export default EditCategoryModal;
