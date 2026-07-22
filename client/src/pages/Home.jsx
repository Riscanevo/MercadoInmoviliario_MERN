import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, EffectFade } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';


export default function Home() {

  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation]);
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

  const heroSlides =
    offerListings && offerListings.length > 0
      ? offerListings
      : [{ _id: 'fallback', imageUrls: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=80'] }];

  return (
    <div className='page-shell'>
    {/* Hero full-bleed */}
    <section className='relative min-h-[88vh] w-full overflow-hidden'>
      <Swiper
        modules={[Navigation, Autoplay, EffectFade]}
        navigation
        effect='fade'
        autoplay={{ delay: 5200, disableOnInteraction: false }}
        loop={heroSlides.length > 1}
        className='absolute inset-0 h-full w-full'
      >
        {heroSlides.map((listing) => (
          <SwiperSlide key={listing._id}>
            <div
              style={{
                background: `url(${listing.imageUrls[0]}) center / cover no-repeat`,
              }}
              className='h-[88vh] w-full scale-105'
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className='pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/55 to-ink/25' />
      <div className='pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-ink/20' />

      <div className='relative z-10 mx-auto flex min-h-[88vh] max-w-6xl flex-col justify-end px-4 pb-16 pt-28 sm:px-6 sm:pb-20 lg:justify-center lg:pb-0'>
        <p className='section-label fade-up mb-4 text-white/90'>PrismaInmobiliaria</p>
        <h1 className='fade-up-delay font-display max-w-3xl text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-7xl'>
          Encuentra tu próximo lugar perfecto
        </h1>
        <p className='fade-up-delay-2 mt-5 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base'>
          Propiedades seleccionadas para comprar o alquilar, con una experiencia clara y moderna.
        </p>
        <div className='fade-up-delay-2 mt-8'>
          <Link
            to={'/search'}
            className='btn-primary pointer-events-auto bg-white text-ink hover:bg-mist'
          >
            Explorar propiedades
          </Link>
        </div>
      </div>
    </section>

    {/* listing results for offer, sale and rent */}

    <div className='mx-auto max-w-6xl px-4 py-16 sm:px-6'>
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
