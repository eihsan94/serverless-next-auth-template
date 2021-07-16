import React, { FC, useEffect, useRef, useState } from "react";
import * as uuid from 'uuid'

import { 
    Box,
    Heading,
    useDisclosure,
    useToast,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    Image,
    Flex,
    Spinner,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Button,
 } from "@chakra-ui/react";
import MainButton from "./Buttons/main-button";
import NormalModal from "./modals/normal-modal";
import { Post } from "@libTypes/post";
import { Magazine } from "@libTypes/magazine";
import { Special } from "@libTypes/special";
import { Regular } from "@libTypes/regular";
import * as Yup from 'yup';
import { Formik, Form, Field,  } from 'formik';
import encodeToBase64 from "../utils/encodeToBase64";
import { PlaceholderImage } from "./assets/PlaceholderImage";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";


interface Props {
    magazine: Magazine,
    updateHandler: (m: Magazine) => Promise<Special | Regular>,
}

const PostsLists: FC<Props> = ({magazine, updateHandler}) => {
    const toast = useToast()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { isOpen: isOpenPostListModal, onOpen: onOpenPostListModal, onClose: onClosePostListModal } = useDisclosure()
    const [posts, setPosts] = useState<Post[]>(magazine.posts || [])
    const [isLoadingPostListModal, setIsLoadingPostListModal] = useState<boolean>(false)
    const [currentPost, setCurrentPost] = useState<Post | null>(null)
    const openCreatePostForm = () => {
        setCurrentPost(null)
        onOpen()
    }
    const openUpdatePostForm = (p:Post) => {
        setCurrentPost(p)   
        onOpen()
    }

    const deletePostHandler = async (p:Post) => {
        if (posts) {
            setIsLoadingPostListModal(true)
            const protoData = [...posts]
            const index = posts.findIndex(post => post.id === p.id)
            protoData.splice(index, 1)
            try {
                magazine.posts= protoData            
                await updateHandler(magazine)
                setPosts(protoData)
                await updateHandler(magazine)
                onClosePostListModal()
                toast({
                    title: `成功`,
                    description: `${p.title}記事削除しました`,
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
                setIsLoadingPostListModal(false)
            }
        }
    }
    return (
        <Box m="40" p="10" maxW="6xl" minH="sm" overflowX="auto" shadow="2xl" rounded="lg">
            {magazine.posts && 
                <PostListsTable
                    posts={posts}
                    editPostHandler={openUpdatePostForm}
                    deletePostHandler={deletePostHandler}
                    openCreatePostForm={openCreatePostForm}
                    isOpenPostListModal={isOpenPostListModal}
                    onClosePostListModal={onClosePostListModal}
                    onOpenPostListModal={onOpenPostListModal}
                    isLoadingPostListModal={isLoadingPostListModal}
                    />}

           <PostForm 
                post={currentPost}
                magazine={magazine}
                isOpen={isOpen}
                onClose={onClose}
                updateHandler={updateHandler}
            />
        </Box>
    )
}

export default PostsLists;



const PostFormSchema: Yup.SchemaOf<Post> = Yup.object().shape({
    id: Yup.string(),
    index: Yup.number()
      .required('この項目は必須です。'),
    slug: Yup.string()
      .min(1, '1文字以上を入れてください!')
      .required('この項目は必須です。'),
    title: Yup.string()
      .min(2, '2文字以上を入れてください!')
      .required('この項目は必須です。'),
    subtitle: Yup.string()
      .min(2, '2文字以上を入れてください!') 
      .required('この項目は必須です。'),
    image: Yup.string(),
    author: Yup.string()
      .required('この項目は必須です。'),
    postDate: Yup.string()
      .required('この項目は必須です。'),
});

interface FormProps {
    magazine: Magazine;
    isOpen: boolean;
    post?: Post | null;
    onClose: () => void;
    updateHandler: (m: Magazine) => Promise<Special | Regular>,
}
interface Event<T = EventTarget> {
    target: T;
}
const PostForm: FC<FormProps> = ({magazine, isOpen, onClose, updateHandler, post}) => {
    const toast = useToast()
    const [uploadLoading, setUploadLoading] = useState(false)
    const [postImage, setPostImage] = useState(post?.image || '')
    
    const inputRef = useRef<HTMLInputElement>(null);
    const postInputAttr = [
        {name: 'index', type: 'number', label: '連番', placeholder: '連番を記入してください', size: "container.xs" },
        {name: 'slug', type: 'string', label: 'スラグ', placeholder: 'スラグを記入してください', size: "container.xs" },
        {name: 'title', type: 'string', label: 'タイトル', placeholder: 'タイトルを記入してください', size: "container.md" },
        {name: 'subtitle', type: 'string', label: 'サブタイトル', placeholder: 'サブタイトルを記入してください', size: "container.md" },
        {name: 'author', type: 'string', label: 'author', placeholder: 'authorを記入してください', size: "container.xs" },
        {name: 'postDate', type: 'string', label: '作成日', placeholder: '作成日を記入してください', size: "container.xs" },
    ]

    const [id, index, slug, title, subtitle, image, author, postDate] = [
        post?.id || uuid.v4(),
        post?.index || 0,
        post?.slug || '',
        post?.title || '',
        post?.subtitle || '',
        post?.image || '',
        post?.author || '',
        post?.postDate || '',]
    
    useEffect(() => {
        setPostImage(post?.image || '')
    },[post])
    const submitHandler = async(p: Post) => {
        p.image = postImage;
        !post
            ? await createPostHandler(p)
            : await updatePostHandler(p)
    }

    const createPostHandler = async(p: Post) => {
        magazine.posts?.push(p)
        magazine.posts?.sort((a: Post, b:Post) => a.index - b.index) 
        try {
            await updateHandler(magazine)
            setPostImage('')
            onClose()
            toast({
                title: `成功`,
                description: `${p.title}登録しました`,
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
    }
    const updatePostHandler = async(p: Post) => {
        
        if (magazine.posts) {
            const index = magazine.posts.findIndex(post => post.id === p.id)
            magazine.posts[index] = p
            magazine.posts?.sort((a: Post, b:Post) => a.index - b.index) 
            try {
                await updateHandler(magazine)
                setPostImage('')
                onClose()
                toast({
                    title: `成功`,
                    description: `${p.title}登録しました`,
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
        }
    }
    
    const uploadHandler = async(v: Event<HTMLInputElement>) => {
        const file = (v.target.files as FileList)[0]
        if (file) {
            setUploadLoading(true)
            const base64 = await encodeToBase64(file);
            setPostImage(base64)
            setUploadLoading(false)
        }
    }
    return (
        <NormalModal
            size="6xl"
            isOpen={isOpen}
            onClose={onClose}
            modalTitle={`記事登録`} 
            modalContent={
                <Formik
                    initialValues={{ id, index,slug,title,subtitle,image,author,postDate}}
                    validationSchema={PostFormSchema}
                    onSubmit={(value) => submitHandler(value)}
                >
                {({errors, touched, isSubmitting}) => (
                    <Form>
                        <Flex w="12rem" h="14rem" justify="center" margin="auto">
                            {!uploadLoading 
                                ? postImage
                                    ?<Image src={postImage} alt={postImage}  objectFit="cover" onClick={() => inputRef?.current?.click()} cursor="pointer"/>
                                    :<PlaceholderImage
                                        w="100%" h="100%"
                                        cursor="pointer"
                                        onClick={() => inputRef?.current?.click()}
                                    />
                            : <Spinner alignSelf="center" />}
                            <input type='file' accept="image/png, image/gif, image/jpeg" ref={inputRef} style={{ display: 'none' }} onChange={uploadHandler}></input>
                        </Flex> 
                        <Flex wrap="wrap">
                            {postInputAttr.map((attr, i) =>
                                <Box key={i} w={attr.size} mr="10">
                                    <Field name={attr.name}>
                                        {({ field }: {field: {name: string, value: string}}) => (
                                            <FormControl isInvalid={!!(errors[attr.name as keyof Post] && touched[attr.name as keyof Post])} mb="3">
                                                <FormLabel id={`post-${attr.name}`} htmlFor={`post-${attr.name}`} >{attr.label}</FormLabel>
                                                <Input 
                                                    {...field}
                                                    id={`post-${attr.name}`}
                                                    placeholder={attr.placeholder}
                                                    bg={'gray.100'}
                                                    border={0}
                                                    color={'gray.500'}
                                                    type={attr.type}
                                                    _placeholder={{
                                                        color: 'gray.500',
                                                    }}
                                                />
                                                <FormErrorMessage>{errors[attr.name as keyof Post]}</FormErrorMessage>
                                            </FormControl>
                                        )}
                                    </Field>
                                </Box>
                            )}
                        </Flex>
                        <MainButton
                            isLoading={isSubmitting}
                            type="submit"
                        >
                            保存
                        </MainButton>
                    </Form>
                    )}
                </Formik>
                }
        />
    )
}

interface PostsTableProps {
    posts: Post[],
    deletePostHandler: (p: Post) => void
    editPostHandler: (p: Post) => void
    openCreatePostForm: () => void,
    isOpenPostListModal: boolean,
    onOpenPostListModal: () => void,
    onClosePostListModal: () => void,
    isLoadingPostListModal: boolean,
}

const PostListsTable:FC<PostsTableProps> = ({posts, editPostHandler, deletePostHandler, openCreatePostForm, isOpenPostListModal, onOpenPostListModal, onClosePostListModal, isLoadingPostListModal}) => {
    const [currentPost, setCurrentPost] = useState<Post | null>(null)
    const deleteHandler = (p: Post) => {
        setCurrentPost(p)
        onOpenPostListModal()
    }
    return (
        <>
            <Flex align="center" pb="4">
                <Heading size="md"  w="24">記事一覧</Heading>
                <MainButton clickHandler={() => openCreatePostForm()}>
                    作成する🖋
                </MainButton>
            </Flex>
            <Table variant="simple">
                <Thead>
                    <Tr>
                        <Th>
                            イメージ
                        </Th>
                        <Th>
                            連番
                        </Th>
                        <Th>
                            スラグ
                        </Th>
                        <Th>
                            タイトル
                        </Th>
                        <Th>
                            サブタイトル
                        </Th>
                        <Th>
                            author
                        </Th>
                        <Th>
                            作成日
                        </Th>
                        <Th>
                        </Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {posts.map((p, i) => 
                        <Tr key={i}>
                            <Td>
                            {p.image && <Image src={p.image} alt={p.image} h="14" objectFit="cover"/>}
                            </Td>
                            <Td>{p.index}</Td>
                            <Td>{p.slug}</Td>
                            <Td>{p.title}</Td>
                            <Td>{p.subtitle}</Td>
                            <Td>{p.author}</Td>
                            <Td>{p.postDate}</Td>
                            <Td>
                                <MainButton
                                    clickHandler={() => editPostHandler(p)}
                                >
                                    <EditIcon />
                                </MainButton>
                                <Button
                                    ml="5"
                                    onClick={() => deleteHandler(p)}
                                >
                                    <DeleteIcon />
                                </Button>
                            </Td>
                        </Tr>
                    )}
                </Tbody>
            </Table>

            {currentPost && <NormalModal 
                isOpen={isOpenPostListModal}
                modalTitle={`${currentPost.title}削除します。`}
                modalContent="よろしいでしょうか?"
                onClose={onClosePostListModal}
                modalFooter={
                    <>
                        <Button variant="ghost" mr={3} onClick={onClosePostListModal}>
                            やめる
                        </Button>
                        <Button isLoading={isLoadingPostListModal} colorScheme="red" onClick={() => deletePostHandler(currentPost)}>削除する</Button>
                    </>
                }
            />}
        </>
    )
}