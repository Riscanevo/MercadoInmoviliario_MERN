import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase.js';

export default function CreateListing() {

  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 1000000,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleImageSubmit = () => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }

      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch(() => {
          setImageUploadError('La imagen no puede pesar más de 2mb');
          setUploading(false);
        });
    } else {
      setImageUploadError('Solo puedes subir 6 imágenes por listado');
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Subiendo ${progress}%`);
        },
        (error) => reject(error),
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
            resolve(downloadURL)
          );
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };
  const handleChange = (e) => {
    if (e.target.id === 'sale' || e.target.id === 'rent') {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === 'parking' ||
      e.target.id === 'furnished' ||
      e.target.id === 'offer'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === 'number' ||
      e.target.type === 'text' ||
      e.target.type === 'textarea'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError('Debes subir al menos una imagen');
      if (+formData.regularPrice < +formData.discountPrice)
        return setError('El precio con descuento debe ser menor al precio regular');
      setLoading(true);
      setError(false);
      const res = await fetch('/api/listing/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
        return;
      }
      navigate(`/listing/${data.listing._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  
  return (
    <main className='page-shell mx-auto max-w-4xl px-4 py-10 sm:px-6'>
      <p className='section-label mb-2 text-center'>Publicación</p>
      <h1 className='font-display mb-8 text-center text-4xl font-semibold text-ink'>
        Crear un listado
      </h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-6 rounded-md border border-line bg-surface/90 p-5 sm:flex-row sm:gap-4 sm:p-6'>
        <div className='flex flex-col gap-4 flex-1'>
          <input
            type='text'
            placeholder='Nombre del listado'
            className='input-field'
            id='name'
            maxLength='62'
            minLength='10'
            required
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            placeholder='Descripcion del listado'
            className='input-field min-h-[120px]'
            id='description'
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type='text'
            placeholder='Dirección'
            className='input-field'
            id='address'
            required
            onChange={handleChange}
            value={formData.address}
          />

          <div className='flex gap-6 flex-wrap'>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='sale'
                className='h-4 w-4 accent-accent'
                onChange={handleChange}
                checked={formData.type === 'sale'}
              />
              <span>Venta</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='rent'
                className='h-4 w-4 accent-accent'
                onChange={handleChange}
                checked={formData.type === 'rent'}
              />
              <span>Arriendo</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='parking'
                className='h-4 w-4 accent-accent'
                onChange={handleChange}
                checked={formData.parking}
              />
              <span>Parqueadero</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='furnished'
                className='h-4 w-4 accent-accent'
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span>Amueblado</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='offer'
                className='h-4 w-4 accent-accent'
                onChange={handleChange}
                checked={formData.offer}
              />
              <span>Oferta</span>
            </div>
          </div>

          <div className='flex flex-wrap gap-6'>
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='bedrooms'
                min='1'
                max='10'
                required
                className='input-field w-28'
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <p>Habitaciones</p>
            </div>
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='bathrooms'
                min='1'
                max='10'
                required
                className='input-field w-28'
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <p>Baños</p>
            </div>
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='regularPrice'
                min={formData.type === 'rent' ? 100000 : 15000000}
                max={formData.type === 'rent' ? 30000000 : 10000000000}
                step={formData.type === 'rent' ? 50000 : 1000000}
                required
                className='input-field w-28'
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <div className='flex flex-col items-center'>
                <p>Precio Habitual</p>
                {formData.type === 'rent' && (
                  <span className='text-xs'>($ / mes)</span>
                )}
              </div>
            </div>
            {formData.offer && (
              <div className='flex items-center gap-2'>
                <input
                  type='number'
                  id='discountPrice'
                  min={formData.type === 'rent' ? 100000 : 15000000}
                  max={formData.type === 'rent' ? 30000000 : 10000000000}
                  step={formData.type === 'rent' ? 50000 : 1000000}
                  required
                  className='input-field w-28'
                  onChange={handleChange}
                  value={formData.discountPrice}
                />
                <div className='flex flex-col items-center'>
                  <p>Precio con Descuento</p>
                  {formData.type === 'rent' && (
                    <span className='text-xs'>($ / mes)</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className='flex flex-col flex-1 gap-4'>
          <p className='font-semibold'>
            Imágenes:
            <span className='ml-2 font-normal text-ink-muted'>
              La primera imagen sera la portada (max 6)
            </span>
          </p>
          <div className='flex gap-4'>
            <input
              onChange={(e) => {
                setFiles(e.target.files);
                console.log('Archivos seleccionados:', e.target.files);
              }}
              className='input-field'
              type='file'
              id='images'
              accept='image/*'
              multiple
            />
            <button
              type='button'
              disabled={uploading}
              onClick={handleImageSubmit}
              className='btn-secondary shrink-0'
            >
              {uploading ? 'Subiendo...' : 'Subir'}
            </button>
          </div>
          <p className='text-sm text-danger'>
            {imageUploadError && imageUploadError}
          </p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={url}
                className='flex items-center justify-between border border-line p-3'
              >
                <img
                  src={url}
                  alt='imagen del listado'
                  className='h-20 w-20 rounded-md object-cover'
                />
                <button
                  type='button'
                  onClick={() => handleRemoveImage(index)}
                  className='p-3 font-semibold uppercase text-danger hover:opacity-75'
                >
                  Eliminar
                </button>
              </div>
            ))}
          <button
            disabled={loading || uploading}
            className='btn-primary'
          >
            {loading ? 'Creando...' : 'Crear listado'}
          </button>
          {error && <p className='text-sm text-danger'>{error}</p>}
        </div>
      </form>
    </main>
  );
}
