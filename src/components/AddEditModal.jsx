import { useEffect, useState } from "react";
import showToast from "./toast";
import supabase from "../supabase";

const AddEditModal = ({ isOpen, onClose, edit, fetchData }) => {
    const [note, setNote] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        setNote(edit)
    }, [edit, isOpen])

    const addNote = async (e) => {
        if (note.title === "" || note.title === null || note.title === undefined) {
            showToast("title required", "error")
            return
        }
        setIsLoading(true)

        const { error } = await supabase.from("notes").upsert(note);
        if (error)
            console.log(error);
        setIsLoading(false)
        onClose()
        showToast(note.id === undefined ? "note added" : "note updated", "success")
        fetchData()
    };

    return (
        <>
            {isOpen ? (
                <div
                    className={`bg-slate-900 bg-opacity-50 delay-300 absolute top-0 left-0 w-screen h-screen flex justify-center items-center z-10`}
                    onClick={(e) => onClose()}
                >
                    <div className={`w-11/12 bg-white`} onClick={(e) => { e.stopPropagation(); }}>
                        <div className="flex flex-col p-5">
                            <input
                                type="text"
                                placeholder="Title"
                                className={`placeholder:text-xl text-xl outline-none p-2`}
                                onChange={(e) => setNote({ ...note, title: e.target.value })}
                                value={note?.title}
                            />
                            <input
                                type="text"
                                placeholder="Tagline"
                                className={`placeholder:text-lg text-lg outline-none p-2`}
                                onChange={(e) =>
                                    setNote({ ...note, tagline: e.target.value })
                                }
                                value={note?.tagline}
                            />
                            <textarea
                                placeholder="Enter your note here..."
                                rows={25}
                                className="outline-none w-full h-auto resize-none p-2"
                                onChange={(e) => setNote({ ...note, body: e.target.value })}
                                value={note?.body}
                            />
                            <div className="flex flex-row-reverse pr-5">
                                <input type="checkbox" onChange={(e) => { setNote({ ...note, isPinned: !note.isPinned }) }} checked={note.isPinned} />
                                <label htmlFor="" className="mr-8 text-lg font-medium">Pin</label>
                            </div>
                        </div>
                        <div className="flex flex-row-reverse gap-10 text-white p-3">
                            <button
                                onClick={addNote}
                                className="bg-indigo-600 w-14 px-10 flex items-center justify-center font-semibold shadow-lg rounded hover:tracking-widest transition-all duration-300 ease-linear"
                            >
                                {isLoading ? (
                                    <div
                                        className="rounded-full animate-spin
                    border-2 border-solid border-white border-t-transparent p-1"
                                    ></div>
                                ) : (
                                    "OK"
                                )}
                            </button>
                            <button
                                onClick={onClose}
                                className="bg-rose-600 w-14 px-10 flex items-center justify-center font-semibold rounded shadow-lg hover:tracking-widest transition-all duration-300 ease-linear"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <></>
            )}
        </>
    );
};

export default AddEditModal;
