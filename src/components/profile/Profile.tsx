import { imgBaseURL } from "@/service/api";
import { useAuth } from "@/store/AuthContext/AuthContext";
import EditUserModal from "../EditUserModal/EditUserModal";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import type { AuthContextType } from "@/interfaces/interfaces";

export default function Profile() {
  const { fullUserData, getCurrentUser }: AuthContextType = useAuth();
  const [showModal, setShowModal] = useState(false);
  console.log(fullUserData);
  const handleClose = () => setShowModal(false);
  const handleOpen = () => setShowModal(true);

  const refreshProfile = () => {
    getCurrentUser();
  };
  if (!fullUserData) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <i className="fa fa-spinner fa-spin fa-3x text-muted" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{fullUserData.userName}</title>
        <meta
          name="description"
          content="A modern project management system for organizing tasks, managing users, and tracking project progress effectively."
        />
      </Helmet>

      <div className="container py-5 ">
        <div className="row justify-content-center py-5">
          <div className="col-md-7 col-lg-6  py-5">
            <div className="card shadow border-0 rounded-4 p-lg-4">
              <div className="card-body p-4 text-center">
                <div className="mb-4">
                  <img
                    src={`${imgBaseURL}/${fullUserData.imagePath}`}
                    alt="User"
                    className="rounded-circle shadow imgEnhanceUser"
                    width="130"
                    height="130"
                  />
                </div>
                <h4 className="fw-bold text-primary mb-1">
                  {fullUserData.userName}
                </h4>
                <p className="text-muted mb-3">{fullUserData.email}</p>

                <ul className="list-group text-start mb-4">
                  <li className="list-group-item d-flex justify-content-between">
                    <strong>Country</strong> <span>{fullUserData.country}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between">
                    <strong>UserName</strong>{" "}
                    <span>{fullUserData.userName}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between">
                    <strong>Phone</strong>{" "}
                    <span>{fullUserData.phoneNumber || "N/A"}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between">
                    <strong>Role</strong>{" "}
                    <span>{fullUserData.group?.name}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between">
                    <strong>Status</strong>{" "}
                    <span
                      className={`badge ${
                        fullUserData.isActivated ? "bg-success" : "bg-secondary"
                      }`}
                    >
                      {fullUserData.isActivated ? "Activated" : "Inactive"}
                    </span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between">
                    <strong>Joined At</strong>{" "}
                    <span>
                      {new Date(fullUserData.creationDate).toLocaleDateString()}
                    </span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between">
                    <strong>Last Modified</strong>{" "}
                    <span>
                      {new Date(
                        fullUserData.modificationDate
                      ).toLocaleDateString()}
                    </span>
                  </li>
                </ul>
                <div className="d-flex justify-content-center">
                  <button
                    onClick={handleOpen}
                    className="btn btn-outline-success rounded-pill px-4 py-2 d-flex align-items-center gap-2 shadow-sm profileBtnEnhance"
                  >
                    <i className="fa-solid fa-pen-to-square"></i>
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <EditUserModal
        show={showModal}
        handleClose={handleClose}
        userData={fullUserData}
        refreshProfile={refreshProfile}
      />
    </>
  );
}
