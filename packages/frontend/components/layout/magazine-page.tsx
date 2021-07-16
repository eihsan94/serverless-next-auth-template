import React, { FC } from 'react'
import { Magazine } from '../../@types/magazine';
import { updateSpecialHandler } from '../../queries/specials';
import PostsLists from '../post-lists';
import {
    Stack,
    Heading,
    HStack,
  } from '@chakra-ui/react';
import Layout, { BreadCrumbItemProps } from '.'

interface MagazineEditPageProps {
    title: string;
    breadCrumbs: BreadCrumbItemProps[];
    data?: Magazine;
}


const MagazineEditPage: FC<MagazineEditPageProps> = ({breadCrumbs, title, data, children}) => {
    return (
        <Layout breadCrumbs={breadCrumbs}>
            <Stack 
                textAlign={'center'}
                pt={5}
            >
                <Heading>{title}</Heading>
            </Stack>
            <HStack
                w="full"
                wrap="wrap"
                justify="center"
                px="14"
            >
                {data &&
                    <>
                        {children}
                        <PostsLists magazine={data} updateHandler={async(m) => updateSpecialHandler(m)}/>
                    </>
                }
            </HStack>
        </Layout>
    )
}

export default MagazineEditPage


