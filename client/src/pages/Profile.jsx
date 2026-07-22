import { useSelector, useDispatch } from 'react-redux'
import {Link} from 'react-router-dom'
import { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase.js'
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
} from '../redux/user/userSlice.js'
import { FaPencilAlt } from 'react-icons/fa'


export default function Profile() {
  const fileRef = useRef(null)
  const {currentUser, loading, error} = useSelector ((state) => state.user)
  const [file, setFile] = useState(undefined)
  const [fileperc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  

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

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess());
      navigate('/sign-in');
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  }

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }
      setUserListings(data);
    } catch {
      setShowListingsError(true);
    }
  }

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return; 
      }
      dispatch(signOutUserSuccess());
      navigate('/sign-in');
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  }
  
  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className='page-shell mx-auto max-w-md px-4 py-10'>
    <p className='section-label mb-2 text-center'>Cuenta</p>
    <h1 className='font-display mb-8 text-center text-4xl font-semibold text-ink'>Perfil del usuario</h1>
    <form  onSubmit={handleSubmit} className='flex flex-col gap-4 rounded-md border border-line bg-surface/90 p-5 sm:p-6'>
      <input 
      onChange={(e) => setFile(e.target.files[0])} 
      type="file" 
      ref={fileRef} 
      hidden accept='image/*'/>

      <div
        onClick={() => fileRef.current.click()}
        className='group relative mx-auto h-24 w-24 cursor-pointer'
        title='Cambiar foto de perfil'
      >
        <img
          src={formData.avatar || currentUser.avatar}
          alt="Profile"
          className='h-24 w-24 rounded-md object-cover ring-1 ring-line'
        />
        <span className='absolute right-0 bottom-0 flex h-8 w-8 items-center justify-center rounded-md border border-surface bg-accent text-white transition-colors group-hover:bg-accent-dark'>
          <FaPencilAlt className='text-xs' />
        </span>
      </div>
      <p className='self-center text-sm'>
        {fileUploadError ? (
          <span className='text-danger'>Error al subir la imagen (imagen debe ser menor a 2MB)</span>
        ) : fileperc > 0 && fileperc < 100 ? (
          <span className='text-ink-soft'>{`Subiendo ${fileperc}%`}</span>
        ) : fileperc === 100 ? (
          <span className='text-success'>Imagen subida correctamente!</span>
        ) : (
          ''
        )}
      </p>
      <input type="text" placeholder='Nombre' defaultValue={currentUser.username} id="username" onChange={handleChange} className='input-field' />
      <input type="text" placeholder='Email' defaultValue={currentUser.email} id="email" onChange={handleChange} className='input-field' />
      <input type="password" placeholder='Contraseña' id="password" onChange={handleChange} className='input-field' />
      <button disabled={loading} type='submit' className='btn-primary cursor-pointer'>
        {loading ? 'Cargando...' : 'Actualizar'}
      </button>
      <Link to='/create-listing' className='btn-secondary text-center'>
        Crear listado
      </Link>
    </form>
    <div className='mt-5 flex justify-between text-sm'> 
      <span onClick={handleDeleteUser} className='cursor-pointer font-medium text-danger hover:underline'>Eliminar cuenta</span>
      <span onClick={handleSignOut} className='cursor-pointer font-medium text-accent hover:underline'>Cerrar sesión</span>
    </div>
    <p className='mt-5 text-danger'>{error ? error : ''}</p>
    <p className='mt-5 text-success'>{updateSuccess ? '¡Usuario actualizado correctamente!' : ''}</p>

    <button onClick={handleShowListings} className='btn-ghost mt-4 w-full cursor-pointer'> 
      Ver mis listados
    </button>
    <p className='mt-5 text-danger'>{showListingsError ? 'Error al cargar los listados' : ''}</p>

    {userListings && userListings.length > 0 && (
      <div className='mt-6 flex flex-col gap-4'>
        <h1 className='font-display text-center text-2xl font-semibold text-ink'>Tus listados</h1>
        {userListings.map((listing) => (
          <div key={listing._id} className='flex items-center justify-between gap-4 rounded-md border border-line bg-surface p-3'>
            <Link to={`/listing/${listing._id}`}>
              <img
                src={listing.imageUrls[0]}
                alt='portada del listado'
                className='h-16 w-16 rounded-md object-cover'
              />
            </Link>
            <Link className='flex-1 truncate font-semibold text-ink hover:text-accent' to={`/listing/${listing._id}`}>
              <p>{listing.name}</p>
            </Link>
            <div className='flex flex-col items-center gap-1 text-xs font-semibold uppercase tracking-wide'>
              <button onClick={() => handleListingDelete(listing._id)} className='text-danger hover:underline'>Eliminar</button>
              <Link to={`/update-listing/${listing._id}`}>
                <button className='text-accent hover:underline'>Editar</button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    )}
    </div>
  )
};


