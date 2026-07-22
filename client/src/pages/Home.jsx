import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ListingItem from '../components/ListingItem';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=2400&q=80';

export default function Home() {

  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch('/api/listing/get?offer=true&limit=4');
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchRentListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=rent&limit=4');
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=sale&limit=4');
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOfferListings();
  }, []);

  return (
    <div className='page-shell'>
    {/* Hero — composición como mockup de referencia */}
    <section className='relative flex min-h-[calc(100vh-4.25rem)] w-full items-end overflow-hidden sm:items-center'>
      <div
        className='absolute inset-0 scale-105 bg-cover bg-center'
        style={{ backgroundImage: `url(${HERO_IMAGE})` }}
        aria-hidden='true'
      />
      {/* Soft left readability overlay (matches photo, not heavy) */}
      <div className='pointer-events-none absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-transparent' />
      <div className='pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10' />

      <div className='relative z-10 mx-auto w-full max-w-7xl px-5 pb-16 pt-24 sm:px-8 sm:pb-20 lg:px-10 lg:pb-24'>
        <h1 className='fade-up font-display max-w-2xl text-[2.35rem] font-semibold leading-[1.12] tracking-tight text-white sm:text-5xl lg:text-[3.75rem] lg:leading-[1.08]'>
          Encuentra tu próximo lugar perfecto
        </h1>
        <p className='fade-up-delay mt-5 max-w-md text-[0.95rem] leading-relaxed text-white/90 sm:text-base lg:text-lg'>
          Propiedades seleccionadas cuidadosamente para ayudarte a vivir mejor.
        </p>
        <div className='fade-up-delay-2 mt-8 sm:mt-10'>
          <Link
            to={'/search'}
            className='inline-flex items-center justify-center rounded-lg bg-white px-7 py-3.5 text-sm font-semibold text-[#1a1f26] shadow-sm transition hover:bg-white/90 sm:px-8 sm:text-base'
          >
            Explorar propiedades
          </Link>
        </div>
      </div>
    </section>

    {/* listing results for offer, sale and rent */}

    <div className='mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8'>
      {offerListings && offerListings.length > 0 && (
        <section className='mb-16'>
          <div className='mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between'>
            <div>
              <p className='section-label mb-2'>Selección</p>
              <h2 className='section-title'>Ofertas recientes</h2>
            </div>
            <Link className='btn-ghost text-sm' to={'/search?offer=true'}>Ver más ofertas →</Link>
          </div>
          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {offerListings.map((listing) => (
              <ListingItem listing={listing} key={listing._id} />
            ))}
          </div>
        </section>
      )}
      {rentListings && rentListings.length > 0 && (
        <section className='mb-16'>
          <div className='mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between'>
            <div>
              <p className='section-label mb-2'>Alquiler</p>
              <h2 className='section-title'>Lugares recientes para rentar</h2>
            </div>
            <Link className='btn-ghost text-sm' to={'/search?type=rent'}>Ver más alquileres →</Link>
          </div>
          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {rentListings.map((listing) => (
              <ListingItem listing={listing} key={listing._id} />
            ))}
          </div>
        </section>
      )}
      {saleListings && saleListings.length > 0 && (
        <section>
          <div className='mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between'>
            <div>
              <p className='section-label mb-2'>Venta</p>
              <h2 className='section-title'>Lugares recientes para vender</h2>
            </div>
            <Link className='btn-ghost text-sm' to={'/search?type=sale'}>Ver más ventas →</Link>
          </div>
          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {saleListings.map((listing) => (
              <ListingItem listing={listing} key={listing._id} />
            ))}
          </div>
        </section>
      )}
    </div>
  </div>
);
}
