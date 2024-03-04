import Boom from "boom";
import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
          console.log(err.message);
          res.status(401).json({
            error: "hatalı",
          });
        } else {
          req.user_id = decoded.user_id;
          next();
        }
      });
    } else {
      res.status(401).json({
        error: "token yok",
      });
    }
  } catch (error) {
    // authorization hatalıysa
    res.status(401).json({
      error: "Not auhthorized",
    });
  }
};

export const verifySession = async (req, res) => {
  try {
    const token = req.cookies.jwt;
    if (token) {
      const payload = await verifyJwt(token);
      const user_id = payload.user_id;
      req.user_id = user_id; // req nesnesine user_id'yi ekleyebilirsiniz.
    } else {
      res.status(401).json({
        error: "token yok",
      });
      // Alternatif olarak, bir hata durumunda next ile hata işlemlerine geçebilirsiniz: next(new Error("token yok"));
    }
  } catch (error) {
    // authorization hatalıysa
    res.status(401).json({
      error: "Not authorized",
    });
    // Alternatif olarak, bir hata durumunda next ile hata işlemlerine geçebilirsiniz: next(error);
  }
};

export const verifyJwt = (req, res, next) => {
  try {
    const authorizationToken = req.cookies.jwt; // Cookies'ten JWT token'ını al

    if (!authorizationToken) {
      throw Boom.unauthorized(); // Token yoksa hemen hata fırlat
    }

    jwt.verify(
      authorizationToken,
      process.env.JWT_SECRET_KEY,
      (err, payload) => {
        if (err) {
          // JWT doğrulama hatası
          throw Boom.unauthorized(
            err.name === "JsonWebTokenError" ? "Unauthorized" : err.message
          );
        }

        req.payload = payload; // Doğrulama başarılı, payload'i request'e ekle
        next();
      }
    );
  } catch (error) {
    next(error); // Hata varsa middleware zincirini kırma, hatayı sonraki middleware'e ilet
  }
};
