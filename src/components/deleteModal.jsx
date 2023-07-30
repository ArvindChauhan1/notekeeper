import React from 'react';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';


const DeleteModalContent = ({ onDelete, closeModal }) => {
    const handleDelete = async () => {
        await onDelete();
        closeModal();
    };

    return (
        <div id="deleteModal" className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-md shadow-lg">
                <p className="text-xl font-semibold mb-4">Are you sure you want to delete?</p>
                <div className="flex justify-end">
                    <button
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 mr-2 rounded"
                        onClick={closeModal}
                    >
                        Cancel
                    </button>
                    <button
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                        onClick={handleDelete}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

const openDeleteModal = (onDeleteCallback) => {
    const closeModal = () => {
        modalContainer.remove();
    };

    const modalContainer = document.createElement('div');
    document.body.appendChild(modalContainer);
    const root = createRoot(modalContainer)
    root.render(<DeleteModalContent onDelete={onDeleteCallback} closeModal={closeModal} />)



    // Add an event listener to handle clicking outside the modal
    document.addEventListener('click', (event) => {
        if (event.target.id === 'deleteModal') {
            closeModal();
        }
    });
};

export default openDeleteModal;
