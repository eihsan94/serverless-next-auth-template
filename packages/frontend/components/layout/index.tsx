import React from 'react'
import Nav from '../nav'
import {
    Container,
    Stack,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
} from '@chakra-ui/react';
import Link from 'next/link'
  export interface BreadCrumbItemProps {
    href: string;
    name: string;
}
interface Props {
    breadCrumbs?: BreadCrumbItemProps[];
}

const Layout: React.FC<Props> = ({breadCrumbs, children}) => {

    return (
        <>
            <Nav />
            <Container maxW={'10xl'} pb="10">
                {breadCrumbs &&
                    <Breadcrumb px={'20'} pt={'10'}>
                        {breadCrumbs.map((item, i) => 
                            <BreadcrumbItem key={i}>
                                <Link href={item.href}>
                                    {item.name}
                                </Link>
                            </BreadcrumbItem>
                        )}
                    </Breadcrumb>
                }
                {children}
            </Container>
        </>
    )
}

export default Layout
