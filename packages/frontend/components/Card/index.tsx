import { Box, Center, useColorModeValue } from "@chakra-ui/react";
import React from "react";

interface Props {
    width?: any;
    onClick?: () => void;
    cursor?: string;
}

const Card: React.FC<Props> = ({width='full', children, onClick}) => {

    return (
        <Center p={6} onClick={onClick} cursor={onClick && "pointer"}>
            <Box
                role={'group'}
                p={6}
                w={width}
                bg={useColorModeValue('white', 'gray.800')}
                boxShadow={'2xl'}
                rounded={'lg'}
                pos={'relative'}
                zIndex={1}
            >
                {children}
            </Box>
        </Center>
    )
}
export default Card