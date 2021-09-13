import React, { useEffect, useState } from 'react';
import Tmdb from './Tmdb';
import MovieRow from './components/MovieRow';
import FeaturedMovie from './components/FeaturedMovie';
import Header from './components/Header';

import './App.scss';

function App() {

  const [movieList, setMovieList] = useState([])
  const [featureData, setFeatureData] = useState(null)
  const [blackHeader, setBlackHeader] = useState(false)

  useEffect(() => {
    const loadAll = async () => {
      let list = await Tmdb.getHomeList()
      setMovieList(list)

      let originals = list.filter(i=>i.slug === 'originals')
      let randomChosen = Math.floor(Math.random() * (originals[0].items.results.length - 1))
      let chosen = originals[0].items.results[randomChosen]
      let chosenInfo = await Tmdb.getMovieInfo(chosen.id, 'tv')
      setFeatureData(chosenInfo)
    }
    loadAll()
  }, [])

  useEffect(()=>{
    const scrollListener = () => {
      if (window.scrollY > 10) {
        setBlackHeader(true);
      } else {
        setBlackHeader(false);
      }
    }

    window.addEventListener('scroll', scrollListener)  
    return () => {
      window.removeEventListener('scroll', scrollListener)
    }
  },[])

  return (
   <div className="page">

    <Header black={blackHeader}/>

      {featureData &&
       <FeaturedMovie item={featureData}/>
      }

      <section className="lists">
        {movieList.map((item, key)=>(
          <div key={key}>
            <MovieRow title={item.title} items={item.items}/>
          </div>
        ))}
      </section>

      <footer>
        Feito com <span role="img" aria-label="coração">❤️ por Jardel Urban</span><br />
        Direitos de imagem para <a href="https://netflix.com">Netflix</a> <br />
        Dados pegos do site <a href="https://themoviedb.org">Themoviedb.org</a>
      </footer>
      { movieList <= 0 &&
      <div className="loading">
        <img src="https://media.filmelier.com/noticias/br/2020/03/Netflix_LoadTime.gif" />
      </div>
      }
   </div>
  );
}

export default App;
