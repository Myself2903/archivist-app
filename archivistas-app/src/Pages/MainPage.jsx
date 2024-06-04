import { fetchToken } from "../Auth";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios"
import NavigationAndFooter from "../layout/NavigationAndFooter";
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
    Flex
} from '@chakra-ui/react'


export default function MainPage() {
    const token = fetchToken();
    const navigate = useNavigate();
    const [projects, setProjects] = useState([])
    const [showSearchIcon, setShowSearchIcon] = useState(true);
    const URL = "http://127.0.0.1:8000"
    const URL_EXTENSION = "/profile/projects/active_state"

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
                    console.log(response.data)
                })
        }
        fetch_project_data()
    }, []);

    const handle_search_bar_change = (e) => {
        // setQuery(inputValue);
        if (e != "")
            setShowSearchIcon(false);
        else
            setShowSearchIcon(true)
    };

    return (<>
        <NavigationAndFooter>
            <Flex>
                <Input
                    placeholder='Busca tu proyecto...'
                    onChange={e => handle_search_bar_change(e.target.value)} 
                    width='50%'
                />
            </Flex>
            <Container minW='100%' minH="100vh" p='0'>
                <Box textAlign="center" py={4} fontWeight="bold" textColor='#7f6bb0'>
                    Selecciona tu proyecto
                </Box>
                <TableContainer>
                    <Table variant='simple'>
                        <Thead>
                            <Tr>
                                <Th>Nombre del proyecto</Th>
                                <Th>Fecha de ultima edición</Th>
                                <Th>Dueño</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {projects.map(project =>
                                <Tr key={project.id}
                                    transition={'background 0.3s ease'}
                                    _hover={{
                                        bg: '#b6a0e8'
                                    }}>
                                    <Td onClick={() => navigate(`/org_chart/${project.id}`)}
                                        cursor='pointer'
                                    >{project.name}</Td>
                                    <Td>{project.last_edition_date}</Td>
                                    <Td>{project.owner.username}</Td>
                                </Tr>
                            )}
                        </Tbody>
                    </Table>
                </TableContainer>
            </Container>
        </NavigationAndFooter>
    </>)
}