import React from 'react'
import { Container, Text, Stack } from '@chakra-ui/react'
import { FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa'
import Logo from './Logo'
import MediaButton from './MediaButton'

export default function Footer() {

	const socials = [
		{
			id: 1,
			name: 'Twitter',
			href: '#',
			icon: <FaTwitter />
		},
		{
			id: 2,
			name: 'Linkedin',
			href: '#',
			icon: <FaLinkedin />
		},
		{
			id: 3,
			name: 'Instagram',
			href: '#',
			icon: <FaInstagram />
		}
	]

	return (
		<div>
			<Container
				as={Stack}
				maxW={'7xl'}
				mt={0}
				py={6}
				direction={{ base: 'column', md: 'row' }}
				spacing={4}
				justify={{ base: 'center', md: 'space-between' }}
				align={{ base: 'center', md: 'center' }}
				bgColor='#7f6bb0'
			>
				<Logo />
				<Text color='#FFFFFF'>© {new Date().getFullYear()} Purple Archive. All rights reserved</Text>
				<Stack direction={'row'} spacing={6}>

					{
						socials.map(({ name, href, icon }) => (
							<MediaButton label={name} href={href} key={name}>
								{icon}
							</MediaButton>
						))
					}

				</Stack>
			</Container>
		</div>
	)
}