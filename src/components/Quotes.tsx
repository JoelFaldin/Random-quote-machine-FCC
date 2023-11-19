import axios, { AxiosRequestConfig } from 'axios'
import { useState, useEffect, useRef } from 'react'
import styles from '../styles/Quotes.module.css'

const options: AxiosRequestConfig = {
  method: 'GET',
  url: 'https://quotes15.p.rapidapi.com/quotes/random/',
  params: {
    language_code: 'en'
  },
  headers: {
    'X-RapidAPI-Key': '336c6b6b4dmshc5cb25ff46f99dcp1cb5d1jsn9fed66c49c43',
    'X-RapidAPI-Host': 'quotes15.p.rapidapi.com'
  }
};

interface Response {
  content: string
  name: string
  tag: string
}

const getData = async (): Promise<Response> => {
  try {
    const response = await axios.request(options);
    console.log('it worked!')
    // console.log(response.data)
    return {content: response.data.content, name: response.data.originator.name, tag: response.data.tags[0]}
  } catch (error) {
    console.error(error)
    return Promise.reject(error)
  }
}

const Quotes = () => {
  const [quote, setQuote] = useState<string>('')
  const [author, setAuthor] = useState<string>('')
  const [category, setCategory] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const [tweet, setTweet] = useState<string>('')

  let tweetLink = 'https://twitter.com/intent/tweet?text='

  const generateQuote = async () => {
    setLoading(true)
    try {
      const data = await getData()
      // Saving data to use in both state and in twitter link:
      const content = data.content
      const auth = data.name
      // Setting states:
      setQuote(content)
      setAuthor(auth)
      setCategory(data.tag)
      // Building the tweet link:
      tweetLink += content.replace(/\s/g, "%20")
      tweetLink += "%20Author:%20"
      tweetLink += auth.replace(/\s/g, "%20")
      setTweet(tweetLink)
    } finally {
      setLoading(false)
    }
  }
  // Dealing with React's double mounting weird thing:
  const shouldRender = useRef<boolean>(true);
  useEffect(() => {
      if (shouldRender.current) {
          shouldRender.current = false;
          //Calling the quote generator function:
          generateQuote();
      }
  });

  const generateNew = () => {
    generateQuote()
  }
  
  return (
    <div className={styles.container}>
      <div id='quote-box' className={styles.div1}>
      {loading ? <p id='text' className={styles.text}>Loading...</p> : <p id='text' className={styles.text}>{quote}</p>}
      {loading ? <p id='author' className={styles.author}>Loading...</p> : <p id='author' className={styles.author}>- {author}</p>}
      {loading ? <p id='category' className={styles.category}>Loading...</p> : <p id='category' className={styles.category}>Category: {category}</p>}

      <div>
        <button type='button' className={`btn btn-warning ${styles.button}`} id='new-quote' onClick={generateNew}>Generate new quote</button>
        <button type='button' className={`btn btn-info ${styles.button}`}><a id='tweet-quote' href={tweet} target='_blank'>Tweet this quote</a></button>
      </div>
      </div>      
    </div>
  )
}

export default Quotes