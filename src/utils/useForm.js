import React,{useState} from 'react';
const useForm = (initialValues) => {
    const [inputs,setInputs] = useState(initialValues);
    const handleSubmit = (event) => {
      if(event){
        event.preventDefault();
      }
      console.log(inputs);
    }
    const handleInputChange = (event) => {
      event.persist();
      setInputs(inputs => ({...inputs, [event.target.name]: event.target.value}));
      }
    return {
      handleSubmit,
     handleInputChange,
     inputs
      };
}
export default useForm;