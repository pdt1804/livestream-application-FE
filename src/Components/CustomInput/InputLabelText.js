import "./CustomInput.css";

export default function SingleLabelText({title, type, value, setValue}) {
  return (
    <div>
      <label className="singleLabelText-label">
        {title}
        <span className="singleLabelText-redDot">*</span>
      </label>
      <input
        className="singleLabelText-input"
        type={type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}
