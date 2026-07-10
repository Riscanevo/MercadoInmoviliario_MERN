import React from 'react'       // eslint-disable-line no-unused-vars

export default function Header() {
  return (
    <header>
        <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
            <span className='text-slate-500'>Prisma</span>
            <span className='text-slate-700'>Inmobiliario</span>
        </h1>
    </header>
  )
}
