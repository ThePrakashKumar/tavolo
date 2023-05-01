"use client";
import { useContext, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import AuthModalInputs from "./AuthModalInputs";
import useAuth from "../../hooks/useAuth";
import { AuthContext } from "../context/AuthContext";
import { Alert } from "@mui/material";
const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export interface AuthInputType {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  password: string;
}

const AuthModel = ({ isSignin }: { isSignin: boolean }) => {
  const [open, setOpen] = useState<boolean>(false);
  const handleOpen = (): void => setOpen(true);
  const handleClose = (): void => setOpen(false);

  const [disabled, setDisabled] = useState(true);

  const [inputs, setInputs] = useState<AuthInputType>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  };

  const { signin } = useAuth();
  const { data, error, loading } = useContext(AuthContext);

  // this function will just return the content based on if we have to signin content or not
  const renderContent = (signinContent: String, signupContent: String) => {
    return isSignin ? signinContent : signupContent;
  };

  const submitHandler = () => {
    if (isSignin) {
      signin(inputs.email, inputs.password, handleClose);
    }
  };

  useEffect(() => {
    // if any of input filed is empty disable the submit button
    if (isSignin) {
      if (inputs.email && inputs.password) {
        return setDisabled(false);
      }
    } else {
      let isEmpty: boolean = false;
      for (let input in inputs) {
        if (!inputs[input]) {
          isEmpty = true;
        }
      }
      if (!isEmpty) return setDisabled(false);
    }
    setDisabled(true);
  }, [inputs]);

  return (
    <div>
      <button
        onClick={handleOpen}
        className={`${renderContent(
          "bg-blue-400 text-white",
          ""
        )} border p-1 px-4 rounded mr-3`}
      >
        {renderContent("Sign in", "Sign out")}
      </button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="p-2">
            <div className="m-auto">
              <h2 className="text-2xl font-light text-center">
                {renderContent(
                  "Log Into Your Account",
                  "Create Your Tavolo Account"
                )}
              </h2>
              <AuthModalInputs
                inputs={inputs}
                handleChange={handleChange}
                isSignin={isSignin}
                loading={loading}
              />
              {error && (
                <Alert severity="error" className="my-2">
                  {error}
                </Alert>
              )}
              <button
                className="uppercase bg-red-600 w-full h-10 text-white p-3 rounded text-sm mb-5 disabled:bg-gray-400"
                disabled={disabled}
                onClick={submitHandler}
              >
                {loading
                  ? renderContent("Signing In", "Creating Account")
                  : renderContent("Sign In", "Create Account")}
              </button>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default AuthModel;
