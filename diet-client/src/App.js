import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import UserCalories from "./pages/Calories/UserCalories";
import AdminHome from "./pages/Home/AdminHome";
import Recipes from "./pages/Recipes/Recipes";
import Profile from "./pages/Auth/Profile";
import Users from "./pages/Users/Users.js";
import UserHome from "./pages/Home/UserHome";
import UserDietList from "./pages/DietList/UserDietList";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./pages/Auth/ProtectedRoute";
import ProtectedAdmin from "./pages/Auth/ProtectedAdmin";
import { useAuth } from "./context/AuthContext";
import Protect from "./pages/Auth/Protect.js";
import RecipeDetail from "./pages/Recipes/RecipeDetail.js";
import AddRecipe from "./pages/Recipes/AddRecipe.js";
import UpdateRecipe from "./pages/Recipes/UpdateRecipe.js";
import AddList from "./pages/DietList/AddList.js";
import UpdateList from "./pages/DietList/UpdateList.js";
import Feedback from "./pages/Feedback.js";

function App() {
  const { user } = useAuth();

  return (
    <div className="bg-gray-100">
      {user && <Navbar></Navbar>}
      <Routes>
      <Route path="/" Component={Login} />
        <Route path="/login" Component={Login} />
        <Route path="/register" Component={Register} />
        <Route element={<Protect />}>
          <Route element={<ProtectedRoute userBool={true} />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/calories" element={<UserCalories></UserCalories>} />
            <Route path="/dietlist" element={<UserDietList />} />
            <Route path="/home" element={<UserHome />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route path="/recipes/:recipe_id" element={<RecipeDetail/>} />
          </Route>
          <Route element={<ProtectedAdmin admin={true} />}>
            <Route path="/admin/home" element={<AdminHome />} />
            <Route path="/admin/users" element={<Users />} />
            <Route path="/admin/profile" element={<Profile />} />
            <Route path="/admin/recipes" element={<Recipes />} />
            <Route path="/admin/recipes/:recipe_id" element={<RecipeDetail/>} />
            <Route path="/admin/recipes/update/:recipe_id" element={<UpdateRecipe/>} />
            <Route path="/admin/recipe/add" element={<AddRecipe/>} />
            <Route path="/admin/list/add/:user_id" element={<AddList/>} />
            <Route path="/admin/list/update/:user_id" element={<UpdateList/>} />
            <Route path="/admin/calories/:user_id" element={<UserCalories/>} />
            <Route path="/admin/userdetail/:user_id" element={<Profile />} />
          </Route>
          <Route path="/feedback" Component={Feedback} />
        </Route>
        <Route path="*" Component={NotFound} />
      </Routes>
      {user && <Footer></Footer>}
    </div>
  );
}

export default App;
