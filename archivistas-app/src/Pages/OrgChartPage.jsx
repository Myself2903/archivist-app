import NavigationAndFooter from "../layout/NavigationAndFooter";
import { useEffect, useState } from 'react';
import { Tree, TreeNode } from 'react-organizational-chart';
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import { useNavigate, useParams } from 'react-router-dom';
import { useRef } from 'react';
import { fetchToken } from "../Auth";
import axios from "axios"
import '../styles/OrgChart.css'
import { 
    IconButton,   
    useDisclosure,
    FormControl,
    Input,
    FormLabel,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton
} from "@chakra-ui/react";

export default function OrgChartPage(){
    
    const { isOpen: addIsOpen, onOpen: addOnOpen, onClose: addOnClose } = useDisclosure();
    const { isOpen: deleteIsOpen, onOpen: deleteOnOpen, onClose: deleteOnClose } = useDisclosure();
    const initialRef = useRef(null)

    const [dependencies, setDependencies] = useState({
        id: -1,
        name: "",
        code: -1,
        children: []
    })
    
    const token = fetchToken();
    const {project_id} = useParams();

    const navigate = useNavigate();
    const URL = "http://127.0.0.1:8000"
    const URL_EXTENSION = "/project/org_chart"

    const instance = axios.create({
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        }
      });    


    useEffect(() => {
        if (token){
            console.log("token version")
            async function verify_project_access_token(){

                await instance.get(URL + '/profile/projects/verify_access/token', {params: {project_id: project_id}})
                .then(response => {
                    console.log(response)
                    if (!response.data){
                        navigate("/")
                    }
                })
            }
            
            verify_project_access_token()
        }else{
            async function verify_project_access(){
                console.log("no token version")
                await instance.get(URL + '/profile/projects/verify_access', {params: {project_id: project_id}})
                .then(response => {
                    if (!response.data){
                        navigate("/")
                    }
                })
            }
            verify_project_access()
        }
        

        async function fetch_dependencies_data(){
            await instance.get(URL+URL_EXTENSION, { params: {project_id: project_id} })
            .then(response => {
                setDependencies(response.data)
            })
        }
        fetch_dependencies_data() 
    }, []);


    const new_node_modal = () =>{
        return(
            <Modal
                initialFocusRef={initialRef}
                isOpen={addIsOpen}
                onClose={addOnClose}
            >
                <ModalOverlay />
                <ModalContent>
                <ModalHeader>Crear nueva dependencia</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <FormControl>
                    <Input ref={initialRef} placeholder='Nombre' />
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
    )}

    const delete_node_modal = () =>{
        return(
            <Modal
                isOpen={deleteIsOpen}
                onClose={deleteOnClose}
            >
                <ModalOverlay />
                <ModalContent>
                <ModalHeader>Eliminar dependencia</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    Al eliminar una dependencia, <b>eliminarás tambien todas las subdependencias por debajo de esta</b>.<br/>
                    ¿Estas de acuerdo?
                </ModalBody>
                <ModalFooter>
                    <Button onClick={deleteOnClose} mr={3}>Cancelar</Button>
                    <Button colorScheme='red' >
                    Eliminar
                    </Button>
                </ModalFooter>
                </ModalContent>
            </Modal>
    )}

    const create_node_label = name =>{
        return (
                <div className="node-container">
                    <IconButton
                        className="delete-button"
                        aria-label="Delete"
                        icon={<MinusIcon boxSize={3}/>}
                        bg="transparent"
                        color="red"
                        size="xs"
                        onClick={deleteOnOpen}
                    />
                    {delete_node_modal()}                    
                    <label>{name} </label>
                    <IconButton
                        className="add-button"
                        aria-label="Add"
                        icon={<AddIcon boxSize={3}/>}
                        bg="transparent"
                        color="green"
                        size="xs"
                        onClick={addOnOpen}
                    />
                    {new_node_modal()}
                </div>
        )}

    
    const draw_node_children = node =>{
        return node.children.map(child => (
            <TreeNode 
                className="node"
                label={create_node_label(child.name)} 
            >
                {child.children ? draw_node_children(child): null}
            </TreeNode>
        ))
    }

    return (
        <div className="org-chart-page">
                <NavigationAndFooter>
                    <div className="org-chart-container">
                        <Tree 
                            lineWidth={'2px'}
                            lineColor={'rgb(203, 201, 201)'}
                            lineBorderRadius={'10px'}
                            className="root"
                            label={create_node_label(dependencies.name)} 
                        >
                            {draw_node_children(dependencies)}
                        </Tree>
                    </div>
                </NavigationAndFooter>
        </div>
    )
}