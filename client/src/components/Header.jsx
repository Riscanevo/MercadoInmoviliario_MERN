import { FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';


export default function Header() {
  return (
    <header className='bg-slate-200 shadow-md'>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
          <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
              <span className='text-slate-500'>Prisma</span>
              <span className='text-slate-700'>Inmobiliario</span>
          </h1>
          <form className='bg-slate-100 p-3 rounded-lg flex items-center'>
              <input 
                type='text' 
                placeholder='Buscar propiedades...'
                className='bg-transparent'
              />
              <FaSearch className='text-slate-600'/>
          </form>
            <ul className='flex gap-4 items-center'>
              <Link to='/'>
              <li className='hidden sm:inline text-slate-700 hover:underline'>
                Inicio
              </li>
            </Link>
            <Link to='/sign-in'>
              <li className='hidden sm:inline text-slate-700 hover:underline'>
              Iniciar sesión
              </li>
            </Link>
            <Link to='/about'>
                <li className=' text-slate-700 hover:underline'> Acerca de</li>
            </Link>
          </ul>
      </div>
    </header>
  )
}
