import { useState, useCallback, useEffect } from "react"
import AddEditModal from "./components/AddEditModal"
import supabase from "./supabase"
import Loader from "./components/Loader"
import openDeleteModal from "./components/DeleteModal"

let page = { size: 0, range: [0, 5], page_no: 0, pageSize: 6 }
const App = () => {
  const [note, setNote] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [notes, setNotes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  // const [page, setPage] = useState( 
  const fetchData = useCallback(async () => {
    // setIsLoading(true)
    const { data, error, count } = await supabase
      .from('notes')
      .select('*', { count: 'exact' })
      .range(page.range[0], page.range[1])
      .order("isPinned", { ascending: false })
    await setNotes(data === null ? [] : data)
    page.size = count;
    if (error)
      console.log(error)

    setIsLoading(false)
  }, [])

  useEffect(() => {
    setIsLoading(true)
    fetchData()
  }, [])

  const onClose = () => {
    setIsOpen(false)
    setNote({})
  }


  const handlePin = async (e) => {
    const { data, error } = await supabase
      .from('notes')
      .update({ "isPinned": !e.isPinned })
      .eq('id', e.id)
    console.log(data)
    if (error) {
      console.log(error)
      return
    }
    fetchData()
  }
  const handleDelete = async (e) => {
      const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', e.id)
    if (error) {
      console.log(error)
      return
    }
    fetchData()
  }

  // Arrow function to go to the next page
  const nextPage = () => {
    const totalPages = Math.ceil(page.size / page.pageSize);
    if (page.page_no < totalPages - 1) {
      page.page_no++;
      updatePageRange();
    } else {
      return
    }
    fetchData()
  };

  // Arrow function to go to the previous page
  const prevPage = () => {
    if (page.page_no > 0) {
      page.page_no--;
      updatePageRange();
    } else {
      return
    }
    fetchData()
  };

  // Helper function to update the page range
  const updatePageRange = () => {
    const start = page.page_no * page.pageSize;
    const end = start + page.pageSize - 1;
    page.range = [start, end];
  };
  return (
    <>
      <div className="flex flex-col h-screen">
        <header className="flex justify-center items-center p-2 text-xl font-sans font-semibold">
          <h1 className="hover:tracking-wide duration-200 ease-linear">
            note-keeper1
          </h1>
        </header>
        <main className="h-full overflow-auto flex flex-col">
          {isLoading ?
            <Loader />
            :
            <>
              <div className="flex-1 grid grid-cols-2 grid-rows-3 md:gap-x-10 gap-x-4 md:px-10 px-4 md:gap-y-10 gap-y-10 py-5">
                {notes.map((e, i) => {
                  return (
                    <div key={i} onClick={async () => {
                      setNote(e)
                      setIsOpen(true)
                    }}
                      className="shadow-md hover:shadow-indigo-400 hover:shadow-2xl transition-all duration-300 ease-linear rounded-xl m-auto cursor-pointer w-full md:w-4/5 h-full md:h-4/5 p-5 bg-slate-100 bg-opacity-40 flex group relative"
                    >
                      <img src="/pin.png" alt="pin" className={
                        `${e.isPinned ? "" : "hidden"} group-hover:block w-9 h-9 hover:h-11 hover:w-11 absolute right-4 transition-all duration-200 ease-linear`
                      } onClick={(event) => {
                        handlePin(e)
                        event.stopPropagation();
                      }} />
                      <div className="m-auto text-2xl tracking-wide group-hover:tracking-widest transition-all duration-300 ease-linear">
                        {e.title}
                      </div>
                      <img src="/delete.png" alt="delete" className="hidden group-hover:block absolute bottom-4 right-4 w-8 h-8 hover:h-9 hover:w-9 transition-all duration-200 ease-linear"
                        onClick={(event) => {
                          openDeleteModal(() => { handleDelete(e) })
                          event.stopPropagation()
                        }}
                      />
                    </div>
                  )
                })}
              </div>
              <div className="flex m-auto w-40 justify-around p-2">
                <button
                  onClick={prevPage}
                  className={`bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold px-4 rounded-l
            ${page.page_no <= 0 ? "opacity-50" : ""}
            `}>Prev</button>
                <div className="bg-gray-300 px-4 border rounded-full mx-5 font-medium text-lg">{page.page_no + 1}</div>
                <button
                  onClick={nextPage}
                  className={`
                bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold px-4 rounded-r ${page.page_no >= Math.ceil(page.size / page.pageSize) - 1 ? "opacity-50" : ""}
                `}>
                  Next
                </button>
              </div>
            </>}
        </main>
        <footer className="flex flex-row justify-center items-center p-1 text-xl font-sans font-semibold">
          <a
            href="https://github.com/ArvindChauhan1"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 hover:tracking-wide duration-200 ease-linear text-base"
          >
            <img src="/github.svg" alt="GitHub" className="w-4 h-4" />
            <span>ArvindChauhan1</span>
          </a>
        </footer>

      </div >
      <AddEditModal isOpen={isOpen} onClose={onClose} edit={note} fetchData={fetchData} />
      <div onClick={() => { setIsOpen(true) }} className="fixed bottom-20 left-8 md:left-20 bg-indigo-700 rounded-full w-10 h-10 flex justify-center items-center hover:shadow-lg cursor-pointer transition-transform transform hover:rotate-45 ease-in duration-300 bg-opacity-90">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="white" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </div>
    </>
  )
}

export default App