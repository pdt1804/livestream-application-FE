
export default function InputLogin (props) {

  return (
    <div>
      <label className="inputLogin-label">{props.title}<span style={{color: "red"}}>*</span></label>
      <div className="inputLogin-ImageInputArea">
        {props.icon}
        <input className="inputLogin-input" type={props.type} value={props.value} onChange={(e) => props.setValue(e.target.value)}/>
      </div>
    </div>
  )
}