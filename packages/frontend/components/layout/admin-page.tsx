import React from 'react'
import ProductCard from '../Card/ProductCard'
import Layout, { BreadCrumbItemProps } from '../../components/layout'
import {
    Flex,
    Heading,
    Text,
    Stack,
    Button,
} from '@chakra-ui/react';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { Magazine } from '@libTypes/magazine';
import { useState } from 'react';
import NormalModal from '../modals/normal-modal';

interface Props {
    title: string;
    data: Magazine[];
    createButton: JSX.Element;
    breadCrumbs: BreadCrumbItemProps[];
    isLoading: boolean;
    editHandler: (m:Magazine) => void;
    deleteHandler: (m: Magazine) => void;
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

const AdminPage: React.FC<Props> = ({data, createButton, title, breadCrumbs, isLoading, deleteHandler, editHandler, isOpen, onOpen, onClose}) => {
    const [currentMagazine, setCurrentMagazine] = useState<Magazine |null>(null)


    return (
        <Layout breadCrumbs={breadCrumbs}>
            <Stack 
                textAlign={'center'}
                align={'center'} 
                py={{ base: 5, md: 7 }}
            >
                <Heading>{title}</Heading>
                {createButton}
            </Stack>
            <Flex wrap="wrap" justify="center" w="full">
                {data.map((s, i) =>
                    <div key={i}>
                        <ProductCard heroImage={ s.heroImage ? `${s.heroImage}?${new Date().getTime()}` : ''}>
                            <Stack pt={10} align={'center'}>
                                <Text color={'gray.500'} fontSize={'sm'} textTransform={'uppercase'}>
                                    タイトル
                                </Text>
                                <Heading fontSize={'2xl'} fontFamily={'body'} fontWeight={500}>
                                    {s.title || 'タイトルなし'}
                                </Heading>
                                <Stack direction={'row'} align={'center'}>
                                    <Text color={'gray.500'} fontSize={'sm'} textTransform={'uppercase'}>
                                        記事の数
                                    </Text>
                                    <Text fontWeight={800} fontSize={'xl'}>
                                        {s.posts?.length}
                                    </Text>
                                </Stack>
                            </Stack>
                            <Button onClick={() => {
                                setCurrentMagazine(s) 
                                onOpen()
                            }} >
                                <DeleteIcon />
                            </Button>
                            <Button 
                                position="absolute"
                                right="4"
                                rounded={'full'}
                                colorScheme={'orange'}
                                bg={'orange.400'}
                                _hover={{ bg: 'orange.500' }}
                                onClick={() => editHandler(s)} 
                            >
                                <EditIcon />
                            </Button>
                        </ProductCard>
                    </div>
                )}
                {currentMagazine &&
                <NormalModal 
                    modalTitle={`${currentMagazine.title}削除します`} 
                    modalContent="よろしいでしょうか？" 
                    isOpen={isOpen}
                    onClose={onClose}
                    modalFooter={
                        <>
                            <Button variant="ghost" mr={3} onClick={onClose}>
                                やめる
                            </Button>
                            <Button isLoading={isLoading} colorScheme="red" onClick={() => deleteHandler(currentMagazine)}>削除する</Button>
                        </>
                    }
                />}
            </Flex>
        </Layout>
    )
}

export default AdminPage
