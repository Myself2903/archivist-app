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
    const [selectedNode, setSelectedNode] = useState(0)
    const [isOwner, setIsOwner] = useState(false)
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
    
    const calculateDepth = (node, level) => {
        if (node.children.length === 0 ){
            return level
        }   
        
        let lvls = []
        for (let i=0; i<node.children.length; i++){
            lvls.push(calculateDepth(node.children[i], level+1))
        }
        return Math.max(...lvls);
    }

    const gen_dependencies_code = (node, father_code, depth) =>{        
        let new_children = []
        let current_level = father_code.length+1
        let sorted_children = node.children.sort()

        for(let i=0;i<sorted_children.length ;i++){
            let code = father_code+String(i+1)
            let current_child = sorted_children[i]

            current_child.code = code + "0".repeat(depth-current_level)

            current_child.children = gen_dependencies_code(current_child, code, depth)
            new_children.push(current_child)
        }
        
        return new_children
    }


    const set_dependencies_with_codes = (dep) =>{
        let depth = calculateDepth(dep, 1)
  
        setDependencies(prevState =>({
            ...dep,
            code: "1"+ "0".repeat(depth-1),
            children: gen_dependencies_code(dep, "1", depth)
        }))
        
        
    }
    

    useEffect(() => {
        if (token){
            async function verify_project_access_token(){

                await instance.get(URL + '/profile/projects/verify_access/token', {params: {project_id: project_id}})
                .then(response => {
                    if (response.data.owner){
                        setIsOwner(true)
                    }else if(!response.data.public_access){
                        navigate("/")
                    }

                })
            }
            
            verify_project_access_token()
        }else{
            async function verify_project_access(){
                await instance.get(URL + '/profile/projects/verify_access', {params: {project_id: project_id}})
                .then(response => {
                    if (!response.data.public_access){
                        navigate("/")
                    }
                })
            }
            verify_project_access()
        }
        

        async function fetch_dependencies_data(){
            await instance.get(URL+URL_EXTENSION, { params: {project_id: project_id} })
            .then(response => {
                // setDependencies(response.data)
                set_dependencies_with_codes(response.data)
            })
        }
        fetch_dependencies_data() 
    }, []);


    //Modal definition to create dependency
    const AddDependencyModal = () =>{

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

                <form onSubmit={(e) => create_new_node(e,initialRef.current.value)}>
                    <ModalBody pb={6}>
                        <FormControl>
                        <Input ref={initialRef} placeholder='Nombre' />
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button onClick={addOnClose} mr={3}>Cancelar</Button>
                        <Button colorScheme='purple' type="submit">
                        Crear
                        </Button>
                    </ModalFooter>
                </form>
                
                </ModalContent>
            </Modal>
    )}

    const create_new_node = async (event, dependency_name) => {
        // event.preventDefault();
        const dependency = {
            name: dependency_name,
            project_id: project_id,
            father_id: selectedNode.id,
        }
        await instance.post(URL + URL_EXTENSION + "/create", dependency)
            .then(response => {
                setSelectedNode({...selectedNode, children: selectedNode.children.push(response.data)})
            });
        
        addOnClose();            
    }
    

    //Modal definition to delete dependency
    const DeleteDependencyModal  = () =>{
        
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
                    <Button colorScheme='red' onClick={() => delete_node()}>
                    Eliminar
                    </Button>
                </ModalFooter>
                </ModalContent>
            </Modal>
    )}

    const delete_node = async () =>{
        // console.log(selectedNode)
        await instance.delete(URL+URL_EXTENSION+"/delete", {params:{id_dependency: selectedNode.id}})
        .then(response => {
            set_dependencies_with_codes(response.data)
        })
        deleteOnClose()
    }

    //node data in org_chart
    const create_node_label = node =>{
        return (
                <div className="node-container">
                    {isOwner ? (
                    <>
                        <IconButton
                            className="delete-button"
                            aria-label="Delete"
                            icon={<MinusIcon boxSize={3}/>}
                            bg="transparent"
                            color="red"
                            size="xs"
                            onClick={()=>{
                                deleteOnOpen() 
                                setSelectedNode(node)
                            }}
                        />              
                        <label>{node.name}<b> | {node.code} </b></label>
                        <IconButton
                            className="add-button"
                            aria-label="Add"
                            icon={<AddIcon boxSize={3}/>}
                            bg="transparent"
                            color="green"
                            size="xs"
                            onClick={() => {
                                addOnOpen() 
                                setSelectedNode(node)
                            }}                    
                    />
                    </>):(
                        <label>{node.name}<b> | {node.code} </b></label>
                    )}
                </div>
        )}

    
    const draw_node_children = node =>{
        return node.children.map(child => (
            <TreeNode 
                key={child.id}
                className="node"
                label={create_node_label(child)} 
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
                            label={create_node_label(dependencies)} 
                        >
                            {draw_node_children(dependencies)}
                        </Tree>
                    </div>
                    <DeleteDependencyModal />   
                    <AddDependencyModal />
                </NavigationAndFooter>
        </div>
    )
}