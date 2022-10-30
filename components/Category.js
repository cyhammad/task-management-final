import React from 'react'
import {
    GlobeAltIcon,
    TrashIcon,
    PencilIcon,
} from "@heroicons/react/24/outline";
import Image from 'next/image';
import { deleteDoc, doc } from 'firebase/firestore';
import { db, storage } from '../firebase';
import EditCategoryModal from './EditCategoryModal';
import { deleteObject, ref } from 'firebase/storage';

function Category({id, name, image}) {
  const deleteCategory = async () => {
    console.log("ID: ", id)
    deleteDoc(doc(db, "categories", id))
    deleteObject(ref(storage, `categories/${id}/image`))
  }
  return (
    <div className='lg:p-2'>
      <div className="bg-white px-4 py-2 flex space-x-3 rounded-lg min-w-[240px]">
        <Image className='rounded-lg' src={image} alt="IMG" width={50} height={50} />
        <div>
            <p className='text-sm font-medium'>{name}</p>
            <div className="flex space-x-2 pt-1">
                <button className='flex items-center space-x-1 text-xs pt-1 text-gray-500 hover:text-black' onClick={deleteCategory}>
                    <TrashIcon className='w-4 h-4'/>
                    <span className='pt-[1px] underline cursor-pointer'>
                        Delete
                    </span>
                </button>
                <EditCategoryModal id={id} />
            </div>
        </div>
      </div>
    </div>
  )
}

export default Category

