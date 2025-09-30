import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearPhotos, deletePhoto } from "../redux/photosSlice";
import { Link } from "react-router-dom";
import html2canvas from "html2canvas";
import ConfirmDialog from "../components/ConfirmDialog";
import "./BoardOfHonor.css";

import fireworksSound from "../assets/fireworks.mp3"; // ✅ your fireworks audio file

const BoardOfHonor = () => {
  const photos = useSelector((state) => state.photos);
  const { isMuted } = useSelector((state) => state.audio);
  const dispatch = useDispatch();
  const [showDeleteButtons, setShowDeleteButtons] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    type: 'danger'
  });

  // ✅ Play fireworks sound only on this page
  useEffect(() => {
    if (!isMuted) {
      const audio = new Audio(fireworksSound);
      audio.loop = true;
      audio.volume = 0.4;
      audio.play();

      return () => {
        audio.pause();
        audio.currentTime = 0;
      };
    }
  }, [isMuted]);

  // ✅ Allow natural page scrolling ONLY on this page
  useEffect(() => {
    const html = document.documentElement;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;

    html.style.overflow = "auto";
    document.body.style.overflow = "auto";
    window.scrollTo(0, 0);

    return () => {
      html.style.overflow = prevHtmlOverflow || "hidden";
      document.body.style.overflow = prevBodyOverflow || "hidden";
    };
  }, []);

  const handleDeletePhoto = (photoId, photoTask) => {
    setConfirmDialog({
      isOpen: true,
      title: '🗑️ Delete Photo',
      message: `Are you sure you want to delete this photo?\n\n"${photoTask}"`,
      onConfirm: () => {
        dispatch(deletePhoto(photoId));
        setConfirmDialog({ ...confirmDialog, isOpen: false });
      },
      type: 'danger'
    });
  };

  const handleClearAll = () => {
    setConfirmDialog({
      isOpen: true,
      title: '🗑️ Clear All Photos',
      message: `Are you sure you want to delete ALL ${photos.length} photos? This action cannot be undone.`,
      onConfirm: () => {
        dispatch(clearPhotos());
        setConfirmDialog({ ...confirmDialog, isOpen: false });
        setShowDeleteButtons(false); // Exit edit mode after clearing
      },
      type: 'danger'
    });
  };

  const closeConfirmDialog = () => {
    setConfirmDialog({ ...confirmDialog, isOpen: false });
  };

  const exportBoard = async () => {
    const node = document.querySelector(".wall");
    if (!node) return;
    const canvas = await html2canvas(node, { useCORS: true, backgroundColor: null });
    const dataURL = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = dataURL;
    a.download = "photo_wall.png";
    a.click();
  };

  return (
    <div className="board-bg">
      <h1 className="board-title">🏆 PHOTO WALL 🏆</h1>

      <div className="wall">
        {photos.length === 0 ? (
          <p className="empty-msg">No photos yet! Complete challenges to add them here.</p>
        ) : (
          <>
            <div className="wall-controls">
              <button 
                className={`toggle-delete-btn ${showDeleteButtons ? 'active' : ''}`}
                onClick={() => setShowDeleteButtons(!showDeleteButtons)}
              >
                {showDeleteButtons ? '✅ Done' : '🗑️ Edit'}
              </button>
            </div>
            <div className="photo-grid">
              {photos.map((p, i) => (
                <div
                  key={p.id || i} // Use ID if available, fallback to index
                  className="honor-card"
                  style={{ "--rotate": `${(i % 2 ? 2 : -2)}deg` }}
                >
                  {showDeleteButtons && (
                    <button 
                      className="delete-photo-btn"
                      onClick={() => handleDeletePhoto(p.id || i, p.task)}
                      title="Delete this photo"
                    >
                      ❌
                    </button>
                  )}
                  <img src={p.image} alt={`Victory ${i}`} className="honor-polaroid" />
                  
                  {/* Task name below polaroid */}
                  <div className="honor-caption">
                    ✨ {p.task} ✨
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="board-actions">
        <Link to="/AdventureSelection">
          <button className="board-btn btn-purple">⬅ Back to Adventures</button>
        </Link>
        {photos.length > 0 && (
          <>
            <button className="board-btn btn-red" onClick={handleClearAll}>
              🗑 Clear All ({photos.length})
            </button>
            <button className="board-btn btn-green" onClick={exportBoard}>
              💾 Export Wall
            </button>
          </>
        )}
      </div>

      {/* Custom Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={closeConfirmDialog}
        type={confirmDialog.type}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default BoardOfHonor;
