interface ComponentProps{
    type?:'submit' | 'reset' | 'button'
    action:string | React.ReactNode
    disabled?:boolean
    className?:string
    onClick?:()=>void
}

const Button : React.FC<ComponentProps> = ({type,action,disabled=false,className,onClick}) => {
  return (
    <button type={type} disabled={disabled} className={className} onClick={onClick}>{action}</button>
  )
}

export default Button
