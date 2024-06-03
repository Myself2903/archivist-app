import { Center, Heading, Image, useBreakpointValue, useColorModeValue } from "@chakra-ui/react"

const Logo = () => {
    return(
        <Center>
        <Image src= '/Garrido.jpg' alt='Purple archive logo' boxSize='35px' borderRadius='full' />
        <Heading
          textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
          color='#FFFFFF'
          as={'h1'}
          ml={2}
          fontSize='20px'
        >
          PURPLE ARCHIVE
        </Heading>
      </Center>
    )
}

export default Logo; 