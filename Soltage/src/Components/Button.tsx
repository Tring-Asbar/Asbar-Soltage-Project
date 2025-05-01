interface ComponentProps{
    type?:'submit' | 'reset' | 'button'
    action:string | React.ReactNode
    disabled?:boolean
    className?:string
    onClick?:()=>void
    icon?:string
}

const Button : React.FC<ComponentProps> = ({type,action,disabled=false,className,onClick,icon}) => {
  return (
    <button type={type} disabled={disabled} className={className} onClick={onClick}>
      {icon && <img src={icon} alt="icon" className="icon"/>}
      {action}
      </button>
  )
}

export default Button
