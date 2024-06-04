import { fetchToken } from "../Auth";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { format } from 'date-fns';
import NavigationAndFooter from "../layout/NavigationAndFooter";
import { FaPen, FaRegTrashAlt, FaFolderPlus } from "react-icons/fa";
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Container,
    Box,
    Input,
    Flex,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    FormControl,
    Button,
    useDisclosure
} from '@chakra-ui/react'


export default function MainPage() {
    const token = fetchToken();
    const navigate = useNavigate();
    const [projects, setProjects] = useState([])
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredProjects, setFilteredProjects] = useState(projects);
    const URL = "http://127.0.0.1:8000"
    const URL_EXTENSION = "/profile/projects/active_state"
    const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure()

    const instance = axios.create({
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    });

    useEffect(() => {
        if (!token) {
            // if no token redirect to root
            navigate("/")
        }

        async function fetch_project_data() {
            await instance.get(URL + URL_EXTENSION)
                .then(response => {
                    setProjects(response.data)
                    setFilteredProjects(response.data)
                    console.log(response.data)
                })
        }
        fetch_project_data()
    }, []);

    useEffect(() => {
        // Filter projects whenever the search query changes
        const filtered = projects.filter(project =>
            project.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredProjects(filtered);
    }, [searchQuery, projects]);

    const handleSearchBarChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const newProjectModal = () => {
        return (
            <Modal
                isOpen={isCreateOpen}
                onClose={onCreateClose}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Crear nuevo proyecto</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <FormControl>
                            <Input placeholder='Nombre' />
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button onClick={addOnClose} mr={3}>Cancelar</Button>
                        <Button colorScheme='purple' >
                            Crear
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        )
    }

    return (<>
        <NavigationAndFooter>
            <Flex pl='10' alignItems='center'>
                <Box textAlign="center" py={4} fontWeight="bold" textColor='#7f6bb0'>
                    Selecciona tu proyecto
                </Box>
                <Input
                    placeholder='Busca tu proyecto...'
                    onChange={handleSearchBarChange}
                    width='40%'
                    ml='5'
                    mr='3'
                />
                <FaFolderPlus color='#7f6bb0' size='35' cursor='pointer' onClick={onCreateOpen} />
            </Flex>
            <Container minW='100%' minH="100vh" p='0'>
                <TableContainer>
                    <Table variant='simple'>
                        <Thead>
                            <Tr>
                                <Th>Nombre del proyecto</Th>
                                <Th>Fecha de ultima edición</Th>
                                <Th>Dueño</Th>
                                <Th>Opciones</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {filteredProjects.map(project =>
                                <Tr key={project.id}
                                    transition={'background 0.3s ease'}
                                    _hover={{
                                        bg: '#b6a0e8'
                                    }}>
                                    <Td onClick={() => navigate(`/org_chart/${project.id}`)}
                                        cursor='pointer'
                                    >{project.name}</Td>
                                    <Td>{format(new Date(project.last_edition_date), 'MM/dd/yyyy')}</Td>
                                    <Td>{project.owner.username}</Td>
                                    <Td>
                                        <Flex gap='10'>
                                            <FaPen cursor='pointer' />
                                            <FaRegTrashAlt cursor='pointer' />
                                        </Flex>
                                    </Td>
                                </Tr>
                            )}
                        </Tbody>
                    </Table>
                </TableContainer>
            </Container>
        </NavigationAndFooter>
    </>)
}