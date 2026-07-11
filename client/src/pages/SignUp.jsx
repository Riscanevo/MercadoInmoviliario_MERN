 import {Link, useNavigate} from 'react-router-dom'    // eslint-disable-line no-unused-vars
 import { useState } from 'react';



export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false || !res.ok) {
        setLoading(false);
        setError(data.message || 'Ocurrió un error');
        return;
      }
      setLoading(false);
      navigate('/sign-in');
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };
 
  return (
    <div>
        <h1 className='text-3xl text-center font-semibold my-7'>Registrarse</h1>        
      <form onSubmit={handleSubmit} className='flex flex-col items-center gap-4'>
      <input
          type='text'
          placeholder='Nombre de usuario'
          className='border p-3 rounded-lg'
          id='username'
          onChange={handleChange}
        />

        <input
          type='email'
          placeholder='Correo electrónico'
          className='border p-3 rounded-lg'
          id='email'
          onChange={handleChange}
        />

        <input
            type='password'
            placeholder='Contraseña'
            className='border p-3 rounded-lg'
            id='password'
            onChange={handleChange}
        />

         <button disabled={loading}
          className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
            {loading ? 'Cargando...' : 'Registrar'}
          </button>

      </form>
    
      <div className='flex gap-2 mt-5'>
        <p>¿Ya tienes una cuenta?</p>

        <Link to='/sign-in'>
          <span className='text-blue-500'>Iniciar sesión</span>
        </Link>
        {error && <p className='text-red-500 mt-5'>{error}</p>}

      </div>
    </div>
  )
}
