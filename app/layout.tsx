import './globals.css';import type {Metadata} from 'next';import {Nav} from '@/components/Nav';import {Providers} from '@/components/Providers';
export const metadata:Metadata={title:'Neon Garage — Build. Drive. Collect.',description:'A Web3 garage for digital car culture on Robinhood Chain.'};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body><Providers><Nav/>{children}</Providers></body></html>}
