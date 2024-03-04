import axios from 'axios';

axios.interceptors.request.use(
  function (config) {
    // İstek yapılan URL'den kaynağı al
    const { origin } = new URL(config.url);
    // İzin verilen kaynaklar
    const allowedOrigins = [process.env.REACT_APP_BASE_ENDPOINT];
    // Cookie'den JWT tokeni al
    const jwtToken = getCookie("jwt");
    // Eğer istek yapılan kaynak izin verilen kaynaklar arasındaysa,
    // isteğe JWT tokenini ekleyin
    if (allowedOrigins.includes(origin) && jwtToken) {
      config.headers.authorization = `Bearer ${jwtToken}`;
    }
    // Düzenlenmiş konfigürasyonu döndür
    return config;
  },
  function (error) {
    // Hata durumunda reddet
    return Promise.reject(error);
  }
);

// Cookie'den değer almak için yardımcı fonksiyon
function getCookie(name) {
  const cookieValue = document.cookie
    .split('; ')
    .find(row => row.startsWith(`${name}=`))
    ?.split('=')[1];
  return cookieValue;
}

// AUTH 
export const fetchLogin = async (input) =>{
	const { data } = await axios.post(`${process.env.REACT_APP_BASE_ENDPOINT}/auth/login`,input);  
      return data;
};
export const fetchLogout = async () => {
	const { data } = await axios.post(`${process.env.REACT_APP_BASE_ENDPOINT}/auth/logout`);
	return data;
};
export const fetchRegister = async (input) => {
  const { data } = await axios.post(
    `${process.env.REACT_APP_BASE_ENDPOINT}/auth/register`,
    input
  );
  return data;
};
export const fetchMe = async () => {
    const {data} = await axios.get(`${process.env.REACT_APP_BASE_ENDPOINT}/auth/user/me`, {
      withCredentials: true,}); // Cookie'leri göndermek için withCredentials kullandık
    return data;
};

// RECIPES 
export const fetchRecipesAll = async() => {
  const {data} = await axios.get(`${process.env.REACT_APP_BASE_ENDPOINT}/recipe/recipes`)
  return data;
}
export const fetchRecipe = async(recipe_id) => {
  const {data} = await axios.get(`${process.env.REACT_APP_BASE_ENDPOINT}/recipe/${recipe_id}`)
  return data;
}
export const addRecipe = async (input) => {
  const { data } = await axios.post(
    `${process.env.REACT_APP_BASE_ENDPOINT}/recipe/add`,
    input
  );
  return data;
};
export const deleteRecipe = async(recipe_id) => {
  const {data} = await axios.delete(`${process.env.REACT_APP_BASE_ENDPOINT}/recipe/${recipe_id}`)
  return data;
}
export const updateRecipe = async(recipe_id, input) => {
  const {data} = await axios.put(`${process.env.REACT_APP_BASE_ENDPOINT}/recipe/${recipe_id}` , input)
  return data;
}

// WATERS 
export const addWater = async (input) => {
  const { data } = await axios.post(
    `${process.env.REACT_APP_BASE_ENDPOINT}/water/add`,
    input
  );
  return data;
};
export const fetchWater = async (user_id) => {
	const { data } = await axios.get(
		`${process.env.REACT_APP_BASE_ENDPOINT}/water/${user_id}`
	);
	return data;
};

// DIETLIST 
export const fetchDietList = async (user_id) => {
	const { data } = await axios.get(
		`${process.env.REACT_APP_BASE_ENDPOINT}/list/${user_id}`
	);
	return data;
};
export const addList = async (user_id , input) => {
  const { data } = await axios.post(
    `${process.env.REACT_APP_BASE_ENDPOINT}/list/add/${user_id}`,
    input
  );
  return data;
};
export const deleteList = async(user_id) => {
  const {data} = await axios.delete(`${process.env.REACT_APP_BASE_ENDPOINT}/list/${user_id}`)
  return data;
}
export const updateList = async(user_id, input) => {
  const {data} = await axios.put(`${process.env.REACT_APP_BASE_ENDPOINT}/list/update/${user_id}` , input)
  return data;
}

// CALORIES 
export const addCalorie = async (input) => {
  const { data } = await axios.post(
    `${process.env.REACT_APP_BASE_ENDPOINT}/cal/add`,
    input
  );
  return data;
};
export const fetchCalories = async (user_id) => {
	const { data } = await axios.get(
		`${process.env.REACT_APP_BASE_ENDPOINT}/cal/cals/${user_id}`
	);
	return data;
};

// USERS 
export const fetchUserAll = async() => {
    const {data} = await axios.get(`${process.env.REACT_APP_BASE_ENDPOINT}/auth/users`)
    return data;
}
export const fetchUser = async(user_id) => {
  const {data} = await axios.get(`${process.env.REACT_APP_BASE_ENDPOINT}/auth/${user_id}`)
  return data;
}
export const updateUser = async(user_id, input) => {
  const {data} = await axios.put(`${process.env.REACT_APP_BASE_ENDPOINT}/auth/${user_id}` , input)
  return data;
}

