import * as yup from 'yup';

export const addProject = yup.object().shape({
    name: yup.string().required("Required"),
    description: yup.string().required("Required"),
    startDate: yup.date().required("Required"),
    endDate: yup.date().required("Required"),
    budget: yup.string().required("required")
})