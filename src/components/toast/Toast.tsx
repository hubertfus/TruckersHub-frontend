import { XIcon } from "lucide-react";

interface props {
    type:string;
    message:string;
    index:number
    onClose:(index:number)=>void;
}

function Toast({type, message, index, onClose}:props){
    return (
        <div className={`alert alert-${type}`}>
            <span>{message}</span>
            <XIcon className="cursor-pointer" onClick={()=>onClose(index)}/>
        </div>
    )
}
export default Toast