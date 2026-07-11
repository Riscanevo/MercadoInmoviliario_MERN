 import {Link} from 'react-router-dom'    // eslint-disable-line no-unused-vars


export default function SignUp() {
  return (
    <div>
        <h1 className='text-3xl text-center font-semibold my-7'>Iniciar sesión</h1>        
      <form className='flex flex-col items-center gap-4'>
      <input
          type='text'
          placeholder='username'
          className='border p-3 rounded-lg'
          id='username'
        />

        <input
          type='email'
          placeholder='email'
          className='border p-3 rounded-lg'
          id='email'
        />

        <input
            type='password'
            placeholder='password'
            className='border p-3 rounded-lg'
            id='password'
        />

         <button
          className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>Sign Up
          </button>
          
      </form>
      <div className='flex gap-2 mt-5'>
        <p>¿Ya tienes una cuenta?</p>

        <Link to='/sign-in'>
          <span className='text-blue-500'>Iniciar sesión</span>
        </Link>

      </div>
    </div>
  )
}
