import NavigationAndFooter from "../layout/NavigationAndFooter";
import { useEffect, useState } from 'react';
import { Tree, TreeNode } from 'react-organizational-chart';
import '../styles/OrgChart.css'

export default function OrgChartPage(){

    const test_dependencies = [
        {
            name: "root dependency",
            code: 100,
            children:[
                {
                    name: "dependency1",
                    code: 101,
                    children:[
                        {
                            name: "dependency3",
                            code: 103,
                        },
                        {
                            name: "dependency4",
                            code: 104,
                        }
                    ]
                },

                {
                    name: "dependency2",
                    code: 102                },
            ]
        }
    ]

    const [dependencies, setDependencies] = useState(test_dependencies)

    
    const draw_node_children = node =>{
        console.log("current node: "+node.name)
        return node.children.map(child => (
            <TreeNode 
                className="node"
                label={
                    <label>
                        {child.name}<br />
                        {child.code}
                    </label>
                } 
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
                        label={
                            <label>
                                {dependencies[0].name} <br />
                                {dependencies[0].code}
                            </label>
                        } 
                    >
                        {draw_node_children(dependencies[0])}
                    </Tree>
                </div>
            </NavigationAndFooter>
        </div>
    )
}