import Boom from "boom";

const refreshTokens = {}; // Sunucu tarafında refresh token'ları saklamak için basit bir obje

const signRefreshToken = (user_id) => {
  return new Promise((resolve, reject) => {
    const payload = {
      user_id,
    };
    const options = {
      expiresIn: "180d",
      issuer: "ecommerce.app",
    };

    JWT.sign(payload, process.env.JWT_REFRESH_SECRET, options, (err, token) => {
      if (err) {
        console.log(err);
        reject(Boom.internal());
      }

      // Sunucu tarafında refresh token'ı sakla
      refreshTokens[user_id] = token;

      resolve(token);
    });
  });
};

const verifyRefreshToken = async (refresh_token) => {
  return new Promise(async (resolve, reject) => {
    try {
      const payload = JWT.verify(refresh_token, process.env.JWT_REFRESH_SECRET);
      const { user_id } = payload;

      // Sunucu tarafındaki refresh token'ı kontrol et
      const storedToken = refreshTokens[user_id];

      if (!storedToken || storedToken !== refresh_token) {
        reject(Boom.unauthorized());
      } else {
        resolve(user_id);
      }
    } catch (err) {
      reject(Boom.unauthorized());
    }
  });
};

export { signRefreshToken, verifyRefreshToken };
