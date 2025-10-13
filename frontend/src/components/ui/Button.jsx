'use client'

import {Button} from '@chakra-ui/react'

export default function ButtonComponent({children, ...props}) {
    return (
        <Button
            style = {{ backgroundColor: "white", border: "2px solid transparent", color: "maroon" }}
            onMouseEnter = {e => e.currentTarget.style.borderColor = "maroon"}
            onMouseLeave = {e => e.currentTarget.style.borderColor = "white"}
            {...props}
        >{children}</Button>
    )
}