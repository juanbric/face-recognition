import { useState } from 'react';

export default function useHandleTagsChange() {
  const [formData, setFormData] = useState({ grado: "", fecha: "" });

  const handleTagsChange = (event: any) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  return [formData, handleTagsChange]
}