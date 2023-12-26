"use client"

import { useState, FormEvent } from "react"
import { scrapeAndStoreProduct } from '@/lib/actions';
const isValidProductURL = (url: string) => {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname;

    if(hostname.includes('emag.bg')){
      return true;
    }
  } catch (e) {
    return false;
  }
  return false;

}

const Searchbar = () => {
  const [searchPrompt, setSearchPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isValidLink = isValidProductURL(searchPrompt);
    if(!isValidLink) return alert('Please provide a valid emag.bg link');

    try {
      setIsLoading(true);

      //Scrape product
      const product = await scrapeAndStoreProduct(searchPrompt);
    } catch (e) {
      console.log(e);
    } finally{
      setIsLoading(false);
    }
  }

  return (
    <form 
      className='flex flex-wrap gap-4 mt-12'
    
      onSubmit={handleSubmit}>
      <input
        value={searchPrompt}
        onChange={(e) => setSearchPrompt(e.target.value)}
        type="text"
        placeholder="Enter Product Link" 
        className="searchbar-input"/>

      <button 
        type="submit"
        className="searchbar-btn"
        disabled={searchPrompt === '' || isLoading}
      >
        {isLoading ? 'Searching ...' : "Search"}
      </button>
      
    </form>
    )
}

export default Searchbar