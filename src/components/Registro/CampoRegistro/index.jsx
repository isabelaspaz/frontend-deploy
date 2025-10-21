const CampoRegistro = ({ label, type = "text", name, value, onChange, placeholder }) => {
    return (
        <div className="caixa">
            <p className="p">{label}</p>
            <div>
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                />
            </div>
        </div>
    );
};

export default CampoRegistro;