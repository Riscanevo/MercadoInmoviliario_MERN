import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {signInStart, signInSuccess, signInFailure} from '../redux/user/userSlice.js';
import OAuth from '../components/OAuth.jsx';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const {loading, error} = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      dispatch(signInFailure(error.message));
      
    }
  };

  return (
    <div className='page-shell flex items-center justify-center px-4 py-14'>
      <div className='w-full max-w-md rounded-md border border-line bg-surface/90 p-6 sm:p-8'>
        <p className='section-label mb-3 text-center'>Bienvenido</p>
        <h1 className='font-display mb-2 text-center text-4xl font-semibold text-ink'>Iniciar sesión</h1>
        <p className='mb-8 text-center text-sm text-ink-muted'>Accede para gestionar tus propiedades y contactos.</p>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <input
            type='email'
            placeholder='Correo electrónico'
            className='input-field'
            id='email'
            onChange={handleChange}
          />
          <input
            type='password'
            placeholder='Contraseña'
            className='input-field'
            id='password'
            onChange={handleChange}
          />

          <button
            disabled={loading}
            className='btn-primary w-full'
          >
            {loading ? 'Cargando...' : 'Iniciar sesión'}
          </button>

          <div className='relative my-1 text-center text-xs uppercase tracking-wider text-ink-muted'>
            <span className='bg-surface relative z-10 px-3'>o</span>
            <span className='absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-line' />
          </div>

          <OAuth  />

          
        </form>
        <div className='mt-6 flex justify-center gap-2 text-sm text-ink-soft'>
          <p>¿No tienes una cuenta?</p>
          <Link to={'/sign-up'}>
            <span className='font-semibold text-accent hover:text-accent-dark'>Crear cuenta</span>
          </Link>
        </div>
        {error && <p className='mt-5 rounded-md border border-danger/20 bg-danger/5 px-3 py-2 text-sm text-danger'>{error}</p>}
      </div>
    </div>
  );
}
