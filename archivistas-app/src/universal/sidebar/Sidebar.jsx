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
import { FiHome } from 'react-icons/fi';
import { useNavigate } from "react-router";
import { fetchToken } from "../../Auth";
import axios from "axios";

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
    const navigate = useNavigate();
    
    const logout = async () => {
        const token = fetchToken();
        const instance = axios.create({
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        });
        const URL = "http://127.0.0.1:8000";

        await instance.put(URL+"/logout")
            .then(response => {
                localStorage.removeItem('auth_token');
                navigate("/")
            })        
    }

    const Items = [
        {
            id: 1,
            name: 'Home',
            onClick: () => navigate('/main_page'),
            icon: FiHome 
        },
        {
            id: 2,
            name: 'Editar Perfil',
            icon: AiOutlineUsergroupAdd
        },
        {
            id: 3,
            name: 'Cerrar sesión',
            onClick: logout,
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
                <NavItem key={link.name} icon={link.icon} click_handler={link.onClick}>
                    {link.name}
                </NavItem>
            ))}
        </Box>
    );
};


const NavItem = ({ icon, children, click_handler }) => {

    return (
        <Link 
            
            style={{ textDecoration: 'none' }} 
            _focus={{ boxShadow: 'none' }}
            onClick={click_handler}
            >
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
                    cursor: 'pointer'
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
