import * as yup from 'yup';

export const addResource = yup.object().shape({
    title: yup.string().required("Required"),
    type: yup.string().required("Required"),
    quantity: yup.number().required("Required"),
    description: yup.string().required("Required"),
    supplier: yup.string().required("required")
})