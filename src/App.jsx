import { useEffect, useRef, useState } from "react";
import emptyAvatar from "./assets/images/empty.png"

function App() {

  useEffect(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const darkMode = (theme) => {
    console.log(theme);
    localStorage.theme = theme;
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const [liveSearch, setLiveSearch] = useState(false);

  useEffect(() => {
    const storedLiveSearch = localStorage.getItem('liveSearch');
    if (storedLiveSearch !== null) {
      setLiveSearch(storedLiveSearch === 'true');
    } else {
      setLiveSearch(false);
    }
  }, []);

  const toggleLiveSearch = (status) => {
    const newLiveSearch = status;
    setLiveSearch(newLiveSearch);
    localStorage.setItem('liveSearch', newLiveSearch);
  };

  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef();
  const timeoutId = useRef(null);

  const [userData, setUserData] = useState();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const searchDev = async (query) => {
    query = query.trim();
    setSearchQuery(query);
    if (!query) {
      if (liveSearch) {
        setError(null)
      }
      setSearchQuery('');
      inputRef.current.focus();
    } else {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('https://api.github.com/users/' + query);
        if (!response.ok) {
          setError('Veri yüklenirken bir hata oluştu veya kullanıcı bulunamadı.');
          setUserData(null);
          setLoading(false);
          return;
        }
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error('API Error:', error.message);
        setError(error.message);
      }
      setLoading(false);
    }
  };

  const handleInputChange = (event) => {
    const { value } = event.target;
    setSearchQuery(value);

    if (liveSearch) {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }

      timeoutId.current = setTimeout(() => {
        searchDev(value);
      }, 500);
    }
  };
  function formatDate(isoDateString) {
    const date = new Date(isoDateString);

    const formattedDate = date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    return formattedDate;
  }
  function ensureProtocol(url) {
    if (url && !url.match(/^[a-zA-Z]+:\/\//)) {
      return `https://${url}`;
    }
    return url;
  }

  useEffect(() => {
    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    };
  }, []);
  return (
    <div className="dark:text-white flex-col font-['Poppins'] flex min-h-screen dark:bg-slate-900 w-full items-center justify-center">
      <div className="max-w-3xl px-4 w-full flex items-center justify-between">
        <div className="text-xl">devFinder</div>
        <label className="select-none inline-flex min-[450px]:flex-row flex-col items-center cursor-pointer">
          <input type="checkbox" value={liveSearch} checked={liveSearch} onChange={(e) => { toggleLiveSearch(e.target.checked); e.target.checked && searchDev(searchQuery) }} className="sr-only peer" />
          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          <span className=" min-[450px]:ms-3 mt-3 min-[450px]:mt-0 text-sm font-medium text-gray-900 dark:text-gray-300">Canlı Ara</span>
        </label>
        <div className='inline-flex items-center'>
          <button className='dark:hidden inline-flex select-none' onClick={() => darkMode("dark")}>
            <span className="mr-3">Açık Mod</span>
            <svg viewBox="0 0 24 24" fill="none" width="24" height="24">
              <path className="fill-transparent" fillRule="evenodd" clipRule="evenodd" d="M17.715 15.15A6.5 6.5 0 0 1 9 6.035C6.106 6.922 4 9.645 4 12.867c0 3.94 3.153 7.136 7.042 7.136 3.101 0 5.734-2.032 6.673-4.853Z"></path>
              <path className="fill-gray-900 dark:fill-gray-900" d="m17.715 15.15.95.316a1 1 0 0 0-1.445-1.185l.495.869ZM9 6.035l.846.534a1 1 0 0 0-1.14-1.49L9 6.035Zm8.221 8.246a5.47 5.47 0 0 1-2.72.718v2a7.47 7.47 0 0 0 3.71-.98l-.99-1.738Zm-2.72.718A5.5 5.5 0 0 1 9 9.5H7a7.5 7.5 0 0 0 7.5 7.5v-2ZM9 9.5c0-1.079.31-2.082.845-2.93L8.153 5.5A7.47 7.47 0 0 0 7 9.5h2Zm-4 3.368C5 10.089 6.815 7.75 9.292 6.99L8.706 5.08C5.397 6.094 3 9.201 3 12.867h2Zm6.042 6.136C7.718 19.003 5 16.268 5 12.867H3c0 4.48 3.588 8.136 8.042 8.136v-2Zm5.725-4.17c-.81 2.433-3.074 4.17-5.725 4.17v2c3.552 0 6.553-2.327 7.622-5.537l-1.897-.632Z"></path>
              <path className="fill-gray-900 dark:fill-gray-900" fillRule="evenodd" clipRule="evenodd" d="M17 3a1 1 0 0 1 1 1 2 2 0 0 0 2 2 1 1 0 1 1 0 2 2 2 0 0 0-2 2 1 1 0 1 1-2 0 2 2 0 0 0-2-2 1 1 0 1 1 0-2 2 2 0 0 0 2-2 1 1 0 0 1 1-1Z"></path>
            </svg>
          </button>
          <button className='hidden dark:inline-flex select-none' onClick={() => darkMode("light")}>
            <span className="mr-3">Koyu Mod</span>
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
              <path className="stroke-white dark:stroke-white" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"></path>
              <path className="stroke-white dark:stroke-white" d="M12 4v1M17.66 6.344l-.828.828M20.005 12.004h-1M17.66 17.664l-.828-.828M12 20.01V19M6.34 17.664l.835-.836M3.995 12.004h1.01M6 6l.835.836"></path>
            </svg>
          </button>
        </div>
      </div>
      <form onSubmit={(e) => { e.preventDefault(); searchDev(searchQuery) }} className="group max-w-3xl px-4 w-full flex items-stretch justify-between my-5 select-none">
        <div className="flex flex-1 items-center justify-between text-left dark:group-hover:bg-slate-800 ps-4 dark:focus-within:bg-slate-800 space-x-3 h-12 bg-white ring-1 ring-slate-900/10 focus-within:outline-none focus-within:ring-2 focus-within:ring-sky-500 shadow-sm rounded-l-lg text-slate-400 dark:bg-brand dark:ring-0 dark:text-slate-300 dark:hover:bg-slate-800">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-none text-slate-300 dark:text-slate-400" aria-hidden="true">
            <path d="M19 19l-3.5-3.5"></path>
            <circle cx="11" cy="11" r="6"></circle>
          </svg>
          <input ref={inputRef} value={searchQuery} type="text"
            onChange={handleInputChange} className="w-full h-full bg-white dark:bg-brand dark:focus:bg-slate-800 dark:text-slate-300 dark:group-hover:bg-slate-800 dark:hover:bg-slate-800 focus:outline-none" placeholder="Kullanıcı Ara" />
        </div>
        <button type="button" onClick={() => searchDev(searchQuery)} className="group- group-focus-within:outline-none group-focus-within:ring-2 group-focus-within:ring-sky-500 flex justify-center items-center text-white bg-black dark:bg-slate-200 dark:text-black px-6 font-bold h-12 rounded-r-lg cursor-pointer">Ara</button>
      </form>
      <div className="max-w-3xl px-4 w-full flex items-stretch justify-between my-5">
        <div className="w-full">
          {error ? (
            <div className="dark:bg-brand rounded-lg dark:border-brand border-2 p-5 text-center">
              {error}
            </div>

          ) : (
            userData ? (
              <div className="dark:bg-brand rounded-lg dark:border-brand border-2 py-10 px-4 md:px-12">
                <div className="flex md:flex-row flex-col">
                  <div className=" md:w-3/12 w-full">
                    <img className="w-28 h-28 rounded-full mb-6 md:mb-0 border border-gray-50 p-1" src={userData.avatar_url ? userData.avatar_url : emptyAvatar} alt="" />
                  </div>
                  <div className=" md:w-9/12 w-full">
                    <div className="flex justify-between">
                      <div className="text-2xl">
                        {userData.name ? userData.name : "Bilinmiyor"}
                        <a href={userData.html_url ? userData.html_url : "#"} target="_blank" className="block my-3 text-base font-['Source_Code_Pro'] text-blue-500 hover:text-blue-600">@{userData.login}</a>
                      </div>
                      <div className="dark:text-zinc-300 text-gray-700">{userData.created_at ? formatDate(userData.created_at) : "Bilinmiyor"}</div>
                    </div>
                    <div className="dark:text-zinc-300 text-gray-700 w-full break-words hyphens-auto">
                      {userData.bio ? userData.bio : "Kullanıcının biyografisi yok."}
                    </div>
                    <div className="dark:bg-slate-900 border dark:border-slate-900 rounded-lg flex py-3 px-5 my-6">
                      <div className="text-sm w-1/3">
                        <div className="mb-2 dark:text-zinc-300 text-gray-700">Repos</div>
                        {userData.followers ? userData.public_repos : "Bilinmiyor"}
                      </div>
                      <div className="text-sm w-1/3">
                        <div className="mb-2 dark:text-zinc-300 text-gray-700">Takipçi</div>
                        {userData.followers ? userData.followers : "Bilinmiyor"}
                      </div>
                      <div className="text-sm w-1/3">
                        <div className="mb-2 dark:text-zinc-300 text-gray-700">Takip</div>
                        {userData.following ? userData.following : "Bilinmiyor"}
                      </div>
                    </div>
                    <div className="flex w-full gap-y-5 flex-wrap dark:text-zinc-300 text-gray-700">
                      <div className="w-fit min-w-[50%] flex">
                        <svg viewBox="0 0 64 64" fill="currentColor" width="20" height="20"><path d="M32,0C18.746,0,8,10.746,8,24c0,5.219,1.711,10.008,4.555,13.93c0.051,0.094,0.059,0.199,0.117,0.289l16,24 C29.414,63.332,30.664,64,32,64s2.586-0.668,3.328-1.781l16-24c0.059-0.09,0.066-0.195,0.117-0.289C54.289,34.008,56,29.219,56,24 C56,10.746,45.254,0,32,0z M32,32c-4.418,0-8-3.582-8-8s3.582-8,8-8s8,3.582,8,8S36.418,32,32,32z" /></svg>
                        <div className="ml-2">{userData.__cpLocation ? userData.__cpLocation : "Bilinmiyor"}</div>
                      </div>
                      <div className="w-fit min-w-[50%] flex">
                        <svg viewBox="0 -2 20 20" width="20" height="20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" fill="currentColor"><g id="SVGRepo_bgCarrier" strokeWidth={0} /><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" /><g id="SVGRepo_iconCarrier"> <title>twitter [#154]</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Page-1" stroke="none" strokeWidth={1} fill="none" fillRule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-60.000000, -7521.000000)" fill="currentColor"> <g id="icons" transform="translate(56.000000, 160.000000)"> <path d="M10.29,7377 C17.837,7377 21.965,7370.84365 21.965,7365.50546 C21.965,7365.33021 21.965,7365.15595 21.953,7364.98267 C22.756,7364.41163 23.449,7363.70276 24,7362.8915 C23.252,7363.21837 22.457,7363.433 21.644,7363.52751 C22.5,7363.02244 23.141,7362.2289 23.448,7361.2926 C22.642,7361.76321 21.761,7362.095 20.842,7362.27321 C19.288,7360.64674 16.689,7360.56798 15.036,7362.09796 C13.971,7363.08447 13.518,7364.55538 13.849,7365.95835 C10.55,7365.79492 7.476,7364.261 5.392,7361.73762 C4.303,7363.58363 4.86,7365.94457 6.663,7367.12996 C6.01,7367.11125 5.371,7366.93797 4.8,7366.62489 L4.8,7366.67608 C4.801,7368.5989 6.178,7370.2549 8.092,7370.63591 C7.488,7370.79836 6.854,7370.82199 6.24,7370.70483 C6.777,7372.35099 8.318,7373.47829 10.073,7373.51078 C8.62,7374.63513 6.825,7375.24554 4.977,7375.24358 C4.651,7375.24259 4.325,7375.22388 4,7375.18549 C5.877,7376.37088 8.06,7377 10.29,7376.99705" id="twitter-[#154]"> </path> </g> </g> </g> </g></svg>
                        <div className="ml-2">{userData.__cpLocation ? userData.__cpLocation : "Bilinmiyor"}</div>
                      </div>
                      <a href={userData.blog ? ensureProtocol(userData.blog) : "Bilinmiyor"} target="_blank" className="group w-fit min-w-[50%] flex hover:underline underline-offset-4 transition duration-1000">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M10.975 14.51a1.05 1.05 0 0 0 0-1.485 2.95 2.95 0 0 1 0-4.172l3.536-3.535a2.95 2.95 0 1 1 4.172 4.172l-1.093 1.092a1.05 1.05 0 0 0 1.485 1.485l1.093-1.092a5.05 5.05 0 0 0-7.142-7.142L9.49 7.368a5.05 5.05 0 0 0 0 7.142c.41.41 1.075.41 1.485 0zm2.05-5.02a1.05 1.05 0 0 0 0 1.485 2.95 2.95 0 0 1 0 4.172l-3.5 3.5a2.95 2.95 0 1 1-4.171-4.172l1.025-1.025a1.05 1.05 0 0 0-1.485-1.485L3.87 12.99a5.05 5.05 0 0 0 7.142 7.142l3.5-3.5a5.05 5.05 0 0 0 0-7.142 1.05 1.05 0 0 0-1.485 0z" /></svg>
                        <div className="relative ml-2">
                          <span className="inline-block">{userData.blog ? userData.blog : "Bilinmiyor"}</span>
                          <span className="absolute -bottom-1 left-0 w-0 h-0.5 dark:bg-white bg-black group-hover:w-full transition-all duration-300"></span>
                        </div>
                      </a>
                      <div className="w-fit min-w-[50%] flex">
                        <svg viewBox="0 0 1024 1024" width="20" height="20" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><g id="SVGRepo_bgCarrier" strokeWidth={0} /><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" /><g id="SVGRepo_iconCarrier"><path fill="currentColor" d="M192 128v704h384V128H192zm-32-64h448a32 32 0 0 1 32 32v768a32 32 0 0 1-32 32H160a32 32 0 0 1-32-32V96a32 32 0 0 1 32-32z" /><path fill="currentColor" d="M256 256h256v64H256v-64zm0 192h256v64H256v-64zm0 192h256v64H256v-64zm384-128h128v64H640v-64zm0 128h128v64H640v-64zM64 832h896v64H64v-64z" /><path fill="currentColor" d="M640 384v448h192V384H640zm-32-64h256a32 32 0 0 1 32 32v512a32 32 0 0 1-32 32H608a32 32 0 0 1-32-32V352a32 32 0 0 1 32-32z" /></g></svg>
                        <div className="ml-2">{userData.company ? userData.company : "Bilinmiyor"}</div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            ) : (
              loading && (
                <div className="dark:bg-brand rounded-lg dark:border-brand border-2 p-5 text-center">
                  Yükleniyor...
                </div>
              )
            )
          )}
        </div>
      </div>

    </div >
  )
}

export default App
