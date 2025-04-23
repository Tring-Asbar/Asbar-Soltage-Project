import React from 'react'

type Props = {
    name:string
    inputType:'text' | 'password'
}

const InputField = (props: Props) => {
  return (
    <input
    type={props.inputType}
    />
  )
}

export default InputField