import "./styles.css"

const Preview = ({ selectedItem = {} }: any) => {
  return (
    <div className="previewContainer">
      <h1>Preview</h1>
      <div>{selectedItem?.patientName}</div>
    </div>
  );
};

export default Preview;
