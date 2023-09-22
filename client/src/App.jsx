import axios from "axios";
import "./App.css";
import React, { useCallback, useEffect, useState } from "react";

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [inputText, setInputText] = useState("");

  const debouncedSearch = (func) => {
    let timer;
    return function (...args) {
      const context = this;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        timer = null;
        func.apply(context, args);
      }, 0);
    };
  };

  const searchFromServer = async (inputText) => {
    try {
      const response = await axios.get(
        `http://localhost:4001/trips?keywords=${inputText}`
      );
      console.log(response.data.data);
      setSearchResults(response.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    // ตรวจสอบว่า inputText ว่างหรือไม่
    if (inputText.trim() === "") {
      // ถ้า inputText ว่างให้ดึงข้อมูลทั้งหมดมาแสดง
      searchFromServer("");
    } else {
      // ถ้ามีข้อความใน inputText ให้ค้นหาทันที
      optimizeSearchResults(inputText);
    }
  }, [inputText]);

  const optimizeSearchResults = useCallback(
    debouncedSearch(searchFromServer),
    []
  );

  const handleTagClick = (tag) => {
    // ถ้า inputText มีค่าให้เพิ่มคำค้นหาเข้าไป
    setInputText((prevText) => (prevText ? `${prevText} ${tag}` : tag));
    // เมื่อคลิกที่หมวดหมู่จะต้องเอาข้อความที่คลิกไปใส่ลงในช่อง Input เพื่อทำการค้นหา
  };

  const handleReadMoreClick = (url) => {
    window.open(url, "_blank");
  };

  return (
    <div className="App">
      <h1 className="font-[800] text-[40px] text-center text-blue-500 mt-[30px] mb-[25px]">
        เที่ยวไหนดี
      </h1>
      <div className="font-[600] text-[20px] text-center m-2 mx-[100px]">
        <h2 className="text-start">ค้นหาที่เกี่ยวข้อง</h2>
        <input
          type="text"
          placeholder="หาที่เที่ยวแล้วไปกัน ..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="text-center text-[18px] border-b border-sky-500 w-full"
        />
      </div>
      {/* Map contents start */}
      {searchResults.length > 0 && (
        <>
          {searchResults.map((result) => (
            <div key={result.eid} className="mt-10 mx-[20px]">
              <div className="md:flex items-start justify-start sm:flex-col md:flex-row">
                {/* picture left side */}
                <div className=" h-[320px] w-[400px] mx-5 mb-5">
                  <img
                    src={result.photos[0]}
                    alt={result.title}
                    className=" rounded-xl mb-5 h-full w-full "
                  />
                </div>
                {/* contents right side */}
                <div className="md:basis-2/3 mr-6 ml-2">
                  {/* title start */}
                  <button
                    onClick={() => handleReadMoreClick(result.url)}
                    className="font-[800] text-[28px] text-black"
                  >
                    {result.title}
                  </button>
                  {/* description start */}
                  <div className="mt-2 font-[400] text-[20px]">
                    {result.description.slice(0, 100)}
                    <span>
                      ...
                      <br />
                      <a href={result.url}>
                        <button
                          onClick={() => handleReadMoreClick(result.url)}
                          className=" text-blue-500 border-blue-500 border-b-2"
                        >
                          อ่านต่อ
                        </button>
                      </a>
                    </span>
                  </div>
                  {/* tags button start  */}
                  <div className="mt-2 font-[400] text-[20px] ">
                    หมวด
                    {result.tags.map((tag, index) => (
                      <React.Fragment key={index}>
                        <button
                          onClick={() => handleTagClick(tag)}
                          className="text-black mx-2 flex-col items-center  border-black border-b-2"
                        >
                          {tag}
                        </button>
                        {index === result.tags.length - 2 && " และ "}
                      </React.Fragment>
                    ))}
                  </div>
                  {/* picture map start */}

                  <div className="mt-4 md:flex sm:flex-row items-start h-[100px] w-[150px]">
                    {result.photos.map((photo, index) => {
                      if (index > 0) {
                        return (
                          <img
                            key={index}
                            src={photo}
                            alt=""
                            className="rounded-xl h-full w-full mr-5"
                          />
                        );
                      }
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default App;
