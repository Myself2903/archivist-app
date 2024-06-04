import React, { ReactNode } from 'react';
import {
    Box,
    CloseButton,
    Flex,
    Icon,
    useColorModeValue,
    Link,
    Drawer,
    DrawerContent,
    Text,
    useDisclosure,
    IconButton
} from '@chakra-ui/react';
import { AiOutlineLogin, AiOutlineUsergroupAdd, AiOutlineLogout, AiOutlineMenu } from "react-icons/ai";

export default function SimpleSidebar() {

    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
        <Box>
            <IconButton
                onClick={onOpen}
                icon={<AiOutlineMenu />}
                aria-label="open menu"
                borderRadius='full'
            />
            <Drawer
                autoFocus={false}
                isOpen={isOpen}
                placement="right"
                onClose={onClose}
                returnFocusOnClose={false}
                onOverlayClick={onClose}
            >
                <DrawerContent maxW="200px">
                    <SidebarContent onClose={onClose} />
                </DrawerContent>
            </Drawer>
        </Box>
    );
}

const SidebarContent = ({ onClose }) => {

    const Items = [
        {
            id: 1,
            name: 'Iniciar sesión',
            href: '#',
            icon: AiOutlineLogin
        },
        {
            id: 2,
            name: 'Registrarse',
            href: '#',
            icon: AiOutlineUsergroupAdd
        },
        {
            id: 3,
            name: 'Cerrar sesión',
            href: '#',
            icon: AiOutlineLogout
        }
    ]

    return (
        <Box
            bg={useColorModeValue('white', 'gray.900')}
            borderRight="1px"
            borderRightColor={useColorModeValue('gray.200', 'gray.700')}
            h="full"
        >
            <Flex h="20" alignItems="center" mx="8" justifyContent="center">
                <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
                    Usuario
                </Text>
                <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
            </Flex>
            {Items.map((link) => (
                <NavItem key={link.name} icon={link.icon}>
                    {link.name}
                </NavItem>
            ))}
        </Box>
    );
};

const NavItem = ({ icon, children }) => {
    return (
        <Link href="#" style={{ textDecoration: 'none' }} _focus={{ boxShadow: 'none' }}>
            <Flex
                align="center"
                p="4"
                mx="4"
                borderRadius="lg"
                role="group"
                cursor="pointer"
                _hover={{
                    bg: '#7f6bb0',
                    color: 'white',
                }}
            >
                {icon && (
                    <Icon
                        mr="4"
                        fontSize="16"
                        _groupHover={{
                            color: 'white',
                        }}
                        as={icon}
                    />
                )}
                {children}
            </Flex>
        </Link>
    );
};
