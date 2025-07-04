import { useForm } from "react-hook-form";
import { useAuth } from "@/store/AuthContext/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import type { AuthContextType, FormLoginProps } from "@/interfaces/interfaces";
import { isAxiosError } from "axios";
// import {
//   EMAIL_VALIDATION,
//   PASSWORD_VALIDATION,
// } from "@/service/validators";
import { axiosInstance } from "@/service/urls";
import { USERS_URL } from "@/service/api";
import validation from "@/service/validation";
import SubmitBtn from "@/components/auth/SubmitBtn";

export default function Login() {
  const navigate = useNavigate();
  const { saveLoginData, loginData, getCurrentUser }: AuthContextType =
    useAuth();
  const [isPassVisible, setIsPassVisible] = useState(false); // eye flash old password
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormLoginProps>({ mode: "onChange" });

  // =========== submit login ========
  const onSubmit = async (data: FormLoginProps) => {
    try {
      const response = await axiosInstance.post(USERS_URL.LOGIN, data);
      // console.log(response);
      localStorage.setItem("token", response?.data?.token);
      await saveLoginData();
      await getCurrentUser();
      toast.success("Login success!");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      // console.log(error?.response?.data?.message);
      if (isAxiosError(error))
        toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  // =========== check if user is logged in ========
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && loginData) {
      navigate("/dashboard", { replace: true });
    }
  }, [loginData, navigate]);

  return (
    <>
      <section aria-labelledby="login-heading">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="text-start"
          aria-describedby="form-description"
          noValidate
        >
          <div className="d-flex flex-column gap-1 mb-5">
            <p id="form-description" className="visually-hidden">
              Please log in using your email and password. Required fields are
              marked.
            </p>
            <small className="text-white">Welcome to PMS</small>
            <h1 id="login-heading" className="section-title">
              Login
            </h1>
          </div>

          {/* E-mail */}
          <div className="mb-3">
            <label htmlFor="email" className="form-label fw-normal">
              E-mail
            </label>

            <div className="border-bottom d-flex align-items-center pb-1">
              <div className="input-group">
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your E-mail"
                  {...register("email", validation.EMAIL_VALIDATION)}
                  className="form-control custom-input"
                />
              </div>
            </div>

            {errors.email && (
              <p className="text-white" role="alert" style={{ fontSize: 12 }}>
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="mb-3">
            <label
              htmlFor="password"
              className="form-label text-warning fw-normal"
            >
              Password
            </label>

            <div className="border-bottom d-flex align-items-center pb-1">
              <div className="input-group">
                <input
                  id="password"
                  type={isPassVisible ? "text" : "password"}
                  placeholder="Password"
                  {...register(
                    "password",
                    validation.PASSWORD_VALIDATION("Password is Required")
                  )}
                  className="form-control custom-input "
                />
                <button
                  type="button"
                  onClick={() => setIsPassVisible((prev) => !prev)}
                  onMouseDown={(e) => e.preventDefault()}
                  onMouseUp={(e) => e.preventDefault} // to prevent the feature of unfocus when i click on the icon
                  className="input-group-text btnSlash"
                  id="addon-wrapping"
                >
                  <i
                    className={`fa-regular ${
                      isPassVisible ? "fa-eye " : "fa-eye-slash"
                    }`}
                  ></i>
                </button>
              </div>
            </div>

            {errors.password && (
              <p className="text-white" role="alert" style={{ fontSize: 12 }}>
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Navigation Links */}
          <nav
            className="links d-flex justify-content-between my-4"
            aria-label="Authentication links"
          >
            <Link
              className="text-white text-decoration-none fw-light"
              to="/register"
            >
              Register Now?
            </Link>
            <Link
              className="text-white text-decoration-none fw-light"
              to="/forget-password"
            >
              Forgot Password?
            </Link>
          </nav>

          {/* Submit Button */}
          <div className="d-grid">
            <SubmitBtn isSubmitting={isSubmitting} title="Login" />
          </div>
        </form>
      </section>
    </>
  );
}
