import { useState } from "react";
import { useNavigate } from "react-router";
import { fetchToken } from "../Auth";
import axios from "axios";
import NavigationAndFooter from "../layout/NavigationAndFooter";
import {
  Button,
  Flex,
  FormControl,
  Box,
  FormLabel,
  Heading,
  Image,
  Input,
  useMediaQuery,
} from "@chakra-ui/react";

export default function LoginPage() {
  const token = fetchToken();
  const navigate = useNavigate();
  if (token){
      navigate("/main_page")
  }
  
  const [count, setCount] = useState(0);
  const [emailValid, setEmailValid] = useState(true);
  const [passwordValid, setPasswordValid] = useState(true);
  const URL = "http://127.0.0.1:8000";
  const URL_EXTENSION = "/token";

  

  //json structure need for query
  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
  });

  //login verification function
  const login = async (event) => {
    event.preventDefault(); //prevent page to reload

    if (loginForm.password == "") {
      setPasswordValid(false);
      return;
    }

    //close error message
    setEmailValid(true);
    setPasswordValid(true);

    //API call
    await axios
      .post(URL + URL_EXTENSION, loginForm, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((response) => {
        //save token in local storage
        if (response.data.access_token) {
          localStorage.setItem("auth_token", response.data.access_token); //token
          localStorage.setItem("auth_token_type", response.data.token_type); //token type
          navigate('/main_page');
        }
      })
      .catch((error) => {
        console.log(error, "error");
        switch (error.response.status) {
          case 400: //error invalid password
            setPasswordValid(false);
            break;

          case 404: //error user not found
            setEmailValid(false);
            break;

          default:
            break;
        }
      });
  };

	const [isSmallScreen] = useMediaQuery('(max-width: 768px)');


  return (
    <NavigationAndFooter logo_url_redirect="/" show_menu={false}>
      <Flex align="center" py="35" flexWrap="wrap" justifyContent="center">
        {!isSmallScreen && (
          <Image
            src="/OficinistaFondoMorado.jpg"
            alt="Secretary image"
            borderRadius="40"
            boxSize="sm"
            mr="50px"
          />
        )}
        <Box
          width={{
            base: "calc(100vw - 50px)",
            sm: "calc(100vw - 100px)",
            md: "400px",
          }}
          px={{ base: "25px", sm: "50px", md: "0" }}
        >
          <Heading
            textAlign="center"
            color='#7f6bb0'
			      fontWeight='bold'
            as={"h1"}
            fontSize="20px"
            mb="20px"
          >
            El objetivo es tu archivo
          </Heading>
          <FormControl as="form" onSubmit={login}>
            <FormLabel>Correo</FormLabel>
            <Input
              onChange={(e) =>
                setLoginForm({ ...loginForm, username: e.target.value })
              }
              type="email"
            />
            <FormLabel>Contraseña</FormLabel>
            <Input
              onChange={(e) =>
                setLoginForm({ ...loginForm, password: e.target.value })
              }
              type="password"
            />
            <Button mt={2} colorScheme="teal" type="submit" width="100%">
              Ingresar
            </Button>
          </FormControl>
        </Box>
      </Flex>
    </NavigationAndFooter>
  );
}