import NavigationAndFooter from "../layout/NavigationAndFooter";
import { useEffect, useState } from 'react';
import { Tree, TreeNode } from 'react-organizational-chart';
import { IconButton } from "@chakra-ui/react";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import { useNavigate, useParams } from 'react-router-dom';
import { fetchToken } from "../Auth";
import axios from "axios"
import '../styles/OrgChart.css'

export default function OrgChartPage(){

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
        if (!token) {
            // if no token redirect to root
            navigate("/")
        }

        async function fetch_dependencies_data(){
            await instance.get(URL+URL_EXTENSION, { params: {project_id: project_id} })
            .then(response => {
                setDependencies(response.data)
                console.log(response.data)
            })
        }
        fetch_dependencies_data() 
    }, []);

    useEffect(() =>console.log(dependencies[0]),[dependencies])

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
                    />
                    <label>{name} </label>
                    <IconButton
                        className="add-button"
                        aria-label="Add"
                        icon={<AddIcon boxSize={3}/>}
                        bg="transparent"
                        color="green"
                        size="xs"
                    />
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
                            className="node"
                            label={create_node_label(dependencies.name)} 
                        >
                            {draw_node_children(dependencies)}
                        </Tree>
                    </div>
                </NavigationAndFooter>
        </div>
    )
}