import { useState } from 'react'
import { useNavigate } from 'react-router'
import axios from "axios"
import NavigationAndFooter from '../layout/NavigationAndFooter'
import { Button, Flex, FormControl, FormHelperText, FormLabel, Heading, Image, Input, useBreakpointValue } from '@chakra-ui/react'

export default function LoginPage() {
	const [count, setCount] = useState(0)
	const [emailValid, setEmailValid] = useState(true)
	const [passwordValid, setPasswordValid] = useState(true)

	const URL = "http://127.0.0.1:8000"
	const URL_EXTENSION = "/token"

	const navigate = useNavigate()

	//json structure need for query
	const [loginForm, setLoginForm] = useState({
		username: "",
		password: ""
	})

	//login verification function
	const login = async (event) => {
		event.preventDefault(); //prevent page to reload

		if (loginForm.password == "") {
			setPasswordValid(false)
			return;
		}

		//close error message
		setEmailValid(true)
		setPasswordValid(true)

		//API call
		await axios
			.post(URL + URL_EXTENSION, loginForm, {
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			})
			.then(response => {
				//save token in local storage
				if (response.data.access_token) {
					localStorage.setItem("auth_token", response.data.access_token)  //token
					localStorage.setItem("auth_token_type", response.data.token_type) //token type
					navigate(`/main_page`)
				}
			})
			.catch((error) => {
				console.log(error, "error");
				switch (error.response.status) {
					case 400: //error invalid password
						setPasswordValid(false)
						break;

					case 404: //error user not found
						setEmailValid(false)
						break;

					default:
						break;
				}
			});
	}

	return (
		<NavigationAndFooter>
			<Flex align='center' py='35' pl='20'>
				<Image src='/OficinistaFondoMorado.jpg' alt='Secretary image' display={{ base: 'none', sm: 'block' }} borderRadius='40' boxSize="sm" />
				<Flex direction='column' bgColor='#000000' objectFit='cover'>
					<Heading
						textAlign='center'
						color='#000000'
						as={'h1'}
						fontSize='20px'
					>
						El objetivo es tu archivo
					</Heading>
					<form onSubmit={login}>
						<FormControl ml='100'>
							<FormLabel>Correo</FormLabel>
							<Input
								onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })} //save email info in hook. username is for python understanding
								type='email' />
							<FormLabel>Contraseña</FormLabel>
							<Input
								onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}//save password info in hook. username is for python understanding
								type='password' />
							<Button
								mt={2}
								colorScheme='teal'
								type='submit'
								width='100%'
							>
								Ingresar
							</Button>
						</FormControl>
					</form>
				</Flex>
			</Flex>
		</NavigationAndFooter>
	)
}
