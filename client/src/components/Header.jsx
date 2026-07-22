import { FaSearch } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export default function Header() {
  const { currentUser } = useSelector(state => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };



  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      // Sincroniza el input con el searchTerm de la URL al navegar
      // eslint-disable-next-line react-hooks/set-state-in-effect -- patrón intencional: reflejar query en el input
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  return (
    <header className='sticky top-0 z-50 border-b border-line/70 bg-surface/85 backdrop-blur-md'>
      <div className='mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6'>
          <Link to='/' className='group shrink-0'>
            <h1 className='font-display text-xl font-semibold tracking-tight sm:text-2xl'>
              <span className='text-accent transition group-hover:text-accent-dark'>Prisma</span>
              <span className='text-ink'>Inmobiliaria</span>
            </h1>
          </Link>

          <form
          onSubmit={handleSubmit}
          className='flex min-w-0 flex-1 items-center gap-2 rounded-md border border-line bg-mist px-3 py-2 transition focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/15 sm:max-w-xs md:max-w-sm'
        >

              <input 
                type='text' 
                placeholder='Buscar propiedades...'
                className='w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-muted'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />


                  
              <button type='submit' aria-label='Buscar' className='text-ink-muted transition hover:text-accent'>
                <FaSearch className='text-sm' />
              </button>



          </form>
            <ul className='flex items-center gap-1 sm:gap-5'>
              <Link to='/'>
              <li className='hidden text-sm font-medium text-ink-soft transition hover:text-accent sm:inline'>
                Inicio
              </li>
            </Link>
            <Link to='/about'>
              <li className='hidden text-sm font-medium text-ink-soft transition hover:text-accent sm:inline'>
                Acerca de
              </li>
            </Link>
            <Link to='/profile' className='flex items-center'>
            {currentUser ? (
              <img
                className='h-8 w-8 rounded-md object-cover ring-1 ring-line transition hover:ring-accent'
                src={currentUser.avatar || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'}
                alt='profile'
                referrerPolicy='no-referrer'
              />
            ) : (
              <li className='rounded-md bg-ink px-3 py-2 text-sm font-semibold text-white transition hover:bg-accent sm:px-4'>
                Iniciar sesión
              </li>
            )}
            
          </Link>

        </ul>
      </div>
    </header>
  );
}
