import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useSelector } from 'react-redux';
import { Navigation, Pagination } from 'swiper/modules';
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

  const discountPercent =
    listing?.offer && listing.regularPrice > 0
      ? Math.round(
          ((listing.regularPrice - listing.discountPrice) / listing.regularPrice) * 100
        )
      : 0;

  return (
    <main className='page-shell bg-white'>
      {loading && <p className='my-16 text-center font-display text-2xl text-ink-soft'>Cargando...</p>}
      {error && (
        <p className='my-16 text-center font-display text-2xl text-danger'>Ocurrió un error</p>
      )}
      {listing && !loading && !error && (
        <div className='pb-16'>
          {/* Gallery */}
          <div className='relative mx-auto max-w-6xl px-4 pt-5 sm:px-6'>
            <div className='listing-gallery relative overflow-hidden rounded-2xl'>
              <Swiper
                modules={[Navigation, Pagination]}
                navigation
                pagination={{ clickable: true }}
                className='h-[280px] sm:h-[420px] lg:h-[480px]'
              >
                {listing.imageUrls.map((url) => (
                  <SwiperSlide key={url}>
                    <div
                      className='h-full w-full'
                      style={{
                        background: `url(${url}) center / cover no-repeat`,
                      }}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            <button
              type='button'
              className='absolute top-8 right-8 z-10 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-black/5 bg-white/95 text-ink-soft shadow-sm transition hover:text-accent sm:right-10'
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
              aria-label='Compartir'
            >
              <FaShare className='text-sm' />
            </button>
            {copied && (
              <p className='absolute top-24 right-8 z-10 rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink shadow-sm sm:right-10'>
                Link copiado!
              </p>
            )}
          </div>

          {/* Content */}
          <div className='mx-auto max-w-6xl px-4 pt-8 sm:px-6 sm:pt-10'>
            {/* Title + price row */}
            <div className='flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between lg:gap-8'>
              <div className='min-w-0 flex-1'>
                <h1 className='font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl lg:text-[2.75rem] lg:leading-tight'>
                  {listing.name}
                </h1>
                <p className='mt-3 flex items-start gap-2 text-sm text-[#6b7280] sm:text-[0.95rem]'>
                  <FaMapMarkerAlt className='mt-0.5 shrink-0 text-accent' />
                  <span>{listing.address || 'Ubicación no disponible'}</span>
                </p>
              </div>

              <div className='flex shrink-0 flex-wrap items-center gap-3 lg:justify-end'>
                <p className='text-3xl font-semibold tracking-tight text-accent sm:text-4xl'>
                  $
                  {listing.offer
                    ? listing.discountPrice.toLocaleString('es-ES')
                    : listing.regularPrice.toLocaleString('es-ES')}
                  {listing.type === 'rent' && (
                    <span className='ml-1 text-base font-medium text-ink-muted'>/ mes</span>
                  )}
                </p>
                <span className='rounded-md bg-[#2f343a] px-3 py-1.5 text-xs font-semibold tracking-wide text-white uppercase'>
                  {listing.type === 'rent' ? 'Arriendo' : 'Venta'}
                </span>
                {listing.offer && discountPercent > 0 && (
                  <span className='rounded-md bg-accent px-3 py-1.5 text-xs font-semibold tracking-wide text-white'>
                    -{discountPercent}%
                  </span>
                )}
              </div>
            </div>

            <div className='mt-8 border-t border-[#e8ebef]' />

            {/* Description + amenities */}
            <div className='mt-8 grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-start'>
              <p className='text-[0.95rem] leading-relaxed text-[#5b6470] sm:text-base'>
                {listing.description}
              </p>

              <ul className='grid grid-cols-2 gap-y-6 sm:grid-cols-4 lg:gap-0'>
                {listing.bedrooms != null && (
                  <li className='flex flex-col items-center gap-2 border-[#e8ebef] px-2 text-center sm:border-r lg:px-3'>
                    <FaBed className='text-2xl text-accent' />
                    <span className='text-sm font-medium text-accent'>
                      {listing.bedrooms} {listing.bedrooms === 1 ? 'Habitación' : 'Habitaciones'}
                    </span>
                  </li>
                )}
                {listing.bathrooms != null && (
                  <li className='flex flex-col items-center gap-2 border-[#e8ebef] px-2 text-center sm:border-r lg:px-3'>
                    <FaBath className='text-2xl text-accent' />
                    <span className='text-sm font-medium text-accent'>
                      {listing.bathrooms} {listing.bathrooms === 1 ? 'Baño' : 'Baños'}
                    </span>
                  </li>
                )}
                <li className='flex flex-col items-center gap-2 border-[#e8ebef] px-2 text-center sm:border-r lg:px-3'>
                  <FaParking className='text-2xl text-accent' />
                  <span className='text-sm font-medium text-accent'>
                    {listing.parking ? 'Parqueadero' : 'Sin parqueadero'}
                  </span>
                </li>
                <li className='flex flex-col items-center gap-2 px-2 text-center lg:px-3'>
                  <FaChair className='text-2xl text-accent' />
                  <span className='text-sm font-medium text-accent'>
                    {listing.furnished ? 'Amoblado' : 'Sin amoblar'}
                  </span>
                </li>
              </ul>
            </div>

            {/* CTA */}
            {currentUser && listing.userRef !== currentUser._id && !contact && (
              <div className='mt-12 flex justify-center'>
                <button
                  onClick={() => setContact(true)}
                  className='inline-flex items-center gap-2.5 rounded-xl bg-accent px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-accent-dark sm:text-base'
                >
                  
                  Contactar al propietario
                </button>
              </div>
            )}
            {contact && (
              <div className='mx-auto mt-10 max-w-xl'>
                <Contact listing={listing} />
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
