import { Link } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';

export default function ListingItem({ listing }) {
  return (
    <article className='group w-full overflow-hidden rounded-md border border-line/80 bg-surface transition duration-300 hover:-translate-y-1 hover:border-accent/30'>
      <Link to={`/listing/${listing._id}`} className='block'>
        <div className='relative overflow-hidden'>
          <img
            src={
              listing.imageUrls[0] ||
              'https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg'
            }
            alt='listing cover'
            className='h-[240px] w-full object-cover transition duration-500 group-hover:scale-105 sm:h-[210px]'
          />
          <span className='absolute left-3 top-3 bg-ink/80 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm'>
            {listing.type === 'rent' ? 'Alquiler' : 'Venta'}
          </span>
        </div>
        <div className='flex flex-col gap-2 p-4'>
          <p className='truncate font-display text-xl font-semibold text-ink'>
            {listing.name}
          </p>
          <div className='flex items-center gap-1'>
            <MdLocationOn className='h-4 w-4 shrink-0 text-accent' />
            <p className='w-full truncate text-sm text-ink-muted'>
              {listing.address}
            </p>
          </div>
          <p className='line-clamp-2 text-sm leading-relaxed text-ink-soft'>
            {listing.description}
          </p>
          <p className='mt-1 text-lg font-semibold text-accent'>
            $
            {listing.offer
              ? listing.discountPrice.toLocaleString('es-ES')
              : listing.regularPrice.toLocaleString('es-ES')}
            {listing.type === 'rent' && (
              <span className='text-sm font-medium text-ink-muted'> / mes</span>
            )}
          </p>
          <div className='flex gap-4 border-t border-line/70 pt-3 text-xs font-semibold text-ink-soft'>
            {listing.bedrooms != null && (
              <div>
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} habitaciones `
                  : `${listing.bedrooms} habitación `}
              </div>
            )}
            {listing.bathrooms != null && (
              <div>
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} baños `
                  : `${listing.bathrooms} baño `}
              </div>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
