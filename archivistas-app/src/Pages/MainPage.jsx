import { fetchToken } from "../Auth";
import React, { useEffect, useRef, useState } from 'react';
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
    ModalFooter,
    ModalBody,
    FormControl,
    FormLabel,
    Button,
    useDisclosure,
    Select
} from '@chakra-ui/react'


export default function MainPage() {
    const token = fetchToken();
    const navigate = useNavigate();
    const [projects, setProjects] = useState([])
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredProjects, setFilteredProjects] = useState(projects);
<<<<<<< HEAD
    
=======
    const [editForm, setEditForm] = useState({ name: '', enterprise: '', public_access: '' });
    const [deleteForm, setDeleteForm] = useState({ id_project: '' });
>>>>>>> 23898e75095bd9379d97eb9c34284a673d93c78c
    const URL = "http://127.0.0.1:8000"
    const URL_EXTENSION = "/profile/projects/active_state", URL_EXTENSION_PROJECTS = "/profile/projects"
    const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure()
    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure()
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure()

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





    const NewProjectModal = () => {
        const [createForm, setCreateForm] = useState({
            name: '',
            enterprise: '',
            public_access: ''
        });

        const createProject = async (event) => {
            event.preventDefault();
            await instance.post(URL + URL_EXTENSION_PROJECTS + "/create", createForm)
                .then(response => navigate(`/org_chart/${response.data.id}`));
            onCreateClose();
        }

        return (
            <Modal
                isOpen={isCreateOpen}
                onClose={onCreateClose}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Crear nuevo proyecto</ModalHeader>
                    <ModalCloseButton />
                    <form onSubmit={createProject}>
                        <ModalBody pb={6}>
                            <FormControl>
                                <Input placeholder='Nombre' onChange={e => setCreateForm({ ...createForm, name: e.target.value })} />
                                <Input placeholder='Empresa' onChange={e => setCreateForm({ ...createForm, enterprise: e.target.value })}
                                />
                                <Select placeholder='Visibilidad' onChange={e => setCreateForm({ ...createForm, public_access: e.target.value })}>
                                    <option value={true}>Público</option>
                                    <option value={false}>Privado</option>
                                </Select>
                            </FormControl>
                        </ModalBody>

                        <ModalFooter>
                            <Button onClick={onCreateClose} mr={3}>Cancelar</Button>
                            <Button colorScheme='purple' type='submit'>
                                Crear
                            </Button>
                        </ModalFooter>
                    </form>
                </ModalContent>
            </Modal>
        )
    }

    

    const [selectedProject, setSelectedProject] = useState({id:-1, name: '', enterprise: '', public_access: '' })

    const EditProjectModal = () => {
        const [editForm, setEditForm] = useState({ name: '', enterprise: '', public_access: '' });

        useEffect(
            () =>{
                setEditForm(selectedProject)
            },[selectedProject])
        

        const editProject = async (event) => {
            event.preventDefault();
            let query_params = {
                current_project_id: selectedProject.id
            }

            await instance.put(URL + URL_EXTENSION_PROJECTS + "/update?current_project_id="+selectedProject.id,
                // { params:{ query_params } },
                editForm
            ).then((response)=>{
                const updatedProjects = projects.map(project =>{
                    if(project.id == selectedProject.id){
                        return { ...project, ...editForm };
                    }
                    return project;
                })
                setProjects(updatedProjects)
            });
            onEditClose();
        }  

            
        return (
            <Modal
                isOpen={isEditOpen}
                onClose={onEditClose}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Editar proyecto</ModalHeader>
                    <ModalCloseButton />
                    <form onSubmit={editProject}>
                        <ModalBody pb={6}>
                            <FormControl>
                                <FormLabel>Nombre:</FormLabel>
                                <Input placeholder='Nombre' onChange={(e) =>
                                    setEditForm({ ...editForm, name: e.target.value })
                                }
                                    value={editForm.name} />
                                <FormLabel>Empresa:</FormLabel>
                                <Input placeholder='Empresa' onChange={(e) =>
                                    setEditForm({ ...editForm, enterprise: e.target.value })
                                }
                                    value={editForm.enterprise} />
                                
                                <FormLabel>Visibilidad:</FormLabel>
                                <Select placeholder='Visibilidad' onChange={(e) =>
                                    setEditForm({ ...editForm, public_access: e.target.value })
                                }
                                    value={editForm.public_access}>
                                    <option value={true}>Público</option>
                                    <option value={false}>Privado</option>
                                </Select>
                            </FormControl>
                        </ModalBody>

                        <ModalFooter>
                            <Button onClick={onEditClose} mr={3}>Cancelar</Button>
                            <Button colorScheme='purple' type='submit'>
                                Actualizar
                            </Button>
                        </ModalFooter>
                    </form>
                </ModalContent>
            </Modal>
        )
    }

    const openDeleteModal = (id_project) => {
        setDeleteForm({
            id_project: id_project
        });
        onDeleteOpen();
    }

    const deleteProject = async (event) => {
        event.preventDefault();
        console.log(deleteForm)
        await instance.delete(URL + URL_EXTENSION_PROJECTS + "/delete", deleteForm);
        onDeleteClose();
    }

    const DeleteProjectModal = () => {
        return (
            <Modal
                isOpen={isDeleteOpen}
                onClose={onDeleteClose}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Está seguro de querer eliminar el proyecto?</ModalHeader>
                    <ModalCloseButton/>
                    <form onSubmit={deleteProject}>
                        <ModalFooter>
                            <Button onClick={onDeleteClose} mr={3}>Cancelar</Button>
                            <Button colorScheme='red' type='submit'>
                                Eliminar
                            </Button>
                        </ModalFooter>
                    </form>
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
                <NewProjectModal />
            </Flex>
            <Container minW='100%' minH="100vh" p='0'>
                <TableContainer>
                    <Table variant='simple'>
                        <Thead>
                            <Tr>
                                <Th>Nombre del proyecto</Th>
                                <Th>Fecha de ultima edición</Th>
                                <Th>Empresa</Th>
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
                                    <Td>{project.enterprise}</Td>
                                    <Td>
                                        <Flex gap='10'>
                                            <FaPen cursor='pointer'  onClick={() => {setSelectedProject(project); onEditOpen();}}/>
                                            <FaRegTrashAlt cursor='pointer' />
                                        </Flex>
                                    </Td>
                                </Tr>
                            )}
                        </Tbody>
                    </Table>
                </TableContainer>
            </Container>
            <EditProjectModal />
            <DeleteProjectModal />
        </NavigationAndFooter>
    </>)
}