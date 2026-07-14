import { useSelector } from 'react-redux'

export default function Profile() {
  const {currentUser} = useSelector ((state) => state.user)
  return (
    <div className='max-w-md mx-auto p-4'>
    <h1 className='text-3xl font-semibold  text-center my-7'>Perfil del usuario</h1>
    <form className='flex flex-col gap-4'>
      <img src={currentUser.avatar} alt="Profile" className='w-24 h-24 object-cover  rounded-full cursor-pointer mx-auto block' />
      <input type="text" placeholder='Nombre' id="username" className='border p-3 rounded-lg ' />
      <input type="text" placeholder='Email' id="email" className='w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500' />
      <input type="text" placeholder='Contraseña' id="password" className='w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500' />
      <button type='update' className='bg-slate-700 p-3 rounded-lg text-white cursor-pointer hover:bg-slate-800'>Actualizar</button>
    </form>
    <div className='flex justify-between mt-5'> 
      <span className='text-red-500 cursor-pointer'>Eliminar cuenta</span>
      <span className='text-blue-500 cursor-pointer'>Cerrar sesión</span>
    </div>
    </div>
  )
}
