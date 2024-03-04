import * as yup from 'yup';

export const validationsRegister = yup.object().shape({
  name: yup.string().required('Zorunlu alan'),
  surname: yup.string().required('Zorunlu alan'),
  phoneNumber: yup.string().required('Zorunlu alan'),
  email: yup.string().email('Geçerli bir email giriniz.').required('Zorunlu alan'),
  password: yup.string().min(5, 'Parolanız en az 5 karakterden oluşabilir.').required('Zorunlu alan'),
  birthdayDate: yup.date().required('Zorunlu alan'),
});

export  const validationsLogin=yup.object().shape({
    email:yup.string().email("Geçerli bir email giriniz.").required("Zorunlu alan"),
    password:yup.string().min(5,"Parolanız en az 5 karakterden oluşabilir."),

})