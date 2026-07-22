import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ListingItem from '../components/ListingItem';

export default function Search() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebardata, setSidebardata] = useState({
    searchTerm: '',
    type: 'all',
    parking: false,
    furnished: false,
    offer: false,
    sort: 'createdAt',
    order: 'desc',
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const typeFromUrl = urlParams.get('type');
    const parkingFromUrl = urlParams.get('parking');
    const furnishedFromUrl = urlParams.get('furnished');
    const offerFromUrl = urlParams.get('offer');
    const sortFromUrl = urlParams.get('sort');
    const orderFromUrl = urlParams.get('order');

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- sincroniza el formulario con la URL
      setSidebardata({
        searchTerm: searchTermFromUrl || '',
        type: typeFromUrl || 'all',
        parking: parkingFromUrl === 'true',
        furnished: furnishedFromUrl === 'true',
        offer: offerFromUrl === 'true',
        sort: sortFromUrl || 'createdAt',
        order: orderFromUrl || 'desc',
      });
    }

    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();
      if (data.length > 8) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
      setListings(data);
      setLoading(false);
    };

    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    if (
      e.target.id === 'all' ||
      e.target.id === 'rent' ||
      e.target.id === 'sale'
    ) {
      setSidebardata({ ...sidebardata, type: e.target.id });
    }

    if (e.target.id === 'searchTerm') {
      setSidebardata({ ...sidebardata, searchTerm: e.target.value });
    }

    if (
      e.target.id === 'parking' ||
      e.target.id === 'furnished' ||
      e.target.id === 'offer'
    ) {
      setSidebardata({
        ...sidebardata,
        [e.target.id]: e.target.checked,
      });
    }

    if (e.target.id === 'sort_order') {
      const sort = e.target.value.split('_')[0] || 'createdAt';
      const order = e.target.value.split('_')[1] || 'desc';
      setSidebardata({ ...sidebardata, sort, order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set('searchTerm', sidebardata.searchTerm);
    urlParams.set('type', sidebardata.type);
    urlParams.set('parking', sidebardata.parking);
    urlParams.set('furnished', sidebardata.furnished);
    urlParams.set('offer', sidebardata.offer);
    urlParams.set('sort', sidebardata.sort);
    urlParams.set('order', sidebardata.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const onShowMoreClick = async () => {
    const numberOfListings = listings.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/listing/get?${searchQuery}`);
    const data = await res.json();
    if (data.length < 9) {
      setShowMore(false);
    }
    setListings([...listings, ...data]);
  };

  return (
    <div className='page-shell flex flex-col md:flex-row'>
      <aside className='border-b border-line bg-surface/70 p-6 md:min-h-[calc(100vh-4.5rem)] md:w-[320px] md:shrink-0 md:border-b-0 md:border-r'>
        <p className='section-label mb-3'>Filtros</p>
        <h2 className='font-display mb-6 text-2xl font-semibold text-ink'>Buscar propiedades</h2>
        <form onSubmit={handleSubmit} className='flex flex-col gap-7'>
          <div className='flex flex-col gap-2'>
            <label className='text-sm font-semibold text-ink-soft'>Nombre de la propiedad</label>
            <input
              type='text'
              id='searchTerm'
              placeholder='Buscar...'
              className='input-field'
              value={sidebardata.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className='flex flex-col gap-3'>
            <label className='text-sm font-semibold text-ink-soft'>Tipo</label>
            <div className='flex flex-wrap gap-3 text-sm text-ink'>
            <div className='flex items-center gap-2'>
              <input
                type='checkbox'
                id='all'
                className='h-4 w-4 accent-accent'
                onChange={handleChange}
                checked={sidebardata.type === 'all'}
              />
              <span>Alquiler & Venta</span>
            </div>
            <div className='flex items-center gap-2'>
              <input
                type='checkbox'
                id='rent'
                className='h-4 w-4 accent-accent'
                onChange={handleChange}
                checked={sidebardata.type === 'rent'}
              />
              <span>Alquiler</span>
            </div>
            <div className='flex items-center gap-2'>
              <input
                type='checkbox'
                id='sale'
                className='h-4 w-4 accent-accent'
                onChange={handleChange}
                checked={sidebardata.type === 'sale'}
              />
              <span>Venta</span>
            </div>
            <div className='flex items-center gap-2'>
              <input
                type='checkbox'
                id='offer'
                className='h-4 w-4 accent-accent'
                onChange={handleChange}
                checked={sidebardata.offer}
              />
              <span>Oferta</span>
            </div>
            </div>
          </div>
          <div className='flex flex-col gap-3'>
            <label className='text-sm font-semibold text-ink-soft'>Servicios</label>
            <div className='flex flex-wrap gap-3 text-sm text-ink'>
            <div className='flex items-center gap-2'>
              <input
                type='checkbox'
                id='parking'
                className='h-4 w-4 accent-accent'
                onChange={handleChange}
                checked={sidebardata.parking}
              />
              <span>Parqueadero</span>
            </div>
            <div className='flex items-center gap-2'>
              <input
                type='checkbox'
                id='furnished'
                className='h-4 w-4 accent-accent'
                onChange={handleChange}
                checked={sidebardata.furnished}
              />
              <span>Muebles</span>
            </div>
            </div>
          </div>
          <div className='flex flex-col gap-2'>
            <label className='text-sm font-semibold text-ink-soft'>Ordenar</label>
            <select
              onChange={handleChange}
              value={`${sidebardata.sort}_${sidebardata.order}`}
              id='sort_order'
              className='input-field'
            >
              <option value='regularPrice_desc'>Precio alto a bajo</option>
              <option value='regularPrice_asc'>Precio bajo a alto</option>
              <option value='createdAt_desc'>Último</option>
              <option value='createdAt_asc'>Más antiguo</option>
            </select>
          </div>
          <button className='btn-primary w-full'>
            Buscar
          </button>
        </form>
      </aside>
      <div className='flex-1'>
        <div className='border-b border-line px-4 py-6 sm:px-7'>
          <p className='section-label mb-2'>Resultados</p>
          <h1 className='font-display text-3xl font-semibold text-ink'>
            Resultados de la búsqueda
          </h1>
        </div>
        <div className='grid grid-cols-1 gap-6 p-4 sm:grid-cols-2 sm:p-7 xl:grid-cols-3'>
        {!loading && listings.length === 0 && (
            <p className='col-span-full text-lg text-ink-soft'>No se encontraron propiedades.</p>
          )}
          {loading && (
            <p className='col-span-full w-full text-center text-lg text-ink-soft'>
              Cargando...
            </p>
          )}

          {!loading &&
            listings &&
            listings.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))}
        </div>
        {showMore && (
          <div className='px-4 pb-10 sm:px-7'>
            <button
              onClick={onShowMoreClick}
              className='btn-secondary w-full'
            >
              Ver más
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
