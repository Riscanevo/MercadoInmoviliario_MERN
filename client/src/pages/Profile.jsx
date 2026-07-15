import { useSelector, useDispatch } from 'react-redux'
import { useRef, useState, useEffect } from 'react'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase.js'
import { updateUserStart, updateUserSuccess, updateUserFailure } from '../redux/user/userSlice.js'


export default function Profile() {
  const fileRef = useRef(null)
  const {currentUser, loading, error} = useSelector ((state) => state.user)
  const [file, setFile] = useState(undefined)
  const [fileperc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const dispatch = useDispatch();
  

  //firebase storage
  // allow read;
  // allow write: if
  // request.resource.size < 2 * 1024 * 1024 &&
  // request.resource.contentType.matches('image/.*')

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setFilePerc(Math.round(progress));
    }, () => {
      setFileUploadError(true);
    }, () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        setFormData({...formData, avatar: downloadURL});
      });
    });
  };

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  useEffect(() => {
    if (fileperc === 100) {
      const timer = setTimeout(() => {
        setFilePerc(0);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [fileperc]);

  useEffect(() => {
    if (updateSuccess) {
      const timer = setTimeout(() => {
        setUpdateSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [updateSuccess]);



const handleChange = (e) => {
  setFormData({...formData, [e.target.id]: e.target.value});
};


const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    dispatch(updateUserStart());
    const res = await fetch(`/api/user/update/${currentUser._id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (data.success === false) {
      dispatch(updateUserFailure(data.message));
      return;
    }
    dispatch(updateUserSuccess(data));
    setUpdateSuccess(true);
  } catch (error) {
    dispatch(updateUserFailure(error.message));
  }
}

  return (
    <div className='max-w-md mx-auto p-4'>
    <h1 className='text-3xl font-semibold  text-center my-7'>Perfil del usuario</h1>
    <form  onSubmit={handleSubmit} className='flex flex-col gap-4'>
      <input 
      onChange={(e) => setFile(e.target.files[0])} 
      type="file" 
      ref={fileRef} 
      hidden accept='image/*'/>

      <img onClick={() => fileRef.current.click()}  src={formData.avatar || currentUser.avatar} alt="Profile" className='w-24 h-24 object-cover  rounded-full cursor-pointer mx-auto block' />
      <p className='text-sm self-center'>
        {fileUploadError ? (
          <span className='text-red-700'>Error al subir la imagen (imagen debe ser menor a 2MB)</span>
        ) : fileperc > 0 && fileperc < 100 ? (
          <span className='text-slate-700'>{`Subiendo ${fileperc}%`}</span>
        ) : fileperc === 100 ? (
          <span className='text-green-700'>Imagen subida correctamente!</span>
        ) : (
          ''
        )}
      </p>
      <input type="text" placeholder='Nombre' defaultValue={currentUser.username} id="username" onChange={handleChange} className='border p-3 rounded-lg' />
      <input type="text" placeholder='Email' defaultValue={currentUser.email} id="email" onChange={handleChange} className='w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500' />
      <input type="password" placeholder='Contraseña' id="password" onChange={handleChange} className='w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500' />
      <button disabled={loading} type='submit' className='bg-slate-700 p-3 rounded-lg text-white cursor-pointer hover:bg-slate-800 disabled:opacity-70'>
        {loading ? 'Cargando...' : 'Actualizar'}
      </button>
    </form>
    <div className='flex justify-between mt-5'> 
      <span className='text-red-500 cursor-pointer'>Eliminar cuenta</span>
      <span className='text-blue-500 cursor-pointer'>Cerrar sesión</span>
    </div>
    <p className='text-red-700 mt-5'>{error ? error : ''}</p>
    <p className='text-green-700 mt-5'>{updateSuccess ? '¡Usuario actualizado correctamente!' : ''}</p>
    </div>
  )
}


