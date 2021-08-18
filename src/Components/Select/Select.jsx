import React, {useRef} from 'react';
import "./Select.css";

const Select = ({setSelect}) => {
    let options =  [ 
        {name: 'Selecione',
        value: 'select',},

        {name: 'Temperatura',
        value: 'temperatura',},

        {name: 'Umidade',
        value: 'umidade',},

        {name: 'Precipitação',
        value: 'precipitacao',},];
    
    function onChangeFunc(event) {
        setSelect(event.target.value)
      }

  return (
    <>
      <div className="div-select">
        <select onChange={onChangeFunc}  >
            {options.map(item => (
            <option className="option" key={item.value} value={item.value}>{item.name}</option>))}
        </select>
      </div>
    </>
  );
};

export default Select;