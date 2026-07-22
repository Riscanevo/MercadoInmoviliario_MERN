import { FaSearch, FaUser } from 'react-icons/fa';
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

  const isHome = location.pathname === '/';
  const isAbout = location.pathname === '/about';

  return (
    <header className='sticky top-0 z-50 border-b border-black/5 bg-white'>
      <div className='mx-auto flex max-w-7xl items-center gap-4 px-4 py-3.5 sm:px-6 lg:gap-8'>
          <Link to='/' className='shrink-0'>
            <h1 className='font-display text-[1.35rem] font-semibold tracking-tight sm:text-[1.65rem]'>
              <span className='text-ink'>Prisma</span>
              <span className='text-accent'>Inmobiliaria</span>
            </h1>
          </Link>

          <form
          onSubmit={handleSubmit}
          className='flex min-w-0 flex-1 items-center gap-3 rounded-full border border-[#e5e7eb] bg-white px-4 py-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition focus-within:border-accent/40 focus-within:ring-2 focus-within:ring-accent/10 md:max-w-xl lg:mx-auto'
        >
              <button type='submit' aria-label='Buscar' className='shrink-0 text-[#9ca3af] transition hover:text-accent'>
                <FaSearch className='text-sm' />
              </button>
              <input 
                type='text' 
                placeholder='Buscar ubicación, ciudad o propiedad...'
                className='w-full bg-transparent text-sm text-ink outline-none placeholder:text-[#9ca3af]'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
          </form>

            <ul className='flex shrink-0 items-center gap-4 sm:gap-6'>
              <Link to='/'>
              <li className={`hidden text-sm font-medium transition sm:inline ${isHome ? 'text-accent' : 'text-[#4b5563] hover:text-accent'}`}>
                Inicio
              </li>
            </Link>
            <Link to='/about'>
              <li className={`hidden text-sm font-medium transition sm:inline ${isAbout ? 'text-accent' : 'text-[#4b5563] hover:text-accent'}`}>
                Acerca de
              </li>
            </Link>
            <Link to='/profile' className='flex items-center'>
            {currentUser ? (
              <img
                className='h-9 w-9 rounded-full object-cover ring-1 ring-black/10 transition hover:ring-accent'
                src={currentUser.avatar || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'}
                alt='profile'
                referrerPolicy='no-referrer'
              />
            ) : (
              <li className='inline-flex items-center gap-2 rounded-lg bg-[#1a1f26] px-3.5 py-2.5 text-sm font-medium text-white transition hover:bg-accent sm:px-4'>
                <FaUser className='text-xs opacity-90' />
                <span>Iniciar sesión</span>
              </li>
            )}
            
          </Link>

        </ul>
      </div>
    </header>
  );
}
