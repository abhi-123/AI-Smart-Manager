import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const { isAuth, login } = useContext(AuthContext);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const url = isLogin
      ? "http://localhost:8000/auth/login"
      : "http://localhost:8000/auth/signup";

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (data.token) {
      login(data.token);
    } else {
      alert(data.error || data.message);
    }
  };

  useEffect(() => {
    if (isAuth) {
      navigate("/home");
    }
  }, [isAuth]);

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow w-80">
        <h2 className="text-xl font-bold mb-4 text-center">
          {isLogin ? "Login" : "Signup"}
        </h2>

        <input
          name="email"
          placeholder="Email"
          className="w-full p-2 border mb-3 rounded"
          onChange={handleChange}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full p-2 border mb-3 rounded"
          onChange={handleChange}
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-purple-600 text-white py-2 rounded"
        >
          {isLogin ? "Login" : "Signup"}
        </button>

        <p
          className="text-sm mt-3 text-center cursor-pointer text-purple-600"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Create new account" : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
}

export default Login;
