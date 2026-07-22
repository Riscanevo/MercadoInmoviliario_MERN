export default function About() {
  return (
    <div className='page-shell'>
      <section className='relative overflow-hidden border-b border-line'>
        <div className='absolute inset-0 bg-gradient-to-br from-ink via-ink to-accent-dark' />
        <div className='absolute inset-0 opacity-30' style={{
          backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.12), transparent 40%), radial-gradient(circle at 80% 60%, rgba(13,115,119,0.35), transparent 45%)'
        }} />
        <div className='relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28'>
          
          <h1 className='font-display max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl'>
            Sobre PrismaInmobiliaria
          </h1>
        </div>
      </section>

      <div className='mx-auto max-w-3xl px-4 py-16 sm:px-6'>
        <p className='mb-6 text-lg leading-relaxed text-ink-soft'>
          PrismaInmobiliaria es una agencia inmobiliaria que se especializa en ayudar a los clientes a comprar, vender y alquilar propiedades en las mejores zonas. Nuestro equipo de agentes experimentados está dedicado a proporcionar un servicio excepcional y hacer que el proceso de compra y venta sea lo más suave posible.
        </p>
        <p className='text-lg leading-relaxed text-ink-soft'>
          Nuestra misión es ayudar a nuestros clientes a lograr sus objetivos inmobiliarios proporcionando asesoramiento experto, servicio personalizado y un profundo conocimiento del mercado local. Ya sea que esté buscando comprar, vender o alquilar una propiedad, estamos aquí para ayudarlo en cada paso del camino.
        </p>
      </div>
    </div>
  );
}
