import "./input.css";

export default function SingleLabelComboBox({
  title,
  placeholder,
  listOptions = [],
  value,
  setValue,
}) {
  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <div className="singleLabelComboBox-select-container">
      <label className="singleLabelComboBox-label">
        {title}
        <span className="singleLabelComboBox-redDot">*</span>
      </label>
      <select
        className="singleLabelComboBox-select"
        value={value}
        onChange={handleChange}
      >
        <option value="">{placeholder}</option>
        {listOptions.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
}
