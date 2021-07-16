import { GetServerSideProps } from 'next'
import { useRouter } from 'next/dist/client/router'
import React, { useState } from 'react'
import { Regular } from '../../@types/regular'
import AdminPage from '../../components/layout/admin-page'
import {Button, useDisclosure, useToast} from '@chakra-ui/react';
import { BreadCrumbItemProps } from '../../components/layout'
import { createRegularHandler, deleteRegularHandler, getRegularsHandler } from '../../queries/regulars'

interface Props {
    regulars:Regular[]  
}


const RegularsIndex: React.FC<Props> = ({regulars}) => {
    const toast = useToast()
    const router = useRouter()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [isLoading, setIsLoading] = useState(false)
    const [isCreateLoading, setIsCreateLoading] = useState(false)
    const [regularsData, setRegularsData] = useState(regulars)

    const breadCrumbs: BreadCrumbItemProps[] = [
        {href: '/', name: 'ホーム'},
        {href: '/regulars', name: '連載'},
    ]
    const createRegulars = async() => {
        setIsCreateLoading(true)
        const regular: Regular ={
            title: '',
            description: '',
            heroImage: '',
            isPublished: false,
            posts: [],
        }
        
        try {
            const res = await createRegularHandler(regular)
            await router.push(`regulars/${res.partition_key}`)
            toast({
                title: `成功`,
                description: `連載を新規作成しました`,
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
    const editHandler = (s: Regular) => {
        router.push(`regulars/${s.partition_key}`)        
    }
    const deleteHandler = async(s: Regular) => {
        setIsLoading(true)
        try {
            await deleteRegularHandler(s)
            onClose()
            const index = regularsData.findIndex(d => d.partition_key === s.partition_key)
            const protoData = [...regularsData]
            protoData.splice(index, 1)
            // console.log(index, protoData.map(d => d.title));
            setRegularsData([...protoData])
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
        onClick={() => createRegulars()}
        isLoading={isCreateLoading}
        _hover={{ bg: 'orange.500' }}>
        連載記事作成する🖋
    </Button>

    return (
        <AdminPage 
            breadCrumbs={breadCrumbs} 
            title="連載管理画面" 
            createButton={createButton} 
            data={regularsData} 
            deleteHandler={deleteHandler}
            editHandler={editHandler}
            isLoading={isLoading}
            isOpen={isOpen}
            onOpen={onOpen}
            onClose={onClose}
        />
    )
}

export default RegularsIndex

export const getServerSideProps: GetServerSideProps<Props> = async () => {
    const regulars = await getRegularsHandler()
    return { 
        props: {
            regulars
        } 
    }
}
  