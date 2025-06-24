'use client';
import Link from 'next/link'
import React from 'react'
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const Navitems = () => {

    const pathName=usePathname();

    const navItems=[
        {label:'Home',href:'/'},
        {label:'Companions',href:'/companions'},
        {label:'My Journey',href:'/my-journey'}
    ]
  return (
    <nav className='flex items-center gap-8'>
        {navItems.map(({href,label})=>(
            <Link 
                href={href} 
                key={label} 
                className={cn(pathName===href && 'text-primary font-semibold')}>
                {label}

            </Link>
        ))}
    </nav>
  )
}

export default Navitems
