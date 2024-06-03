import { chakra, VisuallyHidden } from '@chakra-ui/react'

const MediaButton = ({ children, label, href }) => {

  return (
    <chakra.button
      bg='#FFFF'
      rounded={'full'}
      w={8}
      h={8}
      cursor={'pointer'}
      as={'a'}
      href={href}
      display={'inline-flex'}
      alignItems={'center'}
      justifyContent={'center'}
      transition={'background 0.3s ease'}
      _hover={{
        bg: '#594b7a'
      }}
    >
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </chakra.button>
  )
}

export default MediaButton