import { Box, Center, Flex, Heading, Image, Link, Spacer, useBreakpointValue } from '@chakra-ui/react'
import React from 'react'
import SimpleSidebar from '../sidebar/Sidebar'
import { useNavigate } from 'react-router-dom';

export default function Navbar(logo_url_redirect, show_menu) {
	const navigate = useNavigate();

	return (
		<div>
			<Flex flex={{ base: 1 }} justify={'start'} bgColor='#7f6bb0' minH={'60px'} px={{ base: '30px', lg: '40px' }} align={'center'}>
				<Link to="/" onClick={() => navigate(logo_url_redirect)}>
					<Center>
						<Image
							src="/Garrido.jpg"
							alt="Purple archive icon"
							boxSize="35px"
							borderRadius='full'
						/>
						<Heading
							textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
							color='#FFFFFF'
							as={'h1'}
							ml={2}
							fontSize="20px"
						>
							PURPLE ARCHIVE
						</Heading>
					</Center>
				</Link>
				<Spacer />
				{console.log(show_menu)}
				{show_menu ? <SimpleSidebar/>: <></>}
			</Flex>
		</div>
	)
}