import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useSelector } from 'react-redux';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from 'react-icons/fa';
import Contact from '../components/Contact';

export default function Listing() {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false); 
  const params = useParams();
  const {currentUser} = useSelector((state) => state.user);
  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  return (
    <main className='page-shell'>
      {loading && <p className='my-16 text-center font-display text-2xl text-ink-soft'>Cargando...</p>}
      {error && (
        <p className='my-16 text-center font-display text-2xl text-danger'>Ocurrió un error</p>
      )}
      {listing && !loading && !error && (
        <div>
          <div className='relative'>
            <Swiper modules={[Navigation]} navigation>
              {listing.imageUrls.map((url) => (
                <SwiperSlide key={url}>
                  <div
                    className='h-[420px] sm:h-[550px]'
                    style={{
                      background: `url(${url}) center no-repeat`,
                      backgroundSize: 'cover',
                    }}
                  ></div>
                </SwiperSlide>
              ))}
            </Swiper>
            <div className='pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink/30 to-transparent' />
          </div>
          <button
            type='button'
            className='fixed top-[13%] right-[3%] z-10 flex h-12 w-12 cursor-pointer items-center justify-center rounded-md border border-line bg-surface/95 text-ink-soft transition hover:border-accent hover:text-accent'
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              setCopied(true);
              setTimeout(() => {
                setCopied(false);
              }, 2000);
            }}
            aria-label='Compartir'
          >
            <FaShare />
          </button>
          {copied && (
            <p className='fixed top-[23%] right-[5%] z-10 rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink shadow-sm'>
              Link copiado!
            </p>
          )}
          <div className='mx-auto my-10 flex max-w-4xl flex-col gap-5 px-4 sm:px-6'>
            <p className='font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl'>
              {listing.name}
            </p>
            <p className='font-display text-2xl font-semibold text-accent'>
              ${' '}
              {listing.offer
                ? listing.discountPrice.toLocaleString('es-ES')
                : listing.regularPrice.toLocaleString('es-ES')}
              {listing.type === 'rent' && <span className='text-base font-medium text-ink-muted'> / mes</span>}
            </p>
            <p className='flex items-center gap-2 text-sm text-ink-soft'>
              <FaMapMarkerAlt className='text-accent' />
              {listing.address}
            </p>
            <div className='flex flex-wrap gap-3'>
              <p className='max-w-[200px] flex-1 bg-ink px-3 py-2 text-center text-sm font-semibold text-white'>
                {listing.type === 'rent' ? 'Arriendo' : 'Venta'}
              </p>
              {listing.offer && (
                <p className='max-w-[240px] flex-1 bg-accent px-3 py-2 text-center text-sm font-semibold text-white'>
                  ${(+listing.regularPrice - +listing.discountPrice).toLocaleString('es-ES')} de descuento
                </p>
              )}
            </div>
            <p className='leading-relaxed text-ink-soft'>
              <span className='font-semibold text-ink'>Descripción — </span>
              {listing.description}
            </p>
            <ul className='flex flex-wrap items-center gap-4 border-y border-line py-5 text-sm font-semibold text-accent sm:gap-6'>
              {listing.bedrooms != null && (
                <li className='flex items-center gap-2 whitespace-nowrap '>
                  <FaBed className='text-lg' />
                  {listing.bedrooms > 1
                    ? `${listing.bedrooms} dormitorios `
                    : `${listing.bedrooms} dormitorio `}
                </li>
              )}
              {listing.bathrooms != null && (
                <li className='flex items-center gap-1 whitespace-nowrap '>
                  <FaBath className='text-lg' />
                  {listing.bathrooms > 1
                    ? `${listing.bathrooms} baños `
                    : `${listing.bathrooms} baño `}
                </li>
              )}
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaParking className='text-lg' />
                {listing.parking ? 'Con parqueadero' : 'Sin parqueadero'}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaChair className='text-lg' />
                {listing.furnished ? 'Amueblado' : 'Sin amueblar'}
              </li>
            </ul>

            {currentUser && listing.userRef !== currentUser._id && !contact && (
              <button onClick={()=>setContact(true)} className='btn-primary w-full sm:w-auto'>
                Contactar al propietario
              </button>
            )}
            {contact && <Contact listing={listing}/>}
          </div>
        </div>
      )}
    </main>
  );
}
