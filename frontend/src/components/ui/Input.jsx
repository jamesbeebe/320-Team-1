'use client'

import {Input} from '@chakra-ui/react'

export default function InputComponent(props) {
    return (
        <Input
            bg = "white"
            borderColor = "gray.300"
            _focus={{
                borderColor: "maroon",
                borderWidth: "2px"
            }}
            {...props}
        ></Input>
    )
}