import React, { useState, useContext, useRef, useEffect } from "react";
import { AppState } from "../../App";
import axios from "../../Api/axiosConfig";
import { toast } from "react-toastify";
import { IoIosContact, IoMdCamera } from "react-icons/io";
import styles from "./profile.module.css";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../Data/data";

function Profile() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AppState);

  const [profilePicture, setProfilePicture] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState([]);
  const [loadingBookmarks, setLoadingBookmarks] = useState(false);
  const [activeTab, setActiveTab] = useState("profile"); // profile or saved

  const fileInputRef = useRef(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfilePicture = async () => {
      try {
        const res = await axios.get("/user/profile-picture", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.profilePicture) {
          setProfilePicture(res.data.profilePicture);
          setUser((prev) => ({ ...prev, profile_picture: res.data.profilePicture }));
        }
      } catch (error) {
        console.error("Failed to fetch profile picture:", error);
      }
    };

    const fetchBookmarks = async () => {
      setLoadingBookmarks(true);
      try {
        const res = await axios.get("/bookmark/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookmarkedQuestions(res.data.questions);
      } catch (error) {
        console.error("Failed to fetch bookmarks:", error);
      } finally {
        setLoadingBookmarks(false);
      }
    };

    if (token) {
      fetchProfilePicture();
      fetchBookmarks();
    }
  }, [token, setUser]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be under 5MB");
      return;
    }
    handleImageProcessing(file);
  };

  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const maxWidth = 400;
          let width = img.width;
          let height = img.height;
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob((blob) => {
            resolve(new File([blob], file.name, { type: "image/jpeg" }));
          }, "image/jpeg", 0.7);
        };
      };
    });
  };

  const handleImageProcessing = async (file) => {
    setUploading(true);
    try {
      const compressedFile = await compressImage(file);
      setPreviewUrl(URL.createObjectURL(compressedFile));
      uploadProfilePicture(compressedFile);
    } catch (err) {
      toast.error("Error processing image");
      setUploading(false);
    }
  };

  const uploadProfilePicture = async (file) => {
    try {
      const formData = new FormData();
      formData.append("profilePicture", file);
      const res = await axios.post("/user/upload-profile-picture", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const imageUrl = res.data.profilePictureUrl;
      setProfilePicture(imageUrl);
      setPreviewUrl("");
      setUser((prev) => ({ ...prev, profile_picture: imageUrl }));
      toast.success("Profile picture updated!");
    } catch (error) {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const removeProfilePicture = async () => {
    try {
      await axios.delete("/user/remove-profile-picture", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfilePicture("");
      setUser((prev) => ({ ...prev, profile_picture: "" }));
      toast.success("Profile picture removed");
    } catch (error) {
      toast.error("Failed to remove profile picture");
    }
  };

  const badgeInfo = (rep) => {
    if (rep >= 100) return { label: "Gold", class: styles.gold, desc: "Elite Member" };
    if (rep >= 50) return { label: "Silver", class: styles.silver, desc: "Trusted Contributor" };
    if (rep >= 10) return { label: "Bronze", class: styles.bronze, desc: "Active Member" };
    return { label: "Newbie", class: styles.newbie, desc: "Starting your journey" };
  };

  const currentBadge = badgeInfo(user?.reputation || 0);

  return (
    <div className={styles.container}>
      <div className={styles.profileCard}>
        <div className={styles.tabHeader}>
          <button className={`${styles.tabBtn} ${activeTab === "profile" ? styles.activeTab : ""}`} onClick={() => setActiveTab("profile")}>Profile & Stats</button>
          <button className={`${styles.tabBtn} ${activeTab === "saved" ? styles.activeTab : ""}`} onClick={() => setActiveTab("saved")}>Saved ({bookmarkedQuestions.length})</button>
        </div>

        {activeTab === "profile" ? (
          <div className={styles.profilePictureSection}>
            <div className={styles.pictureContainer}>
              {previewUrl || profilePicture ? (
                <img src={previewUrl || `${API_BASE_URL}${profilePicture}`} alt="Profile" className={styles.profileImage} />
              ) : (
                <div className={styles.defaultAvatar}><IoIosContact size={120} /></div>
              )}
              <div className={styles.uploadOverlay}>
                <button className={styles.uploadButton} onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                  <IoMdCamera size={24} />
                  <span>Change</span>
                </button>
              </div>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} hidden />

            <div className={styles.profileInfo}>
              <h3>{user?.firstname} {user?.lastname}</h3>
              <p>@{user?.username}</p>
              <p>{user?.email}</p>
              <p className={styles.joinedDate}>Joined {new Date(user?.created_at).toLocaleDateString()}</p>

              <div className={styles.reputationCard}>
                <div className={styles.repValue}>
                  <span className={styles.count}>{user?.reputation || 0}</span>
                  <span className={styles.label}>Reputation</span>
                </div>
                <div className={styles.repValue}>
                  <span className={styles.count}>{user?._count?.questions || 0}</span>
                  <span className={styles.label}>Questions</span>
                </div>
                <div className={styles.repValue}>
                  <span className={styles.count}>{user?._count?.answers || 0}</span>
                  <span className={styles.label}>Answers</span>
                </div>
                <div className={`${styles.badgeIndicator} ${currentBadge.class}`}>
                  <span className={styles.badgeLabel}>{currentBadge.label}</span>
                  <span className={styles.badgeDesc}>{currentBadge.desc}</span>
                </div>
              </div>

              <div className={styles.actionButtons}>
                <button className={styles.uploadBtn} onClick={() => fileInputRef.current?.click()} disabled={uploading}>Upload New</button>
                {profilePicture && <button className={styles.removeBtn} onClick={removeProfilePicture}>Remove</button>}
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.savedSection}>
            <h2>Bookmarks</h2>
            {loadingBookmarks ? <p>Loading...</p> : bookmarkedQuestions.length === 0 ? <p className={styles.noData}>No saved questions yet.</p> : (
              <div className={styles.savedGrid}>
                {bookmarkedQuestions.map(q => (
                  <div key={q.questionid} className={styles.savedCard} onClick={() => navigate(`/answer/${q.questionid}`)}>
                    <div className={styles.savedHeader}>
                      <span className={styles.tag}>{q.tag || "General"}</span>
                      <span className={styles.date}>{new Date(q.created_at).toLocaleDateString()}</span>
                    </div>
                    <h4 className={styles.savedTitle}>{q.title}</h4>
                    <p className={styles.savedAuthor}>by {q.username}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
