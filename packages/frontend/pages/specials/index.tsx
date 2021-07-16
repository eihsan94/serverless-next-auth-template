import { GetServerSideProps } from 'next'
import { useRouter } from 'next/dist/client/router'
import React, { useState } from 'react'
import { Special } from '../../@types/special'
import AdminPage from '../../components/layout/admin-page'
import {Button, useDisclosure, useToast} from '@chakra-ui/react';
import { BreadCrumbItemProps } from '../../components/layout'
import { createSpecialHandler, deleteSpecialHandler, getSpecialsHandler } from '../../queries/specials'

interface Props {
    specials:Special[]  
}


const SpecialsIndex: React.FC<Props> = ({specials}) => {
    const toast = useToast()
    const router = useRouter()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [isLoading, setIsLoading] = useState(false)
    const [isCreateLoading, setIsCreateLoading] = useState(false)
    const [specialsData, setSpecialsData] = useState(specials)

    const breadCrumbs: BreadCrumbItemProps[] = [
        {href: '/', name: 'ホーム'},
        {href: '/specials', name: '特集'},
    ]
    const createSpecials = async() => {
        setIsCreateLoading(true)
        const special: Special ={
            title: '',
            description: '',
            heroImage: '',
            isPublished: false,
            posts: [],
        }
        
        try {
            const res = await createSpecialHandler(special)
            await router.push(`specials/${res.partition_key}`)
            toast({
                title: `成功`,
                description: `特集を新規作成しました`,
                status: "success",
                duration: 2000,
                isClosable: true,
            })
            
        } catch (error) {
            toast({
                title: `エラー`,
                description: `エラー内容${JSON.stringify(error)}`,
                status: "error",
                duration: 2000,
                isClosable: true,
            })
            setIsCreateLoading(false)
        }
    }
    const editHandler = (s: Special) => {
        router.push(`specials/${s.partition_key}`)        
    }
    const deleteHandler = async(s: Special) => {
        setIsLoading(true)
        try {
            await deleteSpecialHandler(s)
            onClose()
            const index = specialsData.findIndex(d => d.partition_key === s.partition_key)
            const protoData = [...specialsData]
            protoData.splice(index, 1)
            // console.log(index, protoData.map(d => d.title));
            setSpecialsData([...protoData])
            toast({
                title: `成功`,
                description: `${s.title}削除しました`,
                status: "success",
                duration: 2000,
                isClosable: true,
            })
        } catch (error) {
            toast({
                title: `エラー`,
                description: `エラー内容${JSON.stringify(error)}`,
                status: "error",
                duration: 2000,
                isClosable: true,
            })
            
        }
        setIsLoading(false)
    }
    const createButton = <Button
        rounded={'full'}
        px={6}
        colorScheme={'orange'}
        bg={'orange.400'}
        onClick={() => createSpecials()}
        isLoading={isCreateLoading}
        _hover={{ bg: 'orange.500' }}>
        特集記事作成する🖋
    </Button>

    return (
        <AdminPage 
            breadCrumbs={breadCrumbs} 
            title="特集管理画面" 
            createButton={createButton} 
            data={specialsData} 
            deleteHandler={deleteHandler}
            editHandler={editHandler}
            isLoading={isLoading}
            isOpen={isOpen}
            onOpen={onOpen}
            onClose={onClose}
        />
    )
}

export default SpecialsIndex

export const getServerSideProps: GetServerSideProps<Props> = async () => {
    const specials = await getSpecialsHandler()
    return { 
        props: {
            specials
        } 
    }
}
  