export default function AddressInputs({addressProps,setAddressProp,disabled=false}) {
    const {country} = addressProps;
    return (
      <>
        <label>Country</label>
        <input
          disabled={disabled}
          type="text" placeholder="Country"
          value={country || ''} onChange={ev => setAddressProp('country', ev.target.value)}
        />
      </>
    );
  }