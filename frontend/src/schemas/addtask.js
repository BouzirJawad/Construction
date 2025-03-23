import * as yup from 'yup';

export const addtask = yup.object().shape({
    description: yup.string().required("Required"),
    startDate: yup.date().required("Required"),
    endDate: yup.date().required("Required"),
})